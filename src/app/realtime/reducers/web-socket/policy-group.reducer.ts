import { ActionWithPayload } from '../../../common/actions';
import * as PolicyActions from '../../actions/web-socket/policy-group.actions';
import { PolicyInfo } from '../../models/index';
import * as _ from 'lodash';
import * as pollingActions from '../../actions/rest-api/polling.actions';

export interface State {
  policyInfos: PolicyInfo[];
}

export const initialState: State = {
  policyInfos: []
};

export function reducer(state = initialState, action: ActionWithPayload<any>): State {
  switch (action.type) {
    case PolicyActions.INITIALIZE_SUCCESS:
      const comparator = (a: PolicyInfo, b: PolicyInfo) => a.instance === b.instance
        && a.measure === b.measure
        && a.windowName === b.windowName
        && a.windowType === b.windowType;
      const pIs = _.unionWith(state.policyInfos, [action.payload], comparator);
      return {
        policyInfos: pIs
      };
    case pollingActions.STOP:
      return {
        policyInfos: []
      };
    default:
      return state;
  }
}
