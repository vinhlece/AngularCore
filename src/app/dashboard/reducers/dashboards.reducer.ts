import * as _ from 'lodash';
import {ActionWithPayload} from '../../common/actions';
import * as dashboardActions from '../actions/dashboards.action';
import {LaunchType} from '../models/enums';
import {Tab} from '../models/index';
import * as tabActions from '../actions/tabs.actions';

export interface State {
  ids: string[];
  launchMode: LaunchType;
  tabs: Tab[];
}

export const initialState: State = {
  ids: [],
  launchMode: LaunchType.INTEGRATED,
  tabs: []
};

export function reducer(state = initialState, action: ActionWithPayload<any>): State {
  if (action.error) {
    return state;
  }

  switch (action.type) {
    case dashboardActions.LOAD_ALL_RESPONSE:
      return {
        ...state,
        ids: action.payload.result
      };
    case dashboardActions.LOAD_RESPONSE:
    case dashboardActions.ADD_RESPONSE:
      return {
        ...state,
        ids: _.union(state.ids, action.payload.result)
      };
    case dashboardActions.LAUNCH_INTEGRATED:
      return {
        ...state,
        launchMode: LaunchType.INTEGRATED
      };
    case dashboardActions.LAUNCH_STANDALONE:
      return {
        ...state,
        launchMode: LaunchType.STANDALONE
      };
    case tabActions.LOAD_RESPONSE:
      return {
        ...state,
        tabs: action.payload
      };
    case tabActions.COPY_RESPONSE:
      const tab = action.payload as Tab;
      return {
        ...state,
        tabs: [...state.tabs, tab]
      }
    default:
      return state;
  }
}
