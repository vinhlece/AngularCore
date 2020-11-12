import {ZoomEvent} from '../../charts/models';
import {ActionWithPayload} from '../../common/actions';

export const ZOOM = '[Call Time Line] Zoom';
export const RESET_ZOOM = '[Call Time Line] Reset Zoom';

export class Zoom implements ActionWithPayload<ZoomEvent> {
  type = ZOOM;

  constructor(public payload: ZoomEvent) {
  }
}

export class ResetZoom implements ActionWithPayload<void> {
  type = RESET_ZOOM;
}
