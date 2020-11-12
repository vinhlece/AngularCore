import deepFreeze from '../../../common/testing/deepFreeze';
import * as fromSubscription from './subscription.reducer';
import {WebSocketSubscription} from '../../models/web-socket/widget-container';
import * as subscriptionAction from '../../actions/web-socket/subscription.action';

describe('Subsriptions Reducer', () => {
  describe('subsriptions', () => {
    it('should set succeed subscriptions with add getting data action', () => {
      const subscription: WebSocketSubscription = {
        sessionId: 'sessionId',
        id: 'subscription-1',
        user: 'user01',
        packageName: 'Queue Performance',
        measureFilters: [{
          dimensionFilters: [{dimension: 'intent', included: ['Dog']}],
          measure: 'ContactsAnswered',
          windows: ['LAST_30_MINUTES_HOUR_RETENTION']
        }]
      };
      const subscription2: WebSocketSubscription = {
        sessionId: 'sessionId',
        id: 'subscription-2',
        user: 'user01',
        packageName: 'Queue Status',
        measureFilters: [{
          dimensionFilters: [{dimension: 'intent', included: ['Dog']}],
          measure: 'ContactsAnswered',
          windows: ['LAST_30_MINUTES_HOUR_RETENTION']
        }]
      };
      const stateBefore: fromSubscription.State = {
        subscriptions: [subscription]
      };
      const stateAfter: fromSubscription.State = {
        subscriptions: [subscription, subscription2]
      };
      const action = new subscriptionAction.AddSuccess(subscription2);

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(fromSubscription.reducer(stateBefore, action)).toEqual(stateAfter);
    });

    it('should delete succeed subscriptions with delete getting data action', () => {
      const subscription: WebSocketSubscription = {
        sessionId: 'sessionId',
        id: 'subscription-1',
        user: 'user01',
        packageName: 'Queue Performance',
        measureFilters: [{
          dimensionFilters: [{dimension: 'intent', included: ['Dog']}],
          measure: 'ContactsAnswered',
          windows: ['LAST_30_MINUTES_HOUR_RETENTION']
        }]
      };
      const subscription2: WebSocketSubscription = {
        sessionId: 'sessionId',
        id: 'subscription-2',
        user: 'user01',
        packageName: 'Queue Status',
        measureFilters: [{
          dimensionFilters: [{dimension: 'intent', included: ['Dog']}],
          measure: 'ContactsAnswered',
          windows: ['LAST_30_MINUTES_HOUR_RETENTION']
        }]
      };
      const stateBefore: fromSubscription.State = {
        subscriptions: [subscription, subscription2]
      };
      const stateAfter: fromSubscription.State = {
        subscriptions: [subscription]
      };
      const action = new subscriptionAction.DeleteSuccess(subscription2.id);

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(fromSubscription.reducer(stateBefore, action)).toEqual(stateAfter);
    });
  });
});
