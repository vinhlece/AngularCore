import {TestBed} from '@angular/core/testing';
import {provideMockActions} from '@ngrx/effects/testing';
import {Action, Store} from '@ngrx/store';
import {cold, getTestScheduler, hot} from 'jasmine-marbles';
import {Observable, of} from 'rxjs';
import {UserNavigator} from '../../layout/navigator/user.navigator';
import {
  GetRoles,
  Login, LoginBySession,
  LoginFailure,
  LoginSuccess,
  Logout,
  SignUp,
  SignUpFailure,
  SignUpSuccess, Update, UpdateSuccess
} from '../actions/user.actions';
import {Credentials} from '../models/user';
import {AuthenticationService} from '../services/auth/authentication.service';
import {APP_BOOTSTRAP, SESSION} from '../services/tokens';
import {AuthenticationEffects} from './authentication.effects';
import {UserRolesService} from '../services/settings/user-roles.service';

describe('AuthenticationEffect', () => {
  let mockAuthenticationService;
  let mockPermissionService;
  let mockNavigator;
  let mockStore;
  let mockSession;
  let mockAppBootstrap;
  let effects: AuthenticationEffects;
  let actions: Observable<Action>;

  beforeEach(() => {
    mockNavigator = jasmine.createSpyObj('mockNavigator', ['navigateToLogin', 'navigateToDashboard', 'unSubAutoLogin', 'navigateTo']);
    mockAuthenticationService = jasmine.createSpyObj('AuthenticationService', ['loginUser', 'signupUser', 'loginBySession', 'updateUser']);
    mockPermissionService = jasmine.createSpyObj('UserRolesService', ['getRolesForUser']);
    mockSession = jasmine.createSpyObj('session', ['setUser', 'getUser', 'removeUser']);
    mockSession.getUser.and.returnValue({});
    mockAppBootstrap = jasmine.createSpyObj('appBootstrap', ['bootstrap', 'cleanUp']);
    mockStore = jasmine.createSpyObj('store', ['dispatch', 'pipe']);
    mockStore.pipe.and.returnValue(of({id: '', displayName: ''}));

    TestBed.configureTestingModule({
      providers: [
        AuthenticationEffects,
        provideMockActions(() => actions),
        {
          provide: Store,
          useValue: mockStore
        },
        {
          provide: AuthenticationService,
          useValue: mockAuthenticationService
        },
        {
          provide: UserRolesService,
          useValue: mockPermissionService
        },
        {
          provide: UserNavigator,
          useValue: mockNavigator
        },
        {
          provide: SESSION,
          useValue: mockSession
        },
        {
          provide: APP_BOOTSTRAP,
          useValue: mockAppBootstrap
        }
      ]
    });
  });

  describe('login$', () => {
    // TODO Tom to fix sprint 12
    xit('should call get roles action when login successfully', () => {
      const user = {id: 'username', displayName: 'username', password: 'password'};
      const credentials: Credentials = {userName: 'username', password: 'password'};
      const loginAction = new Login(credentials, {doNavigation: true});
      const successAction = new GetRoles(
        {id: 'username', displayName: 'username', password: 'password', token: 'I--am&&kdfA-gToken'},
        {doNavigation: true}, false);

      actions               = hot('-a-', {a: loginAction});
      const serviceResponse = cold('-a-', {a: user});
      const expected        = cold('--a-', {a: successAction});
      mockAuthenticationService.loginUser.and.returnValue(serviceResponse);

      effects = TestBed.get(AuthenticationEffects);
      expect(effects.login$).toBeObservable(expected);
    });

    it('should call AuthenticationService.loginUser with correct arguments', () => {
      const user = {id: 'username', displayName: 'username'};
      const credentials: Credentials = {userName: 'username', password: 'password'};
      const loginAction = new Login(credentials);

      actions = hot('-a', {a: loginAction});
      const serviceResponse = cold('-a', {a: user});
      mockAuthenticationService.loginUser.and.returnValue(serviceResponse);

      effects = TestBed.get(AuthenticationEffects);
      effects.login$.subscribe();
      getTestScheduler().flush();
      expect(mockAuthenticationService.loginUser).toHaveBeenCalledWith('username', 'password');
    });

    it('should emit login failure action when login failed', () => {
      const credentials: Credentials = {userName: 'username', password: 'password'};
      const loginAction = new Login(credentials);
      const error = new Error('Username or password is invalid.');
      const failAction = new LoginFailure(error);

      actions = hot('-a', {a: loginAction});
      const serviceResponse = cold('-#', {}, error);
      const expected = cold('--a', {a: failAction});
      mockAuthenticationService.loginUser.and.returnValue(serviceResponse);

      effects = TestBed.get(AuthenticationEffects);
      expect(effects.login$).toBeObservable(expected);
    });
  });

  describe('getRoles$', () => {
    it('should dispatch login success action when get roles succeeds', () => {
      const user = {id: 'username', displayName: 'username', token: 'I--am&&kdfA-gToken', password: 'password'};
      const getRolesAction = new GetRoles(user, {doNavigation: true});
      const successAction = new LoginSuccess({...user, roles: ['1', '2']});

      actions = hot('-a', {a: getRolesAction});
      const serviceResponse = cold('-a', {a: ['1', '2']});
      mockPermissionService.getRolesForUser.and.returnValue(serviceResponse);

      effects = TestBed.get(AuthenticationEffects);
      effects.getRoles$.subscribe();
      getTestScheduler().flush();
      expect(mockStore.dispatch).toHaveBeenCalledWith(successAction);
    });

    it('should call UserRolesService.getRolesForUser with correct arguments', () => {
      const user = {id: 'username', displayName: 'username', token: 'I--am&&kdfA-gToken', password: 'password'};
      const getRolesAction = new GetRoles(user, {doNavigation: true});

      actions = hot('-a', {a: getRolesAction});
      const serviceResponse = cold('-a', {a: ['1', '2']});
      mockPermissionService.getRolesForUser.and.returnValue(serviceResponse);

      effects = TestBed.get(AuthenticationEffects);
      effects.getRoles$.subscribe();
      getTestScheduler().flush();
      expect(mockPermissionService.getRolesForUser).toHaveBeenCalledWith(user.id);
    });

    it('should call router.navigate to /dashboard for get roles action with doNavigation meta = true', () => {
      const user = {id: 'username', displayName: 'username', token: 'I--am&&kdfA-gToken', password: 'password'};
      const getRolesAction = new GetRoles(user, {previousUrl: 'dashboard', doNavigation: true});

      actions = hot('-a', {a: getRolesAction});
      const serviceResponse = cold('-a', {a: ['1', '2']});
      mockPermissionService.getRolesForUser.and.returnValue(serviceResponse);

      effects = TestBed.get(AuthenticationEffects);
      effects.getRoles$.subscribe();
      getTestScheduler().flush();
      expect(mockNavigator.navigateTo).toHaveBeenCalledWith(getRolesAction.meta.previousUrl);
    });

    it('should not call router.navigate to /dashboard for get roles action with doNavigation meta = false', () => {
      const user = {id: 'username', displayName: 'username', token: 'I--am&&kdfA-gToken', password: 'password'};
      const getRolesAction = new GetRoles(user, {doNavigation: false});

      actions = hot('-a', {a: getRolesAction});
      const serviceResponse = cold('-a', {a: ['1', '2']});
      mockPermissionService.getRolesForUser.and.returnValue(serviceResponse);

      effects = TestBed.get(AuthenticationEffects);
      effects.getRoles$.subscribe();
      getTestScheduler().flush();
      expect(mockNavigator.navigateToDashboard).not.toHaveBeenCalled();
    });

    it('should emit login failure action when get roles failed', () => {
      const user = {id: 'username', displayName: 'username', token: 'I--am&&kdfA-gToken', password: 'password'};
      const getRolesAction = new GetRoles(user, {doNavigation: false});
      const error = new Error('get roles failed.');
      const failAction = new LoginFailure(error);

      actions = hot('-a', {a: getRolesAction});
      const serviceResponse = cold('-#', {}, error);
      const expected = cold('--a', {a: failAction});
      mockPermissionService.getRolesForUser.and.returnValue(serviceResponse);

      effects = TestBed.get(AuthenticationEffects);
      expect(effects.getRoles$).toBeObservable(expected);
    });
  });

  describe('logout$', () => {
    it('should navigate to Login', () => {
      const logoutAction = new Logout();
      actions = hot('-a', {a: logoutAction});

      effects = TestBed.get(AuthenticationEffects);
      effects.logout$.subscribe();
      getTestScheduler().flush();
      expect(mockNavigator.unSubAutoLogin).toHaveBeenCalled();
    });

    it('should clean up', () => {
      const logoutAction = new Logout();
      actions = hot('-a', {a: logoutAction});

      effects = TestBed.get(AuthenticationEffects);
      effects.logout$.subscribe();
      getTestScheduler().flush();
      expect(mockAppBootstrap.cleanUp).toHaveBeenCalled();
    });
  });

  describe('signup$', () => {
    it('should emit SignupSucceed action when signup succeeds', () => {
      const credentials: Credentials = {userName: 'username', password: 'password'};
      const signUpAction = new SignUp(credentials);
      const successAction = new SignUpSuccess({id: 'username', displayName: 'username', password: 'password'});
      const user = {
        id: 'username',
        displayName: 'username',
        password: 'password'
      };

      actions = hot('-a', {a: signUpAction});
      const serviceResponse = cold('-a', {a: user});
      const expected = cold('--a', {a: successAction});
      mockAuthenticationService.signupUser.and.returnValue(serviceResponse);


      effects = TestBed.get(AuthenticationEffects);
      expect(effects.signup$).toBeObservable(expected);
    });

    it('should emit SignupFail action when signup fails', () => {
      const credentials: Credentials = {userName: 'username', password: 'password'};
      const signUpAction = new SignUp(credentials);
      const error = new Error('Username already exists.');
      const failAction = new SignUpFailure(error);

      actions = hot('-a', {a: signUpAction});
      const serviceResponse = cold('-#', {}, error);
      const expected = cold('--a', {a: failAction});
      mockAuthenticationService.signupUser.and.returnValue(serviceResponse);

      effects = TestBed.get(AuthenticationEffects);
      expect(effects.signup$).toBeObservable(expected);
    });

    it('should call AuthenticationService.signupUser with correct arguments', () => {
      const credentials: Credentials = {userName: 'username', password: 'password'};
      const signUpAction = new SignUp(credentials);
      const user = {
        id: 'username',
        displayName: 'username',
        password: 'password'
      };
      const successAction = new SignUpSuccess(user);

      actions = hot('-a', {a: signUpAction});
      const serviceResponse = cold('-a', {a: user});
      const expected = cold('--a', {a: successAction});
      mockAuthenticationService.signupUser.and.returnValue(serviceResponse);

      effects = TestBed.get(AuthenticationEffects);
      expect(effects.signup$).toBeObservable(expected);
      expect(mockAuthenticationService.signupUser).toHaveBeenCalledWith('username', 'password');
    });

    it('should call router.navigate to /login', () => {
      const credentials: Credentials = {userName: 'username', password: 'password'};
      const signUpAction = new SignUp(credentials);
      const user = {
        id: 'username',
        displayName: 'username',
        password: 'password'
      };
      const successAction = new SignUpSuccess(user);

      actions = hot('-a', {a: signUpAction});
      const serviceResponse = cold('-a', {a: user});
      const expected = cold('--a', {a: successAction});
      mockAuthenticationService.signupUser.and.returnValue(serviceResponse);

      effects = TestBed.get(AuthenticationEffects);
      expect(effects.signup$).toBeObservable(expected);
      expect(mockNavigator.unSubAutoLogin).toHaveBeenCalled();
    });
  });

  describe('loginBySession$', () => {
    it('should call get roles action when login by session successfully', () => {
      const user = {id: 'username', displayName: 'username', password: 'password'};
      const loginAction = new LoginBySession(user);
      const successAction = new GetRoles(user, null, true);

      actions               = hot('-a-', {a: loginAction});
      const serviceResponse = cold('-a-', {a: user});
      const expected        = cold('--a-', {a: successAction});
      mockAuthenticationService.loginBySession.and.returnValue(serviceResponse);

      effects = TestBed.get(AuthenticationEffects);
      expect(effects.loginBySession$).toBeObservable(expected);
    });

    it('should call AuthenticationService.loginBySession with correct arguments', () => {
      const user = {id: 'username', displayName: 'username', password: 'password'};
      const loginAction = new LoginBySession(user);

      actions               = hot('-a-', {a: loginAction});
      const serviceResponse = cold('-a-', {a: user});
      mockAuthenticationService.loginBySession.and.returnValue(serviceResponse);

      effects = TestBed.get(AuthenticationEffects);
      effects.loginBySession$.subscribe();
      getTestScheduler().flush();
      expect(mockAuthenticationService.loginBySession).toHaveBeenCalledWith(user);
    });

    it('should navigate to login service when login by session failed', () => {
      const user = {id: 'username', displayName: 'username', password: 'password'};
      const loginAction = new LoginBySession(user);
      const error = new Error('error while checking login by session.');

      actions               = hot('-a', {a: loginAction});
      const serviceResponse = cold('-#', {}, error);
      mockAuthenticationService.loginBySession.and.returnValue(serviceResponse);

      effects = TestBed.get(AuthenticationEffects);
      effects.loginBySession$.subscribe();
      getTestScheduler().flush();
      expect(mockNavigator.navigateToLogin).toHaveBeenCalled();
    });
  });

  describe('updateUser$', () => {
    it('should call update user success action vs set session when update user successfully', () => {
      const user = {id: 'username', displayName: 'username', password: 'password'};
      const updateAction = new Update(user);
      const successAction = new UpdateSuccess(user);

      actions               = hot('-a-', {a: updateAction});
      const serviceResponse = cold('-a-', {a: user});
      mockAuthenticationService.updateUser.and.returnValue(serviceResponse);

      effects = TestBed.get(AuthenticationEffects);
      effects.updateUser$.subscribe();
      getTestScheduler().flush();
      expect(mockStore.dispatch).toHaveBeenCalledWith(successAction);
      expect(mockSession.setUser).toHaveBeenCalledWith(user);
    });

    it('should call AuthenticationService.updateUser with correct arguments', () => {
      const user = {id: 'username', displayName: 'username', password: 'password'};
      const updateAction = new Update(user);

      actions               = hot('-a-', {a: updateAction});
      const serviceResponse = cold('-a-', {a: user});
      mockAuthenticationService.updateUser.and.returnValue(serviceResponse);

      effects = TestBed.get(AuthenticationEffects);
      effects.updateUser$.subscribe();
      getTestScheduler().flush();
      expect(mockAuthenticationService.updateUser).toHaveBeenCalledWith(user);
    });

    it('should emit login failure action when updating user failed', () => {
      const user = {id: 'username', displayName: 'username', password: 'password'};
      const updateAction = new Update(user);
      const error = new Error('error while updating user failed.');
      const failAction = new LoginFailure(error);

      actions               = hot('-a-', {a: updateAction});
      const serviceResponse = cold('-#', {}, error);
      const expected = cold('--a', {a: failAction});
      mockAuthenticationService.updateUser.and.returnValue(serviceResponse);

      effects = TestBed.get(AuthenticationEffects);
      expect(effects.updateUser$).toBeObservable(expected);
    });
  });
});
