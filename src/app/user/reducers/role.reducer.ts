import {ActionWithPayload} from '../../common/actions';
import * as roleActions from '../actions/role.action';
import {Role} from '../../common/models/index';
import * as _ from 'lodash';

export interface State {
  roles: Role[];
  errorMessage?: string;
}

export const initialState: State = {
  roles: [],
  errorMessage: null
};

export function reducer(state = initialState, action: ActionWithPayload<any>) {
  switch (action.type) {
    case roleActions.LOAD_ALL_RESPONSE:
      return {
        ...state,
        roles: [...action.payload],
      };
    case roleActions.ADD_RESPONSE:
      return {
        ...state,
        roles: [...state.roles, action.payload],
      };
    case roleActions.DELETE_RESPONSE:
      return {
        ...state,
        roles: state.roles.filter(item => item.id !== action.payload)
      };
    case roleActions.ERROR:
      return {
        roles: [...state.roles],
        errorMessage: action.payload
      };
    default:
      return state;
  }
}
