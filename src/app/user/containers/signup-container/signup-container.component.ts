import {Component} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {SignUp} from '../../actions/user.actions';
import {Credentials} from '../../models/user';
import * as fromUsers from '../../reducers';

@Component({
  selector: 'app-signup-container',
  templateUrl: './signup-container.component.html'
})
export class SignupContainerComponent {
  private _store: Store<fromUsers.State>;

  errorMessage$: Observable<string>;

  constructor(store: Store<fromUsers.State>) {
    this._store = store;
    this.errorMessage$ = this._store.pipe(select(fromUsers.getErrorMessage));
  }

  signUp(credentials: Credentials) {
    this._store.dispatch(new SignUp(credentials));
  }
}
