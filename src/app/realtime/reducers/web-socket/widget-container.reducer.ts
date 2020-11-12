import {combineReducers} from '@ngrx/store';
import {ActionWithPayload} from '../../../common/actions/index';
import * as widgetContainerActions from '../../actions/web-socket/widget-container.actions';
import {WidgetContainer} from '../../models/web-socket/widget-container';

export interface State {
  widgetContainers: WidgetContainer[];
}

export const initialState: State = {
  widgetContainers: []
};

export function widgetContainers(state = [], action: ActionWithPayload<any>): WidgetContainer[] {
  switch (action.type) {
    case widgetContainerActions.MODIFY_WIDGET_CONTAINER_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}

export function reducer(state = initialState, action: ActionWithPayload<any>): State {
  const actionReducer = combineReducers({
    widgetContainers
  });
  return actionReducer(state, action);
}
