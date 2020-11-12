import {ActionWithPayload} from '../../../common/actions/index';
import {WidgetContainer} from '../../models/web-socket/widget-container';

export const MODIFY_WIDGET_CONTAINER = '[Widget Container] Modify widget container';
export const MODIFY_WIDGET_CONTAINER_SUCCESS = '[Widget Container] Modify widget container success';
export const ERRORS = '[Widget Container] error';

export class ModifyWidgetContainer implements ActionWithPayload<void> {
  readonly type = MODIFY_WIDGET_CONTAINER;
}
export class ModifyWidgetContainerSuccess implements ActionWithPayload<WidgetContainer[]> {
  readonly type = MODIFY_WIDGET_CONTAINER_SUCCESS;

  constructor(public payload: WidgetContainer[]) {

  }
}
export class Error implements ActionWithPayload<string> {
  readonly type = ERRORS;

  constructor(public payload: string) {

  }
}
