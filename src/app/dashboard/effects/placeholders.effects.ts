import {Inject, Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Action} from '@ngrx/store';
import {Observable, of} from 'rxjs';
import {catchError, flatMap, map} from 'rxjs/operators';
import * as placeholdersActions from '../actions/placeholders.actions';
import {Placeholder} from '../models';
import {PlaceholdersService} from '../services';
import {PLACEHOLDERS_SERVICE} from '../services/tokens';

@Injectable()
export class PlaceholdersEffects {
  private _actions$: Actions;
  private _placeholdersService: PlaceholdersService;

  @Effect() load$: Observable<Action>;

  constructor(actions$: Actions, @Inject(PLACEHOLDERS_SERVICE) placeholdersService) {
    this._actions$ = actions$;
    this._placeholdersService = placeholdersService;

    this.loadEffect();
  }

  private loadEffect() {
    this.load$ = this._actions$.pipe(
      ofType(placeholdersActions.LOAD),
      flatMap((action: placeholdersActions.Load) => (
        this._placeholdersService.findById(action.payload).pipe(
          map((placeholder: Placeholder) => new placeholdersActions.LoadSuccess(placeholder)),
          catchError((error: Error) => of(new placeholdersActions.LoadFailure(error)))
        )
      ))
    );
  }
}
