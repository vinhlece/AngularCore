import * as _ from 'lodash';
import {ActionWithPayload} from '../../common/actions';
import * as widgetsActions from '../actions/widgets.actions';
import {ApiWidgetsResponse} from '../actions/widgets.actions';

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
    case widgetsActions.LOAD_ALL_RESPONSE:
      return {
        ids: action.payload.result
      };
    case widgetsActions.LOAD_RESPONSE:
    case widgetsActions.ADD_RESPONSE:
    case widgetsActions.SEARCH_RESPONSE:
      return {
        ids: _.union(state.ids, action.payload.result)
      };
    default:
      return state;
  }
}
