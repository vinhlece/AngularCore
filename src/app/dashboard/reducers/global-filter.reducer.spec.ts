import deepFreeze from '../../common/testing/deepFreeze';
import * as tabsActions from '../actions/tabs.actions';
import * as fromGlobalFilter from './global-filter.reducer';

describe('GlobalFilters Reducer', () => {
  it('should add global filters with dispatch global filter action', () => {
    const stateBefore: fromGlobalFilter.State = {
      globalFilters: ['global filter']
    };
    const stateAfter: fromGlobalFilter.State = {
      globalFilters: ['new global filter']
    };
    const action = new tabsActions.GlobalFilters(stateAfter.globalFilters);

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(fromGlobalFilter.reducer(stateBefore, action)).toEqual(stateAfter);
  });
});
