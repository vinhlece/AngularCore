import {ActionWithPayload} from '../../common/actions';
import {DragEvent} from '../../widgets/models';
import {DndPayload} from '../models';

export const DRAG_WIDGET = '[DnD] Drag Widget';
export const DRAG_METRIC = '[DnD] Drag Metric';
export const DRAG_START = '[DnD] Drag Start';
export const DRAG = '[DnD] Drag';
export const DRAG_STOP = '[DnD] Drag Stop';

export class DragWidget implements ActionWithPayload<DndPayload> {
  readonly type = DRAG_WIDGET;

  constructor(public payload: DndPayload) {
  }
}

export class DragMetric implements ActionWithPayload<DndPayload> {
  readonly type = DRAG_METRIC;

  constructor(public payload: DndPayload) {
  }
}

export class DragStart implements ActionWithPayload<DragEvent> {
  readonly type = DRAG_START;

  constructor(public payload: DragEvent) {
  }
}

export class Drag implements ActionWithPayload<DragEvent> {
  readonly type = DRAG;

  constructor(public payload: DragEvent) {
  }
}

export class DragStop implements ActionWithPayload<DragEvent> {
  readonly type = DRAG_STOP;

  constructor(public payload: DragEvent) {
  }
}
