import {ActionWithPayload} from '../../common/actions';

export const SEARCH = '[Search] Search';
export const SEARCH_RESPONSE = '[Search] Search Response';
export const SET_SEARCH_TYPE = '[Search] Set Search Type';

export class Search implements ActionWithPayload<string> {
  readonly type = SEARCH;

  constructor(public payload: string) {
  }
}

export class SearchSuccess implements ActionWithPayload<any> {
  readonly type = SEARCH_RESPONSE;

  constructor(public payload: any) {
  }
}

export class SetSearchType implements ActionWithPayload<string> {
  readonly type = SET_SEARCH_TYPE;

  constructor(public payload: string) {
  }
}
