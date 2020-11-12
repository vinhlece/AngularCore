import {combineReducers} from '@ngrx/store';
import {ActionWithPayload} from '../../common/actions';
import * as tabEditorActions from '../actions/tab-editor.actions';
import {GridMetrics} from '../models';

export interface State {
  widgetToCreate: string;
  metrics: GridMetrics;
  isShowGridLines: boolean;
}

const initialState: State = {
  widgetToCreate: null,
  metrics: {},
  isShowGridLines: false,
};

export function widgetToCreate(state = initialState.widgetToCreate, action: ActionWithPayload<any>): string {
  if (action.meta && action.meta.addToGrid && action.payload && action.payload.entities) {
    return action.payload.result[0];
  }
  if (action.type === tabEditorActions.CREATE_WIDGET_SUCCESS) {
    return null;
  }
  return state;
}

export function metrics(state = initialState.metrics, action: ActionWithPayload<any>): GridMetrics {
  if (action.type === tabEditorActions.UPDATE_METRICS) {
    return action.payload;
  }
  return state;
}

export function isShowGridLines(state = initialState.isShowGridLines, action: ActionWithPayload<any>): boolean {
  if (action.type === tabEditorActions.TOGGLE_GRID_LINES) {
    return !state;
  }
}

export function reducer(state = initialState, action: any): State {
  const actionReducer = combineReducers({
    widgetToCreate,
    metrics,
    isShowGridLines,
  });
  return actionReducer(state, action);
}
