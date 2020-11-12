import {UserNavigator} from './user.navigator';

describe('UserNavigator', () => {
  let navigator: UserNavigator;
  let mockRouter;

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj('mockRouter', ['navigateByUrl', 'navigate']);
    navigator = new UserNavigator(mockRouter);
  });

  it('should navigate to /login when call #navigateToLogin', () => {
    navigator.navigateToLogin();

    expect(mockRouter.navigate).toHaveBeenCalledWith( [ '/login' ] , { queryParams: { previousUrl: undefined }});
  });

  it('should navigate to /dashboard when call #navigateToDashboard', () => {
    navigator.navigateToDashboard();

    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/dashboards');
  });

});
