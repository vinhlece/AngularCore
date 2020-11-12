import * as fromUi from './ui.reducer';
import * as requestActions from '../actions/request.actions';
import deepFreeze from '../../common/testing/deepFreeze';

describe('ui.reducer', () => {
  it('should in isLoading state with an action extends StartAction', () => {
    const stateBefore: fromUi.State = {
      loading: false,
      errorMessage: '',
    };
    const stateAfter: fromUi.State = {
      loading: true,
      errorMessage: ''
    };

    const action = new requestActions.StartAction();

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(fromUi.reducer(stateBefore, action)).toEqual(stateAfter);
  });

  it('should reset loading state, update loaded items with an action extends SuccessAction', () => {
    const stateBefore: fromUi.State = {
      loading: true,
      errorMessage: '',
    };
    const stateAfter: fromUi.State = {
      loading: false,
      errorMessage: ''
    };
    const action = new requestActions.SuccessAction();

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(fromUi.reducer(stateBefore, action)).toEqual(stateAfter);
  });

  it('should set errorMessage, stop loading with an action extends FailAction', () => {
    const stateBefore: fromUi.State = {
      loading: true,
      errorMessage: '',
    };
    const stateAfter: fromUi.State = {
      loading: false,
      errorMessage: 'Error!'
    };
    const action = new requestActions.FailAction('Error!');

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(fromUi.reducer(stateBefore, action)).toEqual(stateAfter);
  });

});
