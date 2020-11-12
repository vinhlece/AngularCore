import {Inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {combineLatest, Observable} from 'rxjs';
import {filter, map} from 'rxjs/operators';
import {UserNavigator} from '../../../layout/navigator/user.navigator';
import * as fromWidgets from '../../../widgets/reducers';
import {User} from '../../models/user';
import * as fromUsers from '../../reducers';
import {AppBootstrap} from '../index';
import {APP_BOOTSTRAP} from '../tokens';
import {AppConfigService} from '../../../app.config.service';
import { timer } from 'rxjs';
import {switchMap} from 'rxjs/internal/operators';

@Injectable()
export class AuthenticatedGuardService implements CanActivate {
  private _navigator: UserNavigator;
  private _store: Store<fromUsers.State>;
  private _loggedIn$: Observable<any>;
  private _appBootstrap: AppBootstrap;
  private _bootstrapLoadingStatus$: Observable<boolean>;
  private _isFirstLogin: boolean = true;

  constructor(navigator: UserNavigator, @Inject(APP_BOOTSTRAP) appBootstrap: AppBootstrap, store: Store<fromUsers.State>,
              private appSerivice: AppConfigService) {
    this._navigator = navigator;
    this._store = store;
    this._appBootstrap = appBootstrap;

    this._loggedIn$ = this._store.pipe(select(fromUsers.getAuthenticatedUser));
    this._bootstrapLoadingStatus$ = this._store.pipe(select(fromWidgets.getBootstrapLoadingStatus));
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>
    | Promise<boolean> | boolean {
    const loginStatus$ = this._loggedIn$.pipe(
      switchMap((user: User) => {
        return new Observable<boolean>((observer) => {
          const timer$ = timer(0, 100);
          const subscriber = timer$.subscribe(t => {
            if (this.appSerivice.config) {
              if (user) {
                if (this._isFirstLogin) {
                  this._appBootstrap.bootstrap(user);
                  this._isFirstLogin = false;
                }
                observer.next(true);
              } else {
                if (this._appBootstrap.checkSession()) {
                  if (this._isFirstLogin) {
                    this._navigator.navigateToLogin(state.url);
                    // this._isFirstLogin = false;
                  } else {
                    this._navigator.unSubAutoLogin();
                  }
                } else {
                  this._appBootstrap.loginBySession();
                }
                observer.next(false);
              }
              observer.complete();
              subscriber.unsubscribe();
            }
          });
        });
      })
    );

    return combineLatest(loginStatus$, this._bootstrapLoadingStatus$).pipe(
      filter(([loginStatus, bootstrapLoadingStatus]) => {
        if (!loginStatus) {
          return true;
        }
        return loginStatus && bootstrapLoadingStatus;
      }),
      switchMap(([loginStatus, bootstrapLoadingStatus]) => {
        return new Observable<boolean>((observer) => {
          const timer$ = timer(0, 100);
          const subscriber = timer$.subscribe(t => {
            if (this.appSerivice.config) {
              if (!loginStatus) {
                observer.next(false);
              } else {
                observer.next(loginStatus && bootstrapLoadingStatus);
              }
              observer.complete();
              subscriber.unsubscribe();
            }
          });
        });
      })
    );
  }
}
