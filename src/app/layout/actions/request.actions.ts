import {Action} from '@ngrx/store';

export const START = 'Start';
export const SUCCESS = 'Success';
export const FAIL = 'Fail';

export class StartAction implements Action {
  readonly subType = START;
  type = START;
}

export class SuccessAction implements Action {
  readonly subType = SUCCESS;
  type: string;
  response: any;
  meta: any;

  constructor(type?: string, response?: any, meta?: any) {
    this.type = type || SUCCESS;
    this.response = response;
    this.meta = meta;
  }
}

export class FailAction implements Action {
  readonly subType = FAIL;
  type = FAIL;
  errorMessage: string;

  constructor(errorMessage: string) {
    this.errorMessage = errorMessage;
  }
}

export type Actions = StartAction | SuccessAction | FailAction;
