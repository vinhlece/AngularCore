import {ActionWithPayload} from '../../../common/actions';
import {Topic} from '../../models';

export const ADD = '[Topics] Add';
export const UPDATE = '[Topics] Update';
export const UPDATE_SESSION_ID = '[Topics] update by session id';
export const RESET = '[Topics] Reset';


export class Add implements ActionWithPayload<Topic> {
  readonly type = ADD;

  constructor(public payload: Topic, public currentMeasures?: any) {
  }
}

export class Update implements ActionWithPayload<Topic> {
  readonly type = UPDATE;

  constructor(public payload: Topic) {
  }
}

export class UpdateSessionId implements ActionWithPayload<string> {
  readonly type = UPDATE_SESSION_ID;

  constructor(public payload: string) {
  }
}

export class Reset implements ActionWithPayload<void> {
  readonly type = RESET;
}
