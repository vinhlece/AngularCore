import {combineReducers} from '@ngrx/store';
import * as _ from 'lodash';
import {ActionWithPayload} from '../common/actions';
import merge from '../common/utils/merge';
import {createMeasureId} from '../common/schemas/utils';
import * as dashboardsActions from '../dashboard/actions/dashboards.action';
import * as tabsActions from '../dashboard/actions/tabs.actions';
import {Measure} from '../measures/models';
import * as formulaMeasureActions from '../measures/actions/formula-measure.actions';
import * as instancesActions from '../widgets/actions/instances.actions';
import * as measuresActions from '../measures/actions/measures.actions';
import * as packageActions from '../measures/actions/packages.actions';
import * as widgetsActions from '../widgets/actions/widgets.actions';
import * as paletteActions from '../user/actions/palette.actions';
import * as userActions from '../user/actions/user.actions';

export interface State {
  widgets: object;
  dashboards: object;
  tabs: object;
  placeholders: object;
  packages: object;
  measures: object;
  instances: object;
  isBootstrapLoaded: boolean;
  palettes: object;
  users: object;
}

export const initialState: State = {
  widgets: {},
  dashboards: {},
  tabs: {},
  placeholders: {},
  packages: {},
  measures: {},
  instances: [],
  isBootstrapLoaded: false,
  palettes: {},
  users: {}
};

export function widgets(state = {}, action: ActionWithPayload<any>): object {
  switch (action.type) {
    case widgetsActions.DELETE_RESPONSE:
      return {
        ...state,
        [action.payload]: {
          ...state[action.payload],
          status: 'deleted'
        }
      };
    default:
      return state;
  }
}

export function dashboards(state = {}, action: ActionWithPayload<any>): object {
  switch (action.type) {
    case dashboardsActions.DELETE_RESPONSE:
      return {
        ...state,
        [action.payload]: {
          ...state[action.payload],
          status: 'deleted'
        }
      };
    case tabsActions.ADD_RESPONSE:
      const tabId = action.payload.result[0];
      const dashboardId = action.payload.entities.tabs[tabId].dashboardId;
      return {
        ...state,
        [dashboardId]: {
          ...state[dashboardId],
          tabs: [...state[dashboardId].tabs, ...action.payload.result]
        }
      };
    default:
      return state;
  }
}

export function tabs(state = {}, action: ActionWithPayload<any>): object {
  switch (action.type) {
    case tabsActions.DELETE_RESPONSE:
      return {
        ...state,
        [action.payload]: {
          ...state[action.payload],
          status: 'deleted'
        }
      };
    default:
      return state;
  }
}

export function placeholders(state = {}, action: ActionWithPayload<any>): object {
  return state;
}

export function packages(state = {}, action: ActionWithPayload<any>): object {
  switch (action.type) {
    case formulaMeasureActions.LOAD_ALL_RESPONSE:
    case measuresActions.FIND_BY_NAME_RESPONSE:
      const measuresEntities = action.payload.entities.measures;

      if (!measuresEntities) {
        return state;
      }

      let newState = state;
      Object.values(measuresEntities).forEach((measureEntity: Measure) => {
        const dataType = measureEntity.dataType;
        newState = {
          ...newState,
          [dataType]: {
            ...newState[dataType],
            measures: _.union(newState[dataType].measures, [createMeasureId(dataType, measureEntity.name)])
          }
        };
      });
      return newState;
    case formulaMeasureActions.ADD_RESPONSE:
      const measureName = action.payload.result[0];
      const measure = action.payload.entities.measures[measureName];
      return {
        ...state,
        [measure.dataType]: {
          ...state[measure.dataType],
          measures: [...state[measure.dataType].measures, createMeasureId(measure.dataType, measure.name)]
        }
      };
    default:
      return state;
  }
}

export function measures(state = {}, action: ActionWithPayload<any>): object {
  return state;
}

export function instances(state = {}, action: ActionWithPayload<any>): object {
  switch (action.type) {
    case instancesActions.UPDATE:
      const data = Object.keys(action.payload).reduce((acc, item) => {
        if (acc[item]) {
          acc[item] = _.union(acc[item], action.payload[item]);
        } else {
          acc[item] = action.payload[item];
        }
        return acc;
      }, {...state});
      return data;
    default:
      return state;
  }
}

export function isBootstrapLoaded(state = false, action: ActionWithPayload<any>): boolean {
  switch (action.type) {
    case packageActions.LOAD_ALL:
      return false;
    case formulaMeasureActions.LOAD_ALL_RESPONSE:
      return true;
    default:
      return state;
  }
}

export function palettes(state = {}, action: ActionWithPayload<any>): object {
  switch (action.type) {
    case paletteActions.DELETE_PALETTE_RESPONSE:
      const result = {
        ...state,
        [action.payload]: {
          ...state[action.payload],
          status: 'deleted'
        }
      };
      return result;
    default:
      return state;
  }
}

export function users(state = {}, action: ActionWithPayload<any>): object {
  return state;
}

export function reducer(state = initialState, action: ActionWithPayload<any>): State {
  if (action.error) {
    return state;
  }

  let newState = state;

  if (action.payload && action.payload.entities) {
    newState = merge(newState, action.payload.entities);
  }

  const actionReducer = combineReducers({
    widgets,
    dashboards,
    tabs,
    placeholders,
    packages,
    measures,
    instances,
    isBootstrapLoaded,
    palettes,
    users
  });

  return actionReducer(newState, action);
}

