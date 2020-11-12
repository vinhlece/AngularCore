import {Action} from '@ngrx/store';

export interface ActionWithPayload<T> extends Action {
  payload?: T;
  meta?: any;
  error?: boolean;
}

export class DummyAction implements ActionWithPayload<void> {
  type = 'DUMMY';
}

export interface ActionMeta {
  doNavigation?: boolean;
  previousUrl?: string;
}
