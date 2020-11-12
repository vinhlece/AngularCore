import {ActionWithPayload} from '../../../common/actions';
import * as websocketActions from '../../actions/web-socket/subscription.action';
import * as _ from 'lodash';
import {WebSocketSubscription} from '../../models/web-socket/widget-container';

export interface State {
  subscriptions: WebSocketSubscription[];
}

export const initialState: State = {
  subscriptions: []
};

export function reducer(state = initialState, action: ActionWithPayload<any>): State {
  switch (action.type) {
    case websocketActions.ADD_SUCCESS:
      const subscription = action.payload;
      const idx = state.subscriptions ?
        state.subscriptions.findIndex((item: WebSocketSubscription) => item.packageName === subscription.packageName) : -1;
      return idx >= 0
        ? {
          subscriptions: [
            ...state.subscriptions.slice(0, idx),
            subscription,
            ...state.subscriptions.slice(idx + 1, state.subscriptions.length)
          ]
        }
        : {
          subscriptions: [...state.subscriptions, subscription]
        };
    case websocketActions.REGISTER_SUCCESS:
      return {
        subscriptions: _.unionBy([action.payload], state.subscriptions, 'id')
      };
    case websocketActions.DELETE_SUCCESS:
      return {
        subscriptions: state.subscriptions.filter(item => item.id !== action.payload)
      };
    case websocketActions.DELETE_ALL_SUCCESS:
      return {
        subscriptions: []
      };
    default:
      return state;
  }
}
