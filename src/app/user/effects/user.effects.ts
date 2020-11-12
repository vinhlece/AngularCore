import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {select, Store} from '@ngrx/store';
import {Observable, of} from 'rxjs';
import {map, mergeMap, withLatestFrom} from 'rxjs/internal/operators';
import {catchError, switchMap} from 'rxjs/operators';
import * as userActions from '../actions/user.actions';
import * as fromUsers from '../reducers';
import {UsersService} from '../services/settings/users.service';
import {User} from '../models/user';
import {UserRolesService} from '../services/settings/user-roles.service';
import {DummyAction} from '../../common/actions/index';
import {flatMap} from 'tslint/lib/utils';
import * as instanceColorActions from '../../dashboard/actions/instance-color.actions';


@Injectable()
export class UsersEffects {
  private _action$: Actions;
  private _store: Store<fromUsers.State>;
  private _usersService: UsersService;
  private _permissionService: UserRolesService;

  @Effect() loadAllUser$: Observable<any>;
  @Effect() addUser$: Observable<any>;
  @Effect() deleteUser$: Observable<any>;
  @Effect() assignRoles$: Observable<any>;
  @Effect() loadRolesByUser$: Observable<any>;
  @Effect() createPermission$: Observable<any>;

  constructor(store: Store<fromUsers.State>,
              action$: Actions,
              usersService: UsersService,
              permissionService: UserRolesService) {
    this._action$ = action$;
    this._store = store;
    this._usersService = usersService;
    this._permissionService = permissionService;

    this.loadAllUserEffect();
    this.addUserEffect();
    this.deleteUserEffect();
    this.assignRolesEffect();
    this.loadRolesByUser();
    this.createPermissionEffect();
  }

  private loadAllUserEffect() {
    this.loadAllUser$ = this._action$.pipe(
      ofType(userActions.LOAD_ALL),
      switchMap((action: userActions.LoadAll) => (
        this._usersService.getAllUsers().pipe(
          map((users: User[]) => new userActions.LoadAllSuccess(users)),
          catchError((error: Error) => of(new userActions.LoadAllFailure(error)))
        )
      ))
    );
  }

  private addUserEffect() {
    this.addUser$ = this._action$.pipe(
      ofType(userActions.ADD_USER),
      switchMap((action: userActions.AddUser) => (
        this._usersService.createUser(action.payload).pipe(
          mergeMap((user: User) => {
            return [
              new instanceColorActions.Add(),
              new userActions.CreatePermission(user)
            ];
          }),
          catchError((error: Error) => of(new userActions.AddUserFailure(error)))
        )
      ))
    );
  }

  private deleteUserEffect() {
    this.deleteUser$ = this._action$.pipe(
      ofType(userActions.DELETE_USER),
      switchMap((action: userActions.DeleteUser) => (
        this._usersService.deleteUser(action.payload).pipe(
          map((user: string) => new userActions.DeleteUserSuccess(user)),
          catchError((error: Error) => of(new userActions.DeleteUserFailure(error)))
        )
      ))
    );
  }

  private assignRolesEffect() {
    this.assignRoles$ = this._action$.pipe(
      ofType(userActions.ASSIGN_ROLES),
      withLatestFrom(this._store.select(fromUsers.getAuthenticatedUser)),
      switchMap(([action, user]) => {
        const currUser = (action as userActions.AssignRoles).payload as User;
        return this._permissionService.dettachRoleFromUser(currUser.id, currUser.roles).pipe(
          map((permission: any) => {
            return permission.id === user.id ?
              new userActions.AssignRolesSuccess({...user, roles: permission.roleIds}) : new DummyAction();
          }),
          catchError((error: Error) => of(new userActions.AssignRolesFailure(error)))
        );
      })
    );
  }

  private loadRolesByUser() {
    this.loadRolesByUser$ = this._action$.pipe(
      ofType(userActions.LOAD_ROLES_BY_USER),
      switchMap((action) => {
        const userId = (action as userActions.LoadRolesByUserId).payload;
        return this._permissionService.getRolesForUser(userId).pipe(
          map((roles: string[]) => new userActions.LoadRolesByUserSuccess(roles)),
          catchError((error: Error) => of(new userActions.LoadRolesByUserFailure(error)))
        );
      })
    );
  }

  private createPermissionEffect() {
    this.createPermission$ = this._action$.pipe(
      ofType(userActions.CREATE_PERMISSION),
      switchMap((action: userActions.CreatePermission) =>
        this._permissionService.addRoleForUser(action.payload.id, []).pipe(
          map(permission => new userActions.AddUserSuccess(action.payload)),
          catchError((error: Error) => of(new userActions.AddUserFailure(error)))
      ))
    );
  }
}
