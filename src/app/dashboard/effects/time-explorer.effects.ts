import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Action, select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import * as timeExplorerActions from '../actions/time-explorer.actions';
import * as timePreferencesActions from '../actions/time-preferences.actions';
import {filter, withLatestFrom} from 'rxjs/internal/operators';
import * as fromDashboards from '../reducers/index';

@Injectable()
export class TimeExplorerEffects {
  private _actions$: Actions;
  private _store: Store<fromDashboards.State>;

  @Effect() close$: Observable<Action>;
  @Effect() setTimestamp: Observable<Action>;

  constructor(action: Actions, store: Store<fromDashboards.State>) {
    this._actions$ = action;
    this._store = store;

    this.closeEffect();
    this.setTimestampEffect();
  }

  closeEffect() {
    this.close$ = this._actions$.pipe(
      ofType(timeExplorerActions.CLOSE),
      map((action: timeExplorerActions.Close) => new timePreferencesActions.SetCurrentTimestamp(null))
    );
  }

  setTimestampEffect() {
        this.setTimestamp = this._actions$.pipe(
      ofType(timeExplorerActions.SET_TIMESTAMP),
      withLatestFrom(this._store.pipe(select(fromDashboards.getPlotPoint))),
      filter(([action, plotPoint]) => plotPoint.otherParams && plotPoint.otherParams['timestamp']),
      map(([action, plotPoint]) => {
        return new timePreferencesActions.GoBack(plotPoint.otherParams['timestamp']);
      })
    );
  }
}
