import { Inject, Injectable, Optional } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { combineLatest, Observable, Scheduler } from 'rxjs';
import { async } from 'rxjs/internal/scheduler/async';
import { debounceTime, filter, map, mergeMap, tap, withLatestFrom } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';
import * as timePreferencesActions from '../../../dashboard/actions/time-preferences.actions';
import { TimeRange, TimeRangeSetting } from '../../../dashboard/models';
import { TimeUtils } from '../../../common/services';
import { DummyAction } from '../../../common/actions';
import { TIME_UTILS } from '../../../common/services/tokens';
import * as pollingActions from '../../actions/rest-api/polling.actions';
import {PollingInterval, PumpupOptions, StartOptions, Stream, Topic} from '../../models';
import * as fromRealTime from '../../reducers';
import { ReportingDataGeneratorService } from '../../services';
import { GROUPER_SEPARATOR } from '../../services/grouper/grouper';
import { POLLING_TIME_CONFIG, REPORTING_DATA_GENERATOR_SERVICE } from '../../services/tokens';
import { TopicMapper } from '../../services/TopicMapper';
import { WidgetType } from '../../../widgets/constants/widget-types';
import * as subscriptionAction from '../../actions/web-socket/subscription.action';
import { Widget } from '../../../widgets/models/index';
import * as realTimeActions from '../../actions/web-socket/real-time-client.action';
import * as _ from 'lodash';
import {getFormulaMeasures} from '../../utils/formatter';
import {FormulaMeasureFactory} from '../../../measures/services/index';
import {FORMULA_MEASURE_FACTORY} from '../../../measures/services/tokens';
import {getWindowInMeasure, unionInstances} from '../../../common/utils/function';

@Injectable()
export class PumpUpEffects {
  private _actions$: Actions;
  private _store: Store<fromRealTime.State>;
  private _scheduler: Scheduler;
  private _reportingDataGeneratorService: ReportingDataGeneratorService;
  private _formulaMeasureFactory: FormulaMeasureFactory;
  private _topicMapper: TopicMapper;
  private _timeUtils: TimeUtils;
  private _pollingInterval: PollingInterval;

  @Effect() trigger$: Observable<Action>;
  @Effect() pumpUp$: Observable<Action>;
  @Effect() goBackPumpUp$: Observable<Action>;
  @Effect({ dispatch: false }) zoom$: Observable<any>;

  constructor(action$: Actions,
    store: Store<fromRealTime.State>,
    topicMapper: TopicMapper,
    @Inject(REPORTING_DATA_GENERATOR_SERVICE) reportingDataGeneratorService: ReportingDataGeneratorService,
    @Inject(FORMULA_MEASURE_FACTORY) formulaMeasureFactory: FormulaMeasureFactory,
    @Inject(POLLING_TIME_CONFIG) pollingInterval: PollingInterval,
    @Inject(TIME_UTILS) timeUtils: TimeUtils,
    @Optional() scheduler: Scheduler) {
    this._actions$ = action$;
    this._store = store;
    this._scheduler = scheduler ? scheduler : async;

    this._pollingInterval = pollingInterval;
    this._topicMapper = topicMapper;
    this._reportingDataGeneratorService = reportingDataGeneratorService;
    this._formulaMeasureFactory = formulaMeasureFactory;
    this._timeUtils = timeUtils;

    this.triggerEffect();
    this.pumpUpEffect();
    this.goBackPumpUpEffect();
    this.zoomEffect();
  }

  private triggerEffect() {
    const streams$ = this._store.pipe(select(fromRealTime.getStreams));
    const goBackStreams$ = this._store.pipe(select(fromRealTime.getGoBackStreams));
    const topics$ = this._store.pipe(select(fromRealTime.getTopics));
    const globalFilters$ = this._store.pipe(select(fromRealTime.getGlobalFilters));

    this.trigger$ = combineLatest(topics$, streams$, goBackStreams$, globalFilters$).pipe(
      debounceTime(this._pollingInterval.debounce, this._scheduler),
      map(() =>  new subscriptionAction.Add())
    );
  }

  private pumpUpEffect() {
    const timePreferencesState$ = this._store.pipe(select(fromRealTime.getTimePreferencesState));
    const topics$ = this._store.pipe(select(fromRealTime.getTopics));
    const launchingWidgets$ = this._store.pipe(select(fromRealTime.getLaunchingWidgets));
    const pumpUpOptions$ = this._store.pipe(select(fromRealTime.getPumpUpOptions));
    const globalFilters$ = this._store.pipe(select(fromRealTime.getGlobalFilters));

    // TODO: Do not send pump up request when paused

    this.pumpUp$ = this._actions$.pipe(
      ofType(pollingActions.PUMP_UP),
      withLatestFrom(timePreferencesState$, topics$, launchingWidgets$, pumpUpOptions$, globalFilters$),
      filter(([action, timePreferencesState, topics, launchingWidgets, pumpUpOptions, globalFilters]) => {
        return timePreferencesState.config && !isNullOrUndefined(timePreferencesState.config.timeRangeSettings);
      }),
      mergeMap(([action, timePreferencesState, topics, launchingWidgets, pumpUpOptions, globalFilters]) => {
        // Send pump up request with this time range
        const timeRange = timePreferencesState.config.timeRangeSettings;
        const range = this.getPumpUpTimeRange(timeRange);

        const pumpupAction = (action as pollingActions.PumpUp);
        const pumpUp = pumpupAction.packageName ? pumpUpOptions : null;
        const widgets = pumpupAction.packageName ?
          launchingWidgets.filter(item => item.dataType === pumpupAction.packageName) : launchingWidgets;
        const pumpupOptions = this.executePumpUp(range, topics, widgets, pumpUp, globalFilters);
        if (pumpupOptions.length === 0) {
          return [new DummyAction()];
        }

        const setTimeRangeAction = new timePreferencesActions.SetTimeRange(range);
        const updatePumpUpAction = new realTimeActions.UpdatePumpupSuccess(pumpupOptions, isNullOrUndefined(pumpupAction.packageName));
        // To avoid overlapping with requested time range when sending go back pump up request
        const gobackTimestamp = timeRange.range && timeRange.range.startTimestamp ? timeRange.range.startTimestamp : range.startTimestamp;
        const setGoBackTimestampAction = new timePreferencesActions.SetGoBackTimestamp(gobackTimestamp);

        return isNullOrUndefined(timePreferencesState.goBackTimestamp)
          ? [setTimeRangeAction, updatePumpUpAction, setGoBackTimestampAction]
          : [setTimeRangeAction, updatePumpUpAction];
      })
    );
  }

  private goBackPumpUpEffect() {
    const timePreferencesState$ = this._store.pipe(select(fromRealTime.getTimePreferencesState));
    const topics$ = this._store.pipe(select(fromRealTime.getTopics));
    const widgets$ = this._store.pipe(select(fromRealTime.getLaunchingWidgets));
    const globalFilters$ = this._store.pipe(select(fromRealTime.getGlobalFilters));

    this.goBackPumpUp$ = this._actions$.pipe(
      ofType(pollingActions.GO_BACK),
      withLatestFrom(timePreferencesState$, topics$, widgets$, globalFilters$),
      filter(([action, timePreferencesState, topics, widgets, globalFilters]) => {
        const hasLine = widgets && !isNullOrUndefined(widgets.find(widget => widget.type === WidgetType.Line));
        return !isNullOrUndefined(timePreferencesState.currentTimestamp) &&
          !isNullOrUndefined(timePreferencesState.goBackTimestamp) && topics.length > 0 && hasLine;
      }
      ),
      map(([action, timePreferencesState, topics, launchingWidgets, globalFilters]) => {
        const { type, value } = timePreferencesState.config.timeRangeSettings.interval;
        const startTimestamp = this._timeUtils.subtract(timePreferencesState.currentTimestamp, value, type);

        const widgets = launchingWidgets.filter(item => item.type === WidgetType.Line);
        // We already sending pump up request after current go back timestamp
        if (startTimestamp < timePreferencesState.goBackTimestamp) {
          const dirtyGoBackTimeRange: TimeRange = { startTimestamp, endTimestamp: timePreferencesState.goBackTimestamp };
          this.executeDirtyGoBackPumpUp(dirtyGoBackTimeRange, topics, widgets, globalFilters);
        }

        const goBackTimeRange: TimeRange = {
          startTimestamp,
          endTimestamp: timePreferencesState.timeRange.startTimestamp
        };
        this.executeGoBackPumpUp(goBackTimeRange, topics, widgets, globalFilters);
        return startTimestamp < timePreferencesState.goBackTimestamp
          ? new timePreferencesActions.SetGoBackTimestamp(startTimestamp)
          : new DummyAction();
      })
    );
  }

  private zoomEffect() {
    const topics$ = this._store.pipe(select(fromRealTime.getTopics));
    const widgets$ = this._store.pipe(select(fromRealTime.getLaunchingWidgets));
    const timePreferencesState$ = this._store.pipe(select(fromRealTime.getTimePreferencesState));
    const globalFilters$ = this._store.pipe(select(fromRealTime.getGlobalFilters));

    this.zoom$ = this._actions$.pipe(
      ofType(timePreferencesActions.ZOOM),
      debounceTime(200),
      withLatestFrom(topics$, widgets$, timePreferencesState$, globalFilters$),
      filter(([action, topics, widgets, timePreferencesState, globalFilters]) => (topics.length > 0) &&
        !isNullOrUndefined((action as timePreferencesActions.Zoom).payload.timeRange)),
      tap(([action, topics, widgets, timePreferencesState, globalFilters]) => {
        let zoomTimeRange = (action as timePreferencesActions.Zoom).payload.timeRange;
        if (!this.isValidZoomTimeRange(zoomTimeRange)) {
          zoomTimeRange = this.getPumpUpTimeRange(timePreferencesState.config.timeRangeSettings);
        }
        this.executeZoomPumpUp(zoomTimeRange, topics, widgets, globalFilters);
      })
    );
  }

  private isValidZoomTimeRange(zoomTimeRange: TimeRange) {
    return zoomTimeRange && (!isNullOrUndefined(zoomTimeRange.startTimestamp) || !isNullOrUndefined(zoomTimeRange.endTimestamp));
  }

  private executeZoomPumpUp(timeRange: TimeRange, topics: Topic[], launchingWidgets: Widget[], globalFilters: string[]) {
    this.executeInternal(timeRange, topics, launchingWidgets, globalFilters);
  }

  private executePumpUp(timeRange: TimeRange, topics: Topic[],
                        launchingWidgets: Widget[], pumpUpOptions: PumpupOptions[], globalFilters: string[]): PumpupOptions[] {
    // log the moment widget send pump up request
    // console.log('send pump-up request at: ', getCurrentMoment().format(AppDateTimeFormat.dateTime));
    return this.executeInternal(timeRange, topics, launchingWidgets, globalFilters, pumpUpOptions);
  }

  private executeDirtyGoBackPumpUp(timeRange: TimeRange, topics: Topic[], launchingWidgets: Widget[], globalFilters: string[]) {
    this.executeInternal(timeRange, topics, launchingWidgets, globalFilters);
  }

  private executeGoBackPumpUp(timeRange: TimeRange, topics: Topic[], launchingWidgets: Widget[], globalFilters: string[]) {
    this.executeInternal(timeRange, topics, launchingWidgets, globalFilters);
  }

  private executeInternal(timeRange: TimeRange, topics: Topic[],
                          launchingWidgets: Widget[], globalFilters, currentPumpUps?: PumpupOptions[]): PumpupOptions[] {
    const measuresFilter = launchingWidgets.reduce((acc, widget) => {
      if (widget.measures.length <= 0 || widget.dimensions.length <= 0 || widget.windows.length <= 0) {
        return acc;
      }

      const widgetTopic = topics.find(topic => topic.dataType === widget.dataType);
      if (!widgetTopic.isSubscribed) {
        return acc;
      }
      widget.dimensions.forEach(widgetDimension => {
        widget.measures.forEach(widgetMeasure => {
          const instances = unionInstances(widgetDimension);
          if (instances.length <= 0) {
            return;
          }
          const formulaMeasures = getFormulaMeasures(this._formulaMeasureFactory, widgetMeasure);
          const dimensionName = widgetDimension.dimension;
          formulaMeasures.forEach(measure => {
            if (!acc[measure]) {
              const widgetInstances = globalFilters ? globalFilters : [];
              acc[measure] = {
                dimensions: {
                  [dimensionName]: widgetInstances,
                }
              };
              const window = widgetTopic.measures.find(topicMeasure => topicMeasure.name === measure);
              if (!window) { return; }
              const windowInfo = getWindowInMeasure(window);
              if (widget.windows.indexOf(windowInfo) >= 0) {
                acc[measure].windowType = window.windowType;
                acc[measure].windowName = window.windowName;
              }
            } else if (!acc[measure]['dimensions'][dimensionName]) {
              acc[measure]['dimensions'][dimensionName] = [];
            }
            acc[measure] = {
              ...acc[measure],
              dimensions: {
                ...acc[measure]['dimensions'],
                [dimensionName]: _.union(acc[measure]['dimensions'][dimensionName], instances)
              }
            };
          });
        });
      });
      return acc;
    }, {});
    const pumpupOptions: PumpupOptions[] = [];
    Object.keys(measuresFilter).forEach(measure => {
      const topic = topics.length > 0 ? topics[0] : null;
      if (topic && topic.isSubscribed) {
        Object.keys(measuresFilter[measure]['dimensions']).forEach(dimensionValue => {
          measuresFilter[measure]['dimensions'][dimensionValue].forEach(instance => {
            const {windowType, windowName} = measuresFilter[measure];
            if (!windowType && !windowName) { return; }
            if (currentPumpUps) {
              if (currentPumpUps.find(item => item.measure === measure &&
                  _.difference(item.instances, instance).length === 0 &&
                  windowType === item.windowType && windowName === item.windowName)) {
                return;
              }
            }
            const option = this.buildPumpUpOptions([instance], timeRange, topic.clientId, measure,
              windowType, windowName, dimensionValue);
            pumpupOptions.push({...option, instances: [dimensionValue]});
            this._reportingDataGeneratorService.get(option).subscribe();
          });
        });
      }
    });
    return pumpupOptions;
  }

  /**
   * Build request options for a packages with multiple instances and a specified time range
   * @param streams A list of stream with the same package and time range, but the instances is differ
   * @param timeRange Contain current time range settings, used to calculate time range if it is not provided by stream
   */
  private buildPumpUpOptions(instances: string[], timeRange: TimeRange, clientId: string, measure: string, windowType: string, windowName: string, dimension: string): StartOptions {
    const emptyInstance = instances.find((instance: string) => instance === '');
    const lastInstances = isNullOrUndefined(emptyInstance) ? instances : emptyInstance;

    return {
      startDate: timeRange.startTimestamp, endDate: timeRange.endTimestamp, clientId,
      windowType, windowName, measure,
      dimensions: encodeURI(JSON.stringify([{ [dimension]: lastInstances }]))
    };
  }

  private generatePackageId(stream: Stream): string {
    const { dataType } = stream;
    return `${GROUPER_SEPARATOR}${dataType}`;
  }

  private getPumpUpTimeRange(timeRangeSettings: TimeRangeSetting): TimeRange {
    const { type, value } = timeRangeSettings.interval;
    const endTimestamp = this._timeUtils.getCurrentTimestamp();
    const startTimestamp = this._timeUtils.subtract(endTimestamp, value, type);
    return { startTimestamp, endTimestamp };
  }

  private getTopic(stream: Stream): Topic {
    const { dataType } = stream;
    return this._topicMapper.getTopic(dataType);
  }
}
