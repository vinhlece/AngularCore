import {ActionWithPayload} from '../../common/actions';

export const OPEN = '[Time Explorer] Open';
export const CLOSE = '[Time Explorer] Close';
export const SET_TIMESTAMP = '[Time Explorer] Set timestamp on dropping from table';

export class Open implements ActionWithPayload<void> {
  readonly type = OPEN;
}

export class Close implements ActionWithPayload<void> {
  readonly type = CLOSE;
}

export class SetTimestamp implements ActionWithPayload<void> {
  readonly type = SET_TIMESTAMP;
}

