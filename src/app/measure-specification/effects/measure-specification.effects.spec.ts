import {async, TestBed} from '@angular/core/testing';
import {provideMockActions} from '@ngrx/effects/testing';
import {Action, Store} from '@ngrx/store';
import {cold, hot} from 'jasmine-marbles';
import {Observable, of} from 'rxjs';
import {EVENT_SOURCE_SERVICE} from '../services/tokens';
import {EventSourceEffects} from './measure-specification.effect';
import * as measureActions from '../actions/measure-specification.actions';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

describe('EventSourceEffects', () => {
  let effects: EventSourceEffects;
  let actions: Observable<Action>;
  let service: any;
  let dialogServiceSpy;
  let dialogRefSpy;
  let store;

  beforeEach(async(() => {
    dialogServiceSpy = jasmine.createSpyObj('MatDialog', ['open']);
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['open', 'close', 'afterClosed']);
    TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
      ],
      providers: [
        EventSourceEffects,
        provideMockActions(() => actions),
        {
          provide: EVENT_SOURCE_SERVICE,
          useValue: jasmine.createSpyObj('service', ['getSourceByUrl', 'getAllStreams', 'addMeasure'])
        },
        {provide: Store, useValue: jasmine.createSpyObj('mockStore', ['pipe'])},
        {provide: MatDialog, useValue: dialogServiceSpy}
      ]
    });
    service = TestBed.get(EVENT_SOURCE_SERVICE);
    store = TestBed.get(Store);
  }));

  describe('loadAll$', () => {
    it('should return load a event source success action', () => {
      const responseAction = new measureActions.LoadAllStreams('testid', 'test url');
      const createAction = new measureActions.LoadAll('test url');

      actions               =  hot('-a', {a: createAction});
      const serviceResponse = cold('-r|', {r: [{id: 'testid'}]});
      const expected        = cold('--s', {s: responseAction});

      service.getSourceByUrl.and.returnValue(serviceResponse);
      effects = TestBed.get(EventSourceEffects);

      expect(effects.loadAll$).toBeObservable(expected);
    });

    it('should return load failed action if service load failed', () => {
      const error = new Error('Error!');
      const failedAction = new measureActions.ActionFailure(error, 'test url');
      const createAction = new measureActions.LoadAll('test url');

      actions                =  hot('-a', {a: createAction});
      const serviceResponse  = cold('-#-', {}, error);
      const expected         = cold('--f', {f: failedAction});

      service.getSourceByUrl.and.returnValue(serviceResponse);
      effects = TestBed.get(EventSourceEffects);

      expect(effects.loadAll$).toBeObservable(expected);
    });
  });

  describe('add$', () => {
    const data = {measureName: 'test name', processorType: null, events: [], dimensions: [[]],
      measureWindows: [], packages: [], correlationIdentifiers: null, createdBy: null};
    it('should return add measure success action', () => {
      const user = {id: 'user01', displayName: 'user 01', password: 'user01' };
      store.pipe.and.returnValue(of(user));
      const dataSuccess = {...data, id: 'id test'};
      const responseAction = new measureActions.AddMeasure('url', dataSuccess);
      const createAction = new measureActions.Add(['url'], dataSuccess);

      actions               =  hot('-a', {a: createAction});
      const serviceResponse = cold('-r|', {r: dataSuccess});
      const expected        = cold('-s', {s: responseAction});

      dialogServiceSpy.open.and.returnValue(dialogRefSpy);
      service.addMeasure.and.returnValue(serviceResponse);
      effects = TestBed.get(EventSourceEffects);

      expect(effects.add$).toBeObservable(expected);
    });
  });

  describe('loadStreams$', () => {
    it('should return load all stream success action', () => {
      const responseAction = new measureActions.LoadAllSuccess([{name: 'stream name'}], 'event source url');
      const createAction = new measureActions.LoadAllStreams('event source id', 'event source url');

      actions               =  hot('-a', {a: createAction});
      const serviceResponse = cold('-r|', {r: [{name: 'stream name'}]});
      const expected        = cold('--s', {s: responseAction});

      service.getAllStreams.and.returnValue(serviceResponse);
      effects = TestBed.get(EventSourceEffects);

      expect(effects.loadStreams$).toBeObservable(expected);
    });

    it('should return load failed action if service load failed', () => {
      const error = new Error('Error!');
      const failedAction = new measureActions.FailureResponse(error);
      const createAction = new measureActions.LoadAllStreams('event source id', 'event source url');

      actions                =  hot('-a', {a: createAction});
      const serviceResponse  = cold('-#-', {}, error);
      const expected         = cold('--f', {f: failedAction});

      service.getAllStreams.and.returnValue(serviceResponse);
      effects = TestBed.get(EventSourceEffects);

      expect(effects.loadStreams$).toBeObservable(expected);
    });
  });
});
