import { Inject, Injectable, Optional } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map, mergeMap, pairwise, withLatestFrom } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';
import { TimeManager, TimeUtils } from '../../../common/services';
import { TIME_MANAGER, TIME_UTILS } from '../../../common/services/tokens';
import { TimeRange, TimeRangeInterval, TimeRangeSetting } from '../../../dashboard/models';
import { Logger } from '../../../logging/services';
import { DefaultLogger } from '../../../logging/services/logger';
import { LOGGER } from '../../../logging/services/tokens';
import * as instanceActions from '../../../widgets/actions/instances.actions';
import * as pollingActions from '../../actions/rest-api/polling.actions';
import * as realTimeDataActions from '../../actions/rest-api/real-time-data.actions';
import { ProcessStrategy, RealtimeData, Storage } from '../../models';
import * as fromRealTime from '../../reducers';
import { Preprocessor } from '../../services';
import { PREPROCESSOR } from '../../services/tokens';
import { getCurrentMoment, getMomentByTimestamp } from '../../../common/services/timeUtils';
import * as _ from 'lodash';
import { AppConfigService } from '../../../app.config.service';
import * as placeholdersActions from '../../../dashboard/actions/placeholders.actions';
import { tap } from 'rxjs/internal/operators';
import { DummyAction } from '../../../common/actions/index';
import * as dashboardsAction from '../../../dashboard/actions/dashboards.action';
import { Calculated, Predicted } from '../../models/constants';
import { Table } from '../../models/table';

@Injectable()
export class RealTimeDataFilterEffects {
  private _actions$: Actions;
  private _store: Store<fromRealTime.State>;
  private _preprocessor: Preprocessor;
  private _timeManager: TimeManager;
  private _timeUtils: TimeUtils;
  private _logger: Logger;
  private _appConfigService: AppConfigService;
  private _prevTimePreferences: number = null;

  @Effect() filter$: Observable<Action>;
  @Effect() policyGroup$: Observable<Action>;
  @Effect() rebase$: Observable<Action>;
  @Effect() updateInstances$: Observable<Action>;
  @Effect() clearInstance$: Observable<Action>;
  @Effect({ dispatch: false }) setLoggingMode$: Observable<Action>;
  @Effect({ dispatch: false }) clearData$: Observable<Action>;
  @Effect({ dispatch: false }) setAppConfig$: Observable<Action>;
  @Effect() clearOtherInstance$: Observable<Action>;

  constructor(action$: Actions,
    store: Store<fromRealTime.State>,
    @Inject(TIME_MANAGER) timeManager: TimeManager,
    @Inject(TIME_UTILS) timeUtils: TimeUtils,
    @Inject(PREPROCESSOR) preprocessor: Preprocessor,
    @Optional() @Inject(LOGGER) logger: Logger,
    appConfigService: AppConfigService) {
    this._actions$ = action$;
    this._store = store;
    this._timeManager = timeManager;
    this._timeUtils = timeUtils;
    this._preprocessor = preprocessor;
    this._logger = logger || new DefaultLogger();
    this._appConfigService = appConfigService;

    this.configureFilterEffect();
    this.configureRebaseEffect();
    this.updateInstanceEffect();
    this.clearInstanceEffect();
    this.setLoggingModeEffect();
    this.clearDataEffect();
    this.setAppConfigEffect();
    this.clearOtherInstancesEffect();
    this.configurePolicyGroupEffect();
  }

  private configureFilterEffect() {
    const mainStorage$ = this._store.pipe(select(fromRealTime.getMainStorage));
    const eventStorage$ = this._store.pipe(select(fromRealTime.getEventStorage));
    const predictiveStorage$ = this._store.pipe(select(fromRealTime.getPredictiveStorage));
    const timePreferences$ = this._store.pipe(select(fromRealTime.getTimePreferencesState));

    this.filter$ = this._actions$.pipe(
      ofType(pollingActions.LOAD_SUCCESS),
      filter((action: pollingActions.LoadSuccess) => action.payload.length !== 0),
      withLatestFrom(mainStorage$, eventStorage$, predictiveStorage$, timePreferences$),
      mergeMap(([action, mainStorage, eventStorage, predictiveStorage, timePreferences]) => {
        this._logger.info('---------------------------------------');

        const strategy = this.getStrategy(timePreferences);

        const arrays = [];
        const isDeleteData = this.getDeleteData(timePreferences.config.timeRangeSettings);
        this._logger.startFilterBenchmark();
        const receivedData = this.parseData((action as pollingActions.LoadSuccess).payload);
        if (receivedData[Calculated]) {
          const storage = {};
          Object.keys(receivedData[Calculated]).forEach(window => {
            storage[window] = this.updateStorage(mainStorage[window], receivedData[Calculated][window], timePreferences, isDeleteData, strategy, false);
          });
          arrays.push(new realTimeDataActions.SetMainStorage(storage));
          this._logger.endFilterStorageBenchmark('MAIN', receivedData[Calculated], mainStorage);
        }

        this._logger.startFilterBenchmark();
        if (receivedData.event && receivedData.event.length > 0) {
          const updatedEventStorage = this.updateStorage(eventStorage, receivedData.event, timePreferences, isDeleteData);
          arrays.push(new realTimeDataActions.SetEventStorage(updatedEventStorage));
          this._logger.endFilterBenchmark('EVENT', receivedData.event, eventStorage.records);
        }

        this._logger.startFilterBenchmark();
        if (receivedData[Predicted]) {
          const storage = {};
          Object.keys(receivedData[Predicted]).forEach(window => {
            storage[window] = this.updateStorage(predictiveStorage[window], receivedData[Predicted][window],
              timePreferences, isDeleteData, strategy, true);
          });
          arrays.push(new realTimeDataActions.SetPredictiveStorage(storage));
          this._logger.endFilterStorageBenchmark('PREDICTIVE', receivedData[Predicted], predictiveStorage);
        }

        return arrays.length > 0 ? arrays : [new DummyAction()];
      })
    );
  }

  private configurePolicyGroupEffect() {
    const policyGroupStorage$ = this._store.pipe(select(fromRealTime.getPolicyGroupStorage));
    const timePreferences$ = this._store.pipe(select(fromRealTime.getTimePreferencesState));

    this.policyGroup$ = this._actions$.pipe(
      ofType(pollingActions.LOAD_KPI_SUCCESS),
      filter((action: pollingActions.LoadKpiSuccess) => action.payload.length !== 0),
      withLatestFrom(policyGroupStorage$, timePreferences$),
      map(([action, policyGroupStorage, timePreferences]) => {
        const strategy = this.getStrategy(timePreferences);

        this._logger.startFilterBenchmark();
        const storage = this.updateStorage(policyGroupStorage['hourly'], action.payload, timePreferences, false, strategy);
        this._logger.endFilterStorageBenchmark('POLICY_GROUP', action.payload, storage);
        return new realTimeDataActions.SetPolicyGroupStorage({hourly: storage});
      })
    );
  }

  private clearInstanceEffect() {
    const mainStorage$ = this._store.pipe(select(fromRealTime.getMainStorage));
    const eventStorage$ = this._store.pipe(select(fromRealTime.getEventStorage));
    const predictiveStorage$ = this._store.pipe(select(fromRealTime.getPredictiveStorage));

    this.clearInstance$ = this._actions$.pipe(
      ofType(realTimeDataActions.CLEAR_INSTANCES),
      filter((action: realTimeDataActions.ClearInstanceStorage) => !isNullOrUndefined(action.payload)),
      withLatestFrom(mainStorage$, eventStorage$, predictiveStorage$),
      mergeMap(([action, mainStorage, eventStorage, predictiveStorage]) => {
        const payload = (action as realTimeDataActions.ClearInstanceStorage).payload;

        Object.keys(mainStorage).forEach(window => {
          mainStorage[window] = this.removeInstancesStorage(mainStorage[window], payload);
        });
        const updatedEventStorage = this.removeInstancesStorage(eventStorage, payload);
        Object.keys(predictiveStorage).forEach(window => {
          predictiveStorage[window] = this.removeInstancesStorage(predictiveStorage[window], payload);
        });

        const setMainStorageAction = new realTimeDataActions.SetMainStorage(mainStorage);
        const setEventStorageAction = new realTimeDataActions.SetEventStorage(updatedEventStorage);
        const setPredictiveStorageAction = new realTimeDataActions.SetPredictiveStorage(predictiveStorage);
        return [setMainStorageAction, setEventStorageAction, setPredictiveStorageAction];
      })
    );
  }

  private clearOtherInstancesEffect() {
    const mainStorage$ = this._store.pipe(select(fromRealTime.getMainStorage));
    const eventStorage$ = this._store.pipe(select(fromRealTime.getEventStorage));
    const predictiveStorage$ = this._store.pipe(select(fromRealTime.getPredictiveStorage));

    this.clearOtherInstance$ = this._actions$.pipe(
      ofType(realTimeDataActions.CLEAR_OTHER_INSTANCES),
      filter((action: realTimeDataActions.ClearOtherInstancesStorage) =>
        !isNullOrUndefined(action.payload) && Object.keys(action.payload).length > 0),
      withLatestFrom(mainStorage$, eventStorage$, predictiveStorage$),
      mergeMap(([action, mainStorage, eventStorage, predictiveStorage]) => {
        const payload = (action as realTimeDataActions.ClearOtherInstancesStorage).payload;

        Object.keys(mainStorage).forEach(window => {
          mainStorage[window] = this.removeOtherInstancesStorage(mainStorage[window], payload);
        });
        const updatedEventStorage = this.removeOtherInstancesStorage(eventStorage, payload);
        Object.keys(predictiveStorage).forEach(window => {
          predictiveStorage[window] = this.removeOtherInstancesStorage(predictiveStorage[window], payload);
        });

        const setMainStorageAction = new realTimeDataActions.SetMainStorage(mainStorage);
        const setEventStorageAction = new realTimeDataActions.SetEventStorage(updatedEventStorage);
        const setPredictiveStorageAction = new realTimeDataActions.SetPredictiveStorage(predictiveStorage);
        return [setMainStorageAction, setEventStorageAction, setPredictiveStorageAction];
      })
    );
  }

  private configureRebaseEffect() {
    const storage$ = this._store.pipe(select(fromRealTime.getMainStorage));

    this.rebase$ = this._store.pipe(
      select(fromRealTime.getTimePreferencesState),
      pairwise(),
      filter(([previous, current]) => this.shouldRebase(previous, current)),
      map(([previous, current]) => current),
      withLatestFrom(storage$),
      map(([timePreferences, storage]) => {
        const strategy = this.getStrategy(timePreferences);
        Object.keys(storage).forEach(window => {
          storage[window].resetRecordsState();
          storage[window].rebase(strategy);
        });
        return new realTimeDataActions.SetMainStorage(storage);
      })
    );
  }

  private updateInstanceEffect() {
    this.updateInstances$ = this._actions$.pipe(
      ofType(pollingActions.LOAD_SUCCESS),
      map((action: pollingActions.LoadSuccess) => {
        const instances = action.payload.reduce((lastInstances, item) => {
          const check = lastInstances[item.dimension];
          if (!check) {
            lastInstances[item.dimension] = [item.instance];
          } else {
            lastInstances[item.dimension] = _.union(lastInstances[item.dimension], [item.instance]);
          }
          return lastInstances;
        }, {});
        return new instanceActions.Update(instances);
      })
    );
  }

  private setLoggingModeEffect() {
    this.setLoggingMode$ = this._actions$.pipe(
      ofType(placeholdersActions.SET_LOGGING_MODE),
      tap((action: placeholdersActions.SetLoggingMode) => {
        if (this._appConfigService && this._appConfigService.config && this._appConfigService.config.logging) {
          const logging = action.payload;
          this._appConfigService.config.logging.log = !isNullOrUndefined(logging);
          this._appConfigService.config.logging.level = logging;
        }
      })
    );
  }

  private clearDataEffect() {
    this.clearData$ = this._actions$.pipe(
      ofType(realTimeDataActions.CLEAR_DATA),
      tap((action: realTimeDataActions.ClearData) => {
        this._prevTimePreferences = null;
      })
    );
  }

  private setAppConfigEffect() {
    this.setAppConfig$ = this._actions$.pipe(
      ofType(dashboardsAction.SET_APP_CONFIG),
      tap((action: dashboardsAction.SetAppConfig) => {
        this._appConfigService.config = action.payload;
      })
    );
  }

  private getDeleteData(timeRange: TimeRangeSetting): boolean {
    const { range, dataPointInterval } = timeRange;
    if (!this._prevTimePreferences || (range.startTimestamp >= this._prevTimePreferences)) {
      const { value, type } = dataPointInterval.value;
      this._prevTimePreferences = +getMomentByTimestamp(range.startTimestamp).add(value, type);
      return true;
    }
    return false;
  }

  private shouldRebase(previousTimePreferences, currentTimePreferences): boolean {
    const previousTimeRangeSettings = previousTimePreferences.config.timeRangeSettings;
    const previousZoomTimeRange = previousTimePreferences.zoom.timeRange;
    const currentTimeRangeSettings = currentTimePreferences.config.timeRangeSettings;
    const currentZoomTimeRange = currentTimePreferences.zoom.timeRange;

    return this.shouldRebaseOnSelectTimeRange(previousTimeRangeSettings, currentTimeRangeSettings)
      || this.shouldRebaseOnZoom(previousZoomTimeRange, currentZoomTimeRange, currentTimeRangeSettings)
      || this.shouldRebaseOnResetZoom(previousZoomTimeRange, currentZoomTimeRange, currentTimeRangeSettings);
  }

  private shouldRebaseOnSelectTimeRange(previous: TimeRangeSetting, current: TimeRangeSetting): boolean {
    return !isNullOrUndefined(previous)
      && !isNullOrUndefined(current)
      && this.shouldMakeDataSparse(previous.dataPointInterval.value, current.dataPointInterval.value);
  }

  private shouldRebaseOnZoom(previous: TimeRange, current: TimeRange, setting: TimeRangeSetting): boolean {
    if (!previous || !current) {
      return false;
    }
    const previousZoomDuration = this.timeRangeDuration(previous);
    if (current.startTimestamp <= previous.startTimestamp && current.endTimestamp >= previous.endTimestamp) {
      const currentZoomDuration = this.timeRangeDuration(current);
      return this.shouldMakeDataSpareInDuration(previousZoomDuration, currentZoomDuration);
    }
    const mainDuration = this.intervalDuration(setting.interval);
    return this.shouldMakeDataSpareInDuration(previousZoomDuration, mainDuration);
  }

  private shouldRebaseOnResetZoom(previous: TimeRange, current: TimeRange, timeRangeSettings: TimeRangeSetting): boolean {
    return !isNullOrUndefined(previous)
      && isNullOrUndefined(current)
      && !isNullOrUndefined(timeRangeSettings)
      && this.shouldMakeDataSpareInDuration(this.timeRangeDuration(previous), this.intervalDuration(timeRangeSettings.interval));
  }

  private shouldMakeDataSparse(targetDataPointInterval: TimeRangeInterval, compareWithDataPointInterval: TimeRangeInterval): boolean {
    const compareWithDataPointDuration = this._timeUtils.duration(compareWithDataPointInterval.value, compareWithDataPointInterval.type);
    const targetDataPointDuration = this._timeUtils.duration(targetDataPointInterval.value, targetDataPointInterval.type);
    return compareWithDataPointDuration > targetDataPointDuration;
  }

  private shouldMakeDataSpareInDuration(targetDuration: number, compareWithDuration: number): boolean {
    const targetDataPointInterval = this._timeManager.getDataPointInterval(targetDuration);
    const compareWithDataPointInterval = this._timeManager.getDataPointInterval(compareWithDuration);
    return this.shouldMakeDataSparse(targetDataPointInterval, compareWithDataPointInterval);
  }

  private intervalDuration(interval: TimeRangeInterval): number {
    return this._timeUtils.duration(interval.value, interval.type);
  }

  private timeRangeDuration(timeRange: TimeRange): number {
    return timeRange.endTimestamp - timeRange.startTimestamp;
  }

  private getMainTimeRange(timePreferences): TimeRange {
    const timeRange = timePreferences.config.timeRangeSettings.range;

    const goBackTimestamp = isNullOrUndefined(timePreferences.goBackTimestamp)
      ? timeRange.startTimestamp
      : timePreferences.goBackTimestamp;
    return { startTimestamp: goBackTimestamp, endTimestamp: timeRange.endTimestamp };
  }

  private getZoomTimeRange(timePreferences): TimeRange {
    return timePreferences.zoom.timeRange;
  }

  private getStrategy(timePreferences): ProcessStrategy {
    const mainTimeRange = this.getMainTimeRange(timePreferences);
    const zoomTimeRange = this.getZoomTimeRange(timePreferences);
    this._timeManager.updateTimeRangeSettings(timePreferences.config.timeRangeSettings);
    return this._preprocessor.timestampNormalizeStrategy(mainTimeRange, zoomTimeRange);
  }

  private updateStorage(storage: Storage, newData: RealtimeData[], timePreferences, isDeleteData: boolean,
    strategy?: ProcessStrategy, isPredictive?: boolean): Storage {
    if (!storage) {
      storage = new Table();
    }
    storage.resetRecordsState();
    storage.bulkUpsert(newData, strategy);
    if (isDeleteData) {
      const mainTimeRange = this.getMainTimeRange(timePreferences);
      const leftoverRecords = isPredictive ? storage.findRecords({ measureTimestamp: { $lte: +getCurrentMoment() } }) :
        storage.findRecords({ measureTimestamp: { $lt: mainTimeRange.startTimestamp } });
      storage.bulkRemove(leftoverRecords);
    }
    return storage.clone();
  }

  private removeInstancesStorage(storage: Storage, instanceType: any): Storage {
    const conditions = { dataType: { $eq: instanceType.dataType }, instance: { $in: instanceType.instances } };
    const leftoverRecords = storage.findRecords(conditions);
    storage.bulkRemove(leftoverRecords);
    return storage.clone();
  }

  private removeOtherInstancesStorage(storage: Storage, instanceDataType: any): Storage {
    const data = [];
    Object.keys(instanceDataType).forEach(dataType => {
      const conditions = isNullOrUndefined(instanceDataType[dataType]) ? { dataType: { $eq: dataType } } :
        { dataType: { $eq: dataType }, instance: { $notIn: instanceDataType[dataType] } };
      const leftoverRecords = storage.findRecords(conditions);
      data.push(...leftoverRecords);
      storage.bulkRemove(leftoverRecords);
    });
    return storage.clone();
  }

  private getMainData(data: RealtimeData[]): RealtimeData[] {
    return data.filter((record: RealtimeData) =>
      isNullOrUndefined(record.callID) && record.metricCalcType.toLowerCase() === Calculated);
  }

  private getEventData(data: RealtimeData[]): RealtimeData[] {
    return data.filter((record: RealtimeData) =>
      !isNullOrUndefined(record.callID) && record.metricCalcType.toLowerCase() === Calculated);
  }

  private getPredictiveData(data: RealtimeData[]): RealtimeData[] {
    return data.filter((record: RealtimeData) =>
      isNullOrUndefined(record.callID) && record.metricCalcType.toLowerCase() === Predicted);
  }

  private parseData(data: RealtimeData[]): any {
    return data.reduce((acc, item) => {
      if (isNullOrUndefined(item.callID)) {
        const metricCalcType = item.metricCalcType.toLowerCase();
        if (!acc[metricCalcType]) {
          acc[metricCalcType] = {};
        }
        if (!acc[metricCalcType][item.window]) {
          acc[metricCalcType][item.window] = [];
        }
        acc[metricCalcType][item.window].push(item);
      } else {
        if (!acc['event']) {
          acc['event'] = [];
        }
        acc['event'].push(item);
      }
      return acc;
    }, {});
  }
}
