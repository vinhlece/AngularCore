import {Inject, Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Action, Store} from '@ngrx/store';
import {Observable, of} from 'rxjs';
import {catchError, map, mergeMap, switchMap, tap} from 'rxjs/operators';
import {UserNavigator} from '../../layout/navigator/user.navigator';
import * as userActions from '../actions/user.actions';
import {User} from '../models/user';
import * as fromUsers from '../reducers';
import {AppBootstrap, Session} from '../services';
import {AuthenticationService} from '../services/auth/authentication.service';
import {APP_BOOTSTRAP, SESSION} from '../services/tokens';
import {UserRolesService} from '../services/settings/user-roles.service';

@Injectable()
export class AuthenticationEffects {
  private _action$: Actions;
  private _store: Store<fromUsers.State>;
  private _session: Session;
  private _navigator: UserNavigator;
  private _appBootstrap: AppBootstrap;
  private _authenticationService: AuthenticationService;
  private _permissionService: UserRolesService;

  @Effect() login$: Observable<any>;
  @Effect({dispatch: false}) getRoles$: Observable<any>;
  @Effect({dispatch: false}) logout$: Observable<any>;
  @Effect() signup$: Observable<Action>;
  @Effect({dispatch: false}) updateUser$: Observable<any>;
  @Effect() loginBySession$: Observable<any>;

  constructor(store: Store<fromUsers.State>,
              action$: Actions,
              authenticationService: AuthenticationService,
              permissionService: UserRolesService,
              navigator: UserNavigator,
              @Inject(SESSION) session: Session,
              @Inject(APP_BOOTSTRAP) appBootstrap: AppBootstrap) {
    this._action$ = action$;
    this._store = store;
    this._session = session;
    this._navigator = navigator;
    this._appBootstrap = appBootstrap;
    this._authenticationService = authenticationService;
    this._permissionService = permissionService;

    this.loginEffect();
    this.getRolesEffect();
    this.logoutEffect();
    this.signUpEffect();
    this.updateUserEffect();
    this.checkLoginSession();
  }

  private loginEffect() {
    this.login$ = this._action$.pipe(
      ofType(userActions.LOGIN),
      switchMap((action: userActions.Login) => (
        this._authenticationService.loginUser(action.payload.userName, action.payload.password).pipe(
          map((user: User) => {
            user.token = user.Session;
            user.id = user.username;
            return new userActions.GetRoles(user, action.meta, false);
          }),
          catchError((error: Error) => {
            return of(new userActions.LoginFailure(error));
          })
        )
      ))
    );
  }

  private getRolesEffect() {
    this.getRoles$ = this._action$.pipe(
      ofType(userActions.GET_ROLES),
      switchMap((action: userActions.GetRoles) => {
        const user = action.payload as User;
        const url = window.location.href.split('/#/')[1];
        return this._permissionService.getRolesForUser(user.id).pipe(
          tap((roles: string[]) => {
            if (!user) {
              this._navigator.navigateToLogin();
              return;
            }
            user.roles = roles;
            this._store.dispatch(new userActions.LoginSuccess(user));
            if (action.loginBySession) {
              this._navigator.navigateTo(`/${url}`);
            } else if (action.meta.doNavigation) {
              this._navigator.navigateTo(action.meta.previousUrl);
            }
          }),
          catchError((error: Error) => of(new userActions.LoginFailure(error)))
        );
      }
    ));
  }

  private logoutEffect() {
    this.logout$ = this._action$.pipe(
      ofType(userActions.LOGOUT),
      tap((action: userActions.Logout) => {
        this._navigator.unSubAutoLogin();
        this._appBootstrap.cleanUp();
      })
    );
  }

  private signUpEffect() {
    this.signup$ = this._action$.pipe(
      ofType(userActions.SIGN_UP),
      mergeMap((action: userActions.SignUp) =>
        this._authenticationService.signupUser(action.payload.userName, action.payload.password).pipe(
          map((user: User) => {
            this._navigator.unSubAutoLogin();
            return new userActions.SignUpSuccess(user);
          }),
          catchError((error: Error) => of(new userActions.SignUpFailure(error)))
        )
      )
    );
  }

  private checkLoginSession() {
    this.loginBySession$ = this._action$.pipe(
      ofType(userActions.LOGIN_BY_SESSION),
      switchMap((action: userActions.LoginBySession) => (
        this._authenticationService.loginBySession(action.payload).pipe(
          map((user: User) => {
            return new userActions.GetRoles(user, null, true);
          }),
          catchError((error: Error) => of(this._navigator.navigateToLogin()))
        )
      ))
    );
  }

  private updateUserEffect() {
    this.updateUser$ = this._action$.pipe(
      ofType(userActions.UPDATE),
      switchMap((action: userActions.Update) => (
        this._authenticationService.updateUser(action.payload).pipe(
          tap((user: User) => {
            this._store.dispatch(new userActions.UpdateSuccess(user));
            this._session.setUser(user);
          }),
          catchError((error: Error) => of(new userActions.LoginFailure(error)))
        )
      ))
    );
  }
}
