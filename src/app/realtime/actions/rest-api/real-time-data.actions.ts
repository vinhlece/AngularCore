import {ActionWithPayload} from '../../../common/actions';
import {Storage} from '../../models';

export const SET_MAIN_STORAGE = '[Real Time Data] Set Main Storage';
export const SET_EVENT_STORAGE = '[Real Time Data] Set Event Storage';
export const SET_PREDICTIVE_STORAGE = '[Real Time Data] Set Predictive Storage';
export const SET_POLICY_GROUP_STORAGE = '[Real Time Data] Set Policy group Storage';
export const CLEAR_DATA = '[Real Time Data] Clear Data';
export const CLEAR_INSTANCES = '[Real Time Data] Clear Data by Instances';
export const CLEAR_OTHER_INSTANCES = '[Real Time Data] Clear Data of other Instances';

export class ClearData implements ActionWithPayload<void> {
  readonly type = CLEAR_DATA;
}

export class SetMainStorage implements ActionWithPayload<{[window: string]: Storage}> {
  readonly type = SET_MAIN_STORAGE;

  constructor(public payload: {[window: string]: Storage}) {
  }
}

export class SetEventStorage implements ActionWithPayload<Storage> {
  readonly type = SET_EVENT_STORAGE;

  constructor(public payload: Storage) {
  }
}

export class SetPredictiveStorage implements ActionWithPayload<{[window: string]: Storage}> {
  readonly type = SET_PREDICTIVE_STORAGE;

  constructor(public payload: {[window: string]: Storage}) {
  }
}

export class ClearInstanceStorage implements ActionWithPayload<any> {
  readonly type = CLEAR_INSTANCES;

  constructor(public payload: any) {
  }
}

export class ClearOtherInstancesStorage implements ActionWithPayload<any> {
  readonly type = CLEAR_OTHER_INSTANCES;

  constructor(public payload: any) {
  }
}

export class SetPolicyGroupStorage implements ActionWithPayload<{[window: string]: Storage}> {
  readonly type = SET_POLICY_GROUP_STORAGE;

  constructor(public payload: {[window: string]: Storage}) {
  }
}
