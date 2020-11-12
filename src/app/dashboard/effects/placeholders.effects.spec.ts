import {TestBed} from '@angular/core/testing';
import {provideMockActions} from '@ngrx/effects/testing';
import {cold, hot} from 'jasmine-marbles';
import {Observable} from 'rxjs';
import {mockPlaceholder} from '../../common/testing/mocks/dashboards';
import * as placeholdersActions from '../actions/placeholders.actions';
import {PLACEHOLDERS_SERVICE} from '../services/tokens';
import {PlaceholdersEffects} from './placeholders.effects';

describe('PlaceholdersEffects', () => {
  let effects: PlaceholdersEffects;
  let actions: Observable<any>;
  let placeholdersService: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PlaceholdersEffects,
        provideMockActions(() => actions),
        {provide: PLACEHOLDERS_SERVICE, useValue: jasmine.createSpyObj('PlaceholdersService', ['findById'])},
      ]
    });
    placeholdersService = TestBed.get(PLACEHOLDERS_SERVICE);
  });

  describe('load$', () => {
    it('should return load success action if load placeholder success', () => {
      const placeholder = mockPlaceholder();
      const loadAction = new placeholdersActions.Load(placeholder.id);
      const successAction = new placeholdersActions.LoadSuccess(placeholder);

      actions        =  hot('--a-', {a: loadAction});
      const response = cold('-a', {a: placeholder});
      const expected = cold('---b', {b: successAction});

      placeholdersService.findById.and.returnValue(response);
      effects = TestBed.get(PlaceholdersEffects);

      expect(effects.load$).toBeObservable(expected);
    });

    it('should return add fail action when service is failed.', () => {
      const error = new Error('Error message');
      const loadAction = new placeholdersActions.Load('abc');
      const failAction = new placeholdersActions.LoadFailure(error);

      actions        =  hot('--a-', {a: loadAction});
      const response = cold('-#', {}, error);
      const expected = cold('---b', {b: failAction});

      placeholdersService.findById.and.returnValue(response);
      effects = TestBed.get(PlaceholdersEffects);

      expect(effects.load$).toBeObservable(expected);
    });
  });
});
