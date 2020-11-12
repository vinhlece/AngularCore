import {normalize} from 'normalizr';
import {ActionWithPayload} from '../../common/actions';
import {dashboardSchema} from '../../common/schemas';
import {Dashboard, Placeholder} from '../models';
import {AppConfig} from '../../config/app.config';

export interface ApiDashboardsResponse {
  entities: {
    dashboards?: object,
    tabs?: object,
    placeholders?: object
  };
  result: number[];
}

export const LOAD_ALL = '[Dashboards] Load All';
export const LOAD_ALL_RESPONSE = '[Dashboards] Load All Response';

export class LoadAll implements ActionWithPayload<string> {
  readonly type = LOAD_ALL;

  constructor(public payload: string) {
  }
}

export class LoadAllSuccess implements ActionWithPayload<ApiDashboardsResponse> {
  readonly type = LOAD_ALL_RESPONSE;
  payload: ApiDashboardsResponse;

  constructor(dashboards: Dashboard[]) {
    this.payload = normalize(dashboards, [dashboardSchema]);
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

export const LOAD = '[Dashboards] Load';
export const LOAD_RESPONSE = '[Dashboards] Load Response';

export class Load implements ActionWithPayload<string> {
  readonly type = LOAD;

  constructor(public payload: string) {
  }
}

export class LoadSuccess implements ActionWithPayload<ApiDashboardsResponse> {
  readonly type = LOAD_RESPONSE;
  payload: ApiDashboardsResponse;

  constructor(dashboard: Dashboard) {
    this.payload = normalize([dashboard], [dashboardSchema]);
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

export const ADD = '[Dashboards] Add';
export const ADD_RESPONSE = '[Dashboards] Add Response';

export class Add implements ActionWithPayload<Dashboard> {
  readonly type = ADD;

  constructor(public dashboard: Dashboard) {
  }
}

export class AddSuccess implements ActionWithPayload<ApiDashboardsResponse> {
  readonly type = ADD_RESPONSE;
  payload: ApiDashboardsResponse;

  constructor(dashboard: Dashboard) {
    this.payload = normalize([dashboard], [dashboardSchema]);
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

export const DELETE = '[Dashboards] Delete';
export const DELETE_RESPONSE = '[Dashboards] Delete Response';

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

export class DeleteFailure implements ActionWithPayload<string> {
  readonly type = DELETE_RESPONSE;
  error = true;
  payload: string;

  constructor(error: Error) {
    this.payload = error.message;
  }
}

export const UPDATE = '[Dashboards] Update';
export const UPDATE_RESPONSE = '[Dashboards] Update Response';


export class Update implements ActionWithPayload<Dashboard> {
  readonly type = UPDATE;

  constructor(public payload: Dashboard) {
  }
}

export class UpdateSuccess implements ActionWithPayload<ApiDashboardsResponse> {
  readonly type = UPDATE_RESPONSE;
  payload: ApiDashboardsResponse;

  constructor(dashboard: Dashboard) {
    this.payload = normalize([dashboard], [dashboardSchema]);
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

export const LAUNCH_STANDALONE = '[Dashboards] Launch Standalone';
export const LAUNCH_INTEGRATED = '[Dashboards] Launch Integrated';

export class LaunchStandalone implements ActionWithPayload<void> {
  readonly type = LAUNCH_STANDALONE;

  constructor() {
  }
}

export class LaunchIntegrated implements ActionWithPayload<void> {
  readonly type = LAUNCH_INTEGRATED;

  constructor() {
  }
}

export const SET_APP_CONFIG = '[Dashboards] set app config';

export class SetAppConfig implements ActionWithPayload<AppConfig> {
  readonly type = SET_APP_CONFIG;

  constructor(public payload: AppConfig) {
  }
}

export const COPY = '[Dashboards] Copy';
export const COPY_TAB = '[Dashboards] Copy Tab';
export const COPY_RESPONSE = '[Dashboards] Copy Response';

export class Copy implements ActionWithPayload<Dashboard> {
  readonly type = COPY;

  constructor(public payload: Dashboard) {
  }
}

export class CopySuccess implements ActionWithPayload<Dashboard> {
  readonly type = COPY_RESPONSE;

  constructor(public payload: Dashboard) {
  }
}

export class CopyTab implements ActionWithPayload<any> {
  readonly type = COPY_TAB;

  constructor(public payload: Dashboard, public placeholders: Placeholder[]) {
  }
}
