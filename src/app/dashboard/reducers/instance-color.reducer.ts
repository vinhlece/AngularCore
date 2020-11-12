import * as _ from 'lodash';
import {ActionWithPayload} from '../../common/actions';
import * as dashboardActions from '../actions/dashboards.action';
import {LaunchType} from '../models/enums';
import {InstanceColor} from '../../common/models/index';
import * as InstanceColorActions from '../actions/instance-color.actions';

export interface State {
  instanceColors: InstanceColor[];
}

export const initialState: State = {
  instanceColors: []
};

export function reducer(state = initialState, action: ActionWithPayload<any>): State {
  if (action.error) {
    return state;
  }

  switch (action.type) {
    case InstanceColorActions.GET_RESPONSE:
    case InstanceColorActions.UPDATE_RESPONSE:
    case InstanceColorActions.DELETE_RESPONSE:
    case InstanceColorActions.EDIT_RESPONSE:
      return {
        instanceColors: action.payload
      };
    default:
      return state;
  }
}
