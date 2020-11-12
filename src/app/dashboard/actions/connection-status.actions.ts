import {ActionWithPayload} from '../../common/actions';

export const GET_CONNECTION_STATUS = '[ConnectionStatus] Get connection status';

export class GetConnectionStatus implements ActionWithPayload<string> {
  readonly type = GET_CONNECTION_STATUS;

  constructor(public payload: string) {
  }
}
