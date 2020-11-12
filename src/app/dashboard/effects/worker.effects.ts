import {Inject, Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Action} from '@ngrx/store';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {ActionWithPayload, DummyAction} from '../../common/actions';
import * as formulaMeasuresActions from '../../measures/actions/formula-measure.actions';
import * as measuresActions from '../../measures/actions/measures.actions';
import * as packagesActions from '../../measures/actions/packages.actions';
import * as pollingActions from '../../realtime/actions/rest-api/polling.actions';
import * as streamsActions from '../../realtime/actions/rest-api/streams.actions';
import * as widgetsActions from '../../widgets/actions/widgets.actions';
import * as realTimeDataActions from '../../realtime/actions/rest-api/real-time-data.actions';
import * as placeholdersActions from '../actions/placeholders.actions';
import * as timeExplorerActions from '../actions/time-explorer.actions';
import * as timePreferencesActions from '../actions/time-preferences.actions';
import * as colorPaletteActions from '../../user/actions/palette.actions';
import * as tabsActions from '../actions/tabs.actions';
import {WorkerService} from '../services';
import {WORKER_SERVICE} from '../services/tokens';
import * as userActions from '../../user/actions/user.actions';
import * as dashboardsAction from '../actions/dashboards.action';
import * as connectionStatusActions from '../actions/connection-status.actions';
import * as instanceAction from '../actions/instance-color.actions';

@Injectable()
export class WorkerEffects {
  private _actions$: Actions;
  private _workerService: WorkerService;

  @Effect() response$: Observable<Action>;

  @Effect({dispatch: false}) actionTransfer$: Observable<Action>;

  constructor(action$: Actions, @Inject(WORKER_SERVICE) workerService: WorkerService) {
    this._actions$ = action$;
    this._workerService = workerService;

    this.actionTransfer();
    this.responseEffect();
  }

  private actionTransfer() {
    type actions =
      | pollingActions.Start
      | pollingActions.Stop
      | pollingActions.Pause
      | pollingActions.Resume
      | pollingActions.Generate
      | pollingActions.PumpUp
      | pollingActions.GoBack
      | realTimeDataActions.ClearData
      | realTimeDataActions.ClearInstanceStorage
      | streamsActions.ResetPumpUpStream
      | streamsActions.ResetGoBackPumpUpStream
      | packagesActions.LoadAllSuccess
      | formulaMeasuresActions.LoadAllSuccess
      | formulaMeasuresActions.AddSuccess
      | measuresActions.FindByNameSuccess
      | timePreferencesActions.LoadSuccess
      | timePreferencesActions.UpdateTimeRange
      | timePreferencesActions.SetGoBackTimestamp
      | timePreferencesActions.UpdateTimeRangeSettings
      | timePreferencesActions.UpdatePredictiveSettings
      | timePreferencesActions.SetCurrentTimestamp
      | timePreferencesActions.Zoom
      | timePreferencesActions.ResetZoom
      | timeExplorerActions.Open
      | timeExplorerActions.Close
      | tabsActions.GlobalFilters
      | placeholdersActions.Set
      | placeholdersActions.Delete
      | placeholdersActions.ReleasePlaceholders
      | placeholdersActions.ShowLatest
      | placeholdersActions.ShowHistorical
      | placeholdersActions.ShowHistoricals
      | placeholdersActions.ShowTimestamp
      | widgetsActions.LoadSuccess
      | widgetsActions.LoadAllSuccess
      | widgetsActions.AddSuccess
      | widgetsActions.UpdateSuccess
      | widgetsActions.DeleteSuccess
      | widgetsActions.SearchSuccess
      | colorPaletteActions.LoadAllPalettesSuccess
      | userActions.LoginSuccess
      | userActions.UpdateSuccess
      | connectionStatusActions.GetConnectionStatus
      | dashboardsAction.SetAppConfig
      | instanceAction.GetSuccess
      | instanceAction.DeleteSuccess
      | instanceAction.UpdateSuccess
      | instanceAction.EditSuccess;

    const actionTypes: string[] = [
      pollingActions.START,
      pollingActions.STOP,
      pollingActions.PAUSE,
      pollingActions.RESUME,
      pollingActions.GENERATE,
      pollingActions.PUMP_UP,
      pollingActions.GO_BACK,
      realTimeDataActions.CLEAR_DATA,
      realTimeDataActions.CLEAR_INSTANCES,
      streamsActions.RESET_PUMP_UP_STREAM,
      streamsActions.RESET_GO_BACK_PUMP_UP_STREAM,
      packagesActions.LOAD_ALL_RESPONSE,
      formulaMeasuresActions.LOAD_ALL_RESPONSE,
      formulaMeasuresActions.ADD_RESPONSE,
      measuresActions.FIND_BY_NAME_RESPONSE,
      timePreferencesActions.LOAD_RESPONSE,
      timePreferencesActions.UPDATE_TIME_RANGE,
      timePreferencesActions.SET_GO_BACK_TIMESTAMP,
      timePreferencesActions.UPDATE_TIME_RANGE_SETTINGS,
      timePreferencesActions.UPDATE_PREDICTIVE_SETTINGS,
      timePreferencesActions.SET_CURRENT_TIMESTAMP,
      timePreferencesActions.ZOOM,
      timePreferencesActions.RESET_ZOOM,
      timeExplorerActions.OPEN,
      timeExplorerActions.CLOSE,
      tabsActions.GLOBAL_FILTERS,
      placeholdersActions.SET,
      placeholdersActions.DELETE,
      placeholdersActions.SHOW_LATEST,
      placeholdersActions.SHOW_HISTORICAL,
      placeholdersActions.SHOW_HISTORICALS,
      placeholdersActions.SHOW_TIMESTAMP,
      placeholdersActions.RELEASE_PLACEHOLDERS,
      widgetsActions.LOAD_RESPONSE,
      widgetsActions.LOAD_ALL_RESPONSE,
      widgetsActions.ADD_RESPONSE,
      widgetsActions.UPDATE_RESPONSE,
      widgetsActions.DELETE_RESPONSE,
      widgetsActions.SEARCH_RESPONSE,
      colorPaletteActions.LOAD_ALL_RESPONSE,
      userActions.LOGIN_RESPONSE,
      userActions.UPDATE_RESPONSE,
      placeholdersActions.SET_REAL_TIME_MODE,
      placeholdersActions.SET_LOGGING_MODE,
      connectionStatusActions.GET_CONNECTION_STATUS,
      dashboardsAction.SET_APP_CONFIG,
      instanceAction.GET_RESPONSE,
      instanceAction.DELETE_RESPONSE,
      instanceAction.UPDATE_RESPONSE,
      instanceAction.EDIT_RESPONSE
    ];

    this.actionTransfer$ = this._actions$.pipe(
      ofType<actions>(...actionTypes),
      tap((action: ActionWithPayload<any>) => this._workerService.transferAction(action))
    );
  }

  private responseEffect() {
    this.response$ = this._workerService.onResponse().pipe(
      map(action => {
        if ('type' in action) {
          return action;
        }
        return new DummyAction();
      })
    );
  }
}
