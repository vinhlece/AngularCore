import deepFreeze from '../../common/testing/deepFreeze';
import * as usersActions from '../actions/user.actions';
import {User} from '../models/user';
import * as fromUser from './user.reducer';

describe('UserReducer', () => {
  it('should set authenticated user with login success action', () => {
    const user: User = {id: 'admin', displayName: 'Admin', password: '12345678'};

    const stateBefore: fromUser.State = {
      authenticatedUserId: null,
      errorMessage: null,
      users: [],
      rolesEditing: []
    };
    const stateAfter: fromUser.State = {
      authenticatedUserId: user.id,
      errorMessage: null,
      users: [],
      rolesEditing: []
    };
    const action = new usersActions.LoginSuccess(user);

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(fromUser.reducer(stateBefore, action)).toEqual(stateAfter);
  });

  it('should set error message with login failure action', () => {
    const stateBefore: fromUser.State = {
      authenticatedUserId: null,
      errorMessage: null,
      users: [],
      rolesEditing: []
    };
    const stateAfter: fromUser.State = {
      authenticatedUserId: null,
      errorMessage: 'Error message',
      users: [],
      rolesEditing: []
    };
    const action = new usersActions.LoginFailure(new Error('Error message'));

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(fromUser.reducer(stateBefore, action)).toEqual(stateAfter);
  });

  it('should set error message with sign up failure action', () => {
    const stateBefore: fromUser.State = {
      authenticatedUserId: null,
      errorMessage: null,
      users: [],
      rolesEditing: []
    };
    const stateAfter: fromUser.State = {
      authenticatedUserId: null,
      errorMessage: 'Error message',
      users: [],
      rolesEditing: []
    };
    const action = new usersActions.SignUpFailure(new Error('Error message'));

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(fromUser.reducer(stateBefore, action)).toEqual(stateAfter);
  });

  it('should set authenticated user to null with logout action', () => {
    const user: User = {id: 'admin', displayName: 'Admin', password: '12345678'};

    const stateBefore: fromUser.State = {
      authenticatedUserId: user.id,
      errorMessage: null,
      users: [],
      rolesEditing: []
    };
    const stateAfter: fromUser.State = {
      authenticatedUserId: null,
      errorMessage: null,
      users: [],
      rolesEditing: []
    };
    const action = new usersActions.Logout();

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(fromUser.reducer(stateBefore, action)).toEqual(stateAfter);
  });

  it('should load all success action', () => {
    const user: User = {id: 'admin', displayName: 'Admin', password: '12345678'};

    const stateBefore: fromUser.State = {
      authenticatedUserId: null,
      errorMessage: null,
      users: [],
      rolesEditing: []
    };
    const stateAfter: fromUser.State = {
      authenticatedUserId: null,
      errorMessage: null,
      users: [user],
      rolesEditing: []
    };
    const action = new usersActions.LoadAllSuccess([user]);

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(fromUser.reducer(stateBefore, action)).toEqual(stateAfter);
  });

  it('should set error message with load all failure action', () => {
    const stateBefore: fromUser.State = {
      authenticatedUserId: null,
      errorMessage: null,
      users: [],
      rolesEditing: []
    };
    const stateAfter: fromUser.State = {
      authenticatedUserId: null,
      errorMessage: 'Error message',
      users: [],
      rolesEditing: []
    };
    const action = new usersActions.LoadAllFailure(new Error('Error message'));

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(fromUser.reducer(stateBefore, action)).toEqual(stateAfter);
  });

  it('should delete a user success action', () => {
    const user: User = {id: 'admin', displayName: 'Admin', password: '12345678'};

    const stateBefore: fromUser.State = {
      authenticatedUserId: null,
      errorMessage: null,
      users: [user],
      rolesEditing: []
    };
    const stateAfter: fromUser.State = {
      authenticatedUserId: null,
      errorMessage: null,
      users: [],
      rolesEditing: []
    };
    const action = new usersActions.DeleteUserSuccess(user.id);

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(fromUser.reducer(stateBefore, action)).toEqual(stateAfter);
  });

  it('should set error message with delete a user failure action', () => {
    const user: User = {id: 'admin', displayName: 'Admin', password: '12345678'};
    const stateBefore: fromUser.State = {
      authenticatedUserId: null,
      errorMessage: null,
      users: [user],
      rolesEditing: []
    };
    const stateAfter: fromUser.State = {
      authenticatedUserId: null,
      errorMessage: 'Error message',
      users: [user],
      rolesEditing: []
    };
    const action = new usersActions.DeleteUserFailure(new Error('Error message'));

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(fromUser.reducer(stateBefore, action)).toEqual(stateAfter);
  });

  it('should add new id with add success action', () => {
    const user: User = {id: 'admin', displayName: 'Admin', password: '12345678'};

    const stateBefore: fromUser.State = {
      authenticatedUserId: null,
      errorMessage: null,
      users: [],
      rolesEditing: []
    };
    const stateAfter: fromUser.State = {
      authenticatedUserId: null,
      errorMessage: null,
      users: [user],
      rolesEditing: []
    };
    const action = new usersActions.AddUserSuccess(user);

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(fromUser.reducer(stateBefore, action)).toEqual(stateAfter);
  });

  it('should set error message with add a user failure action', () => {
    const stateBefore: fromUser.State = {
      authenticatedUserId: null,
      errorMessage: null,
      users: [],
      rolesEditing: []
    };
    const stateAfter: fromUser.State = {
      authenticatedUserId: null,
      errorMessage: 'Error message',
      users: [],
      rolesEditing: []
    };
    const action = new usersActions.AddUserFailure(new Error('Error message'));

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(fromUser.reducer(stateBefore, action)).toEqual(stateAfter);
  });
});
