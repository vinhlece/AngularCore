import {normalize} from 'normalizr';
import {ActionWithPayload} from '../../common/actions';
import {measureSchema} from '../../common/schemas';
import {Measure} from '../models';
import {ApiMeasuresResponse} from './formula-measure.actions';

export const ADD = '[Measures] Add';
export const ADD_RESPONSE = '[Measures] Add Response';
export const DELETE = '[Measures] Delete';
export const DELETE_RESPONSE = '[Measures] Delete Response';
export const LOAD_ALL = '[Measures] Load All';
export const LOAD_ALL_RESPONSE = '[Measures] Load All Response';
export const FIND_BY_NAME = '[Measures] Find by Name';
export const FIND_BY_NAME_RESPONSE = '[Measures] Find by Name Response';
export const ERROR = '[Measures] Error';

export class FindByName implements ActionWithPayload<string> {
  readonly type = FIND_BY_NAME;

  constructor(public payload: string) {
  }
}

export class FindByNameSuccess implements ActionWithPayload<ApiMeasuresResponse> {
  readonly type = FIND_BY_NAME_RESPONSE;
  payload: ApiMeasuresResponse;

  constructor(measures: Measure[]) {
    this.payload = normalize(measures, [measureSchema]);
  }
}

export class Add implements ActionWithPayload<Measure> {
  readonly type = ADD;
  payload: Measure;

  constructor(measure: Measure) {
    this.payload = measure;
  }
}

export class AddSuccess implements ActionWithPayload<ApiMeasuresResponse> {
  readonly type = ADD_RESPONSE;
  payload: ApiMeasuresResponse;

  constructor(measure: Measure) {
    this.payload = normalize([measure], [measureSchema]);
  }
}

export class Delete implements ActionWithPayload<string> {
  readonly type = DELETE;
  payload: string;

  constructor(measureID: string) {
    this.payload = measureID;
  }
}

export class DeleteSuccess implements ActionWithPayload<Measure> {
  readonly type = DELETE_RESPONSE;
  payload: Measure;

  constructor(measure: Measure) {
    this.payload = measure;
  }
}

export class LoadAll implements ActionWithPayload<void> {
  readonly type = LOAD_ALL;

  constructor() {
  }
}

export class LoadAllSuccess implements ActionWithPayload<ApiMeasuresResponse> {
  readonly type = LOAD_ALL_RESPONSE;
  payload: ApiMeasuresResponse;

  constructor(measures: Measure[]) {
    this.payload = normalize(measures, [measureSchema]);
  }
}

export class ActionFailure implements ActionWithPayload<string> {
  readonly type = ERROR;
  error = true;
  payload: string;

  constructor(error: Error) {
    this.payload = error.message;
  }
}
