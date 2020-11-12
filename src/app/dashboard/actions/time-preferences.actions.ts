import {ZoomEvent} from '../../charts/models';
import {ActionWithPayload} from '../../common/actions';
import {PollingConfig, PredictiveSetting, TimeRange, TimeRangeSetting} from '../models';

export const LOAD = '[Time Preferences] Load Polling Config';
export const LOAD_RESPONSE = '[Time Preferences] Load Polling Config Success';
export const TRIGGER_ZOOM = '[Time Preferences] Trigger Zoom';
export const ZOOM = '[Time Preferences] Zoom';
export const RESET_ZOOM = '[Time Preferences] Reset Zoom';
export const GO_BACK = '[Time Preferences] GoBack';
export const SET_GO_BACK_TIMESTAMP = '[Time Preferences] Set Start Timestamp';
export const SET_CURRENT_TIMESTAMP = '[Time Preferences] Set Current Timestamp';
export const SET_TIME_RANGE = '[Time Preferences] Set Time Range';
export const SELECT_TIME_RANGE_SETTINGS = '[Time Preferences] Select Time Range Settings';
export const UPDATE_TIME_RANGE_SETTINGS = '[Time Preferences] Update Time Range Settings';
export const UPDATE_TIME_RANGE = '[Time Preferences] Update Time Range';
export const START_UPDATE_IN_REAL_TIME = '[Time Preferences] Start Update In Real Time';
export const STOP_UPDATE_IN_REAL_TIME = '[Time Preferences] Stop Update In Real Time';
export const SELECT_PREDICTIVE_SETTINGS = '[Time Preferences] Select Predictive Settings';
export const UPDATE_PREDICTIVE_SETTINGS = '[Time Preferences] Update Predictive Settings';

export class Load implements ActionWithPayload<PollingConfig> {
  type = LOAD;
}

export class LoadSuccess implements ActionWithPayload<PollingConfig> {
  type = LOAD_RESPONSE;

  constructor(public payload: PollingConfig) {
  }
}

export class LoadFailure implements ActionWithPayload<string> {
  type = LOAD_RESPONSE;
  error = true;
  payload: string;

  constructor(error: Error) {
    this.payload = error.message;
  }
}

export class SetGoBackTimestamp implements ActionWithPayload<number> {
  type = SET_GO_BACK_TIMESTAMP;

  constructor(public payload: number) {
  }
}

export class SetCurrentTimestamp implements ActionWithPayload<number> {
  type = SET_CURRENT_TIMESTAMP;

  constructor(public payload: number) {
  }
}

export class SetTimeRange implements ActionWithPayload<TimeRange> {
  type = SET_TIME_RANGE;

  constructor(public payload: TimeRange) {
  }
}

export class SelectTimeRangeSettings implements ActionWithPayload<TimeRangeSetting> {
  type = SELECT_TIME_RANGE_SETTINGS;

  constructor(public payload: TimeRangeSetting) {
  }
}

export class SelectPredictiveSettings implements ActionWithPayload<PredictiveSetting> {
  type = SELECT_PREDICTIVE_SETTINGS;

  constructor(public payload: PredictiveSetting) {
  }
}

export class UpdatePredictiveSettings implements ActionWithPayload<PredictiveSetting> {
  type = UPDATE_PREDICTIVE_SETTINGS;

  constructor(public payload: PredictiveSetting) {
  }
}

export class UpdateTimeRangeSettings implements ActionWithPayload<TimeRangeSetting> {
  type = UPDATE_TIME_RANGE_SETTINGS;

  constructor(public payload: TimeRangeSetting) {
  }
}

export class UpdateTimeRange implements ActionWithPayload<TimeRange> {
  type = UPDATE_TIME_RANGE;

  constructor(public payload: TimeRange) {
  }
}

export class TriggerZoom implements ActionWithPayload<ZoomEvent> {
  type = TRIGGER_ZOOM;

  constructor(public payload: ZoomEvent) {
  }
}

export class Zoom implements ActionWithPayload<ZoomEvent> {
  type = ZOOM;

  constructor(public payload: ZoomEvent) {
  }
}

export class ResetZoom implements ActionWithPayload<boolean> {
  type = RESET_ZOOM;

  constructor(public payload?: boolean) {
  }
}

export class GoBack implements ActionWithPayload<number> {
  type = GO_BACK;

  constructor(public payload: number) {
  }
}

export class StartUpdateInRealTime implements ActionWithPayload<void> {
  type = START_UPDATE_IN_REAL_TIME;
}

export class StopUpdateInRealTime implements ActionWithPayload<void> {
  type = STOP_UPDATE_IN_REAL_TIME;
}
