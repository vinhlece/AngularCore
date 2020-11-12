import {TestBed} from '@angular/core/testing';
import {provideMockActions} from '@ngrx/effects/testing';
import {Store} from '@ngrx/store';
import {cold} from 'jasmine-marbles';
import {Observable} from 'rxjs';
import {mockRealtimeData} from '../../../common/testing/mocks/realtime-data.mocks';
import * as pollingActions from '../../actions/rest-api/polling.actions';
import {REAL_TIME_FACTORY_SERVICE, REPORTING_DATA_GENERATOR_SERVICE} from '../../services/tokens';
import {TopicMapper} from '../../services/TopicMapper';
import {WebSocketRealTimeEffects} from './web-socket-real-time.effects';
import {WebSocketSubscription} from '../../models/web-socket/widget-container';
import {DummyAction} from '../../../common/actions/index';
import {Initialize} from '../../actions/web-socket/real-time-client.action';
import {FORMULA_MEASURE_FACTORY} from '../../../measures/services/tokens';

describe('WebSocketRealTimeEffects', () => {
  let effects: WebSocketRealTimeEffects;
  let mockFormulaFactory;
  let actions: Observable<any> = null;
  let store;
  let topicMapper;
  let realTimeService;
  let realTimeFactoryService;
  let reportingDataGeneratorService;

  beforeEach(() => {
    store = jasmine.createSpyObj('store', ['pipe', 'dispatch']);
    realTimeService = jasmine.createSpyObj('realTimeService',
      ['getData', 'getStatusConnection', 'destroyConsumer', 'initConsumer', 'getConsumerRegistrationInfo']);
    realTimeFactoryService = jasmine.createSpyObj('realTimeFactoryService', ['createRealTimeService']);
    mockFormulaFactory = jasmine.createSpyObj('formulaFactory', ['create']);
    reportingDataGeneratorService = jasmine.createSpyObj('reportingDataGeneratorService', ['get']);

    TestBed.configureTestingModule({
      providers: [
        WebSocketRealTimeEffects,
        TopicMapper,
        provideMockActions(() => actions),
        {provide: Store, useValue: store},
        {provide: REAL_TIME_FACTORY_SERVICE, useValue: realTimeFactoryService},
        {provide: REPORTING_DATA_GENERATOR_SERVICE, useValue: reportingDataGeneratorService},
        {
          provide: FORMULA_MEASURE_FACTORY,
          useValue: mockFormulaFactory
        }
      ],
    }).compileComponents();

    topicMapper = TestBed.get(TopicMapper);
    realTimeFactoryService.createRealTimeService.and.returnValue(realTimeService);
  });

  describe('getData$', () => {
    const data = [mockRealtimeData()];
    const subscriptions: WebSocketSubscription[] = [{
      id: 'subscription-id1',
      measureNames: [],
      user: 'user-id1',
      topic: {
        name: 'reporting-queue-performance',
        channel: 'queueperformance',
        dataType: 'Queue Performance'
      }
    },
    {
      id: 'subscription-id2',
      measureNames: [],
      user: 'user-id2',
      topic: {
        name: 'reporting-queue-performance',
        channel: 'queueperformance',
        dataType: 'Queue Performance'
      }
    }];

    it('should return load success action when subscriptions are created', () => {
      const loadSuccessAction = new pollingActions.LoadSuccess(data);

      const addAction      = new Initialize();
      actions              =  cold('-a', {a: addAction});
      const subscriptions$ = cold('-a------', {a: subscriptions});
      const data$          = cold('-a------', {a: data});
      const status$        = cold('-a------', {a: 'connected'});
      const expected       = cold('--a------', {a: loadSuccessAction});
      const registration$  = cold('-a------', {a: subscriptions[0]});

      store.pipe.and.returnValue(subscriptions$);
      store.dispatch.and.returnValue({});
      realTimeService.getData.and.returnValue(data$);
      realTimeService.initConsumer.and.returnValue({});
      realTimeService.getStatusConnection.and.returnValue(status$);
      realTimeService.getConsumerRegistrationInfo.and.returnValue(registration$);
      effects = TestBed.get(WebSocketRealTimeEffects);

      expect(effects.getData$).toBeObservable(expected);
      expect(realTimeFactoryService.createRealTimeService).toHaveBeenCalledTimes(1);
    });

    it('should return default action when creating subscriptions is error', () => {
      const defaultAction = new DummyAction();
      const error = new Error('Creating failed');

      const addAction      = new Initialize();
      actions              =  cold('-a', {a: addAction});
      const subscriptions$ = cold('-a------', {a: subscriptions});
      const data$          = cold('-#------', {}, error);
      const status$        = cold('-a------', {a: 'connected'});
      const expected       = cold('--a-----', {a: defaultAction});
      const registration$  = cold('-a------', {a: subscriptions[0]});

      store.pipe.and.returnValue(subscriptions$);
      store.dispatch.and.returnValue({});
      realTimeService.getData.and.returnValue(data$);
      realTimeService.getStatusConnection.and.returnValue(status$);
      realTimeService.initConsumer.and.returnValue({});
      realTimeService.getConsumerRegistrationInfo.and.returnValue(registration$);
      effects = TestBed.get(WebSocketRealTimeEffects);

      expect(effects.getData$).toBeObservable(expected);
      expect(realTimeFactoryService.createRealTimeService).toHaveBeenCalledTimes(1);
    });
  });
});
