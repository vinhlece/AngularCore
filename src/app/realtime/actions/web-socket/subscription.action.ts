import {ActionWithPayload} from '../../../common/actions';
import {WebSocketSubscription} from '../../models/web-socket/widget-container';

export const ADD_SUBSCRIPTION = '[Subscription] Add subscription';
export const CREATE_SUBSCRIPTION = '[Subscription] Create subscription';
export const DELETE_SUBSCRIPTION = '[Subscription] Delete subscription';
export const UPDATE_SUBSCRIPTION = '[Subscription] Update subscription';
export const ADD_SUCCESS = '[Subscription] Add subscription success';
export const DELETE_SUCCESS = '[Subscription] Delete subscription success';
export const DELETE_ALL_SUCCESS = '[Subscription] Delete all subscription success';
export const UPDATE_SUCCESS = '[Subscription] Update subscription success';
export const REGISTER_SUCCESS = '[Subscription] Register subscription success';
export const GENERATE_DATA = '[Subscription] Generate data by subscription';
export const ERRORS = '[Subscription] Subscription Errors';

export class Add implements ActionWithPayload<void> {
  type = ADD_SUBSCRIPTION;
}

export class Create implements ActionWithPayload<WebSocketSubscription> {
  type = CREATE_SUBSCRIPTION;

  constructor(public payload: WebSocketSubscription) {
  }
}

export class AddSuccess implements ActionWithPayload<WebSocketSubscription> {
  readonly type = ADD_SUCCESS;

  constructor(public payload: WebSocketSubscription) {
  }
}

export class Delete implements ActionWithPayload<WebSocketSubscription> {
  type = DELETE_SUBSCRIPTION;
  payload: WebSocketSubscription;

  constructor(public subscription: WebSocketSubscription) {
    this.payload = subscription;
  }
}

export class DeleteSuccess implements ActionWithPayload<string> {
  readonly type = DELETE_SUCCESS;

  constructor(public payload: string) {
  }
}

export class DeleteAllSuccess implements ActionWithPayload<void> {
  readonly type = DELETE_ALL_SUCCESS;
}

export class Update implements ActionWithPayload<WebSocketSubscription> {
  type = UPDATE_SUBSCRIPTION;

  constructor(public payload: WebSocketSubscription) {
  }
}

export class UpdateSuccess implements ActionWithPayload<WebSocketSubscription> {
  readonly type = UPDATE_SUCCESS;
  payload: WebSocketSubscription;

  constructor(websocketSubscription: WebSocketSubscription) {
    this.payload = websocketSubscription;
  }
}

export class RegisterSuccess implements ActionWithPayload<WebSocketSubscription> {
  readonly type = REGISTER_SUCCESS;
  payload: WebSocketSubscription;

  constructor(websocketSubscription: WebSocketSubscription) {
    this.payload = websocketSubscription;
  }
}

export class GenerateData implements ActionWithPayload<WebSocketSubscription> {
  readonly type = GENERATE_DATA;
  payload: WebSocketSubscription;

  constructor(websocketSubscription: WebSocketSubscription) {
    this.payload = websocketSubscription;
  }
}

export class Error implements ActionWithPayload<String> {
  readonly type = ERRORS;

  constructor(public payload: string) {
  }
}

