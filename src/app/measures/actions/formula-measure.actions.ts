import {normalize} from 'normalizr';
import {ActionWithPayload} from '../../common/actions';
import {measureSchema} from '../../common/schemas';
import {FormulaMeasure} from '../models';

export const LOAD_ALL = '[Formula Measure] Load All';
export const LOAD_ALL_RESPONSE = '[Formula Measure] Load All Response';
export const ADD = '[Formula Measure] Add';
export const ADD_RESPONSE = '[Formula Measure] Add Response';
export const EDIT = '[Formula Measures] Edit';
export const EDIT_RESPONSE = '[Formula Measures] Edit Response';
export const DELETE = '[Formula Measures] Delete Measure';
export const DELETE_RESPONSE = '[Formula Measures] Delete Response';

export interface ApiMeasuresResponse {
  entities: {
    measures: object
  };
  result: number[];
}

export class LoadAll implements ActionWithPayload<void> {
  type = LOAD_ALL;
}

export class LoadAllSuccess implements ActionWithPayload<ApiMeasuresResponse> {
  readonly type = LOAD_ALL_RESPONSE;
  payload: ApiMeasuresResponse;

  constructor(measures: FormulaMeasure[]) {
    this.payload = normalize(measures, [measureSchema]);
  }
}

export class LoadAllFailure implements ActionWithPayload<string> {
  readonly type = LOAD_ALL_RESPONSE;
  error = true;
  payload: string;

  constructor(error: Error) {
    this.payload = error.message;
  }
}

export class Add implements ActionWithPayload<FormulaMeasure> {
  readonly type = ADD;

  constructor(public payload: FormulaMeasure) {
  }
}

export class AddSuccess implements ActionWithPayload<ApiMeasuresResponse> {
  readonly type = ADD_RESPONSE;
  payload: ApiMeasuresResponse;

  constructor(measure: FormulaMeasure) {
    this.payload = normalize([measure], [measureSchema]);
  }
}

export class AddFailure implements ActionWithPayload<string> {
  type = ADD_RESPONSE;
  error = true;
  payload: string;

  constructor(error: Error) {
    this.payload = error.message;
  }
}
