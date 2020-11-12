import {Inject, Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Action} from '@ngrx/store';
import {Observable, of} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import {Package} from '../models';
import * as packagesActions from '../actions/packages.actions';
import {PackagesService} from '../services';
import {PACKAGES_SERVICE} from '../services/tokens';

@Injectable()
export class PackagesEffects {
  private _actions$: Actions;
  private _packagesService: PackagesService;

  @Effect() loadAll$: Observable<Action>;

  constructor(actions$: Actions, @Inject(PACKAGES_SERVICE) packagesService: PackagesService) {
    this._actions$ = actions$;
    this._packagesService = packagesService;

    this.configLoadAll();
  }

  private configLoadAll() {
    this.loadAll$ = this._actions$.pipe(
      ofType(packagesActions.LOAD_ALL),
      switchMap((action: packagesActions.LoadAll) => (
        this._packagesService.getAllPackages().pipe(
          map((res: any) => {
            const packages: Package[] = res.map(item => {
              item.dimensions = item.package;
              delete item.package;
              return item;
            });
            return new packagesActions.LoadAllSuccess(packages);
          }),
          catchError((error: Error) => of(new packagesActions.LoadAllFailure(error)))
        )
      ))
    );
  }
}
