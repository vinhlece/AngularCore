import {ActionWithPayload} from '../../../common/actions';
import {PumpupOptions} from '../../models/index';
import * as realTimeAction from '../../actions/web-socket/real-time-client.action';
import * as _ from 'lodash';

export interface State {
  options: PumpupOptions[];
}

export const initialState: State = {
  options: []
};

export function reducer(state = initialState, action: ActionWithPayload<any>): State {
  switch (action.type) {
    case realTimeAction.UPDATE_PUMPUP_SUCCESS:
      if ((action as realTimeAction.UpdatePumpupSuccess).changeTimePreference) {
        return {
          options: action.payload
        };
      }
      const comparator = (a: PumpupOptions, b: PumpupOptions) => a.measure === b.measure &&
                                                                 _.difference(a.instances, b.instances).length === 0;
      const unionData = _.unionWith(state.options, action.payload, comparator);
      return {
        options: unionData
      };
    case realTimeAction.RESET_DATA:
      return {
        options: []
      };
    default:
      return state;
  }
}
