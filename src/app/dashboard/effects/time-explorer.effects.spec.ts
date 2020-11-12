import {TestBed} from '@angular/core/testing';
import {provideMockActions} from '@ngrx/effects/testing';
import {cold, hot} from 'jasmine-marbles';
import * as timeExplorerActions from '../actions/time-explorer.actions';
import * as timePreferencesActions from '../actions/time-preferences.actions';
import {TimeExplorerEffects} from './time-explorer.effects';
import {Store} from '@ngrx/store';

describe('TimeExplorerEffects', () => {
  let effects: TimeExplorerEffects;
  let actions: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TimeExplorerEffects,
        provideMockActions(() => actions),
        {provide: Store, useValue: jasmine.createSpyObj('store', ['dispatch', 'select', 'pipe'])}
      ]
    }).compileComponents();
  });

  it('should return set null current timestamp action on close', () => {
    const closeAction = new timeExplorerActions.Close();
    const expectedAction = new timePreferencesActions.SetCurrentTimestamp(null);

    actions         =  hot('-a-', {a: closeAction});
    const expected$ = cold('-e-', {e: expectedAction});

    effects = TestBed.get(TimeExplorerEffects);
    expect(effects.close$).toBeObservable(expected$);
  });
});
