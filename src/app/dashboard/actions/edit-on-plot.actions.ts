import {ActionWithPayload} from '../../common/actions';
import {DeleteOnPlotOptions, UpdateOnPlotOptions, UpdateMetricsPayload} from '../models';
import {Widget} from '../../widgets/models/index';

export const UPDATE_INSTANCE = '[Edit on Plot] Update Instance';
export const UPDATE_MEASURE = '[Edit on Plot] Update Measure';
export const UPDATE_BOTH = '[Edit on Plot] Update Both';
export const UPDATE_METRICS = '[Edit on Plot] Update Metrics';
export const CONFIRM = '[Edit on Plot] Confirm';
export const UPDATE = '[Edit on Plot] Update';
export const ADD_MEASURE = '[Edit on Plot] Add new measure';
export const CONFIRM_TITLE = '[Edit on Plot] Confirm column tile';
export const SET_TIME_RANGE = '[Edit on Plot] Change time range';
export const DROP_TIMESTAMP_DIALOG = '[Edit on Plot] Drop timestamp on bar';
export const SELECT_OPTION_DIALOG = '[Edit on Plot] select option dialog on bar';
export const DROP_TIMESTAMP = '[Edit on Plot] Drop timestamp without dialog options';

export class UpdateInstance implements ActionWithPayload<UpdateOnPlotOptions> {
  type = UPDATE_INSTANCE;

  constructor(public payload: UpdateOnPlotOptions) {
  }
}

export class UpdateMeasure implements ActionWithPayload<any> {
  type = UPDATE_MEASURE;

  constructor(public payload: any) {
  }
}

export class UpdateBoth implements ActionWithPayload<UpdateOnPlotOptions> {
  type = UPDATE_BOTH;

  constructor(public payload: UpdateOnPlotOptions) {
  }
}

export const DELETE_INSTANCE = '[Edit on Plot] Delete Instance';
export const DELETE_MEASURE = '[Edit on Plot] Delete Measure';

export class DeleteInstance implements ActionWithPayload<DeleteOnPlotOptions> {
  type = DELETE_INSTANCE;

  constructor(public payload: DeleteOnPlotOptions) {
  }
}

export class DeleteMeasure implements ActionWithPayload<DeleteOnPlotOptions> {
  type = DELETE_MEASURE;

  constructor(public payload: DeleteOnPlotOptions) {
  }
}

export class UpdateMetrics implements ActionWithPayload<UpdateMetricsPayload> {
  type = UPDATE_METRICS;

  constructor(public payload: UpdateMetricsPayload) {
  }
}

export class Confirm implements ActionWithPayload<UpdateMetricsPayload> {
  type = CONFIRM;

  constructor(public payload: UpdateMetricsPayload) {
  }
}

export class Update implements ActionWithPayload<UpdateMetricsPayload> {
  type = UPDATE;

  constructor(public payload: UpdateMetricsPayload) {
  }
}

export class AddMeasure implements ActionWithPayload<any> {
  readonly type = ADD_MEASURE;

  constructor(public payload: any) {
  }
}

export class ConfirmTitle implements ActionWithPayload<UpdateMetricsPayload> {
  type = CONFIRM_TITLE;

  constructor(public payload: UpdateMetricsPayload) {
  }
}

export class ChangeTimeRange implements ActionWithPayload<Widget> {
  type = SET_TIME_RANGE;

  constructor(public payload: Widget) {
  }
}

export class DropTimeStampDialog implements ActionWithPayload<any> {
  type = DROP_TIMESTAMP_DIALOG;

  constructor(public payload: any) {
  }
}

export class SelectOptionDialog implements ActionWithPayload<any> {
  type = SELECT_OPTION_DIALOG;

  constructor(public payload: any) {
  }
}

export class DropTimeStamp implements ActionWithPayload<any> {
  type = DROP_TIMESTAMP;

  constructor(public payload: any) {
  }
}

