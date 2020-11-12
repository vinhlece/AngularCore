import {Inject, Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Action, select, Store} from '@ngrx/store';
import {Observable, of, zip} from 'rxjs';
import {catchError, filter, flatMap, map, switchMap, withLatestFrom} from 'rxjs/operators';
import * as fromUsers from '../../user/reducers';
import * as formulaMeasureActions from '../actions/formula-measure.actions';
import {FormulaMeasure, Package} from '../models';
import * as fromMeasures from '../reducers';
import {PackagesService} from '../services';
import {PACKAGES_SERVICE} from '../services/tokens';
import {concatMap} from 'rxjs/internal/operators';

@Injectable()
export class FormulaMeasureEffects {
  private _actions$: Actions;
  private _packagesService: PackagesService;
  private _store: Store<fromMeasures.State>;

  @Effect() loadAll$: Observable<Action>;
  @Effect() add$: Observable<Action>;

  constructor(actions$: Actions, store: Store<fromMeasures.State>, @Inject(PACKAGES_SERVICE) packagesService: PackagesService) {
    this._actions$ = actions$;
    this._packagesService = packagesService;
    this._store = store;

    this.configLoadAll();
    this.configAdd();
  }

  private configLoadAll() {
    const action$ = this._actions$.pipe(ofType(formulaMeasureActions.LOAD_ALL));
    const packages$ = this._store
      .pipe(select(fromMeasures.getPackages))
      .pipe(filter((packages: Package[]) => packages.length !== 0));
    const user$ = this._store.pipe(select(fromUsers.getAuthenticatedUser));

    this.loadAll$ = zip(action$, packages$).pipe(
      withLatestFrom(user$),
      concatMap(([actionAndPackages, user]) => (
        this._packagesService.getAllFormulaMeasures(user.id).pipe(
          map((measures: FormulaMeasure[]) => new formulaMeasureActions.LoadAllSuccess(measures)),
          catchError((error: Error) => of(new formulaMeasureActions.LoadAllSuccess([])))
        )
      ))
    );
  }

  private configAdd() {
    this.add$ = this._actions$.pipe(
      ofType(formulaMeasureActions.ADD),
      withLatestFrom(this._store.pipe(select(fromUsers.getAuthenticatedUser))),
      flatMap(([action, user]) => {
        const formulaMeasure: FormulaMeasure = {
          ...(action as formulaMeasureActions.Add).payload,
          userId: user.id
        };
        return this._packagesService.addFormulaMeasure(formulaMeasure).pipe(
          map((measure: FormulaMeasure) => new formulaMeasureActions.AddSuccess(measure)),
          catchError((error: Error) => of(new formulaMeasureActions.AddFailure(error)))
        );
      })
    );
  }
}
