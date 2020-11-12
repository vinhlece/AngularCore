import {ZoomEvent} from '../../charts/models';
import {ActionWithPayload} from '../../common/actions';
import * as callTimeLineActions from '../actions/call-time-line.actions';

export interface State {
  zoom: ZoomEvent;
}

const initialState: State = {
  zoom: {}
};

export function reducer(state = initialState, action: ActionWithPayload<any>): State {
  switch (action.type) {
    case callTimeLineActions.ZOOM:
      return {
        ...state,
        zoom: action.payload
      };
    case callTimeLineActions.RESET_ZOOM:
      return {
        ...state,
        zoom: initialState.zoom
      };
    default:
      return state;
  }
}
