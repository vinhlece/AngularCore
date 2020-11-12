import {async, TestBed} from '@angular/core/testing';
import {provideMockActions} from '@ngrx/effects/testing';
import {Action} from '@ngrx/store';
import {cold, hot} from 'jasmine-marbles';
import {Observable} from 'rxjs';
import {EventTagEffect} from './event-tag.effect';
import {EVENT_SOURCE_SERVICE} from '../services/tokens';
import {CreateCustomEvent, ActionFailure, CreateCustomEventSuccess} from '../actions/event-tag.actions';

describe('EventTagEffect', () => {
  let effects: EventTagEffect;
  let actions: Observable<Action>;
  let service: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        EventTagEffect,
        provideMockActions(() => actions),
        {
          provide: EVENT_SOURCE_SERVICE,
          useValue: jasmine.createSpyObj('service', ['createEventTag'])
        }
      ]
    });
    service = TestBed.get(EVENT_SOURCE_SERVICE);
  }));

  describe('createEventTag$', () => {
    it('should return create custom event tag success action', () => {
      const responseAction = new CreateCustomEventSuccess({id: 'testid', name: 'name', query: 'query'});
      const createAction = new CreateCustomEvent('test url', {id: 'testid', name: 'name', operator: null, parameters: null}, 'query');

      actions               =  hot('-a', {a: createAction});
      const serviceResponse = cold('-r|', {r: {id: 'testid'}});
      const expected        = cold('--s', {s: responseAction});

      service.createEventTag.and.returnValue(serviceResponse);
      effects = TestBed.get(EventTagEffect);

      expect(effects.createEventTag$).toBeObservable(expected);
    });

    it('should return create failed action if service create failed', () => {
      const error = new Error('Error!');
      const failedAction = new ActionFailure(error);
      const createAction = new CreateCustomEvent('test url', null, null);

      actions                =  hot('-a', {a: createAction});
      const serviceResponse  = cold('-#-', {}, error);
      const expected         = cold('--f', {f: failedAction});

      service.createEventTag.and.returnValue(serviceResponse);
      effects = TestBed.get(EventTagEffect);

      expect(effects.createEventTag$).toBeObservable(expected);
    });
  });
});
