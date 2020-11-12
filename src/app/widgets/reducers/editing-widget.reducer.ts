import {denormalize} from 'normalizr';
import {widgetSchema} from '../../common/schemas';
import * as fromEditingWidget from '../actions/editing-widget.actions';
import {Widget} from '../models';

export interface State {
  widget: Widget;
}

const initialState: State = {
  widget: null,
};

export function reducer(state = initialState, action: any): State {
  if (action.meta && action.meta.edit && action.payload && action.payload.entities) {
    const widget = denormalize(action.payload.result, [widgetSchema], action.payload.entities)[0];
    return {
      ...state,
      widget
    };
  }

  switch (action.type) {
    case fromEditingWidget.EDIT:
      return {
        ...state,
        widget: action.widget
      };
    default:
      return state;
  }
}
