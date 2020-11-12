import {normalize} from 'normalizr';
import {ActionWithPayload} from '../../common/actions';
import {widgetSchema} from '../../common/schemas';
import {Widget} from '../models';

export interface ApiWidgetsResponse {
  entities: {
    widgets: {
      [id: string]: Widget
    }
  };
  result: string[];
}

export const LOAD_ALL = '[Widgets] Load All';
export const LOAD_ALL_RESPONSE = '[Widgets] Load All Response';

export class LoadAll implements ActionWithPayload<void> {
  type = LOAD_ALL;
}

export class LoadAllSuccess implements ActionWithPayload<ApiWidgetsResponse> {
  type = LOAD_ALL_RESPONSE;
  payload: ApiWidgetsResponse;

  constructor(widgets: Widget[]) {
    this.payload = normalize(widgets, [widgetSchema]);
  }
}

export class LoadAllFailure implements ActionWithPayload<string> {
  type = LOAD_ALL_RESPONSE;
  error = true;
  payload: string;

  constructor(error: Error) {
    this.payload = error.message;
  }
}

export const LOAD = '[Widgets] Load';
export const LOAD_RESPONSE = '[Widgets] Load Response';

export class Load implements ActionWithPayload<string> {
  type = LOAD;

  constructor(public payload: string, public meta?: object) {
  }
}

export class LoadSuccess implements ActionWithPayload<ApiWidgetsResponse> {
  type = LOAD_RESPONSE;
  payload: ApiWidgetsResponse;
  meta?: object;

  constructor(widget: Widget, meta?: object) {
    this.payload = normalize([widget], [widgetSchema]);
    this.meta = meta;
  }
}

export class LoadFailure implements ActionWithPayload<string> {
  type = LOAD_RESPONSE;
  error = true;
  payload: string;

  constructor(error: Error) {
    this.payload = error.message;
  }
}

export const ADD = '[Widgets] Add';
export const ADD_RESPONSE = '[Widgets] Add Response';
export const ADD_AND_NAVIGATE = '[Widgets] Add And Navigate';

export class Add implements ActionWithPayload<Widget> {
  type = ADD;

  constructor(public payload: Widget, public meta?: object) {
  }
}

export class AddAndNavigate implements ActionWithPayload<Widget> {
  type = ADD_AND_NAVIGATE;

  constructor(public payload: Widget) {
  }
}

export class AddSuccess implements ActionWithPayload<ApiWidgetsResponse> {
  type = ADD_RESPONSE;
  payload: ApiWidgetsResponse;
  meta?: any;

  constructor(widget: Widget, meta?: any) {
    this.payload = normalize([widget], [widgetSchema]);
    this.meta = meta;
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

export const UPDATE = '[Widgets] Update';
export const UPDATE_AND_NAVIGATE = '[Widgets] Update And Navigate';
export const UPDATE_RESPONSE = '[Widgets] Update Response';

export class Update implements ActionWithPayload<Widget> {
  type = UPDATE;

  constructor(public payload: Widget) {
  }
}

export class UpdateAndNavigate implements ActionWithPayload<Widget> {
  type = UPDATE_AND_NAVIGATE;

  constructor(public payload: Widget) {
  }
}

export class UpdateSuccess implements ActionWithPayload<ApiWidgetsResponse> {
  type = UPDATE_RESPONSE;
  payload: ApiWidgetsResponse;

  constructor(widget: Widget) {
    this.payload = normalize([widget], [widgetSchema]);
  }
}

export class UpdateFailure implements ActionWithPayload<string> {
  type = UPDATE_RESPONSE;
  error = true;
  payload: string;

  constructor(error: Error) {
    this.payload = error.message;
  }
}

export const DELETE = '[Widgets] Delete';
export const RESET = '[Widgets] Reset';
export const DELETE_RESPONSE = '[Widgets] Delete Response';

export class Delete implements ActionWithPayload<string> {
  type = DELETE;

  constructor(public payload: string) {
  }
}

export class Reset implements ActionWithPayload<Widget> {
  type = RESET;

  constructor(public payload: Widget) {
  }
}

export class DeleteSuccess implements ActionWithPayload<string> {
  type = DELETE_RESPONSE;

  constructor(public payload: string) {
  }
}

export class DeleteFailure implements ActionWithPayload<string> {
  type = DELETE_RESPONSE;
  error = true;
  payload: string;

  constructor(error: Error) {
    this.payload = error.message;
  }
}

export const SEARCH = '[Widgets] Search';
export const SEARCH_RESPONSE = '[Widgets] Search Response';

export class Search implements ActionWithPayload<string> {
  readonly type = SEARCH;

  constructor(public payload: string) {
  }
}

export class SearchSuccess implements ActionWithPayload<ApiWidgetsResponse> {
  readonly type = SEARCH_RESPONSE;
  payload: ApiWidgetsResponse;

  constructor(widgets: Widget[]) {
    this.payload = normalize(widgets, [widgetSchema]);
  }
}

export class SearchFailure implements ActionWithPayload<string> {
  readonly type = SEARCH_RESPONSE;
  error = true;
  payload: string;

  constructor(error: Error) {
    this.payload = error.message;
  }
}

export const COPY = '[Widgets] Copy';

export class Copy implements ActionWithPayload<Widget> {
  type = COPY;

  constructor(public payload: Widget) {
  }
}
