import {ActionWithPayload} from '../../common/actions';
import * as userActions from '../actions/user.actions';
import {User} from '../models/user';

export interface State {
  users: User[];
  authenticatedUserId: string;
  rolesEditing: string[];
  errorMessage: string;
}

export const initialState: State = {
  authenticatedUserId: '',
  errorMessage: null,
  rolesEditing: [],
  users: []
};

export function reducer(state = initialState, action: ActionWithPayload<any>) {
  switch (action.type) {
    case userActions.LOGIN_RESPONSE:
      if (action.error) {
        return {
          ...state,
          errorMessage: action.payload
        };
      }
    case userActions.UPDATE_RESPONSE:
      if (action.error) {
        return {
          ...state,
          errorMessage: action.payload
        };
      }
      return {
        ...state,
        authenticatedUserId: action.payload.result[0]
      };
    case userActions.SIGN_UP_RESPONSE:
      if (action.error) {
        return {
          ...state,
          errorMessage: action.payload
        };
      }
      return state;
    case userActions.LOGOUT:
      return {
        ...state,
        authenticatedUserId: null
      };
    case userActions.LOAD_ALL_RESPONSE:
      if (action.error) {
        return {
          ...state,
          errorMessage: action.payload
        };
      }
      return {
        ...state,
        users: action.payload
      };
    case userActions.ADD_USER_RESPONSE:
      if (action.error) {
        return {
          ...state,
          errorMessage: action.payload
        };
      }
      return {
        ...state,
        users: [...state.users, action.payload]
      };
    case userActions.DELETE_USER_RESPONSE:
      if (action.error) {
        return {
          ...state,
          errorMessage: action.payload
        };
      }
      return {
        ...state,
        users: state.users.filter(user => user.id !== action.payload)
      };
    case userActions.ASSIGN_ROLES_RESPONSE:
      if (action.error) {
        return {
          ...state,
          errorMessage: action.payload
        };
      }
      return {
        ...state
      };
    case userActions.LOAD_ROLES_BY_USER_RESPONSE:
      return {
        ...state,
        rolesEditing: action.payload
      };
    default:
      return state;
  }
}
