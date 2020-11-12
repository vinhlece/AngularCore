import {mockDashboard, mockDashboards} from '../../common/testing/mocks/dashboards';
import deepFreeze from '../../common/testing/deepFreeze';
import * as dashboardsActions from '../actions/dashboards.action';
import {LaunchType} from '../models/enums';
import * as fromDashboards from './dashboards.reducer';

describe('Dashboard Reducer', () => {
  it('should set dashboards ids with load all success action', () => {
    const dashboards = mockDashboards();
    const ids = dashboards.map(item => item.id);
    const stateBefore: fromDashboards.State = {
      ids: [],
      launchMode: LaunchType.INTEGRATED
    };
    const stateAfter: fromDashboards.State = {
      ids,
      launchMode: LaunchType.INTEGRATED
    };
    const action = new dashboardsActions.LoadAllSuccess(mockDashboards());

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(fromDashboards.reducer(stateBefore, action)).toEqual(stateAfter);
  });

  it('should add new id with load success action', () => {
    const dashboard = mockDashboard();
    const stateBefore: fromDashboards.State = {
      ids: ['1', '2'],
      launchMode: LaunchType.INTEGRATED
    };
    const stateAfter: fromDashboards.State = {
      ids: ['1', '2', '3'],
      launchMode: LaunchType.INTEGRATED
    };
    const action = new dashboardsActions.LoadSuccess({...dashboard, id: '3'});
    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(fromDashboards.reducer(stateBefore, action)).toEqual(stateAfter);
  });

  it('should do nothing with load success action has id already in the ids array', () => {
    const dashboard = mockDashboard();
    const stateBefore: fromDashboards.State = {
      ids: ['1', '2'],
      launchMode: LaunchType.INTEGRATED
    };
    const stateAfter: fromDashboards.State = {
      ids: ['1', '2'],
      launchMode: LaunchType.INTEGRATED
    };
    const action = new dashboardsActions.LoadSuccess({...dashboard, id: '2'});
    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(fromDashboards.reducer(stateBefore, action)).toEqual(stateAfter);
  });

  it('should add new id with add success action', () => {
    const dashboard = mockDashboard();
    const stateBefore: fromDashboards.State = {
      ids: ['1', '2'],
      launchMode: LaunchType.INTEGRATED
    };
    const stateAfter: fromDashboards.State = {
      ids: ['1', '2', '3'],
      launchMode: LaunchType.INTEGRATED
    };
    const action = new dashboardsActions.AddSuccess({...dashboard, id: '3'});
    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(fromDashboards.reducer(stateBefore, action)).toEqual(stateAfter);
  });

  it('should set launch mode to Integrated', () => {
    const stateBefore: fromDashboards.State = {
      ids: [],
      launchMode: LaunchType.STANDALONE
    };
    const stateAfter: fromDashboards.State = {
      ids: [],
      launchMode: LaunchType.INTEGRATED
    };
    const action = new dashboardsActions.LaunchIntegrated();

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(fromDashboards.reducer(stateBefore, action)).toEqual(stateAfter);
  });

  it('should set launch mode to Standalone', () => {
    const stateBefore: fromDashboards.State = {
      ids: [],
      launchMode: LaunchType.INTEGRATED
    };
    const stateAfter: fromDashboards.State = {
      ids: [],
      launchMode: LaunchType.STANDALONE
    };
    const action = new dashboardsActions.LaunchStandalone();

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(fromDashboards.reducer(stateBefore, action)).toEqual(stateAfter);
  });
});
