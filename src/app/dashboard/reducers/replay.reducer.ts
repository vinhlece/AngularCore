import {ActionWithPayload} from '../../common/actions';
import * as replayActions from '../actions/replay.actions';
import {ReplayStatus} from '../models/enums';

export interface State {
  status: ReplayStatus;
}

const initialState: State = {
  status: ReplayStatus.STOP,
};

export function reducer(state = initialState, action: ActionWithPayload<any>): State {
  switch (action.type) {
    case replayActions.TOGGLE:
      return {
        ...state,
        status: state.status === ReplayStatus.RESUME ? ReplayStatus.PAUSE : ReplayStatus.RESUME
      };
    case replayActions.STOP:
      return {
        ...state,
        status: ReplayStatus.STOP
      };
    default:
      return state;
  }
}
