import {async, TestBed} from '@angular/core/testing';
import {provideMockActions} from '@ngrx/effects/testing';
import {Action} from '@ngrx/store';
import {cold, hot} from 'jasmine-marbles';
import {Observable} from 'rxjs';
import {mockPackages} from '../../common/testing/mocks/widgets';
import * as packagesActions from '../actions/packages.actions';
import {PACKAGES_SERVICE} from '../services/tokens';
import {PackagesEffects} from './packages.effects';
import {Package} from '../models/index';

describe('PackagesEffects', () => {
  let effects: PackagesEffects;
  let actions: Observable<Action>;
  let service: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        PackagesEffects,
        provideMockActions(() => actions),
        {
          provide: PACKAGES_SERVICE,
          useValue: jasmine.createSpyObj('service', ['getAllPackages'])
        }
      ]
    });
    service = TestBed.get(PACKAGES_SERVICE);
  }));

  describe('loadAll$', () => {
    it('should return set normalized measures action', () => {
      const packages = mockPackages().map(item => {
        const i = {...item};
        i['Package'] = item['dimensions'];
        delete i['dimensions'];
        return i;
      });
      const loadAllAction = new packagesActions.LoadAll();
      const convertPackages: Package[] = packages.map(item => {
        const i = {...item};
        i.name = item['package'];
        delete i['package'];
        return i;
      });
      const successAction = new packagesActions.LoadAllSuccess(convertPackages);

      actions               =  hot('-a', {a: loadAllAction});
      const serviceResponse = cold('-r|', {r: packages});
      const expected        = cold('--s', {s: successAction});

      service.getAllPackages.and.returnValue(serviceResponse);
      effects = TestBed.get(PackagesEffects);

      expect(effects.loadAll$).toBeObservable(expected);
    });

    it('should return load failed action if service load failed', () => {
      const loadAllAction = new packagesActions.LoadAll();
      const error = new Error('Error!');
      const failedAction = new packagesActions.LoadAllFailure(error);

      actions                =  hot('-a', {a: loadAllAction});
      const measuresResponse = cold('-#-', {}, error);
      const expected         = cold('--f', {f: failedAction});

      service.getAllPackages.and.returnValue(measuresResponse);
      effects = TestBed.get(PackagesEffects);

      expect(effects.loadAll$).toBeObservable(expected);
    });
  });
});
