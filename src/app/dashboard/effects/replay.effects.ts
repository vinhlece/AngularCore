import {Inject, Injectable, Optional} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {Action, select, Store} from '@ngrx/store';
import {Observable, Scheduler, timer, zip} from 'rxjs';
import {async} from 'rxjs/internal/scheduler/async';
import {filter, first, flatMap, map, withLatestFrom} from 'rxjs/operators';
import {isNullOrUndefined} from 'util';
import * as timePreferencesActions from '../actions/time-preferences.actions';
import * as replayActions from '../actions/replay.actions';
import {ReplayStatus} from '../models/enums';
import * as fromDashboards from '../reducers';
import {REPLAY_INTERVAL} from '../services/tokens';

@Injectable()
export class ReplayEffects {
  private _actions$: Actions;
  private _store: Store<fromDashboards.State>;
  private _scheduler: Scheduler;
  private _interval: number;

  @Effect() replay$: Observable<Action>;

  constructor(action: Actions,
              store: Store<fromDashboards.State>,
              @Inject(REPLAY_INTERVAL) replayInterval: number,
              @Optional() scheduler: Scheduler = async) {
    this._actions$ = action;
    this._store = store;
    this._interval = replayInterval;
    this._scheduler = scheduler;

    this.replayEffect();
  }

  replayEffect() {
    const currentTimestamp$ = this._store.pipe(select(fromDashboards.getCurrentTimestamp));
    const step$ = this._store.pipe(select(fromDashboards.getStep));
    const range$ = this._store.pipe(select(fromDashboards.getTimeRange));

    const observable = zip(currentTimestamp$, step$, range$).pipe(
      first(),
      map(([currentTimestamp, step, timeRange]) => {
        const stopAction = new replayActions.Stop();

        if (isNullOrUndefined(currentTimestamp)) {
          return stopAction;
        }

        const replayTimestamp = currentTimestamp + step;

        return replayTimestamp <= timeRange.endTimestamp
          ? new timePreferencesActions.SetCurrentTimestamp(replayTimestamp)
          : stopAction;
      })
    );

    this.replay$ = timer(this._interval, this._interval, this._scheduler).pipe(
      withLatestFrom(this._store.pipe(select(fromDashboards.getReplayStatus))),
      filter(([item, status]) => status === ReplayStatus.RESUME),
      flatMap(() => observable)
    );
  }
}
