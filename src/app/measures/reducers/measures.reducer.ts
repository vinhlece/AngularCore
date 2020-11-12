import {ActionWithPayload} from '../../common/actions';
import {ApiWidgetsResponse} from '../../widgets/actions/widgets.actions';
import * as measuresActions from '../actions/measures.actions';

export interface State {
  ids: string[];
}

const initialState: State = {
  ids: []
};

export function reducer(state = initialState, action: ActionWithPayload<ApiWidgetsResponse>): State {
  if (action.error) {
    return state;
  }

  switch (action.type) {
    case measuresActions.LOAD_ALL_RESPONSE:
      return {
        ids: action.payload.result
      };
    default:
      return state;
  }
}
