import {TestBed} from '@angular/core/testing';
import {provideMockActions} from '@ngrx/effects/testing';
import {Action, Store} from '@ngrx/store';
import {cold, hot} from 'jasmine-marbles';
import {Observable} from 'rxjs';
import {mockFormulaMeasure} from '../../common/testing/mocks/mockMeasures';
import {mockPackages} from '../../common/testing/mocks/widgets';
import * as formulaMeasureActions from '../actions/formula-measure.actions';
import {FormulaMeasureEffects} from './formula-measure.effect';
import {PACKAGES_SERVICE} from '../services/tokens';

describe('FormulaMeasureEffects', () => {
  let effects: FormulaMeasureEffects;
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
        FormulaMeasureEffects,
        provideMockActions(() => actions),
        {
          provide: PACKAGES_SERVICE,
          useValue: jasmine.createSpyObj('service', ['getAllFormulaMeasures', 'addFormulaMeasure'])
        },
        {provide: Store, useValue: jasmine.createSpyObj('mockStore', ['pipe'])}
      ]
    });

    store = TestBed.get(Store);
    service = TestBed.get(PACKAGES_SERVICE);
  });

  describe('loadAll$', () => {
    it('should return success actions if load all formula measures success', () => {
      const customMeasures = [mockFormulaMeasure({name: 'measure 1'}), mockFormulaMeasure({name: 'measure 2'})];
      const packages = mockPackages();
      const loadAction = new formulaMeasureActions.LoadAll();
      const successAction = new formulaMeasureActions.LoadAllSuccess(customMeasures);

      actions                     = cold('-a', {a: loadAction});
      const formulaMeasureService = cold('-a|', {a: customMeasures});
      const userStore             = cold('a', {a: loggedInUser});
      const packagesStore         = cold('-a', {a: packages});
      const expected              = cold('--a', {a: successAction});

      service.getAllFormulaMeasures.and.returnValue(formulaMeasureService);
      store.pipe.and.returnValues(packagesStore, userStore);

      effects = TestBed.get(FormulaMeasureEffects);

      expect(effects.loadAll$).toBeObservable(expected);
    });

    it('should return fail action if service throws error', () => {
      const loadAction = new formulaMeasureActions.LoadAll();
      const error = new Error('Error!');
      const packages = mockPackages();
      const failAction = new formulaMeasureActions.LoadAllFailure(error);

      actions                     = cold('-a', {a: loadAction});
      const formulaMeasureService = cold('-#', {}, error);
      const userStore             = cold('a', {a: loggedInUser});
      const packagesStore         = cold('-a', {a: packages});
      const expected              = cold('--c', {c: failAction});

      service.getAllFormulaMeasures.and.returnValue(formulaMeasureService);
      store.pipe.and.returnValues(packagesStore, userStore);

      effects = TestBed.get(FormulaMeasureEffects);

      expect(effects.loadAll$).toBeObservable(expected);
    });

    it('should do nothing if packages is empty', () => {
      const customMeasures = [mockFormulaMeasure({name: 'measure 1'}), mockFormulaMeasure({name: 'measure 2'})];
      const packages = [];
      const loadAction = new formulaMeasureActions.LoadAll();
      const successAction = new formulaMeasureActions.LoadAllSuccess(customMeasures);

      actions                     = cold('-a', {a: loadAction});
      const formulaMeasureService = cold('-a|', {a: customMeasures});
      const userStore             = cold('a', {a: loggedInUser});
      const packagesStore         = cold('-a', {a: packages});
      const expected              = cold('------');

      service.getAllFormulaMeasures.and.returnValue(formulaMeasureService);
      store.pipe.and.returnValues(packagesStore, userStore);

      effects = TestBed.get(FormulaMeasureEffects);

      expect(effects.loadAll$).toBeObservable(expected);
    });
  });

  describe('add$', () => {
    it('should return success actions if service add success', () => {
      const measure = mockFormulaMeasure();
      const action = new formulaMeasureActions.Add(measure);
      const successAction = new formulaMeasureActions.AddSuccess(measure);

      actions                     =  hot('--a', {a: action});
      const formulaMeasureService = cold('-s-', {s: measure});
      const userStore             = cold('a', {a: loggedInUser});
      const expected              = cold('---e-', {e: successAction});

      service.addFormulaMeasure.and.returnValue(formulaMeasureService);
      store.pipe.and.returnValue(userStore);

      effects = TestBed.get(FormulaMeasureEffects);

      expect(effects.add$).toBeObservable(expected);
    });


    it('should return error action if service add failed', () => {
      const measure = mockFormulaMeasure();
      const error = new Error('Error!');
      const action = new formulaMeasureActions.Add(measure);
      const failAction = new formulaMeasureActions.AddFailure(error);

      actions                     =  hot('-a', {a: action});
      const formulaMeasureService = cold('-#', {}, error);
      const userStore             = cold('a', {a: loggedInUser});
      const expected              = cold('--c', {c: failAction});

      service.addFormulaMeasure.and.returnValue(formulaMeasureService);
      store.pipe.and.returnValue(userStore);

      effects = TestBed.get(FormulaMeasureEffects);

      expect(effects.add$).toBeObservable(expected);
    });
  });
});
