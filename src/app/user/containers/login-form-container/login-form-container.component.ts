import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ActionMeta } from '../../../common/actions';
import { Login } from '../../actions/user.actions';
import { Credentials } from '../../models/user';
import * as fromUsers from '../../reducers';
import { ActivatedRoute } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { State } from '../../reducers/user.reducer';

@Component({
  selector: 'app-login-form-container',
  templateUrl: './login-form-container.component.html'
})
export class LoginFormContainerComponent implements OnInit {
  private _store: Store<fromUsers.State>;
  private _route: ActivatedRoute;
  errorMessage$: Observable<State>;
  previousUrl: string;

  constructor(store: Store<fromUsers.State>, route: ActivatedRoute) {
    this._store = store;
    this.errorMessage$ = this._store.pipe(select(fromUsers.getAuthenticationErrorMessage));
    this._route = route;
  }

  ngOnInit(): void { }

  handleLogin(credentials: Credentials) {
    this.previousUrl = this._route.snapshot.queryParams['previousUrl'] || '/';
    const meta: ActionMeta = { doNavigation: true, previousUrl: this.previousUrl };
    this._store.dispatch(new Login(credentials, meta));
  }

  /**
   * Disabled until figure out how to switch based on env or flag
   */
  // checkRouter() {
  //   const su: Credentials = { userName: 'adminUser', password: '12345678' };
  //   this._route.queryParams
  //     .subscribe(params => {
  //       const reLogin = params['reLogin'];
  //       if (isNullOrUndefined(reLogin) || reLogin === true) {
  //         this.handleLogin(su);
  //       }
  //     });
  // }
}
