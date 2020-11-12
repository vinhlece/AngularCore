import {TestBed} from '@angular/core/testing';
import {provideMockActions} from '@ngrx/effects/testing';
import {Action, Store} from '@ngrx/store';
import {cold} from 'jasmine-marbles';
import {Observable} from 'rxjs';
import {mockFormulaMeasure} from '../../common/testing/mocks/mockMeasures';
import * as measuresActions from '../actions/measures.actions';
import {PACKAGES_SERVICE} from '../services/tokens';
import {MeasuresEffects} from './measures.effects';

describe('MeasuresEffects', () => {
  let effects: MeasuresEffects;
  let actions: Observable<Action>;
  let service: any;
  let store: any;

  const loggedInUser = {
    id: 'User',
    displayName: 'UserName'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MeasuresEffects,
        provideMockActions(() => actions),
        {
          provide: PACKAGES_SERVICE,
          useValue: jasmine.createSpyObj('service', ['findMeasuresByName'])
        },
        {provide: Store, useValue: jasmine.createSpyObj('mockStore', ['pipe'])}
      ]
    });

    store = TestBed.get(Store);
    service = TestBed.get(PACKAGES_SERVICE);
  });

  describe('findByName$', () => {
    it('should return success actions if find measures success', () => {
      const measures = [mockFormulaMeasure({name: 'measure 1'}), mockFormulaMeasure({name: 'measure 2'})];
      const findByNameAction = new measuresActions.FindByName('abc');
      const successAction = new measuresActions.FindByNameSuccess(measures);

      actions               = cold('-a', {a: findByNameAction});
      const serviceResponse = cold('-a|', {a: measures});
      const userStore       = cold('a', {a: loggedInUser});
      const expected        = cold('--a', {a: successAction});

      service.findMeasuresByName.and.returnValue(serviceResponse);
      store.pipe.and.returnValue(userStore);

      effects = TestBed.get(MeasuresEffects);

      expect(effects.findByName$).toBeObservable(expected);
    });

    it('should return fail action if service throws error', () => {
      const findByNameAction = new measuresActions.FindByName('abc');
      const error = new Error('Error!');
      const failAction = new measuresActions.ActionFailure(error);

      actions               = cold('-a', {a: findByNameAction});
      const serviceResponse = cold('-#', {}, error);
      const userStore       = cold('a', {a: loggedInUser});
      const expected        = cold('--c', {c: failAction});

      service.findMeasuresByName.and.returnValue(serviceResponse);
      store.pipe.and.returnValues(userStore);

      effects = TestBed.get(MeasuresEffects);

      expect(effects.findByName$).toBeObservable(expected);
    });
  });
});
