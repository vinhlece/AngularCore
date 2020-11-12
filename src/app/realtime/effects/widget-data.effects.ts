import {Inject, Injectable, Optional} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {Action, select, Store} from '@ngrx/store';
import {combineLatest, Observable, Scheduler} from 'rxjs';
import {async} from 'rxjs/internal/scheduler/async';
import {filter, map, throttleTime} from 'rxjs/operators';
import {isNullOrUndefined} from 'util';
import {TimeUtilsImpl} from '../../common/services/timeUtils';
import * as widgetDataActions from '../../dashboard/actions/widgets-data.actions';
import {Logger} from '../../logging/services';
import {DefaultLogger} from '../../logging/services/logger';
import {LOGGER} from '../../logging/services/tokens';
import {LaunchingWidget, PollingInterval, Storage, WidgetData} from '../models';
import * as fromRealTime from '../reducers';
import {ConverterOptions} from '../services';
import {DataSourceFactory} from '../services/datasource';
import {DATA_SOURCE_FACTORY, POLLING_TIME_CONFIG} from '../services/tokens';
import {appConfig} from '../../config/app.config';

@Injectable()
export class WidgetDataEffects {
  private _actions$: Actions;
  private _store: Store<fromRealTime.State>;
  private _factory: DataSourceFactory;
  private _delayTime: number;
  private _scheduler: Scheduler;
  private _logger: Logger;

  @Effect() convert$: Observable<Action>;

  constructor(action$: Actions,
              store: Store<fromRealTime.State>,
              @Inject(DATA_SOURCE_FACTORY) factory: DataSourceFactory,
              @Inject(POLLING_TIME_CONFIG) pollingTime: PollingInterval,
              @Optional() scheduler: Scheduler,
              @Optional() @Inject(LOGGER) logger: Logger) {
    this._actions$ = action$;
    this._store = store;
    this._factory = factory;
    this._delayTime = pollingTime.convertDelay;
    this._scheduler = scheduler ? scheduler : async;
    this._logger = logger || new DefaultLogger();

    this.configureConvertEffect();
  }

  private configureConvertEffect() {
    const mainStorage$ = this._store.pipe(select(fromRealTime.getMainStorage));
    const eventStorage$ = this._store.pipe(select(fromRealTime.getEventStorage));
    const predictiveStorage$ = this._store.pipe(select(fromRealTime.getPredictiveStorage));
    const policyGroupStorage$ = this._store.pipe(select(fromRealTime.getPolicyGroupStorage));
    const launchingWidgets$ = this._store.pipe(select(fromRealTime.getLaunchingWidgets));
    const timePreferences$ = this._store.pipe(select(fromRealTime.getTimePreferencesState));
    const isTimeExplorerOpened$ = this._store.pipe(select(fromRealTime.isTimeExplorerOpened));
    const colorPalette$ = this._store.pipe(select(fromRealTime.getPalette));
    const globalFilters$ = this._store.pipe(select(fromRealTime.getGlobalFilters));
    const realTimeMode$ = this._store.pipe(select(fromRealTime.getRealTimeMode));
    const instanceColors$ = this._store.pipe(select(fromRealTime.getIColors));

    this.convert$ = combineLatest(
          mainStorage$,
          eventStorage$,
          predictiveStorage$,
          policyGroupStorage$,
          launchingWidgets$,
          timePreferences$,
          isTimeExplorerOpened$,
          colorPalette$,
          globalFilters$,
          realTimeMode$,
          instanceColors$)
      .pipe(
        throttleTime(this._delayTime, this._scheduler),
        filter(([mainStorage, eventStorage, predictiveStorage, policyGroupStorage, widgets, timePreferences]) => !isNullOrUndefined(timePreferences.config.timeRangeSettings)),
        map(([mainStorage, eventStorage, predictiveStorage, policyGroupStorage, widgets, timePreferences, isTimeExplorerOpened, colorPalette, globalFilters, realTimeMode, instanceColors]) => {
          const mainTimeRange = timePreferences.config.timeRangeSettings.range;
          const currentTimeRange = timePreferences.config.timeRangeSettings.interval;
          const currentTimestamp = timePreferences.currentTimestamp;
          const goBackTimeRange = currentTimestamp
            ? {
              startTimestamp: new TimeUtilsImpl().subtract(currentTimestamp, currentTimeRange.value, currentTimeRange.type),
              endTimestamp: currentTimestamp
            }
            : null;
          const zoomTimeRange = timePreferences.zoom.timeRange;

          const options: ConverterOptions = {
            mainTimeRange,
            goBackTimeRange,
            zoomTimeRange,
            isTimeExplorerOpened,
            colorPalette,
            globalFilters,
            currentTimeRange,
            realTimeMode,
            instanceColors
          };
          // log raw data length when get it from websocket
          // console.log('number of data points get from websocket: ', mainStorage.collections.length)
          const widgetData = this.getData(mainStorage, eventStorage, predictiveStorage, policyGroupStorage, widgets, options);
          return new widgetDataActions.ConvertSuccess(widgetData);
        }
      )
    );
  }

  private getData(mainStorage: {[window: string]: Storage},
                  eventStorage: Storage,
                  predictiveStorage: {[window: string]: Storage},
                  policyGroupStorage: {[window: string]: Storage},
                  widgets: LaunchingWidget[],
                  options: ConverterOptions): { [placeholderId: string]: WidgetData } {
    return widgets.reduce((accumulator, widget: LaunchingWidget) => {
      accumulator[widget.placeholder.id] = [];

      const dataSource = this._factory.create(widget, options);

      this._logger.startConvertBenchmark(widget);
      const t1 = appConfig.performanceLogging ? performance.now() : null;
      accumulator[widget.placeholder.id] = dataSource.getData({mainStorage, eventStorage, predictiveStorage, policyGroupStorage});
      if (appConfig.performanceLogging) {
        console.log(`Convert time: (${widget.name}-${widget.type}): ${Math.floor(performance.now() - t1)}ms`);
      }
      this._logger.endConvertBenchmark(widget);

      return accumulator;
    }, {});
  }
}
