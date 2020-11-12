import {Location} from '@angular/common';
import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {select, Store} from '@ngrx/store';
import {Observable, of} from 'rxjs';
import {map, mergeMap, withLatestFrom} from 'rxjs/internal/operators';
import {catchError, flatMap, switchMap} from 'rxjs/operators';
import {ColorPalette} from '../../common/models';
import {getDefaultColorPalettes} from '../../common/utils/color';
import * as colorPaletteActions from '../actions/palette.actions';
import * as userActions from '../actions/user.actions';
import * as fromUsers from '../reducers';
import {UserPaletteService} from '../services/settings/user-palette.service';


@Injectable()
export class UserPaletteEffects {
  private _action$: Actions;
  private _store: Store<fromUsers.State>;
  private _userPaletteService: UserPaletteService;


  @Effect() addUserPalette$: Observable<any>;
  @Effect() changeUserPalette$: Observable<any>;
  @Effect() loadAllPalettes$: Observable<any>;
  @Effect() deletePalette$: Observable<any>;
  @Effect() updatePalette$: Observable<any>;

  constructor(store: Store<fromUsers.State>,
              action$: Actions,
              userPaletteService: UserPaletteService,
              private location: Location) {
    this._action$ = action$;
    this._store = store;
    this._userPaletteService = userPaletteService;

    this.addUserPaletteEffect();
    this.changeUserPaletteEffect();
    this.loadAllPaletteEffect();
    this.deletePaletteEffect();
    this.updatePaletteEffect();
  }

  private addUserPaletteEffect() {
    this.addUserPalette$ = this._action$.pipe(
      ofType(colorPaletteActions.ADD_PALETTE),
      withLatestFrom(this._store.pipe(select(fromUsers.getAuthenticatedUser))),
      flatMap(([action, user]) => {
        const palette = (action as colorPaletteActions.AddUserPalette).payload;
        const newPalette = {...palette, userId: user.id};
        return this._userPaletteService.addColorPalette(newPalette).pipe(
          map((colorPalette: ColorPalette) => {
            this.location.back();
            return new colorPaletteActions.AddUserPaletteSuccess(colorPalette);
          }),
          catchError((error: Error) => of(new colorPaletteActions.AddUserPaletteFailure(error)))
        );
      }),
    );
  }

  private updatePaletteEffect() {
    this.updatePalette$ = this._action$.pipe(
      ofType(colorPaletteActions.UPDATE_PALETTE),
      flatMap((action) => {
        const palette = (action as colorPaletteActions.UpdateUserPalette).payload;
        return this._userPaletteService.updateColorPalette(palette).pipe(
          map((colorPalette: ColorPalette) => {
            this.location.back();
            return new colorPaletteActions.UpdatePaletteSuccess(colorPalette);
          }),
          catchError((error: Error) => of(new colorPaletteActions.AddUserPaletteFailure(error)))
        );
      })
    );
  }

  private changeUserPaletteEffect() {
    this.changeUserPalette$ = this._action$.pipe(
      ofType(colorPaletteActions.CHANGE),
      withLatestFrom(this._store.pipe(select(fromUsers.getAuthenticatedUser))),
      mergeMap(([action, user]) => {
        const palette = (action as colorPaletteActions.ChangeColorPalette).payload;
        const newUser = {
          ...user,
          selectedPalette: palette.id
        };
        return [
          new userActions.Update(newUser)
        ];
      }),
      catchError((error: Error) => of(new colorPaletteActions.AddUserPaletteFailure(error)))
    );
  }

  private loadAllPaletteEffect() {
    this.loadAllPalettes$ = this._action$.pipe(
      ofType(colorPaletteActions.LOAD_ALL),
      withLatestFrom(this._store.pipe(select(fromUsers.getAuthenticatedUser))),
      switchMap(([action, user]) => (
        this._userPaletteService.getColorPalette(user.id).pipe(
          map((colorPalettes: ColorPalette[]) => {
            const palettes = [...getDefaultColorPalettes(), ...colorPalettes];
            return new colorPaletteActions.LoadAllPalettesSuccess(palettes);
          }),
          catchError((error: Error) => of(new colorPaletteActions.LoadAllPalettesFailure(error)))
        )
      ))
    );
  }

  private deletePaletteEffect() {
    this.deletePalette$ = this._action$.pipe(
      ofType(colorPaletteActions.DELETE_PALETTE),
      switchMap((action: colorPaletteActions.DeletePalette) => {
        const paletteId = (action as colorPaletteActions.DeletePalette).payload as string;
        return this._userPaletteService.deletePaletteById(paletteId).pipe(
          map((id: string) => {
            return new colorPaletteActions.DeletePaletteSuccess(id);
          }),
          catchError((error: Error) => of(new colorPaletteActions.DeletePaletteFailure(error)))
        );
      }
    ));
  }
}
