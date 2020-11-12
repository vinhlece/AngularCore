import {combineReducers} from '@ngrx/store';
import * as _ from 'lodash';
import {ActionWithPayload} from '../../common/actions';
import * as placeholdersActions from '../actions/placeholders.actions';
import {Placeholder} from '../models';
import {DisplayMode, PlaceholderSize} from '../models/enums';
import {isNullOrUndefined} from 'util';
import {ajaxPost} from 'rxjs/internal-compatibility';

export interface State {
  placeholders: Placeholder[];
  sizes: { [placeholderId: string]: PlaceholderSize };
  maximumPlaceholderId: string;
  focus: { [placeholderId: string]: boolean };
  displayModes: { [placeholderId: string]: DisplayMode };
  charts: { [placeholderId: string]: string };
  realTimeMode: { [widgetId: string]: boolean };
  changeLegend: {[placeholderId: string]: boolean};
  pauseLineChart: {[placeholderId: string]: boolean};
}

const initialState: State = {
  placeholders: [],
  sizes: {},
  maximumPlaceholderId: null,
  focus: {},
  displayModes: {},
  charts: {},
  realTimeMode: {},
  changeLegend: {},
  pauseLineChart: {}
};

export function placeholders(state = [], action: ActionWithPayload<any>): Placeholder[] {
  switch (action.type) {
    case placeholdersActions.SET:
      // Old placeholder will be replaced with the new one in payload
      return _.unionBy(action.payload, state, 'id');
    case placeholdersActions.DELETE:
      const idx = state.findIndex((placeholder: Placeholder) => placeholder.id === action.payload);
      return [
        ...state.slice(0, idx),
        ...state.slice(idx + 1, state.length)
      ];
    default:
      return state;
  }
}

export function sizes(state = {}, action: ActionWithPayload<string>): { [placeholderId: string]: PlaceholderSize } {
  switch (action.type) {
    case placeholdersActions.MAXIMIZE:
      return {
        ...state,
        [action.payload]: PlaceholderSize.MAXIMUM
      };
    case placeholdersActions.MINIMIZE:
      return {
        ...state,
        [action.payload]: PlaceholderSize.MINIMUM
      };
    default:
      return state;
  }
}

export function maximumPlaceholderId(state = null, action: ActionWithPayload<string>): string {
  switch (action.type) {
    case placeholdersActions.MAXIMIZE:
      return action.payload;
    case placeholdersActions.MINIMIZE:
      return null;
    default:
      return state;
  }
}

export function focus(state = {}, action: ActionWithPayload<any>): { [placeholderId: string]: boolean } {
  switch (action.type) {
    case placeholdersActions.FOCUS:
      return {
        ...state,
        [action.payload]: true
      };
    case placeholdersActions.BLUR:
      return {
        ...state,
        [action.payload]: false
      };
    default:
      return state;
  }
}

export function displayModes(state = {}, action: ActionWithPayload<any>): { [placeholderId: string]: DisplayMode } {
  switch (action.type) {
    case placeholdersActions.SHOW_LATEST:
      return {
        ...state,
        [action.payload]: DisplayMode.Latest
      };
    case placeholdersActions.SHOW_HISTORICAL:
      return {
        ...state,
        [action.payload]: DisplayMode.Historical
      };
    case placeholdersActions.SHOW_HISTORICALS:
      return action.payload.reduce((acc, item) => {
        acc[item] = DisplayMode.Historical;
        return acc;
      }, {...state});
    case placeholdersActions.SHOW_TIMESTAMP:
      return {
        ...state,
        [action.payload]: DisplayMode.Timestamp
      };
    default:
      return state;
  }
}

export function changeLegend(state = {}, action: ActionWithPayload<any>): {[placeholderId: string]: boolean} {
  switch (action.type) {
    case placeholdersActions.SHOW_LEGEND:
      return {
        ...state,
        [action.payload.placeholderId]: action.payload.isShow
      };
    default:
      return state;
  }
}

export function pauseLineChart(state = {}, action: ActionWithPayload<any>): {[placeholderId: string]: boolean} {
  switch (action.type) {
    case placeholdersActions.PAUSE_LINE_CHART:
      return {
        ...state,
        [action.payload.placeholderId]: action.payload.isPause
      };
    default:
      return state;
  }
}

export function realTimeMode(state = {}, action: ActionWithPayload<any>): { [widgetId: string]: boolean } {
  switch (action.type) {
    case placeholdersActions.SET_REAL_TIME_MODE:
      const value = isNullOrUndefined(state[action.payload]) ? false : !state[action.payload];
      return {
        ...state,
        [action.payload]: value
      };
    default:
      return state;
  }
}

export function charts(state = {}, action: ActionWithPayload<any>): { [placeholderId: string]: string } {
  switch (action.type) {
    case placeholdersActions.CHANGE_CHART_TYPE:
      return {
        ...state,
        [action.payload.placeholderId]: action.payload.chartType
      };
    default:
      return state;
  }
}

export function reducer(state = initialState, action: ActionWithPayload<any>): State {
  if (action.type === placeholdersActions.RELEASE_PLACEHOLDERS) {
    return initialState;
  }

  const actionReducer = combineReducers({
    placeholders,
    sizes,
    maximumPlaceholderId,
    focus,
    displayModes,
    charts,
    realTimeMode,
    changeLegend,
    pauseLineChart
  });

  return actionReducer(state, action);
}
