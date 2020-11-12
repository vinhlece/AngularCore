import {ActionWithPayload} from '../../common/actions';
import * as timeExplorerActions from '../actions/time-explorer.actions';

export interface State {
  opened: boolean;
}

const initialState: State = {
  opened: false
};

export function reducer(state = initialState, action: ActionWithPayload<any>): State {
  switch (action.type) {
    case timeExplorerActions.OPEN:
      return {
        ...state,
        opened: true
      };
    case timeExplorerActions.CLOSE:
      return {
        ...state,
        opened: false
      };
    default:
      return state;
  }
}
