import {ActionWithPayload} from '../../common/actions';
import {MouseEventWrapper, Widget} from '../../widgets/models';
import {GridMetrics, Placeholder} from '../models';

export const INITIALIZE = '[Tab Editor] Initialize';
export const UPDATE_EDITING_TAB = '[Tab Editor] Update Editing Tab';
export const CREATE_WIDGET_SUCCESS = '[Tab Editor] Create Widget Success';
export const ADJUST_SIZE = '[Tab Editor] Adjust Size';
export const UPDATE_METRICS = '[Tab Editor] Update Metrics';
export const ADD_WIDGET = '[Tab Editor] Add Widget';
export const DRAG_WIDGET = '[Tab Editor] Drag Widget';
export const REMOVE_WIDGET = '[Tab Editor] Remove Widget';
export const BULK_ADD = '[Tab Editor] Bulk Add';
export const BULK_UPDATE = '[Tab Editor] Bulk Update';
export const CREATE_WIDGET_FROM_TEMPLATE = '[Tab Editor] Create Widget From Template';
export const TOGGLE_GRID_LINES = '[Tab Editor] Toggle Grid Lines';
export const ADD_INSTANCE = '[Tab Editor] add instance';
export const REMOVE_INSTANCE = '[Tab Editor] remove instance';
export const BULK_CREATE_NEW = '[Tab Editor] create a new temporary widget';
export const SAVE_EDITING_WIDGET = '[Tab Editor] save editing widget';
export const CANCEL_EDITING_WIDGET = '[Tab Editor] cancel editing widget';

export class Initialize implements ActionWithPayload<string> {
  readonly type = INITIALIZE;

  constructor(public payload: string) {
  }
}

export class UpdateEditingTab implements ActionWithPayload<string> {
  readonly type = UPDATE_EDITING_TAB;

  constructor(public payload: string) {
  }
}

export class CreateWidgetSuccess implements ActionWithPayload<void> {
  readonly type = CREATE_WIDGET_SUCCESS;
}

export class UpdateMetrics implements ActionWithPayload<GridMetrics> {
  readonly type = UPDATE_METRICS;

  constructor(public payload: GridMetrics) {
  }
}

export class AdjustSize implements ActionWithPayload<void> {
  readonly type = ADJUST_SIZE;
}

export class AddWidget implements ActionWithPayload<Widget> {
  readonly type = ADD_WIDGET;

  constructor(public payload: Widget) {
  }
}

export class DragWidget implements ActionWithPayload<MouseEventWrapper> {
  readonly type = DRAG_WIDGET;

  constructor(public payload: MouseEventWrapper) {
  }
}

export class RemoveWidget implements ActionWithPayload<string> {
  readonly type = REMOVE_WIDGET;

  constructor(public payload: string, public widgetId?: string) {
  }
}

export class BulkAdd implements ActionWithPayload<Placeholder[]> {
  readonly type = BULK_ADD;

  constructor(public payload: Placeholder[]) {
  }
}

export class BulkUpdate implements ActionWithPayload<Widget> {
  readonly type = BULK_UPDATE;

  constructor(public payload: Widget) {
  }
}

export class CreateWidgetFromTemplate implements ActionWithPayload<string> {
  readonly type = CREATE_WIDGET_FROM_TEMPLATE;

  constructor(public payload: string) {
  }
}

export class ToggleGridLines implements ActionWithPayload<void> {
  readonly type = TOGGLE_GRID_LINES;
}

export class AddInstance implements ActionWithPayload<string> {
  readonly type = ADD_INSTANCE;

  constructor(public payload: string) {
  }
}

export class RemoveInstance implements ActionWithPayload<any> {
  readonly type = REMOVE_INSTANCE;

  constructor(public payload: any) {
  }
}

export class BulkCreateNew implements ActionWithPayload<any> {
  readonly type = BULK_CREATE_NEW;

  constructor(public payload: any) {
  }
}

export class SaveEditingWidget implements ActionWithPayload<Widget> {
  readonly type = SAVE_EDITING_WIDGET;

  constructor(public payload: Widget) {
  }
}

export class CancelEditingWidget implements ActionWithPayload<void> {
  readonly type = CANCEL_EDITING_WIDGET;
}
