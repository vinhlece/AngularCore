import {ActionWithPayload} from '../../common/actions';
import * as plotActions from '../actions/plot.actions';
import {PlotPoint} from '../models';

export interface State {
  point: PlotPoint;
}

export const initialState: State = {
  point: null
};

export function reducer(state = initialState, action: ActionWithPayload<any>): State {
  switch (action.type) {
    case plotActions.PLOT:
      return {
        ...state,
        point: action.payload
      };
    default:
      return state;
  }
}
