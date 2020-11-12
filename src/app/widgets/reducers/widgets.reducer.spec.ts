import {mockWidgets} from '../../common/testing/mocks/widgets';
import deepFreeze from '../../common/testing/deepFreeze';
import * as widgetsActions from '../actions/widgets.actions';
import * as fromWidgets from './widgets.reducer';

describe('widget reducer', () => {
  const widget = mockWidgets()[0];

  it('should set ids array with load all widget success action', () => {
    const stateBefore: fromWidgets.State = {
      ids: []
    };
    const stateAfter: fromWidgets.State = {
      ids: ['1', '2', '3']
    };
    const action = new widgetsActions.LoadAllSuccess([{...widget, id: '1'}, {...widget, id: '2'}, {...widget, id: '3'}]);
    deepFreeze(stateBefore);
    deepFreeze(action);
    expect(fromWidgets.reducer(stateBefore, action)).toEqual(stateAfter);
  });

  it('should add new id with load widget success action', () => {
    const stateBefore: fromWidgets.State = {
      ids: ['1', '2']
    };
    const stateAfter: fromWidgets.State = {
      ids: ['1', '2', '3']
    };
    const action = new widgetsActions.LoadSuccess({...widget, id: '3'});
    deepFreeze(stateBefore);
    deepFreeze(action);
    expect(fromWidgets.reducer(stateBefore, action)).toEqual(stateAfter);
  });

  it('should do nothing with load widget success action has id already in the ids array', () => {
    const stateBefore: fromWidgets.State = {
      ids: ['1', '2']
    };
    const stateAfter: fromWidgets.State = {
      ids: ['1', '2']
    };
    const action = new widgetsActions.LoadSuccess({...widget, id: '1'});
    deepFreeze(stateBefore);
    deepFreeze(action);
    expect(fromWidgets.reducer(stateBefore, action)).toEqual(stateAfter);
  });

  it('should add new id with add widget success action', () => {
    const stateBefore: fromWidgets.State = {
      ids: ['1', '2']
    };
    const stateAfter: fromWidgets.State = {
      ids: ['1', '2', '3']
    };
    const action = new widgetsActions.AddSuccess({...widget, id: '3'});
    deepFreeze(stateBefore);
    deepFreeze(action);
    expect(fromWidgets.reducer(stateBefore, action)).toEqual(stateAfter);
  });

  it('should add new ids with search success action', () => {
    const stateBefore: fromWidgets.State = {
      ids: ['1', '2']
    };
    const stateAfter: fromWidgets.State = {
      ids: ['1', '2', '3']
    };
    const action = new widgetsActions.SearchSuccess([{...widget, id: '1'}, {...widget, id: '2'}, {...widget, id: '3'}]);
    deepFreeze(stateBefore);
    deepFreeze(action);
    expect(fromWidgets.reducer(stateBefore, action)).toEqual(stateAfter);
  });
});
