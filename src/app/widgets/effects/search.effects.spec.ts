import {TestBed} from '@angular/core/testing';
import {provideMockActions} from '@ngrx/effects/testing';
import {Action} from '@ngrx/store';
import {cold, getTestScheduler, hot} from 'jasmine-marbles';
import {Observable, Scheduler} from 'rxjs';
import * as instancesActions from '../actions/instances.actions';
import * as measuresActions from '../../measures/actions/measures.actions';
import * as searchActions from '../actions/search.actions';
import * as widgetsActions from '../actions/widgets.actions';
import {SEARCH_DEBOUNCE_TIME} from '../services/tokens';
import {SearchEffects} from './search.effects';

describe('SearchEffects', () => {
  let effects: SearchEffects;
  let actions: Observable<Action>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SearchEffects,
        provideMockActions(() => actions),
        {provide: Scheduler, useValue: getTestScheduler()},
        {provide: SEARCH_DEBOUNCE_TIME, useValue: 20}
      ]
    });
  });

  it('should dispatch search widgets action & find measures by name & findRecords instances by name action after debounce time has passed', () => {
    const searchAction = new searchActions.Search('abc');
    const searchMeasuresAction = new measuresActions.FindByName('abc');
    const searchWidgetsAction = new widgetsActions.Search('abc');
    const searchInstancesAction = new instancesActions.FindByName('abc');
    const setSearchTypeAction = new searchActions.SetSearchType('all');

    actions        =  hot('-a------a--------', {a: searchAction});
    const values = {b: searchWidgetsAction, c: searchMeasuresAction, d: searchInstancesAction, e: setSearchTypeAction};
    const expected = cold('---(bcde)-(bcde)-', values);

    effects = TestBed.get(SearchEffects);

    expect(effects.search$).toBeObservable(expected);
  });

  it('should dispatch search widgets action', () => {
    const searchAction = new searchActions.Search('widgets:abc');
    const searchWidgetsAction = new widgetsActions.Search('abc');
    const setSearchTypeAction = new searchActions.SetSearchType('widgets');

    actions        =  hot('-a------a--------', {a: searchAction});
    const values = {b: searchWidgetsAction, c: setSearchTypeAction};
    const expected = cold('---(bc)---(bc)---', values);

    effects = TestBed.get(SearchEffects);

    expect(effects.search$).toBeObservable(expected);
  });

  it('should dispatch search instances action', () => {
    const searchAction = new searchActions.Search('instances:abc');
    const searchInstancesActoin = new instancesActions.FindByName('abc');
    const setSearchTypeAction = new searchActions.SetSearchType('instances');

    actions        =  hot('-a------a--------', {a: searchAction});
    const values = {b: searchInstancesActoin, c: setSearchTypeAction};
    const expected = cold('---(bc)---(bc)---', values);

    effects = TestBed.get(SearchEffects);

    expect(effects.search$).toBeObservable(expected);
  });

  it('should dispatch search measures action', () => {
    const searchAction = new searchActions.Search('measures:abc');
    const searchMeasuresAction = new measuresActions.FindByName('abc');
    const setSearchTypeAction = new searchActions.SetSearchType('measures');

    actions        =  hot('-a------a--------', {a: searchAction});
    const values = {b: searchMeasuresAction, c: setSearchTypeAction};
    const expected = cold('---(bc)---(bc)---', values);

    effects = TestBed.get(SearchEffects);

    expect(effects.search$).toBeObservable(expected);
  });
});
