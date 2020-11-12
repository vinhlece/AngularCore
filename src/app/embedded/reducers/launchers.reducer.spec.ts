import deepFreeze from '../../common/testing/deepFreeze';
import * as embeddedActions from '../actions/embedded.actions';
import * as fromLaunchers from './launchers.reducer';

describe('LaunchersReducer', () => {
  it('should set launcher size', () => {
    const stateBefore: fromLaunchers.State = {
      sizes: {}
    };
    const stateAfter: fromLaunchers.State = {
      sizes: {
        'launcher 1': {width: 1, height: 2}
      }
    };
    const action = new embeddedActions.SetLauncherSize({id: 'launcher 1', size: {width: 1, height: 2}});

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(fromLaunchers.reducer(stateBefore, action)).toEqual(stateAfter);
  });

  it('should replace launcher size', () => {
    const stateBefore: fromLaunchers.State = {
      sizes: {
        'launcher 1': {width: 5, height: 6}
      }
    };
    const stateAfter: fromLaunchers.State = {
      sizes: {
        'launcher 1': {width: 1, height: 2}
      }
    };
    const action = new embeddedActions.SetLauncherSize({id: 'launcher 1', size: {width: 1, height: 2}});

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(fromLaunchers.reducer(stateBefore, action)).toEqual(stateAfter);
  });
});
