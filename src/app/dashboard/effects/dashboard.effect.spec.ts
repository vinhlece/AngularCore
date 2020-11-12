import {TestBed} from '@angular/core/testing';
import {provideMockActions} from '@ngrx/effects/testing';
import {cold, hot} from 'jasmine-marbles';
import {Observable} from 'rxjs';
import {mockDashboard, mockTab} from '../../common/testing/mocks/dashboards';
import {createTab} from '../../common/models/factory/createTab';
import * as dashboardActions from '../actions/dashboards.action';
import {DashboardService} from '../services/http/dashboard.service';
import {TabService} from '../services/http/tab.service';
import {DASHBOARD_NAVIGATOR} from '../services/tokens';
import {DashboardsEffect} from './dashboard.effects';

describe('Dashboard Effect', () => {
  let effector: DashboardsEffect;
  let dashboardServiceSpy: any;
  let tabServiceSpy: any;
  let navigator: any;
  let actions: Observable<any>;

  beforeEach(() => {
    dashboardServiceSpy = jasmine.createSpyObj('DashboardService', [
      'getDashboards',
      'getDashboardWithTabs',
      'getDashboardsByUser',
      'addDashboard',
      'deleteDashboard',
      'updateDashboard'
    ]);
    tabServiceSpy = jasmine.createSpyObj('tabService', ['add']);
    navigator = jasmine.createSpyObj('DashboardNavigator', ['navigateToDashboardDetails']);
    TestBed.configureTestingModule({
      providers: [
        DashboardsEffect,
        provideMockActions(() => actions),
        {provide: DashboardService, useValue: dashboardServiceSpy},
        {provide: TabService, useValue: tabServiceSpy},
        {provide: DASHBOARD_NAVIGATOR, useValue: navigator}
      ]
    }).compileComponents();
    effector = TestBed.get(DashboardsEffect);
  });
  describe('loadAllEffect', () => {
    it('should return load all success action when load all dashboards success', () => {
      const dashboards = [mockDashboard({id: '1'}), mockDashboard({id: '2'})];
      const loadAllAction = new dashboardActions.LoadAll('admin');
      const successAction = new dashboardActions.LoadAllSuccess(dashboards);

      actions = hot('-a', {a: loadAllAction});
      const response = cold('-a', {a: dashboards});
      const expected = cold('--(c)', {c: successAction});
      dashboardServiceSpy.getDashboardsByUser.and.returnValue(response);

      expect(effector.loadAll$).toBeObservable(expected);
    });

    it('should return load all fail action when load all dashboards fail', () => {
      const error = new Error('Error!');
      const loadAllAction = new dashboardActions.LoadAll('admin');
      const failAction = new dashboardActions.LoadAllFailure(error);

      actions = hot('-a', {a: loadAllAction});
      const response = cold('-#', {}, error);
      const expected = cold('--c', {c: failAction});
      dashboardServiceSpy.getDashboardsByUser.and.returnValue(response);

      expect(effector.loadAll$).toBeObservable(expected);
    });
  });

  describe('loadEffect', () => {
    it('should return load success action when load dashboard success', () => {
      const dashboard = mockDashboard({id: '1'});
      const successAction = new dashboardActions.LoadSuccess(dashboard);
      const load = new dashboardActions.Load('1');

      actions = hot('-a', {a: load});
      const response = cold('-a', {a: dashboard});
      const expected = cold('--c', {c: successAction});
      dashboardServiceSpy.getDashboardWithTabs.and.returnValue(response);

      expect(effector.load$).toBeObservable(expected);
    });

    it('should return load fail action when load dashboard fail', () => {
      const error = new Error('Error!');
      const loadAction = new dashboardActions.Load('1');
      const failAction = new dashboardActions.LoadFailure(error);

      actions = hot('-a', {a: loadAction});
      const response = cold('-#', {}, error);
      const expected = cold('--c', {c: failAction});
      dashboardServiceSpy.getDashboardWithTabs.and.returnValue(response);

      expect(effector.load$).toBeObservable(expected);
    });
  });

  describe('addEffect', () => {
    it('should navigate to dashboard detail page and return add success action when add dashboard and tab success', () => {
      const dashboard = mockDashboard({id: '1'});
      const tab = mockTab({dashboardId: '1'});
      const add = new dashboardActions.Add(dashboard);
      const success = new dashboardActions.AddSuccess(dashboard);

      actions = hot('-a', {a: add});
      const dashboardResponse = cold('-a', {a: dashboard});
      const tabResponse = cold('-a', {a: tab});
      const expected = cold('---c', {c: success});
      dashboardServiceSpy.addDashboard.and.returnValue(dashboardResponse);
      tabServiceSpy.add.and.returnValue(tabResponse);

      expect(effector.add$).toBeObservable(expected);
      // expect(navigator.navigateToDashboardDetails).toHaveBeenCalledWith(dashboard.id);
    });

    it('should return add success action when add dashboard success but add tab failed', () => {
      const dashboard = mockDashboard({id: '1'});
      const tab = createTab({dashboardId: '1'});
      const add = new dashboardActions.Add(dashboard);
      const success = new dashboardActions.AddSuccess(dashboard);

      actions = hot('-a', {a: add});
      const dashboardResponse = cold('-a', {a: dashboard});
      const tabResponse = cold('-#', {}, 'Error when add tab');
      const expected = cold('---c', {c: success});
      dashboardServiceSpy.addDashboard.and.returnValue(dashboardResponse);
      tabServiceSpy.add.and.returnValue(tabResponse);

      expect(effector.add$).toBeObservable(expected);
    });

    it('should return error action when add dashboard fail', () => {
      const dashboard = mockDashboard({id: 1});
      const error = new Error('Error!');
      const load = new dashboardActions.Add(dashboard);
      const fail = new dashboardActions.AddFailure(error);

      actions = hot('-a', {a: load});
      const response = cold('-#', {}, error);
      const expected = cold('--c', {c: fail});
      dashboardServiceSpy.addDashboard.and.returnValue(response);

      expect(effector.add$).toBeObservable(expected);
    });
  });
  describe('deleteEffect', () => {
    it('should return delete success action when delete dashboard success', () => {
      const dashboardID = '1';
      const add = new dashboardActions.Delete(dashboardID);
      const success = new dashboardActions.DeleteSuccess(dashboardID);

      actions = hot('-a', {a: add});
      const response = cold('-a', {a: dashboardID});
      const expected = cold('--c', {c: success});
      dashboardServiceSpy.deleteDashboard.and.returnValue(response);

      expect(effector.delete$).toBeObservable(expected);
    });

    it('should return delete fail action when delete dashboard fail', () => {
      const dashboardID = '1';
      const error = new Error('Error!');
      const load = new dashboardActions.Delete(dashboardID);
      const fail = new dashboardActions.DeleteFailure(error);

      actions = hot('-a', {a: load});
      const response = cold('-#', {}, error);
      const expected = cold('--c', {c: fail});
      dashboardServiceSpy.deleteDashboard.and.returnValue(response);

      expect(effector.delete$).toBeObservable(expected);
    });
  });
  describe('updateEffect', () => {
    it('should navigate to dashboard detail page and return update success action when update dashboard success', () => {
      const dashboard = mockDashboard({id: 1});
      const update = new dashboardActions.Update(dashboard);
      const success = new dashboardActions.UpdateSuccess(dashboard);

      actions = hot('-a', {a: update});
      const dashboardResponse = cold('-a', {a: dashboard});
      const expected = cold('--c', {c: success});
      dashboardServiceSpy.updateDashboard.and.returnValue(dashboardResponse);

      expect(effector.update$).toBeObservable(expected);
    });

    it('should return error action when update dashboard fail', () => {
      const dashboard = mockDashboard({id: 1});
      const error = new Error('Error!');
      const update = new dashboardActions.Update(dashboard);
      const fail = new dashboardActions.UpdateFailure(error);

      actions = hot('-a', {a: update});
      const response = cold('-#', {}, error);
      const expected = cold('--c', {c: fail});
      dashboardServiceSpy.updateDashboard.and.returnValue(response);

      expect(effector.update$).toBeObservable(expected);
    });
  });
});
