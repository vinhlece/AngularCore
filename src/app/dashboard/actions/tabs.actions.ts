import {normalize} from 'normalizr';
import {ActionWithPayload} from '../../common/actions';
import {tabSchema} from '../../common/schemas';
import {Dashboard, Tab} from '../models';

export interface ApiTabsResponse {
  entities: {
    tabs?: object,
    placeholders?: object
  };
  result: number[];
}

export const ADD = '[Tabs] Add';
export const ADD_RESPONSE = '[Tabs] Add Response';

export class Add implements ActionWithPayload<Tab> {
  readonly type = ADD;

  constructor(public payload: Tab) {
  }
}

export class AddSuccess implements ActionWithPayload<ApiTabsResponse> {
  readonly type = ADD_RESPONSE;
  payload: ApiTabsResponse;

  constructor(tab: Tab) {
    this.payload = normalize([tab], [tabSchema]);
  }
}

export class AddFailure implements ActionWithPayload<string> {
  readonly type = ADD_RESPONSE;
  error = true;
  payload: string;

  constructor(error: Error) {
    this.payload = error.message;
  }
}

export const UPDATE = '[Tabs] Update';
export const UPDATE_RESPONSE = '[Tabs] Update Response';

export class Update implements ActionWithPayload<Tab> {
  readonly type = UPDATE;

  constructor(public payload: Tab) {
  }
}

export class UpdateSuccess implements ActionWithPayload<ApiTabsResponse> {
  readonly type = UPDATE_RESPONSE;
  payload: ApiTabsResponse;

  constructor(tab: Tab) {
    this.payload = normalize([tab], [tabSchema]);
  }
}

export class UpdateFailure implements ActionWithPayload<string> {
  readonly type = UPDATE_RESPONSE;
  error = true;
  payload: string;

  constructor(error: Error) {
    this.payload = error.message;
  }
}

export const DELETE = '[Tabs] Delete';
export const DELETE_RESPONSE = '[Tabs] Delete Response';

export class Delete implements ActionWithPayload<Tab> {
  readonly type = DELETE;

  constructor(public payload: Tab) {
  }
}

export class DeleteSuccess implements ActionWithPayload<string> {
  readonly type = DELETE_RESPONSE;

  constructor(public payload: string) {
  }
}

export class DeleteFailure implements ActionWithPayload<string> {
  readonly type = DELETE_RESPONSE;
  error = true;
  payload: string;

  constructor(error: Error) {
    this.payload = error.message;
  }
}

export const SELECT = '[Tab] Select';

export class Select implements ActionWithPayload<Tab> {
  readonly type = SELECT;

  constructor(public payload: Tab) {
  }
}

export const EXIT = '[Tabs] Exit';

export class Exit implements ActionWithPayload<void> {
  readonly type = EXIT;
}

export const GLOBAL_FILTERS = '[Tab] Global Filters';
export class GlobalFilters implements ActionWithPayload<string []> {
  readonly type = GLOBAL_FILTERS;

  constructor(public payload: string[]) {
  }
}

export const LOAD = '[Tab] Load';
export const LOAD_RESPONSE = '[Tabs] Delete Response';

export class Load implements ActionWithPayload<void> {
  readonly type = LOAD;
}

export class LoadSuccess implements ActionWithPayload<Tab[]> {
  readonly type = LOAD_RESPONSE;

  constructor(public payload: Tab[]) {
  }
}

export class LoadFailure implements ActionWithPayload<string> {
  readonly type = LOAD_RESPONSE;
  error = true;
  payload: string;

  constructor(error: Error) {
    this.payload = error.message;
  }
}

export const COPY = '[Tabs] Copy';
export const COPY_RESPONSE = '[Tabs] Copy Response';

export class Copy implements ActionWithPayload<Tab> {
  readonly type = COPY;

  constructor(public payload: Tab) {
  }
}

export class CopySuccess implements ActionWithPayload<Tab> {
  readonly type = COPY_RESPONSE;
  payload: Tab;

  constructor(payload: Tab) {
    this.payload = payload;
  }
}
