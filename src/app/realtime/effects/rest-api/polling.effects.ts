import {Inject, Injectable, Optional} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Action, select, Store} from '@ngrx/store';
import {from, Observable, Scheduler, timer} from 'rxjs';
import {async} from 'rxjs/internal/scheduler/async';
import {flatMap, map, takeUntil, withLatestFrom} from 'rxjs/operators';
import * as pollingActions from '../../actions/rest-api/polling.actions';
import * as fromRealTime from '../../reducers';
import * as policyGroupActions from '../../actions/web-socket/policy-group.actions';
import {PolicyInfo} from '../../models/index';

@Injectable()
export class PollingEffects {
  private _actions$: Actions;
  private _store: Store<fromRealTime.State>;
  private _scheduler: Scheduler;

  @Effect() policyGroup$: Observable<Action>;

  constructor(action$: Actions,
              store: Store<fromRealTime.State>,
              @Optional() scheduler: Scheduler) {
    this._actions$ = action$;
    this._store = store;
    this._scheduler = scheduler ? scheduler : async;

    this.policyGroupEffect();
  }

  private policyGroupEffect() {
    const policyGroups$ = this._store.pipe(select(fromRealTime.getPolicyGroup));

    const timer$ = timer(3600000, 3600000, this._scheduler).pipe(
      withLatestFrom(policyGroups$),
      flatMap(([n, policyGroups]) => from(policyGroups)),
      map((pInfo: PolicyInfo) => new policyGroupActions.Get(pInfo)),
      takeUntil(this._actions$.pipe(ofType(pollingActions.STOP)))
    );

    this.policyGroup$ = this._actions$.pipe(
      ofType(pollingActions.START),
      flatMap((action: pollingActions.Start) => timer$)
    );
  }
}
