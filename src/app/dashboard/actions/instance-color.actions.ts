import {normalize} from 'normalizr';
import {ActionWithPayload} from '../../common/actions';
import {dashboardSchema} from '../../common/schemas';
import {Dashboard} from '../models';
import {InstanceColor} from '../../common/models/index';

export const LOAD_ALL = '[Instance Color] Load All';
export const LOAD_ALL_RESPONSE = '[Instance Color] Load All Response';
export const ERROR = '[Instance Color] Error';

export class LoadAll implements ActionWithPayload<string> {
  readonly type = LOAD_ALL;

  constructor(public payload: string) {
  }
}

export class LoadAllSuccess implements ActionWithPayload<InstanceColor[]> {
  readonly type = LOAD_ALL_RESPONSE;
  payload: InstanceColor[];

  constructor(payload: InstanceColor[]) {
    this.payload = payload;
  }
}

export class ActionError implements ActionWithPayload<string> {
  readonly type = ERROR;
  payload: string;
  error = true;

  constructor(error: Error) {
    this.payload = error.message;
  }
}

export const ADD = '[Instance Color] Add';
export const ADD_RESPONSE = '[Instance Color] Add Response';

export class Add implements ActionWithPayload<void> {
  readonly type = ADD;
}

export class AddSuccess implements ActionWithPayload<void> {
  readonly type = ADD_RESPONSE;
}

export const DELETE = '[Instance Color] Delete';
export const DELETE_RESPONSE = '[Instance Color] Delete response';

export class Delete implements ActionWithPayload<string> {
  readonly type = DELETE;

  constructor(public payload: string) {
  }
}

export class DeleteSuccess implements ActionWithPayload<InstanceColor[]> {
  readonly type = DELETE_RESPONSE;

  constructor(public payload: InstanceColor[]) {
  }
}

export const GET = '[Instance Color] Get';
export const GET_RESPONSE = '[Instance Color] Get Response';

export class Get implements ActionWithPayload<void> {
  readonly type = GET;
}

export class GetSuccess implements ActionWithPayload<InstanceColor[]> {
  readonly type = GET_RESPONSE;

  constructor(public payload: InstanceColor[]) {}
}

export const UPDATE = '[Instance Color] Update';
export const UPDATE_RESPONSE = '[Instance Color] Update Response';

export class Update implements ActionWithPayload<InstanceColor[]> {
  readonly type = UPDATE;

  constructor(public payload: InstanceColor[]) {}
}

export class UpdateSuccess implements ActionWithPayload<InstanceColor[]> {
  readonly type = UPDATE_RESPONSE;

  constructor(public payload: InstanceColor[]) {}
}

export const EDIT = '[Instance Color] Edit';
export const EDIT_RESPONSE = '[Instance Color] Edit Response';

export class Edit implements ActionWithPayload<InstanceColor> {
  readonly type = EDIT;

  constructor(public payload: InstanceColor) {}
}

export class EditSuccess implements ActionWithPayload<InstanceColor[]> {
  readonly type = EDIT_RESPONSE;

  constructor(public payload: InstanceColor[]) {}
}
