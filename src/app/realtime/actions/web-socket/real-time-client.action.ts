import {ActionWithPayload} from '../../../common/actions/index';
import {PumpupOptions} from '../../models/index';

export const INITIALIZE = '[RealTimeClient] initialize websocket';
export const UPDATE_PUMPUP_SUCCESS = '[RealTimeClient] update pumpup success';
export const RESET_DATA = '[RealTimeClient] reset data';

export class Initialize implements ActionWithPayload<void> {
  type = INITIALIZE;
}

export class UpdatePumpupSuccess implements ActionWithPayload<PumpupOptions[]> {
  type = UPDATE_PUMPUP_SUCCESS;

  constructor(public payload: PumpupOptions[], public changeTimePreference?: boolean) {
  }
}

export class ResetData implements ActionWithPayload<void> {
  type = RESET_DATA;
}

