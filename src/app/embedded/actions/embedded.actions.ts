import {Dimension} from '../../charts/models';
import {ActionWithPayload} from '../../common/actions';

export const START_SESSION = '[Embedded] Start Session';
export const SET_LAUNCHER_SIZE = '[Embedded] Set Launcher Size';

export class StartSession implements ActionWithPayload<void> {
  type = START_SESSION;

  constructor() {
  }
}

export class SetLauncherSize implements ActionWithPayload<{ id: string, size: Dimension }> {
  type = SET_LAUNCHER_SIZE;

  constructor(public payload: { id: string, size: Dimension }) {
  }
}
