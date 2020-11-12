import {ActionWithPayload} from '../../common/actions';
import * as widgetsData from '../actions/widgets-data.actions';

export interface State {
  data: any;
}

export const initialState: State = {
  data: {}
};

export function reducer(state = initialState, action: ActionWithPayload<any>): State {
  switch (action.type) {
    case widgetsData.CONVERT_SUCCESS:
      return {
        ...state,
        data: action.payload
      };
    default:
      return state;
  }
}
