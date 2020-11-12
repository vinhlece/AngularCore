import {combineReducers} from '@ngrx/store';
import {ActionWithPayload} from '../../../common/actions';
import * as realTimeDataActions from '../../actions/rest-api/real-time-data.actions';
import {Storage} from '../../models';
import {Collection} from '../../models/collection';
import {Event} from '../../models/event';
import * as streamsActions from '../../actions/rest-api/streams.actions';

export interface State {
  mainStorage: {[window: string]: Storage};
  eventStorage: Storage;
  predictiveStorage: {[window: string]: Storage};
  policyGroupStorage: {[window: string]: Storage};
}

function createStorage(): {[window: string]: Storage} {
  return {}; // new Table();
}

export const initialState: State = {
  mainStorage: createStorage(),
  eventStorage: new Event(),
  predictiveStorage: createStorage(),
  policyGroupStorage: createStorage(),
};

export function mainStorage(state = initialState.mainStorage, action: ActionWithPayload<any>): any {
  switch (action.type) {
    case realTimeDataActions.SET_MAIN_STORAGE:
      return {...state, ...action.payload};
    case realTimeDataActions.CLEAR_DATA:
      return createStorage();
    default:
      return state;
  }
}

export function eventStorage(state = initialState.eventStorage, action: ActionWithPayload<any>): Storage {
  switch (action.type) {
    case realTimeDataActions.SET_EVENT_STORAGE:
      return action.payload;
    case realTimeDataActions.CLEAR_DATA:
      return new Collection();
    default:
      return state;
  }
}

export function predictiveStorage(state = initialState.predictiveStorage, action: ActionWithPayload<any>): any {
  switch (action.type) {
    case realTimeDataActions.SET_PREDICTIVE_STORAGE:
      return {...state, ...action.payload};
    case realTimeDataActions.CLEAR_DATA:
      return createStorage();
    default:
      return state;
  }
}

export function policyGroupStorage(state = initialState.policyGroupStorage, action: ActionWithPayload<any>): any {
  switch (action.type) {
    case realTimeDataActions.SET_POLICY_GROUP_STORAGE:
      return {...state, ...action.payload};
    case streamsActions.RESET_PUMP_UP_STREAM:
      return createStorage();
    default:
      return state;
  }
}

export function reducer(state = initialState, action: ActionWithPayload<any>): State {
  const actionReducer = combineReducers({
    mainStorage,
    eventStorage,
    predictiveStorage,
    policyGroupStorage
  });
  return actionReducer(state, action);
}
