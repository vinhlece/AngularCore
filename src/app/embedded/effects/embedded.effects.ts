import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Action, select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {filter, map, mergeMap} from 'rxjs/operators';
import {isNullOrUndefined} from 'util';
import {ActionMeta} from '../../common/actions';
import * as dashboardsActions from '../../dashboard/actions/dashboards.action';
import * as placeholdersActions from '../../dashboard/actions/placeholders.actions';
import * as timePreferencesActions from '../../dashboard/actions/time-preferences.actions';
import {Placeholder} from '../../dashboard/models';
import * as fromDashboards from '../../dashboard/reducers';
import * as pollingActions from '../../realtime/actions/rest-api/polling.actions';
import * as usersActions from '../../user/actions/user.actions';
import {Credentials, User} from '../../user/models/user';
import * as fromUsers from '../../user/reducers';
import * as widgetsActions from '../../widgets/actions/widgets.actions';
import * as embeddedActions from '../actions/embedded.actions';
import * as fromEmbedded from '../reducers';

@Injectable()
export class EmbeddedEffects {
  private _actions$: Actions;
  private _store: Store<fromEmbedded.State>;
  private _isSessionStarted: boolean;

  @Effect() startSession$: Observable<Action>;
  @Effect() onSessionStarted$: Observable<Action>;
  @Effect() setPlaceholders$: Observable<Action>;

  constructor(action: Actions, store: Store<fromEmbedded.State>) {
    this._actions$ = action;
    this._store = store;

    this.startSessionEffect();
    this.onSessionStartedEffect();
    this.setPlaceholdersEffect();
  }

  startSessionEffect() {
    this.startSession$ = this._actions$.pipe(
      ofType(embeddedActions.START_SESSION),
      filter((action: embeddedActions.StartSession) => !this._isSessionStarted),
      mergeMap((action: embeddedActions.StartSession) => {
        this._isSessionStarted = true;
        const credentials: Credentials = {userName: 'adminUser', password: '12345678'};
        const meta: ActionMeta = {doNavigation: false};
        const loginAction = new usersActions.Login(credentials, meta);
        const launchAction = new dashboardsActions.LaunchStandalone();
        const startAction = new pollingActions.Start();
        return [loginAction, launchAction, startAction];
      })
    );
  }

  onSessionStartedEffect() {
    this.onSessionStarted$ = this._store.pipe(
      select(fromUsers.getAuthenticatedUser),
      filter((user: User) => !isNullOrUndefined(user)),
      mergeMap((user: User) => {
        const loadAllWidgetsAction = new widgetsActions.LoadAll();
        const loadPollingConfigAction = new timePreferencesActions.Load();
        return [loadAllWidgetsAction, loadPollingConfigAction];
      })
    );
  }

  setPlaceholdersEffect() {
    this.setPlaceholders$ = this._store.pipe(
      select(fromDashboards.getPlaceholders),
      map((placeholders: Placeholder[]) => new placeholdersActions.Set(placeholders))
    );
  }
}
