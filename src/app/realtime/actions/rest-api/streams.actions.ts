import {ActionWithPayload} from '../../../common/actions';
import {Stream} from '../../models';

export const SET_PUMP_UP_STREAM = '[Streams] Set Pump Up Stream';
export const UPDATE_PUMP_UP_STREAMS = '[Streams] Update Pump Up Streams';
export const RESET_PUMP_UP_STREAM = '[Streams] Reset Pump Up Stream';
export const SET_GO_BACK_PUMP_UP_STREAM = '[Streams] Set Go Back Pump Up Stream';
export const RESET_GO_BACK_PUMP_UP_STREAM = '[Streams] Reset Go Back Pump Up Stream';

export class SetPumpUpStream implements ActionWithPayload<Stream[]> {
  readonly type = SET_PUMP_UP_STREAM;

  constructor(public payload: Stream[], public currentStream?: Stream[]) {
  }
}

export class UpdatePumpUpStreams implements ActionWithPayload<Stream[]> {
  readonly type = UPDATE_PUMP_UP_STREAMS;

  constructor(public payload: Stream[]) {
  }
}

export class ResetPumpUpStream implements ActionWithPayload<void> {
  readonly type = RESET_PUMP_UP_STREAM;
}

export class SetGoBackPumpUpStream implements ActionWithPayload<Stream[]> {
  readonly type = SET_GO_BACK_PUMP_UP_STREAM;

  constructor(public payload: Stream[]) {
  }
}

export class ResetGoBackPumpUpStream implements ActionWithPayload<void> {
  readonly type = RESET_GO_BACK_PUMP_UP_STREAM;
}
