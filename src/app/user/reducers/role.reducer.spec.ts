import deepFreeze from '../../common/testing/deepFreeze';
import * as roleActions from '../actions/role.action';
import {User} from '../models/user';
import * as fromRole from './role.reducer';
import {Role} from '../../common/models/index';

describe('RoleReducer', () => {
  it('should set all role with load success action', () => {
    const role: Role = {id: '1', name: 'Dashboard'};

    const stateBefore: fromRole.State = {
      roles: [],
      errorMessage: null
    };
    const stateAfter: fromRole.State = {
      roles: [role],
      errorMessage: null
    };
    const action = new roleActions.LoadAllSuccess([role]);

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(fromRole.reducer(stateBefore, action)).toEqual(stateAfter);
  });

  it('should set error message with role failure action', () => {
    const stateBefore: fromRole.State = {
      roles: [],
      errorMessage: null
    };
    const stateAfter: fromRole.State = {
      roles: [],
      errorMessage: 'Error message'
    };
    const action = new roleActions.ActionError(new Error('Error message'));
    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(fromRole.reducer(stateBefore, action)).toEqual(stateAfter);
  });

  it('should set role with add role success action', () => {
    const stateBefore: fromRole.State = {
      roles: [],
      errorMessage: null
    };

    const role: Role = {id: '1', name: 'Dashboard'};
    const stateAfter: fromRole.State = {
      roles: [role],
      errorMessage: null
    };
    const action = new roleActions.AddSuccess(role);

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(fromRole.reducer(stateBefore, action)).toEqual(stateAfter);
  });

  it('should set role state to null with delete success role action', () => {
    const user: User = {id: 'admin', displayName: 'Admin', password: '123'};

    const stateBefore: fromRole.State = {
      roles: [{
        id: '1',
        name: 'Dashboard'
      }],
      errorMessage: null
    };
    const stateAfter: fromRole.State = {
      roles: [],
      errorMessage: null
    };
    const action = new roleActions.DeleteSuccess('1');

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(fromRole.reducer(stateBefore, action)).toEqual(stateAfter);
  });
});
