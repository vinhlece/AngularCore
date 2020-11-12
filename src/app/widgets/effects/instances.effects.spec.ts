import {TestBed} from '@angular/core/testing';
import {provideMockActions} from '@ngrx/effects/testing';
import {Action, Store} from '@ngrx/store';
import {cold} from 'jasmine-marbles';
import {Observable} from 'rxjs';
import * as instancesActions from '../actions/instances.actions';
import {InstancesEffects} from './instances.effects';

describe('InstancesEffects', () => {
  let effects: InstancesEffects;
  let actions: Observable<Action>;
  let store: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        InstancesEffects,
        provideMockActions(() => actions),
        {provide: Store, useValue: jasmine.createSpyObj('mockStore', ['pipe'])}
      ]
    });

    store = TestBed.get(Store);
  });

  describe('findByName$', () => {
    it('should return success actions if find measures success', () => {
      const instances = ['ABC', 'ABCDEF'];
      const findByNameAction = new instancesActions.FindByName('abc');
      const successAction = new instancesActions.FindByNameSuccess(instances);

      actions          = cold('-a', {a: findByNameAction});
      const instances$ = cold('a-', {a: [...instances, 'SDGFG']});
      const expected   = cold('-a', {a: successAction});

      store.pipe.and.returnValue(instances$);
      effects = TestBed.get(InstancesEffects);

      expect(effects.findByName$).toBeObservable(expected);
    });
  });
});
