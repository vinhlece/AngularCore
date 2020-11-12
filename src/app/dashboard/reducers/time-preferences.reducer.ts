import {combineReducers} from '@ngrx/store';
import {ZoomEvent} from '../../charts/models';
import {ActionWithPayload} from '../../common/actions';
import * as timePreferencesActions from '../actions/time-preferences.actions';
import {PollingConfig, TimeRange} from '../models';
import {getCurrentMoment} from '../../common/services/timeUtils';

export interface State {
  config: PollingConfig;
  currentTimestamp: number;
  goBackTimestamp: number;
  timeRange: TimeRange;
  zoom: ZoomEvent;
}

export const initialState: State = {
  config: {},
  currentTimestamp: null,
  goBackTimestamp: null,
  timeRange: null,
  zoom: {},
};

export function currentTimestamp(state = null, action: ActionWithPayload<any>): number {
  switch (action.type) {
    case timePreferencesActions.SET_CURRENT_TIMESTAMP:
      return action.payload;
    default:
      return state;
  }
}

export function goBackTimestamp(state = null, action: ActionWithPayload<any>): number {
  switch (action.type) {
    case timePreferencesActions.SET_GO_BACK_TIMESTAMP:
      return action.payload;
    default:
      return state;
  }
}

export function config(state: PollingConfig = null, action: ActionWithPayload<any>): PollingConfig {
  switch (action.type) {
    case timePreferencesActions.LOAD_RESPONSE:
      return action.payload;
    case timePreferencesActions.UPDATE_TIME_RANGE_SETTINGS:
      return {
        ...state,
        timeRangeSettings: action.payload
      };
    case timePreferencesActions.UPDATE_TIME_RANGE:
      return {
        ...state,
        timeRangeSettings: {
          ...state.timeRangeSettings,
          range: action.payload
        }
      };
    case timePreferencesActions.UPDATE_PREDICTIVE_SETTINGS:
      return {
        ...state,
        predictiveSettings: action.payload,
      };
    default:
      return state;
  }
}

export function timeRange(state = null, action: ActionWithPayload<any>): TimeRange {
  switch (action.type) {
    case timePreferencesActions.SET_TIME_RANGE:
      return action.payload;
    default:
      return state;
  }
}

export function zoom(state = null, action: ActionWithPayload<any>): ZoomEvent {
  switch (action.type) {
    case timePreferencesActions.ZOOM:
      return action.payload;
    case timePreferencesActions.RESET_ZOOM:
      return {
        ...state,
        trigger: 'rangeSelectorButton',
        timeRange: null,
        rangeSelectorButton: 'All'
      };
    default:
      return state;
  }
}

export function reducer(state = initialState, action: ActionWithPayload<any>): State {
  const actionReducer = combineReducers({
    config,
    currentTimestamp,
    goBackTimestamp,
    timeRange,
    zoom,
  });
  return actionReducer(state, action);
}
