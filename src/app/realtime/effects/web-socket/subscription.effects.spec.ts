import {TestBed} from '@angular/core/testing';
import {provideMockActions} from '@ngrx/effects/testing';
import {Action, Store} from '@ngrx/store';
import {Observable, of} from 'rxjs';
import {SubscriptionEffect} from './subscription.effects';
import {SubscriptionService} from '../../services/web-socket/subscription.services';
import * as SubscriptionAction from '../../actions/web-socket/subscription.action';
import {WebSocketSubscription} from '../../models/web-socket/widget-container';
import {cold, getTestScheduler, hot} from 'jasmine-marbles';
import {SUBSCRIPTION_SERVICE} from '../../services/tokens';
import {Widget} from '../../../widgets/models/index';
import {WidgetType} from '../../../widgets/constants/widget-types';
import {Stream, Topic} from '../../models/index';
import * as pollingActions from '../../actions/rest-api/polling.actions';
import {FORMULA_MEASURE_FACTORY} from '../../../measures/services/tokens';
import * as policyGroupActions from '../../actions/web-socket/policy-group.actions';

describe('SubscriptionEffect', () => {
  let mockSubscriptionService;
  let mockFormulaFactory;
  let mockStore;
  let actions: Observable<Action>;
  let effects: SubscriptionEffect;
  const user = {id: 'user01', displayName: 'user 01'};

  const widgets: Widget[] = [{
    dataType: 'Queue Performance',
    defaultSize: {
      columns: 2,
      rows: 2
    },
    id: 'widget',
    dimensions: [
      {
        dimension: 'intent',
        systemInstances: ['Dog'],
        customInstances: []
      }
    ],
    windows: ['LAST_30_MINUTES_HOUR_RETENTION'],
    measures: ['ContactsAnswered'],
    type: WidgetType.Billboard,
    userId: user.id,
    name: 'asda'
  }];

  const stream: Stream[] = [{
    dataType: 'Queue Performance',
    instance: 'Dog',
    dirty: false
  }];
  const globalFilter = ['Dog', 'Cat'];

  const topic: Topic[] = [{
    channel: 'queueperformance',
    dataType: 'Queue Performance',
    isSubscribed: true,
    measures: [{
      dataType: 'Queue Performance',
      dimension: 'intent',
      format: 'number',
      name: 'ContactsAnswered',
      relatedMeasures: [],
      windowName: 'LAST_30_MINUTES_HOUR_RETENTION',
      windowType: 'INTERVAL'
    }],
    name: 'reporting_queue_performance',
    subscriptionId: 'subscription-1',
    clientId: 'sessionId'
  }];

  beforeEach(() => {
    mockSubscriptionService = jasmine.createSpyObj('SubscriptionService',
      ['add', 'remove']);
    mockFormulaFactory = jasmine.createSpyObj('formulaFactory', ['create']);
    mockStore = jasmine.createSpyObj('store', ['pipe', 'dispatch']);
    TestBed.configureTestingModule({
      providers: [
        SubscriptionEffect,
        provideMockActions(() => actions),
        {
          provide: Store,
          useValue: mockStore
        },
        {
          provide: SUBSCRIPTION_SERVICE,
          useValue: mockSubscriptionService
        },
        {
          provide: FORMULA_MEASURE_FACTORY,
          useValue: mockFormulaFactory
        }
      ]
    });
  });

  describe('subscription$', () => {
    it('should add a new subscription successfully', () => {
      const subscription: WebSocketSubscription = {
        sessionId: 'sessionId',
        id: 'subscription-1',
        user: 'user01',
        packageName: 'Queue Performance',
        measureFilters: [{
          dimensionFilters: [{dimension: 'intent', included: ['Dog', 'Cat']}],
          measure: 'ContactsAnswered',
          windows: ['LAST_30_MINUTES_HOUR_RETENTION']
        }]
      };

      mockStore.pipe.and.returnValues(of(widgets), of(user), of(topic), of([]), of(globalFilter));

      const addAction = new SubscriptionAction.Add();
      actions               =  hot('-a', {a: addAction});
      const expected        = cold('-(a)', {a: new SubscriptionAction.Create(subscription)});

      effects = TestBed.get(SubscriptionEffect);
      expect(effects.add$).toBeObservable(expected);
    });

    it('should call add a new  subscription service successfully', () => {
      const subscription: WebSocketSubscription = {
        sessionId: 'sessionId',
        id: 'subscriptionID',
        user: 'adminUser',
        measureFilters: [],
        packageName: 'Queue Performance'
      };

      mockStore.pipe.and.returnValues(of(widgets), of(user), of(topic), of([]), of(globalFilter));
      const addAction = new SubscriptionAction.Create(subscription);
      actions               =  hot('-a', {a: addAction});
      const serviceResponse = cold('-a', {a: {
        webSocketConnection: 'joulica-reporting-sub-pub-queueperformance'
      }});
      mockSubscriptionService.add.and.returnValue(serviceResponse);
      effects = TestBed.get(SubscriptionEffect);
      effects.create$.subscribe();
      getTestScheduler().flush();
      expect(mockSubscriptionService.add).toHaveBeenCalledWith(subscription);
    });

    it('should emit add subscription error action when adding failed', () => {
      const subscription: WebSocketSubscription = {
        id: 'subscription-id',
        measureNames: [],
        user: 'user-id',
        topic: {
          name: 'reporting-queue-performance',
          channel: 'queueperformance',
          dataType: 'Queue Performance'
        },
        packageName: 'Queue Performance'
      };

      mockStore.pipe.and.returnValues(of(widgets), of(user), of(topic), of([]), of(globalFilter));
      const error = new Error('Adding failed');
      const failAction = new SubscriptionAction.Error(error.message);
      const addAction = new SubscriptionAction.Create(subscription);
      actions               =  hot('-a', {a: addAction});
      const serviceResponse = cold('-#', {}, error);
      const expected        = cold('--a', {a: failAction});

      mockSubscriptionService.add.and.returnValue(serviceResponse);

      effects = TestBed.get(SubscriptionEffect);
      expect(effects.create$).toBeObservable(expected);
    });

    it('should emit subscription succeed action when added successfully', () => {
      const subscription: WebSocketSubscription = {
        id: 'subscription-id',
        measureNames: [],
        user: 'user-id',
        topic: {
          name: 'reporting-queue-performance',
          channel: 'queueperformance',
          dataType: 'Queue Performance'
        },
        packageName: 'Queue Performance'
      };
      mockStore.pipe.and.returnValues(of(widgets), of(user), of(topic), of([]), of(globalFilter));
      const serviceResponseData = {webSocketConnection: 'joulica-reporting-sub-pub-queueperformance'};
      const addAction = new SubscriptionAction.Create(subscription);
      const successAction = new SubscriptionAction.AddSuccess(subscription);
      const pumpup = new pollingActions.PumpUp('Queue Performance');
      const createPolicyGroup = new policyGroupActions.Initialize('Queue Performance');

      actions               =  hot('-a-', {a: addAction});
      const serviceResponse = cold('-a-', {a: serviceResponseData});
      const expected        = cold('--(adc)', {a: successAction, d: pumpup, c: createPolicyGroup});

      mockSubscriptionService.add.and.returnValue(serviceResponse);

      effects = TestBed.get(SubscriptionEffect);
      expect(effects.create$).toBeObservable(expected);
    });

    it('should call delete subscription service successfully', () => {
      const subscription: WebSocketSubscription = {
        id: 'queueperformance-12315',
        topic: {
          name: 'reporting-queue-performance',
          channel: 'queueperformance',
          dataType: 'Queue Performance'
        }
      };
      const deleteAction = new SubscriptionAction.Delete(subscription);

      actions               =  hot('-a---', {a: deleteAction});
      const serviceResponse = cold('-a----', {a: subscription});

      mockSubscriptionService.remove.and.returnValue(serviceResponse);

      effects = TestBed.get(SubscriptionEffect);
      effects.remove$.subscribe();
      getTestScheduler().flush();
      expect(mockSubscriptionService.remove).toHaveBeenCalledWith(subscription);
    });

    it('should emit subscription succeed action when deleted successfully', () => {
      const subscription: WebSocketSubscription = {
        id: 'queueperformance-12315',
        topic: {
          name: 'reporting-queue-performance',
          channel: 'queueperformance',
          dataType: 'Queue Performance'
        }
      };
      const deleteAction = new SubscriptionAction.Delete(subscription);
      const successAction = new SubscriptionAction.DeleteSuccess(subscription.id);

      actions               =  hot('-a-', {a: deleteAction});
      const serviceResponse = cold('-a-', {a: subscription.id});
      const expected        = cold('--a', {a: successAction});

      mockSubscriptionService.remove.and.returnValue(serviceResponse);

      effects = TestBed.get(SubscriptionEffect);
      expect(effects.remove$).toBeObservable(expected);
    });

    it('should emit delete subscription error action when deleting failed', () => {
      const subscription: WebSocketSubscription = {
        id: 'queueperformance-12315',
        topic: {
          name: 'reporting-queue-performance',
          channel: 'queueperformance',
          dataType: 'Queue Performance'
        }
      };

      const error = new Error('Adding failed');
      const failAction = new SubscriptionAction.Error(error.message);
      const deleteAction = new SubscriptionAction.Delete(subscription);

      actions               =  hot('-a', {a: deleteAction});
      const serviceResponse = cold('-#', {}, error);
      const expected        = cold('--a', {a: failAction});

      mockSubscriptionService.remove.and.returnValue(serviceResponse);

      effects = TestBed.get(SubscriptionEffect);
      expect(effects.remove$).toBeObservable(expected);
    });
  });
});
