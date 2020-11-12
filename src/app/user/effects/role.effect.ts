import {Location} from '@angular/common';
import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/internal/operators';
import {catchError, switchMap} from 'rxjs/operators';
import * as roleActions from '../actions/role.action';
import * as fromUsers from '../reducers';
import {RolesService} from '../services/settings/roles.service';
import {Role} from '../../common/models/index';

@Injectable()
export class RoleEffects {
  private _action$: Actions;
  private _store: Store<fromUsers.State>;
  private _roleService: RolesService;

  @Effect() loadAllRole$: Observable<any>;
  @Effect() addRole$: Observable<any>;
  @Effect() deleteRole$: Observable<any>;

  constructor(store: Store<fromUsers.State>,
              action$: Actions,
              roleService: RolesService) {
    this._action$ = action$;
    this._store = store;
    this._roleService = roleService;

    this.loadAllRolesEffect();
    this.addRoleEffect();
    this.deleteRoleEffect();
  }

  private loadAllRolesEffect() {
    this.loadAllRole$ = this._action$.pipe(
      ofType(roleActions.LOAD_ALL),
      switchMap((action: roleActions.LoadAll) => (
        this._roleService.getAllRoles().pipe(
          map((roles: Role[]) => {
            return new roleActions.LoadAllSuccess(roles);
          }),
          catchError((error: Error) => of(new roleActions.ActionError(error)))
        )
      ))
    );
  }

  private addRoleEffect() {
    this.addRole$ = this._action$.pipe(
      ofType(roleActions.ADD),
      switchMap((action: roleActions.Add) => (
        this._roleService.createRole(action.payload).pipe(
          map((role: Role) => {
            return new roleActions.AddSuccess(role);
          }),
          catchError((error: Error) => of(new roleActions.ActionError(error)))
        )
      ))
    );
  }

  private deleteRoleEffect() {
    this.deleteRole$ = this._action$.pipe(
      ofType(roleActions.DELETE),
      switchMap((action: roleActions.Delete) => (
        this._roleService.deleteRole(action.payload).pipe(
          map((id: string) => {
            return new roleActions.DeleteSuccess(id);
          }),
          catchError((error: Error) => of(new roleActions.ActionError(error)))
        )
      ))
    );
  }
}
