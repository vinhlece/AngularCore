import {ActionWithPayload} from '../../common/actions';

export const TOGGLE = '[Replay] Toggle';
export const STOP = '[Replay] Stop';

export class Toggle implements ActionWithPayload<void> {
  type = TOGGLE;
}

export class Stop implements ActionWithPayload<void> {
  type = STOP;
}
