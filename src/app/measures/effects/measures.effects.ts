import {Inject, Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Action, select, Store} from '@ngrx/store';
import {Observable, of} from 'rxjs';
import {catchError, flatMap, map, withLatestFrom} from 'rxjs/operators';
import * as fromUsers from '../../user/reducers';
import * as measuresActions from '../actions/measures.actions';
import {Measure} from '../models';
import * as fromMeasures from '../reducers';
import {PackagesService} from '../services';
import {PACKAGES_SERVICE} from '../services/tokens';

@Injectable()
export class MeasuresEffects {
  private _actions$: Actions;
  private _store: Store<fromMeasures.State>;
  private _packagesService: PackagesService;

  @Effect() findByName$: Observable<Action>;
  @Effect() loadAll$: Observable<Action>;

  constructor(actions$: Actions, store: Store<fromMeasures.State>, @Inject(PACKAGES_SERVICE) packagesService: PackagesService) {
    this._actions$ = actions$;
    this._store = store;
    this._packagesService = packagesService;

    this.findByNameEffect();
    this.loadAllEffect();
  }

  private findByNameEffect() {
    const user$ = this._store.pipe(select(fromUsers.getAuthenticatedUser));

    this.findByName$ = this._actions$.pipe(
      ofType(measuresActions.FIND_BY_NAME),
      withLatestFrom(user$),
      flatMap(([action, user]) => {
        return this._packagesService.findMeasuresByName(user.id, (action as measuresActions.FindByName).payload).pipe(
          map((measures: Measure[]) => new measuresActions.FindByNameSuccess(measures)),
          catchError((error: Error) => of(new measuresActions.ActionFailure(error)))
        );
      })
    );
  }

  private loadAllEffect() {
    const user$ = this._store.pipe(select(fromUsers.getAuthenticatedUser));

    this.loadAll$ = this._actions$.pipe(
      ofType(measuresActions.LOAD_ALL),
      withLatestFrom(user$),
      flatMap(([action, user]) => {
        return this._packagesService.getAllMeasures(user.id).pipe(
          map((measures) => new measuresActions.LoadAllSuccess(measures)),
          catchError((error: Error) => of(new measuresActions.ActionFailure(error)))
        );
      })
    );
  }
}
