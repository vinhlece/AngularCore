import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Action} from '@ngrx/store';
import {Observable, of} from 'rxjs';
import {catchError, flatMap, map, mergeMap} from 'rxjs/operators';
import * as pollingActions from '../../realtime/actions/rest-api/polling.actions';
import * as realTimeDataActions from '../../realtime/actions/rest-api/real-time-data.actions';
import * as callTimeLineActions from '../actions/call-time-line.actions';
import * as placeholdersActions from '../actions/placeholders.actions';
import * as replayActions from '../actions/replay.actions';
import * as tabsActions from '../actions/tabs.actions';
import * as timePreferencesActions from '../actions/time-preferences.actions';
import {Tab} from '../models';
import {TabService} from '../services/http/tab.service';
import {concatMap} from 'rxjs/internal/operators';

@Injectable()
export class TabEffects {
  private _actions$: Actions;
  private _tabService: TabService;

  @Effect() add$: Observable<Action>;
  @Effect() update$: Observable<Action>;
  @Effect() delete$: Observable<Action>;
  @Effect() select$: Observable<Action>;
  @Effect() exit$: Observable<Action>;
  @Effect() copy$: Observable<Action>;

  constructor(actions$: Actions, tabService: TabService) {
    this._actions$ = actions$;
    this._tabService = tabService;

    this.configureAddEffect();
    this.configureUpdateEffect();
    this.configureDeleteEffect();
    this.configureSelectEffect();
    this.configureExitEffect();
    this.copyEffect();
  }

  private configureAddEffect() {
    this.add$ = this._actions$.pipe(
      ofType(tabsActions.ADD),
      mergeMap((action: tabsActions.Add) => (
        this._tabService.add(action.payload).pipe(
          map((tab: Tab) => new tabsActions.AddSuccess(tab)),
          catchError((error: Error) => of(new tabsActions.AddFailure(error)))
        )
      ))
    );
  }

  private configureUpdateEffect() {
    this.update$ = this._actions$.pipe(
      ofType(tabsActions.UPDATE),
      mergeMap((action: tabsActions.Update) => {
        const placeholders = action.payload.placeholders;
        return this._tabService.update({...action.payload, placeholders}).pipe(
          map((tab: Tab) => {
            return new tabsActions.UpdateSuccess(tab);
          }),
          catchError((error: Error) => of(new tabsActions.UpdateFailure(error)))
        );
      })
    );
  }

  private configureDeleteEffect() {
    this.delete$ = this._actions$.pipe(
      ofType(tabsActions.DELETE),
      flatMap((action: tabsActions.Delete) => (
        this._tabService.remove(action.payload.id).pipe(
          map((id: string) => new tabsActions.DeleteSuccess(id)),
          catchError((error) => of(new tabsActions.DeleteFailure(error)))
        )
      ))
    );
  }

  private configureSelectEffect() {
    this.select$ = this._actions$.pipe(
      ofType(tabsActions.SELECT),
      mergeMap((action: tabsActions.Select) => {
        return [
          new pollingActions.Start(),
          new placeholdersActions.ReleasePlaceholders()
        ];
      })
    );
  }

  private configureExitEffect() {
    this.exit$ = this._actions$.pipe(
      ofType(tabsActions.EXIT),
      mergeMap((action: tabsActions.Exit) => {
        return [
          new placeholdersActions.ReleasePlaceholders(),
          new pollingActions.Stop(),
          new realTimeDataActions.ClearData(),
          new replayActions.Stop(),
          new timePreferencesActions.SetCurrentTimestamp(null),
          new timePreferencesActions.SetGoBackTimestamp(null),
          new timePreferencesActions.SetTimeRange(null),
          new timePreferencesActions.ResetZoom(true),
          new callTimeLineActions.ResetZoom(),
        ];
      })
    );
  }

  private copyEffect() {
    this.copy$ = this._actions$.pipe(
      ofType(tabsActions.COPY),
      concatMap((action: tabsActions.Copy) => (
        this._tabService.update(action.payload).pipe(
          map((tab: Tab) => new tabsActions.CopySuccess(tab)),
          catchError((error: Error) => of(new tabsActions.AddFailure(error)))
        )
      ))
    );
  }
}
