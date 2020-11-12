import {ActionWithPayload} from '../../common/actions';
import * as connectionStatusActions from '../actions/connection-status.actions';

export interface State {
  connectionStatus: string;
}

export const initialState: State = {
  connectionStatus: null
};

export function reducer(state = initialState, action: ActionWithPayload<any>): State {
  if (action.error) {
    return state;
  }

  switch (action.type) {
    case connectionStatusActions.GET_CONNECTION_STATUS:
      return {
        ...state,
        connectionStatus: action.payload
      };
    default:
      return state;
  }
}
