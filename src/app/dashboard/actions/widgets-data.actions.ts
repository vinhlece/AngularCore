import {ActionWithPayload} from '../../common/actions';

export const CONVERT_SUCCESS = '[Widget Data] Convert Success';

export class ConvertSuccess implements ActionWithPayload<any> {
  type = CONVERT_SUCCESS;

  constructor(public payload: any) {
  }
}
