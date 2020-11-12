import {ActionWithPayload} from '../../common/actions/index';
import * as tabsActions from '../actions/tabs.actions';

export interface State {
  globalFilters: string[];
}

const initialState: State = {
  globalFilters: [],
};

export function reducer(state = initialState, action: ActionWithPayload<any>): State {
  switch (action.type) {
    case tabsActions.GLOBAL_FILTERS:
      return {
        globalFilters: action.payload
      };
    default:
      return state;
  }
}
