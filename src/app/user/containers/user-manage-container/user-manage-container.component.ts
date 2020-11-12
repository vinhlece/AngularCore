import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {Observable, Subject} from 'rxjs/index';
import {select, Store} from '@ngrx/store';
import * as fromUsers from '../../reducers/index';
import {User} from '../../models/user';
import {isNullOrUndefined} from 'util';
import {filter, takeUntil} from 'rxjs/internal/operators';
import * as userActions from '../../actions/user.actions';
import {UserNavigator} from '../../../layout/navigator/user.navigator';
import {createUser} from '../../../common/models/factory/createUser';
import {NewDialogUserComponent} from '../../components/common/new-dialog-user.component';
import * as navigationActions from '../../../layout/actions/navigation.actions';

@Component({
  selector: 'app-user-manage-container',
  templateUrl: './user-manage-container.component.html',
  styleUrls: ['./user-manage-container.component.scss']
})
export class UserManageContainerComponent implements OnInit {
  users$: Observable<User[]>;
  private _dialogService: MatDialog;
  private _unsubscribe = new Subject<void>();
  private _store: Store<fromUsers.State>;
  private _userNavigator: UserNavigator;

  constructor(store: Store<fromUsers.State>, public dialogService: MatDialog,
              userNavigator: UserNavigator) {
    this._store = store;
    this._userNavigator = userNavigator;
    this._dialogService = dialogService;
  }

  ngOnInit() {
    this.users$ = this._store.pipe(select(fromUsers.getAllUsers));
    this._store
      .pipe(
        select(fromUsers.getAuthenticatedUser),
        filter((user: User) => !isNullOrUndefined(user)),
        takeUntil(this._unsubscribe)
      )
      .subscribe(() => {
        this._store.dispatch(new userActions.LoadAll());

      });
  }

  addUser(info: User) {
    if (!this.isValidUser(info)) {
      return;
    }
    this._store.dispatch(new userActions.AddUser(createUser(info)));
  }

  openCreateNewUserDialog() {
    const dialogUser = this.dialogService.open(NewDialogUserComponent, {
      width: '600px',
      data: {
        title: 'New User',
        inputData: {}
      }
    });
    dialogUser.afterClosed().subscribe((users: User) => {
      if (isNullOrUndefined(users)) {
        return false;
      }
      this.addUser(users);
    });
  }

  edit(user: User) {
    this._store.dispatch(navigationActions.navigateToEditUser(user));
  }

  handleEditUser(userId: string) {
    this._userNavigator.navigateToUserDetails(userId);
  }

  deleteUser(id: string) {
    if (isNullOrUndefined(id)) {
      return;
    }
    this._store.dispatch(new userActions.DeleteUser(id));
  }

  private isValidUser(user: User): boolean {
    return user.id.trim().length > 0
    && !user.id.trim().includes(' ')
    && !user.password.trim().includes(' ');
  }
}
