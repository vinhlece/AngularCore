import {Inject, Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppBootstrap, Session} from '.';
import * as formulaMeasuresActions from '../../measures/actions/formula-measure.actions';
import * as packagesActions from '../../measures/actions/packages.actions';
import * as colorPalleteActions from '../actions/palette.actions';
import {User} from '../models/user';
import {SESSION} from './tokens';
import {isNullOrUndefined} from 'util';
import * as userActions from '../actions/user.actions';
import * as InstanceColorsActions from '../../dashboard/actions/instance-color.actions';

@Injectable()
export class AppBootstrapImpl implements AppBootstrap {
  private _store: Store<any>;
  private _session: Session;

  constructor(store: Store<any>, @Inject(SESSION) session: Session) {
    this._store = store;
    this._session = session;
  }

  bootstrap(user: User): void {
    this._session.setUser(user);
    this._store.dispatch(new packagesActions.LoadAll());
    this._store.dispatch(new formulaMeasuresActions.LoadAll());
    this._store.dispatch(new colorPalleteActions.LoadAllPalettes());
    this._store.dispatch(new InstanceColorsActions.Get());
  }

  cleanUp(): void {
    this._session.removeUser();
  }

  checkSession(): boolean {
    return isNullOrUndefined(this._session.getUser());
  }

  loginBySession(): void {
    this._store.dispatch(new userActions.LoginBySession(this._session.getUser()));
  }
}
