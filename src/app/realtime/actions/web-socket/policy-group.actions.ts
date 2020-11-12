import {ActionWithPayload} from '../../../common/actions/index';
import {PolicyInfo, ActionPolicy} from '../../models/index';

export const INITIALIZE = '[KPI] initialize';
export const INITIALIZE_SUCCESS = '[KPI] initialize success';
export const CREATE = '[KPI] Create';
export const GET = '[KPI] Get';
export const GET_SUCCESS = '[KPI] Get Success';
export const ERRORS = '[KPI] error';

export class Initialize implements ActionWithPayload<string> {
  type = INITIALIZE;

  constructor(public payload: string) {
  }
}

export class InitializeSuccess implements ActionWithPayload<PolicyInfo> {
  type = INITIALIZE_SUCCESS;

  constructor(public payload: PolicyInfo) {
  }
}

export class Create implements ActionWithPayload<ActionPolicy[]> {
  type = CREATE;

  constructor(public payload: ActionPolicy[], public policyInfo: PolicyInfo) {
  }
}

export class Get implements ActionWithPayload<string> {
  type = GET;

  constructor(public policyInfo: PolicyInfo) {
  }
}

export class Error implements ActionWithPayload<string> {
  readonly type = ERRORS;

  constructor(public payload: string) {

  }
}

