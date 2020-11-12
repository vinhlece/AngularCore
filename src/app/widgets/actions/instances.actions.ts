import {ActionWithPayload} from '../../common/actions';

export const UPDATE = '[Instances] Update';
export const FIND_BY_NAME = '[Instances] Find by Name';
export const FIND_BY_NAME_RESPONSE = '[Instances] Find by Name Response';

export class Update implements ActionWithPayload<string[]> {
  readonly type = UPDATE;
  payload: any;

  constructor(instances: any) {
    this.payload = instances;
  }
}

export class FindByName implements ActionWithPayload<string> {
  readonly type = FIND_BY_NAME;

  constructor(public payload: string) {
  }
}

export class FindByNameSuccess implements ActionWithPayload<string[]> {
  readonly type = FIND_BY_NAME_RESPONSE;
  payload: string[];

  constructor(instances: string[]) {
    this.payload = instances;
  }
}
