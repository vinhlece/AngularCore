import {normalize} from 'normalizr';
import {ActionWithPayload} from '../../common/actions';
import {placeholderSchema} from '../../common/schemas';
import {Placeholder} from '../models';
import {LogLevel} from '../../config/app.config';

export const LOAD = '[Placeholders] Load';
export const LOAD_RESPONSE = '[Placeholders] Load Response';
export const SET = '[Placeholders] Set';
export const RELEASE_PLACEHOLDERS = '[Placeholders] Release Placeholders';
export const MAXIMIZE = '[Placeholders] Maximize';
export const MINIMIZE = '[Placeholders] Minimize';
export const FOCUS = '[Placeholders] Focus';
export const BLUR = '[Placeholders] Blur';
export const SHOW_LATEST = '[Placeholders] Show Latest';
export const SHOW_HISTORICAL = '[Placeholders] Show Historical';
export  const SHOW_HISTORICALS = '[Placeholder] Show List Histories';
export const SHOW_TIMESTAMP = '[Placeholders] Show Timestamp';
export const CHANGE_CHART_TYPE = '[Placeholders] Change Chart Type';
export const SET_REAL_TIME_MODE = '[Placeholders] Set real time mode';
export const SET_LOGGING_MODE = '[Placeholders] Set logging mode mode';
export const SHOW_LEGEND = '[Placeholders] Change Show Legend'
export const PAUSE_LINE_CHART = '[Placeholders] Start Pause Line Chart'

export interface ApiPlaceholderResponse {
  entities: {
    placeholders?: object
  };
  result: number[];
}

export class Load implements ActionWithPayload<string> {
  readonly type = LOAD;

  constructor(public payload: string) {
  }
}

export class LoadSuccess implements ActionWithPayload<ApiPlaceholderResponse> {
  readonly type = LOAD_RESPONSE;
  payload: ApiPlaceholderResponse;

  constructor(placeholder: Placeholder) {
    this.payload = normalize([placeholder], [placeholderSchema]);
  }
}

export class LoadFailure implements ActionWithPayload<string> {
  readonly type = LOAD_RESPONSE;
  error = true;
  payload: string;

  constructor(error: Error) {
    this.payload = error.message;
  }
}

export class Set implements ActionWithPayload<Placeholder[]> {
  readonly type = SET;

  constructor(public payload: Placeholder[]) {
  }
}

export class ReleasePlaceholders implements ActionWithPayload<Placeholder[]> {
  readonly type = RELEASE_PLACEHOLDERS;
}

export const DELETE = '[Placeholders] Delete';

export class Delete implements ActionWithPayload<string> {
  readonly type = DELETE;

  constructor(public payload: string) {
  }
}

export class Maximize implements ActionWithPayload<string> {
  readonly type = MAXIMIZE;

  constructor(public payload: string) {
  }
}

export class Minimize implements ActionWithPayload<string> {
  readonly type = MINIMIZE;

  constructor(public payload: string) {
  }
}

export class Focus implements ActionWithPayload<string> {
  readonly type = FOCUS;

  constructor(public payload: string) {
  }
}

export class Blur implements ActionWithPayload<string> {
  readonly type = BLUR;

  constructor(public payload: string) {
  }
}

export class ShowLatest implements ActionWithPayload<string> {
  readonly type = SHOW_LATEST;

  constructor(public payload: string) {
  }
}

export class ShowHistorical implements ActionWithPayload<string> {
  readonly type = SHOW_HISTORICAL;

  constructor(public payload: string) {
  }
}

export class ShowHistoricals implements ActionWithPayload<string[]> {
  readonly type = SHOW_HISTORICALS;
  constructor(public payload: string[]) {
  }
}

export class ShowLegends implements ActionWithPayload<{placeholderId: string, isShow: boolean}> {
  readonly type = SHOW_LEGEND;
  constructor(public payload: {placeholderId: string, isShow: boolean}) {
  }
}

export class StartPauseLineChart implements ActionWithPayload<{placeholderId: string, isPause: boolean}> {
  readonly type = PAUSE_LINE_CHART;
  constructor(public payload: {placeholderId: string, isPause: boolean}) {
  }
}

export class ChangeChartType implements ActionWithPayload<{placeholderId: string, chartType: string}> {
  readonly type = CHANGE_CHART_TYPE;

  constructor(public payload: {placeholderId: string, chartType: string}) {
  }
}

export class SetRealTimeMode implements ActionWithPayload<string> {
  readonly type = SET_REAL_TIME_MODE;

  constructor(public payload: string) {
  }
}

export class ShowTimestamp implements ActionWithPayload<string> {
  readonly type = SHOW_TIMESTAMP;

  constructor(public payload: string) {
  }
}

export class SetLoggingMode implements ActionWithPayload<LogLevel> {
  readonly type = SET_LOGGING_MODE;

  constructor(public payload: LogLevel) {
  }
}
