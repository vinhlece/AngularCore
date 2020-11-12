import {ActionWithPayload} from '../../common/actions';
import {MeasureSpecification} from '../models/index';

export const LOAD_ALL = '[Event Stream] Load All';
export const LOAD_ALL_RESPONSE = '[Event Stream] Load All Response';
export const LOAD_ALL_STREAMS = '[Event Stream] Load All Streams';
export const ADD = '[Event Stream] Add';
export const ADD_MEASURE = '[Event Stream] Add Measure';
export const ADD_RESPONSE = '[Event Stream] Add Response';
export const UPDATE_STREAM = '[Event Stream] Update Stream';
export const ERROR = '[Event Stream] Error';
export const FAILED_RESPONSE = '[Event Stream] failed response';

export class LoadAll implements ActionWithPayload<string> {
  readonly type = LOAD_ALL;

  constructor(public payload: string) {
  }
}

export class LoadAllSuccess implements ActionWithPayload<any> {
  readonly type = LOAD_ALL_RESPONSE;
  payload: any;
  eventSource: any;

  constructor(streams: any, eventSource: string) {
    this.payload = streams;
    this.eventSource = eventSource;
  }
}

export class LoadAllStreams implements ActionWithPayload<any> {
  readonly type = LOAD_ALL_STREAMS;
  payload: any;
  eventSource: any;

  constructor(streams: any, eventSource: string) {
    this.payload = streams;
    this.eventSource = eventSource;
  }
}

export class Add implements ActionWithPayload<string[]> {
  readonly type = ADD;

  constructor(public payload: string[], public measure: MeasureSpecification) {
  }
}

export class AddMeasure implements ActionWithPayload<string> {
  readonly type = ADD_MEASURE;

  constructor(public payload: string, public measure: MeasureSpecification) {
  }
}

export class Update implements ActionWithPayload<any> {
  readonly type = UPDATE_STREAM;

  constructor(public payload: any) {
  }
}

export class AddSuccess implements ActionWithPayload<any> {
  readonly type = ADD_RESPONSE;
  payload: any;

  constructor(measure: any) {
    this.payload = measure;
  }
}

export class ActionFailure implements ActionWithPayload<string> {
  readonly type = ERROR;
  error = true;
  payload: string;

  constructor(error: Error, public source: string) {
    this.payload = error.message;
  }
}

export class FailureResponse implements ActionWithPayload<string> {
  readonly type = FAILED_RESPONSE;
  error = true;
  payload: string;

  constructor(error: Error) {
    this.payload = error.message;
  }
}
