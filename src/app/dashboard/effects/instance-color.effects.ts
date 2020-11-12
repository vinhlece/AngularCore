import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Action, select, Store} from '@ngrx/store';
import {Observable, of} from 'rxjs';
import {catchError, flatMap, map, mergeMap} from 'rxjs/operators';
import * as tabsActions from '../actions/tabs.actions';
import * as InstanceColorActions from '../actions/instance-color.actions';
import {switchMap, withLatestFrom} from 'rxjs/internal/operators';
import * as fromDashboard from '../reducers/index';
import * as fromUser from '../../user/reducers/index';
import {InstanceColorService} from '../services/http/instance-color.service';
import {InstanceColor} from '../../common/models/index';


@Injectable()
export class InstanceColorEffects {
  private _actions$: Actions;
  private _instanceColorService: InstanceColorService;
  private _store: Store<fromDashboard.State>;

  @Effect() add$: Observable<Action>;
  @Effect() get$: Observable<Action>;
  @Effect() update$: Observable<Action>;
  @Effect() delete$: Observable<Action>;
  @Effect() edit$: Observable<Action>;

  constructor(actions$: Actions, instanceColorService: InstanceColorService, store: Store<fromDashboard.State>) {
    this._actions$ = actions$;
    this._instanceColorService = instanceColorService;
    this._store = store;

    this.configureAddEffect();
    this.configureGetEffect();
    this.configureUpdateEffect();
    this.configureDeleteEffect();
    this.configureEditEffect();
  }

  private configureAddEffect() {
    this.add$ = this._actions$.pipe(
      ofType(InstanceColorActions.ADD),
      withLatestFrom(this._store.pipe(select(fromUser.getAuthenticatedUser))),
      switchMap(([action, user]) => {
        const data = {
          id: user.id,
          instances: []
        };
        return this._instanceColorService.add(data).pipe(
          map((res: any) => new InstanceColorActions.AddSuccess()),
          catchError((error: Error) => of(new InstanceColorActions.ActionError(error)))
        );
      }),
    );
  }

  private configureGetEffect() {
    this.get$ = this._actions$.pipe(
      ofType(InstanceColorActions.GET),
      withLatestFrom(this._store.pipe(select(fromUser.getAuthenticatedUser))),
      flatMap(([action, user]) => {
        return this._instanceColorService.get(user.id).pipe(
          map((res: any) => new InstanceColorActions.GetSuccess(res.instances)),
          catchError((error: Error) => of(new InstanceColorActions.ActionError(error)))
        );
      }),
    );
  }

  private configureUpdateEffect() {
    this.update$ = this._actions$.pipe(
      ofType(InstanceColorActions.UPDATE),
      withLatestFrom(this._store.pipe(select(fromUser.getAuthenticatedUser))),
      flatMap(([action, user]) => {
        return this._instanceColorService.update(user.id, (action as InstanceColorActions.Update).payload).pipe(
          map((res: any) => new InstanceColorActions.UpdateSuccess(res.instances)),
          catchError((error: Error) => of(new InstanceColorActions.ActionError(error)))
        );
      }),
    );
  }

  private configureDeleteEffect() {
    this.delete$ = this._actions$.pipe(
      ofType(InstanceColorActions.DELETE),
      withLatestFrom(this._store.pipe(select(fromUser.getAuthenticatedUser)),
        this._store.pipe(select(fromDashboard.getInstanceColors))),
      flatMap(([action, user, instanceColors]) => {
        const payload = (action as InstanceColorActions.Delete).payload;
        const data = instanceColors.filter((item: InstanceColor) => item.name !== payload);
        return this._instanceColorService.update(user.id, data).pipe(
          map((res: any) => new InstanceColorActions.DeleteSuccess(res.instances)),
          catchError((error) => of(new tabsActions.DeleteFailure(error)))
        );
      })
    );
  }

  private configureEditEffect() {
    this.edit$ = this._actions$.pipe(
      ofType(InstanceColorActions.EDIT),
      withLatestFrom(this._store.pipe(select(fromUser.getAuthenticatedUser)),
        this._store.pipe(select(fromDashboard.getInstanceColors))),
      flatMap(([action, user, instanceColors]) => {
        const payload = (action as InstanceColorActions.Edit).payload;
        const instance = instanceColors.find((item: InstanceColor) => item.name === payload.name);
        instance.color = payload.color;
        return this._instanceColorService.update(user.id, instanceColors).pipe(
          map((res: any) => new InstanceColorActions.EditSuccess(res.instances)),
          catchError((error) => of(new tabsActions.DeleteFailure(error)))
        );
      })
    );
  }
}
