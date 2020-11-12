import {Action} from '@ngrx/store';
import {Widget} from '../models';

export const EDIT = '[EditingWidget] Edit';
export const UPDATE = '[EditingWidget] Update';

export class Edit implements Action {
  readonly type = EDIT;
  widget: Widget;

  constructor(widget: Widget) {
    this.widget = widget;
  }
}

export class Update implements Action {
  readonly type = UPDATE;
  payload: any;

  constructor(payload: any) {
    this.payload = payload;
  }
}

export type Actions = Edit;
