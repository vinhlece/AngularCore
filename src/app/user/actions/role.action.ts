import {ActionMeta, ActionWithPayload} from '../../common/actions';
import {Role} from '../../common/models/index';

export const LOAD_ALL = '[Role] Load All';
export const LOAD_ALL_RESPONSE = '[Role] Load All Success';

export const ADD = '[Role] Add';
export const ADD_RESPONSE = '[Role] Add Success';

export const DELETE = '[Role] Delete';
export const DELETE_RESPONSE = '[Role] Delete Success';

export const ERROR = '[Role] Error';


export class LoadAll implements ActionWithPayload<void> {
  readonly type = LOAD_ALL;
}
export class LoadAllSuccess implements ActionWithPayload<Role[]> {
  readonly type = LOAD_ALL_RESPONSE;

  constructor(public payload: Role[]) {
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
export class Add implements ActionWithPayload<string> {
  readonly type = ADD;

  constructor(public payload: string) {
  }
}
export class AddSuccess implements ActionWithPayload<Role> {
  readonly type = ADD_RESPONSE;

  constructor(public payload: Role) {
  }
}

export class Delete implements ActionWithPayload<string> {
  readonly type = DELETE;

  constructor(public payload: string) {
  }
}
export class DeleteSuccess implements ActionWithPayload<string> {
  readonly type = DELETE_RESPONSE;

  constructor(public payload: string) {
  }
}

