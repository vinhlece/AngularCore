import {ActionWithPayload} from '../../../common/actions';
import {RealtimeData, Storage, Stream, Topic} from '../../models';

export const START = '[Polling] Start';
export const STOP = '[Polling] Stop';
export const PAUSE = '[Polling] Pause';
export const RESUME = '[Polling] Resume';
export const GENERATE = '[Polling] Generate';
export const PUMP_UP = '[Polling] Pump Up';
export const GO_BACK = '[Polling] go back timestamp';
export const LOAD_SUCCESS = '[Polling] Load Success';
export const LOAD_KPI_SUCCESS = '[Polling] Load policy group Success';

export class Start implements ActionWithPayload<void> {
  readonly type = START;
}

export class Stop implements ActionWithPayload<void> {
  readonly type = STOP;
}

export class Pause implements ActionWithPayload<void> {
  readonly type = PAUSE;
}

export class Resume implements ActionWithPayload<void> {
  readonly type = RESUME;
}

export class Generate implements ActionWithPayload<Stream[]> {
  readonly type = GENERATE;

  constructor(public payload: Stream[], public meta?: any, public measures?: any) {
  }
}

export class PumpUp implements ActionWithPayload<boolean> {
  readonly type = PUMP_UP;

  constructor(public packageName?: string) {
  }
}

export class LoadSuccess implements ActionWithPayload<RealtimeData[]> {
  readonly type = LOAD_SUCCESS;

  constructor(public payload: RealtimeData[]) {
  }
}

export class LoadKpiSuccess implements ActionWithPayload<RealtimeData[]> {
  readonly type = LOAD_KPI_SUCCESS;

  constructor(public payload: RealtimeData[]) {
  }
}

export class GoBack implements ActionWithPayload<void> {
  readonly type = GO_BACK;
}
