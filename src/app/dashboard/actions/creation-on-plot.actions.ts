import {ActionWithPayload} from '../../common/actions';
import {CreationSideEffects} from '../models';

export const CREATE_TIME_LINE = '[Creation on Plot] Create Time Line';
export const CREATE_BILLBOARD = '[Creation on Plot] Create Billboard';
export const CREATE_LIQUID_FILL_GAUGE = '[Creation on Plot] Create Liquid Fill Gauge';
export const CREATE_TABLE = '[Creation on Plot] Create Table';
export const CREATE_SHIFT_TREND_DIFF = '[Creation on Plot] Create Shift Trend Diff';
export const CREATE_DAY_TREND_DIFF = '[Creation on Plot] Create Day Trend Diff';
export const CREATE_WEEK_TREND_DIFF = '[Creation on Plot] Create Week Trend Diff';

export class CreateTimeLine implements ActionWithPayload<CreationSideEffects> {
  type = CREATE_TIME_LINE;

  constructor(public payload: CreationSideEffects) {
  }
}

export class CreateBillboard implements ActionWithPayload<CreationSideEffects> {
  type = CREATE_BILLBOARD;

  constructor(public payload: CreationSideEffects) {
  }
}

export class CreateLiquidFillGauge implements ActionWithPayload<CreationSideEffects> {
  type = CREATE_LIQUID_FILL_GAUGE;

  constructor(public payload: CreationSideEffects) {
  }
}

export class CreateTable implements ActionWithPayload<CreationSideEffects> {
  type = CREATE_TABLE;

  constructor(public payload: CreationSideEffects) {
  }
}

export class CreateShiftTrendDiff implements ActionWithPayload<void> {
  readonly type = CREATE_SHIFT_TREND_DIFF;
}

export class CreateDayTrendDiff implements ActionWithPayload<void> {
  readonly type = CREATE_DAY_TREND_DIFF;
}

export class CreateWeekTrendDiff implements ActionWithPayload<void> {
  readonly type = CREATE_WEEK_TREND_DIFF;
}
