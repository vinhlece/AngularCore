import {Inject, Injectable, Optional} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Action, select, Store} from '@ngrx/store';
import {Observable, of, Scheduler, timer} from 'rxjs';
import {async} from 'rxjs/internal/scheduler/async';
import {catchError, debounceTime, flatMap, mergeMap, switchMap, takeUntil, withLatestFrom} from 'rxjs/operators';
import {isNullOrUndefined} from 'util';
import {TimeManager, TimeUtils} from '../../common/services';
import {TIME_MANAGER, TIME_UTILS} from '../../common/services/tokens';
import * as streamsActions from '../../realtime/actions/rest-api/streams.actions';
import {PollingInterval} from '../../realtime/models';
import {POLLING_TIME_CONFIG} from '../../realtime/services/tokens';
import * as replayActions from '../actions/replay.actions';
import * as timePreferencesActions from '../actions/time-preferences.actions';
import {PollingConfig, PredictiveSetting, TimeRange, TimeRangeInterval, TimeRangeSetting} from '../models';
import * as fromDashboards from '../reducers';
import {PollingConfigService} from '../services';
import {POLLING_CONFIG_SERVICE} from '../services/tokens';
import * as realtimeDataAction from '../../realtime/actions/rest-api/real-time-data.actions';
import {ZoomEvent} from '../../charts/models/index';
import * as pollingActions from '../../realtime/actions/rest-api/polling.actions';
import {getAvailablePredictiveRange} from '../utils/functions';
import * as placeholdersActions from '../actions/placeholders.actions';

@Injectable()
export class TimePreferencesEffect {
  private _store: Store<fromDashboards.State>;
  private _actions$: Actions;
  private _pollingConfigService: PollingConfigService;
  private _timeManager: TimeManager;
  private _timeUtils: TimeUtils;
  private _scheduler: Scheduler;
  private _pollingInterval: PollingInterval;

  @Effect() load$: Observable<Action>;
  @Effect() update$: Observable<Action>;
  @Effect() goBack$: Observable<Action>;
  @Effect() triggerZoom$: Observable<Action>;
  @Effect() selectTimeRangeSettings$: Observable<Action>;
  @Effect() selectPredictiveSettings$: Observable<Action>;
  @Effect() resetZoom$: Observable<Action>;

  constructor(store: Store<fromDashboards.State>,
              action: Actions,
              @Inject(POLLING_CONFIG_SERVICE) pollingConfigService: PollingConfigService,
              @Inject(TIME_MANAGER) timeManager: TimeManager,
              @Inject(TIME_UTILS) timeUtils: TimeUtils,
              @Inject(POLLING_TIME_CONFIG) pollingInterval: PollingInterval,
              @Optional() scheduler: Scheduler) {
    this._store = store;
    this._actions$ = action;
    this._scheduler = scheduler ? scheduler : async;
    this._pollingInterval = pollingInterval;
    this._pollingConfigService = pollingConfigService;
    this._timeManager = timeManager;
    this._timeUtils = timeUtils;

    this.loadEffect();
    this.updateEffect();
    this.goBackEffect();
    this.triggerZoomEffect();
    this.selectTimeRangeSettingsEffect();
    this.selectPredictiveSettingsEffect();
    this.resetZoomEffect();
  }

  private loadEffect() {
    this.load$ = this._actions$.pipe(
      ofType(timePreferencesActions.LOAD),
      switchMap((action: timePreferencesActions.Load) => (
        this._pollingConfigService.load().pipe(
          mergeMap((config: PollingConfig) => {
            config.timeRangeSettings.range = this.getMainTimeRange(config.timeRangeSettings.interval, config.predictiveSettings.value);
            const loadSuccessAction = new timePreferencesActions.LoadSuccess(config);
            const startUpdateInRealTimeAction = new timePreferencesActions.StartUpdateInRealTime();
            return [loadSuccessAction, startUpdateInRealTimeAction];
          }),
          catchError((error: Error) => of(new timePreferencesActions.LoadFailure(error)))
        )
      ))
    );
  }

  private updateEffect() {
    const timeRangeSetting$ = this._store.pipe(select(fromDashboards.getTimeRangeSettings));
    const currentTimestamp$ = this._store.pipe(select(fromDashboards.getCurrentTimestamp));
    const goBackTimestamp$ = this._store.pipe(select(fromDashboards.getGoBackTimestamp));
    const predictiveSetting$ = this._store.pipe(select(fromDashboards.getPredictiveSetting));

    const timer$ = timer(0, 60 * 1000, this._scheduler).pipe(
      withLatestFrom(timeRangeSetting$, currentTimestamp$, goBackTimestamp$, predictiveSetting$),
      takeUntil(this._actions$.pipe(ofType(timePreferencesActions.STOP_UPDATE_IN_REAL_TIME))),
      mergeMap(([i, timeRangeSetting, currentTimestamp, goBackTimestamp, predictiveSetting]) => {
        const range = this.getMainTimeRange(timeRangeSetting.interval, predictiveSetting);
        const updateTimeRangeAction = new timePreferencesActions.UpdateTimeRange(this._timeManager.normalizeTimeRange(range));
        const updatedGoBackTimestamp = this.getGoBackTimestamp(timeRangeSetting.interval, goBackTimestamp, currentTimestamp);
        const setGoBackTimestampAction = new timePreferencesActions.SetGoBackTimestamp(updatedGoBackTimestamp);
        return [updateTimeRangeAction, setGoBackTimestampAction];
      }),
    );

    this.update$ = this._actions$.pipe(
      ofType(timePreferencesActions.START_UPDATE_IN_REAL_TIME),
      flatMap(() => timer$)
    );
  }

  private goBackEffect() {
    const placeHolders$ = this._store.pipe(select(fromDashboards.getPlaceholderDisplayModes));
    this.goBack$ = this._actions$.pipe(
      ofType(timePreferencesActions.GO_BACK),
      withLatestFrom(this._store.pipe(select(fromDashboards.getCurrentTimestamp)), placeHolders$),
      mergeMap(([action, currentTimestamp, placeHolders]) => {
        const newCurrentTimestamp = (action as timePreferencesActions.GoBack).payload;
        const setCurrentTimestampAction = new timePreferencesActions.SetCurrentTimestamp(newCurrentTimestamp);
        const setGoBackTimestamp = new timePreferencesActions.SetGoBackTimestamp(newCurrentTimestamp);
        const resetGoBackPumpUpAction = new streamsActions.ResetGoBackPumpUpStream();
        const stopReplayAction = new replayActions.Stop();
        const gobackPumpUpAction = new pollingActions.GoBack();
        const placeHolderHistory = new placeholdersActions.ShowHistoricals(placeHolders);
        if (newCurrentTimestamp && (!currentTimestamp || newCurrentTimestamp < currentTimestamp)) {
          return [setCurrentTimestampAction, resetGoBackPumpUpAction, stopReplayAction, setGoBackTimestamp, gobackPumpUpAction, placeHolderHistory];
        } else {
          return [setCurrentTimestampAction, stopReplayAction];
        }
      })
    );
  }

  private triggerZoomEffect() {
    this.triggerZoom$ = this._actions$.pipe(
      ofType(timePreferencesActions.TRIGGER_ZOOM),
      debounceTime(this._pollingInterval.debounce, this._scheduler),
      flatMap((action: timePreferencesActions.TriggerZoom) => [
        new realtimeDataAction.ClearInstanceStorage(action.payload.otherParams),
        new timePreferencesActions.Zoom(action.payload)
      ])
    );
  }

  private resetZoomEffect() {
    const timeRangeSetting$ = this._store.pipe(select(fromDashboards.getTimeRangeSettings));
    this.resetZoom$ = this._actions$.pipe(
      ofType(timePreferencesActions.RESET_ZOOM),
      withLatestFrom(timeRangeSetting$),
      debounceTime(this._pollingInterval.debounce, this._scheduler),
      flatMap(([action, timeRangeSetting]) => {
        const zoomEvent: ZoomEvent = {
          timeRange: (action as timePreferencesActions.ResetZoom).payload ? null : timeRangeSetting.range
        };
        return [
          new realtimeDataAction.ClearData(),
          new timePreferencesActions.Zoom(zoomEvent)
        ];
      })
    );
  }

  private selectTimeRangeSettingsEffect() {
    const predictiveSettings$ = this._store.pipe(select(fromDashboards.getPredictiveSettings));
    this.selectTimeRangeSettings$ = this._actions$.pipe(
      ofType(timePreferencesActions.SELECT_TIME_RANGE_SETTINGS),
      withLatestFrom(predictiveSettings$),
      mergeMap(([action, predictiveSettings]) => {
        const timeRangeSettings = (action as timePreferencesActions.SelectTimeRangeSettings).payload;
        const newPredictiveSettings = this.getPredictiveRange(predictiveSettings, timeRangeSettings.interval);
        const {startTimestamp, endTimestamp} = this.getMainTimeRange(timeRangeSettings.interval, newPredictiveSettings.value);
        const range: TimeRange = this._timeManager.normalizeTimeRange({startTimestamp, endTimestamp});
        const settings: TimeRangeSetting = {...timeRangeSettings, range};

        return [
          new streamsActions.ResetPumpUpStream(),
          new timePreferencesActions.UpdateTimeRangeSettings(settings),
          new timePreferencesActions.UpdatePredictiveSettings(newPredictiveSettings),
          new timePreferencesActions.SetCurrentTimestamp(null),
          new timePreferencesActions.SetGoBackTimestamp(null),
          new timePreferencesActions.SetTimeRange(null),
          new timePreferencesActions.ResetZoom(true),
          new pollingActions.PumpUp(null)
        ];
      })
    );
  }

  private selectPredictiveSettingsEffect() {
    const timeRangeSettings$ = this._store.pipe(select(fromDashboards.getTimeRangeSettings));
    this.selectPredictiveSettings$ = this._actions$.pipe(
      ofType(timePreferencesActions.SELECT_PREDICTIVE_SETTINGS),
      withLatestFrom(timeRangeSettings$),
      mergeMap(([action, timeRangeSettings]) => {
        const predictiveSetting = (action as timePreferencesActions.SelectPredictiveSettings).payload;
        const {startTimestamp, endTimestamp} = this.getMainTimeRange(timeRangeSettings.interval, predictiveSetting.value);
        const range: TimeRange = this._timeManager.normalizeTimeRange({startTimestamp, endTimestamp});
        const settings: TimeRangeSetting = {...timeRangeSettings, range};

        return [
          new timePreferencesActions.UpdatePredictiveSettings(predictiveSetting),
          new timePreferencesActions.UpdateTimeRangeSettings(settings)
        ];
      })
    );
  }

  private getMainTimeRange(interval: TimeRangeInterval, predictiveSetting: TimeRangeInterval): TimeRange {
    const {value, type} = interval;
    let endTimestamp = this._timeUtils.getCurrentTimestamp();
    const startTimestamp = this._timeUtils.subtract(endTimestamp, value, type);
    if (predictiveSetting.value) {
      endTimestamp = this._timeUtils.add(endTimestamp, predictiveSetting.value, predictiveSetting.type);
    }
    return {startTimestamp, endTimestamp};
  }

  private getGoBackTimestamp(interval: TimeRangeInterval, previousGoBackTimestamp: number, currentTimestamp: number): number {
    if (isNullOrUndefined(previousGoBackTimestamp) || isNullOrUndefined(currentTimestamp)) {
      return null;
    }
    const {value, type} = interval;
    return this._timeUtils.subtract(currentTimestamp, value, type);
  }

  private getPredictiveRange(predictiveSettings: PredictiveSetting, currentTimeRange: TimeRangeInterval) {
    const newPredictiveSettings = {...predictiveSettings, available: getAvailablePredictiveRange(currentTimeRange)};
    const {value, type} = newPredictiveSettings.value;
    const exitedRange = newPredictiveSettings.available.reduce((acc, item) => {
      return acc || item.value === value && item.type === type;
    }, false);
    if (!exitedRange) {
      newPredictiveSettings.value = newPredictiveSettings.available[1];
    }
    return newPredictiveSettings;
  }
}
