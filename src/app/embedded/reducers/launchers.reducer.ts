import {Dimension} from '../../charts/models';
import {ActionWithPayload} from '../../common/actions';
import * as embeddedActions from '../actions/embedded.actions';

export interface State {
  sizes: { [id: string]: Dimension };
}

export const initialState: State = {
  sizes: {}
};

export function reducer(state = initialState, action: ActionWithPayload<any>): State {
  switch (action.type) {
    case embeddedActions.SET_LAUNCHER_SIZE:
      return {
        ...state,
        sizes: {
          ...state.sizes,
          [action.payload.id]: action.payload.size
        }
      };
    default:
      return state;
  }
}
