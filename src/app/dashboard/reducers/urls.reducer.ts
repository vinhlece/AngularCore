import {ActionWithPayload} from '../../common/actions';
import * as urlsActions from '../actions/urls.actions';
import {Url} from '../../widgets/models';

export interface State {
  url: Url;
  data: any;
  error: boolean;
}

export const initialState: State = {
  url: null,
  data: null,
  error: null
};

export function reducer(state = initialState, action: ActionWithPayload<any>): State {
  if (action.type === urlsActions.INVOKE_RESPONSE) {
    return {
      ...state,
      ...action.payload,
      error: action.error
    };
  } else if (action.type === urlsActions.INVOKE_COMPLETED_RESPONSE) {
    return {
      ...state,
      ...initialState
    };
  }
  return state;
}
