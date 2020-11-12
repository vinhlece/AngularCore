import {TestBed} from '@angular/core/testing';
import {provideMockActions} from '@ngrx/effects/testing';
import {Store} from '@ngrx/store';
import {cold, getTestScheduler, hot} from 'jasmine-marbles';
import {Observable, Scheduler} from 'rxjs';
import * as replayActions from '../actions/replay.actions';
import * as timePreferencesActions from '../actions/time-preferences.actions';
import {ReplayStatus} from '../models/enums';
import {REPLAY_INTERVAL} from '../services/tokens';
import {ReplayEffects} from './replay.effects';

describe('ReplayEffects', () => {
  let effects: ReplayEffects;
  let actions: Observable<any>;
  let store: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ReplayEffects,
        provideMockActions(() => actions),
        {
          provide: Store,
          useValue: jasmine.createSpyObj('store', ['pipe', 'dispatch'])
        },
        {
          provide: REPLAY_INTERVAL,
          useValue: 50
        },
        {
          provide: Scheduler,
          useValue: getTestScheduler()
        }
      ]
    }).compileComponents();

    store = TestBed.get(Store);
  });

  it('should not replay if replay status is stop', () => {
    const expected       = cold('-------------');
    const storeReplaying = cold('--a--', {a: ReplayStatus.STOP});

    store.pipe.and.returnValue(storeReplaying);
    effects = TestBed.get(ReplayEffects);

    expect(effects.replay$).toBeObservable(expected);
  });

  describe('start replay', () => {
    it('should dispatch set current timestamp action', () => {
      const startAction = new replayActions.Toggle();
      const stopAction = new replayActions.Stop();
      const expectedAction = new timePreferencesActions.SetCurrentTimestamp(6);

      actions                     =  hot('-a-b----', {a: startAction, b: stopAction});
      const expected              = cold('------a-', {a: expectedAction});
      const storeCurrentTimestamp = cold('-a------', {a: 1});
      const storeStep             = cold('-a------', {a: 5});
      const timeRange             = cold('-a------', {a: {startTimestamp: 0, endTimestamp: 1000}});
      const storeReplay           = cold('-a-----b', {a: ReplayStatus.RESUME, b: ReplayStatus.STOP});

      store.pipe.and.returnValues(storeCurrentTimestamp, storeStep, timeRange, storeReplay);

      effects = TestBed.get(ReplayEffects);

      expect(effects.replay$).toBeObservable(expected);
    });

    it('should dispatch stop replay action if current timestamp is null', () => {
      const startAction = new replayActions.Toggle();
      const stopAction = new replayActions.Stop();
      const expectedAction = new replayActions.Stop();

      actions                     =  hot('-a-b----', {a: startAction, b: stopAction});
      const expected              = cold('------a-', {a: expectedAction});
      const storeCurrentTimestamp = cold('-a------', {a: null});
      const storeStep             = cold('-a------', {a: 5});
      const timeRange             = cold('-a------', {a: {startTimestamp: 0, endTimestamp: 1000}});
      const storeReplay           = cold('-a-----b', {a: ReplayStatus.RESUME, b: ReplayStatus.STOP});

      store.pipe.and.returnValues(storeCurrentTimestamp, storeStep, timeRange, storeReplay);

      effects = TestBed.get(ReplayEffects);

      expect(effects.replay$).toBeObservable(expected);
    });

    it('should dispatch stop replay action if replay timestamp (currentTimestamp + step) larger than end timestamp of time range', () => {
      const startAction = new replayActions.Toggle();
      const stopAction = new replayActions.Stop();
      const expectedAction = new replayActions.Stop();

      actions                     =  hot('-a-b----', {a: startAction, b: stopAction});
      const expected              = cold('------a-', {a: expectedAction});
      const storeCurrentTimestamp = cold('-a------', {a: 99});
      const storeStep             = cold('-a------', {a: 5});
      const timeRange             = cold('-a------', {a: {startTimestamp: 0, endTimestamp: 10}});
      const storeReplay           = cold('-a-----b', {a: ReplayStatus.RESUME, b: ReplayStatus.STOP});

      store.pipe.and.returnValues(storeCurrentTimestamp, storeStep, timeRange, storeReplay);

      effects = TestBed.get(ReplayEffects);

      expect(effects.replay$).toBeObservable(expected);
    });
  });
});
