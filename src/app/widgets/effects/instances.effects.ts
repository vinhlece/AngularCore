import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Action, select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {map, withLatestFrom} from 'rxjs/operators';
import * as fromEntities from '../../reducers';
import * as instancesActions from '../actions/instances.actions';
import * as fromWidgets from '../reducers';

@Injectable()
export class InstancesEffects {
  private _actions$: Actions;
  private _store: Store<fromWidgets.State>;

  @Effect() findByName$: Observable<Action>;

  constructor(actions$: Actions, store: Store<fromWidgets.State>) {
    this._actions$ = actions$;
    this._store = store;
    this.findByNameEffect();
  }

  private findByNameEffect() {
    const instances$ = this._store.pipe(select(fromEntities.getAllInstances));

    this.findByName$ = this._actions$.pipe(
      ofType(instancesActions.FIND_BY_NAME),
      withLatestFrom(instances$),
      map(([action, instances]) => {
        const keyword = (action as instancesActions.FindByName).payload;
        const result = instances.filter(item => item.toLowerCase().includes(keyword.toLowerCase()));
        return new instancesActions.FindByNameSuccess(result);
      })
    );
  }
}
