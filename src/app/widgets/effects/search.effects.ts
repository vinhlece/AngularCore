import {Inject, Injectable, Optional} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Action} from '@ngrx/store';
import {Observable, Scheduler} from 'rxjs';
import {async} from 'rxjs/internal/scheduler/async';
import {debounceTime, mergeMap} from 'rxjs/operators';
import * as instancesActions from '../actions/instances.actions';
import * as measuresActions from '../../measures/actions/measures.actions';
import * as searchActions from '../actions/search.actions';
import * as widgetsActions from '../actions/widgets.actions';
import {SEARCH_DEBOUNCE_TIME} from '../services/tokens';

@Injectable()
export class SearchEffects {
  private _actions$: Actions;
  private _scheduler: Scheduler;
  private _searchDebounceTime: number;

  @Effect() search$: Observable<Action>;

  constructor(actions$: Actions, @Inject(SEARCH_DEBOUNCE_TIME) searchDebounceTime, @Optional() scheduler: Scheduler) {
    this._actions$ = actions$;
    this._scheduler = scheduler ? scheduler : async;
    this._searchDebounceTime = searchDebounceTime;

    this.searchEffect();
  }

  searchEffect() {
    this.search$ = this._actions$.pipe(
      ofType(searchActions.SEARCH),
      debounceTime(this._searchDebounceTime, this._scheduler),
      mergeMap((action: searchActions.Search) => {
        const {type, value} = this.parseQuery(action.payload);
        const actionsBySearchType = this.getSearchActions(value);
        return [...actionsBySearchType[type], new searchActions.SetSearchType(type)];
      })
    );
  }

  private parseQuery(query: string): { type: string, value: string } {
    const re = /(all|widgets|instances|measures)?:?(.*)/;
    const match = re.exec(query.trim());
    return {
      type: match[1] ? match[1] : 'all',
      value: match[2]
    };
  }

  private getSearchActions(searchValue: string): { [type: string]: Action[] } {
    const searchWidgetsAction = new widgetsActions.Search(searchValue);
    const searchMeasuresAction = new measuresActions.FindByName(searchValue);
    const searchInstancesAction = new instancesActions.FindByName(searchValue);

    return {
      all: [searchWidgetsAction, searchMeasuresAction, searchInstancesAction],
      widgets: [searchWidgetsAction],
      instances: [searchInstancesAction],
      measures: [searchMeasuresAction]
    };
  }
}
