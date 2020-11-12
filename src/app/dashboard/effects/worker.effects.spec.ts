import {TestBed} from '@angular/core/testing';
import {provideMockActions} from '@ngrx/effects/testing';
import {cold} from 'jasmine-marbles';
import {empty, Observable} from 'rxjs';
import {DummyAction} from '../../common/actions/index';
import {WORKER_SERVICE} from '../services/tokens';
import {WorkerEffects} from './worker.effects';

describe('WorkerEffects', () => {
  let effects: WorkerEffects;
  let actions: Observable<any>;
  let workerService: any;

  beforeEach(() => {
    workerService = jasmine.createSpyObj(
      'workerService',
      [
        'start',
        'stop',
        'convert',
        'updateFilter',
        'removeFilter',
        'onResponse',
        'loadAllPackagesResponse',
        'loadAllFormulaMeasures',
        'addFormulaMeasure'
      ]
    );
    TestBed.configureTestingModule({
      providers: [
        WorkerEffects,
        provideMockActions(() => actions),
        {provide: WORKER_SERVICE, useValue: workerService},
      ]
    });
    workerService = TestBed.get(WORKER_SERVICE);
    workerService.onResponse.and.returnValue(empty());
  });

  describe('response$', () => {
    it('should return action as it is...', () => {
      const action = new DummyAction();

      const result   = cold('---a---', {a: action});
      const expected = cold('---a---', {a: action});

      workerService.onResponse.and.returnValue(result);
      effects = TestBed.get(WorkerEffects);
      expect(effects.response$).toBeObservable(expected);
    });
  });
});
