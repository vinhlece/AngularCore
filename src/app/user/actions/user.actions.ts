import {Action} from '@ngrx/store';
import {ActionMeta, ActionWithPayload} from '../../common/actions';
import {Credentials, User} from '../models/user';
import {normalize} from 'normalizr';
import {userSchema} from '../../common/schemas/index';


export const LOGIN = '[User] Login';
export const GET_ROLES = '[User] get roles for user';
export const LOGIN_RESPONSE = '[User] Login Response';

export const SIGN_UP = '[User] Sign Up';
export const SIGN_UP_RESPONSE = '[User] Sign Up Response';

export const LOGOUT = '[User] Logout';

export const UPDATE = '[User] Update';
export const UPDATE_RESPONSE = '[User] Update Response';

export const LOGIN_BY_SESSION = '[User] Login By Session';

export const LOAD_ALL = '[User] Load All';
export const LOAD_ALL_RESPONSE = '[User] Load All Response';

export const ADD_USER = '[User] Add User';
export const ADD_USER_RESPONSE = '[User] Add User Response';

export const DELETE_USER = '[User] Delete User';
export const DELETE_USER_RESPONSE = '[User] Delete Response';

export const LOAD_ROLES_BY_USER = '[User] load roles for user id';
export const LOAD_ROLES_BY_USER_RESPONSE = '[User] load roles for user id Response';
export const ASSIGN_ROLES = '[User] assign roles for user';
export const ASSIGN_ROLES_RESPONSE = '[User] assign roles for user Response';

export const CREATE_PERMISSION = '[User] create permission for new user'

export interface ApiUserResponse {
  entities: {
    users: {
      [id: string]: User
    }
  };
  result: string[];
}
export class DeleteUser implements ActionWithPayload<string> {
  readonly type = DELETE_USER;

  constructor(public payload: string) {
  }
}
export class DeleteUserSuccess implements ActionWithPayload<string> {
  readonly type = DELETE_USER_RESPONSE;

  constructor(public payload: string) {
  }
}
export class DeleteUserFailure implements ActionWithPayload<string> {
  readonly type = DELETE_USER_RESPONSE;
  error = true;
  payload: string;

  constructor(error: Error) {
    this.payload = error.message;
  }
}

export class AddUser implements ActionWithPayload<User> {
  readonly type = ADD_USER;
  constructor(public payload: User) {
  }
}
export class AddUserSuccess implements ActionWithPayload<User> {
  readonly type = ADD_USER_RESPONSE;
  constructor(public payload: User) {
  }
}
export class AddUserFailure implements ActionWithPayload<string> {
  readonly type = ADD_USER_RESPONSE;
  error = true;
  payload: string;

  constructor(error: Error) {
    this.payload = error.message;
  }
}

export class LoadAll implements ActionWithPayload<void> {
  readonly type = LOAD_ALL;
}
export class LoadAllSuccess implements ActionWithPayload<User[]> {
  readonly type = LOAD_ALL_RESPONSE;

  constructor(public payload: User[]) {
  }
}

export class LoadAllFailure implements ActionWithPayload<string> {
  readonly type = LOAD_ALL_RESPONSE;
  error = true;
  payload: string;

  constructor(error: Error) {
    this.payload = error.message;
  }
}

export class Login implements ActionWithPayload<Credentials> {
  readonly type = LOGIN;

  constructor(public payload: Credentials, public meta?: ActionMeta) {
  }
}

export class GetRoles implements ActionWithPayload<User> {
  readonly type = GET_ROLES;

  constructor(public payload: User, public meta?: ActionMeta, public loginBySession?: boolean) {
  }
}

export class LoginSuccess implements ActionWithPayload<ApiUserResponse> {
  readonly type = LOGIN_RESPONSE;
  payload: ApiUserResponse;

  constructor(user: User) {
    this.payload = normalize([user], [userSchema]);
  }
}

export class LoginFailure implements ActionWithPayload<string> {
  readonly type = LOGIN_RESPONSE;
  error = true;
  payload: string;

  constructor(error: Error) {
    this.payload = error.message;
  }
}

export class SignUp implements ActionWithPayload<Credentials> {
  readonly type = SIGN_UP;

  constructor(public payload: Credentials) {
  }
}

export class SignUpSuccess implements ActionWithPayload<ApiUserResponse> {
  readonly type = SIGN_UP_RESPONSE;
  payload: ApiUserResponse;

  constructor(user: User) {
    this.payload = normalize([user], [userSchema]);
  }
}

export class SignUpFailure implements ActionWithPayload<string> {
  readonly type = SIGN_UP_RESPONSE;
  error = true;
  payload: string;

  constructor(error: Error) {
    this.payload = error.message;
  }
}

export class Logout implements Action {
  readonly type: string = LOGOUT;
}


export class Update implements ActionWithPayload<User> {
  readonly type = UPDATE;

  constructor(public payload: User) {
  }
}

export class UpdateSuccess implements ActionWithPayload<ApiUserResponse> {
  readonly type = UPDATE_RESPONSE;
  payload: ApiUserResponse;

  constructor(user: User) {
    this.payload = normalize([user], [userSchema]);
  }
}

export class LoginBySession implements ActionWithPayload<User> {
  readonly type = LOGIN_BY_SESSION;
  constructor(public payload: User) {
  }
}

export class LoadRolesByUserId implements ActionWithPayload<string> {
  readonly type = LOAD_ROLES_BY_USER;

  constructor(public payload: string) {
  }
}

export class LoadRolesByUserSuccess implements ActionWithPayload<string[]> {
  readonly type = LOAD_ROLES_BY_USER_RESPONSE

  constructor(public payload: string[]) {
  }
}

export class AssignRoles implements ActionWithPayload<User> {
  readonly type = ASSIGN_ROLES;

  constructor(public payload: User) {
  }
}

export class AssignRolesSuccess implements ActionWithPayload<ApiUserResponse> {
  readonly type = ASSIGN_ROLES_RESPONSE;
  payload: ApiUserResponse;

  constructor(user: User) {
    this.payload = normalize([user], [userSchema]);
  }
}

export class AssignRolesFailure implements ActionWithPayload<string> {
  readonly type = ASSIGN_ROLES_RESPONSE;
  error = true;
  payload: string;

  constructor(error: Error) {
    this.payload = error.message;
  }
}

export class LoadRolesByUserFailure implements ActionWithPayload<string> {
  readonly type = LOAD_ROLES_BY_USER_RESPONSE;
  error = true;
  payload: string;

  constructor(error: Error) {
    this.payload = error.message;
  }
}

export class CreatePermission implements ActionWithPayload<User> {
  readonly type = CREATE_PERMISSION;

  constructor(public payload: User) {
  }
}
