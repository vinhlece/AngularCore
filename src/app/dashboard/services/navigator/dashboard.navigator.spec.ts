import {DashboardNavigatorImpl} from './dashboard.navigator';
import {DashboardNavigator} from '..';

describe('DashboardNavigator', () => {
  let navigator: DashboardNavigator;
  let mockRouter;

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj('mockRouter', ['navigateByUrl']);
    navigator = new DashboardNavigatorImpl(mockRouter);
  });

  it('should navigate to /dashboard when call #navigateToDashboardList', () => {
    navigator.navigateToDashboardList();

    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/dashboards');
  });

  it('should navigate to /dashboard/id when call #navigateToDashboardDetails', () => {
    navigator.navigateToDashboardDetails('1');

    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/dashboards/1');
  });

});
