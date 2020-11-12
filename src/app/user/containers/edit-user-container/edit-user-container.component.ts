import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, of, Subject} from 'rxjs/index';
import {select, Store} from '@ngrx/store';
import * as fromUsers from '../../reducers/index';
import {Role, User} from '../../models/user';
import {isNullOrUndefined} from 'util';
import {filter, find, first, map, takeUntil} from 'rxjs/internal/operators';
import {UserNavigator} from '../../../layout/navigator/user.navigator';
import * as userAction from '../../actions/user.actions';
import * as roleAction from '../../actions/role.action';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-edit-user-container',
  templateUrl: './edit-user-container.component.html',
  styleUrls: ['./edit-user-container.component.scss']
})
export class EditUserContainerComponent implements OnInit {
  user$: Observable<User>;
  roles$: Observable<Role[]>;
  rolesByUser$: Observable<string[]>;
  private _store: Store<fromUsers.State>;
  private _userNavigator: UserNavigator;
  private _route: ActivatedRoute;

  constructor(store: Store<fromUsers.State>,
              userNavigator: UserNavigator,
              route: ActivatedRoute) {
    this._store = store;
    this._userNavigator = userNavigator;
    this._route = route;
  }

  ngOnInit() {
    this.roles$ = this._store.pipe(select(fromUsers.getAllRoles));
    this.rolesByUser$ = this._store.pipe(select(fromUsers.getRolesByUserEditing));
    this._route.params.subscribe(param => {
      this._store.dispatch(new userAction.LoadRolesByUserId(param.id));
      this.user$ = this._store.pipe(select(fromUsers.getUserById(param.id)));
    });
    this._store.dispatch(new roleAction.LoadAll());
  }

  handleCancel() {
    this._userNavigator.navigateToUser();
  }

  handleSave(event: User) {
    this._store.dispatch(new userAction.AssignRoles(event));
    this.handleCancel();
  }
}
