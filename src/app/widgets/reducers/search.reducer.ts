import {combineReducers} from '@ngrx/store';
import {ActionWithPayload} from '../../common/actions';
import * as instancesActions from '../actions/instances.actions';
import * as measuresActions from '../../measures/actions/measures.actions';
import * as searchActions from '../actions/search.actions';
import * as widgetsActions from '../actions/widgets.actions';

export interface State {
  widgets: string[];
  measures: string[];
  instances: string [];
  searchType: string;
}

const initialState: State = {
  widgets: [],
  measures: [],
  instances: [],
  searchType: 'all'
};

export function widgets(state = [], action: ActionWithPayload<any>) {
  if (action.type === widgetsActions.SEARCH_RESPONSE) {
    return action.payload.result;
  }
  return state;
}

export function measures(state = [], action: ActionWithPayload<any>) {
  if (action.type === measuresActions.FIND_BY_NAME_RESPONSE) {
    return action.payload.result;
  }
  return state;
}

export function instances(state = [], action: ActionWithPayload<any>) {
  if (action.type === instancesActions.FIND_BY_NAME_RESPONSE) {
    return action.payload;
  }
  return state;
}

export function searchType(state = 'all', action: ActionWithPayload<string>) {
  if (action.type === searchActions.SET_SEARCH_TYPE) {
    return action.payload;
  }
  return state;
}

export function reducer(state = initialState, action: ActionWithPayload<any>) {
  if (action.error) {
    return state;
  }

  const actionReducer = combineReducers({
    widgets,
    instances,
    measures,
    searchType
  });

  return actionReducer(state, action);
}
