import deepFreeze from '../../common/testing/deepFreeze';
import * as fromTimeExplorer from './time-explorer.reducer';
import * as timeExplorerActions from '../actions/time-explorer.actions';

describe('TimeExplorerReducer', () => {
  it('should mark time explorer as opened on open', () => {
    const stateBefore: fromTimeExplorer.State = {
      opened: false
    };
    const stateAfter: fromTimeExplorer.State = {
      opened: true
    };
    const action = new timeExplorerActions.Open();

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(fromTimeExplorer.reducer(stateBefore, action)).toEqual(stateAfter);
  });

  it('should mark time explorer as closed on close', () => {
    const stateBefore: fromTimeExplorer.State = {
      opened: true
    };
    const stateAfter: fromTimeExplorer.State = {
      opened: false
    };
    const action = new timeExplorerActions.Close();

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(fromTimeExplorer.reducer(stateBefore, action)).toEqual(stateAfter);
  });
});
