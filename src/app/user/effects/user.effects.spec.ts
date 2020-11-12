import {TestBed} from '@angular/core/testing';
import {provideMockActions} from '@ngrx/effects/testing';
import {Action, Store} from '@ngrx/store';
import {cold, getTestScheduler, hot} from 'jasmine-marbles';
import {Observable, of} from 'rxjs';
import {
  AddUser, AddUserFailure, AddUserSuccess, CreatePermission, DeleteUser, DeleteUserFailure, DeleteUserSuccess, LoadAll,
  LoadAllFailure,
  LoadAllSuccess
} from '../actions/user.actions';
import {User} from '../models/user';
import {UsersEffects} from './user.effects';
import {UsersService} from '../services/settings/users.service';
import {UserRolesService} from '../services/settings/user-roles.service';
import {Add} from '../../dashboard/actions/instance-color.actions';

describe('UserEffects', () => {
  let mockUserService;
  let mockUserRoleService;
  let mockStore;
  let actions: Observable<Action>;
  let effects: UsersEffects;

  beforeEach(() => {
    mockStore = jasmine.createSpyObj('store', ['pipe', 'dispatch', 'select']);
    mockUserService = jasmine.createSpyObj('UsersService',
      ['getAllUsers', 'createUser', 'deleteUser']);
    mockUserRoleService = jasmine.createSpyObj('UserRolesService',
      ['addRoleForUser']);
    TestBed.configureTestingModule({
      providers: [
        UsersEffects,
        provideMockActions(() => actions),
        {
          provide: Store,
          useValue: mockStore
        },
        {
          provide: UsersService,
          useValue: mockUserService
        },
        {
          provide: UserRolesService,
          useValue: mockUserRoleService
        }
      ]
    });
  });
  describe('add user', () => {
    it('should call user service successfully', () => {
      const user: User = {
        id: 'username',
        displayName: 'display Name',
        password: '12345678'
      };
      const addAction = new AddUser(user);

      actions               =  hot('-a', {a: addAction});
      const serviceResponse = cold('-a', {a: {...user}});
      mockUserService.createUser.and.returnValue(serviceResponse);

      effects = TestBed.get(UsersEffects);
      effects.addUser$.subscribe();
      getTestScheduler().flush();
      expect(mockUserService.createUser).toHaveBeenCalled();
    });

    it('should emit user action when saved successfully', () => {
      const user: User = {
        id: 'username',
        displayName: 'display Name',
        password: '12345678'
      };
      const addAction = new AddUser(user);
      const successAction = new CreatePermission(user);
      const addColorOption = new Add();

      actions               =  hot('-a-', {a: addAction});
      const serviceResponse = cold('-a-', {a: {...user}});
      const expected        = cold('--(ab)', {a: addColorOption, b: successAction});

      mockUserService.createUser.and.returnValue(serviceResponse);
      mockUserRoleService.addRoleForUser.and.returnValue(of({}));

      effects = TestBed.get(UsersEffects);
      expect(effects.addUser$).toBeObservable(expected);
    });

    it('should emit add user failure action when saving failed', () => {
      const user: User = {
        id: 'username',
        displayName: 'display Name',
        password: '12345678'
      };
      const addAction = new AddUser(user);
      const error = new Error('Saving failed.');
      const failAction = new AddUserFailure(error);

      actions               =  hot('-a-', {a: addAction});
      const serviceResponse = cold('-#', {}, error);
      const expected        = cold('--a', {a: failAction});

      mockUserService.createUser.and.returnValue(serviceResponse);

      effects = TestBed.get(UsersEffects);
      expect(effects.addUser$).toBeObservable(expected);
    });
  });

  describe('load all user', () => {
    it('should call load all user service successfully', () => {
      const user: User = {
        id: 'username',
        displayName: 'display Name',
        password: '12345678'
      };
      const loadAction = new LoadAll();

      actions               =  hot('-a', {a: loadAction});
      const serviceResponse = cold('-a', {a: [user]});

      mockUserService.getAllUsers.and.returnValue(serviceResponse);

      effects = TestBed.get(UsersEffects);
      effects.loadAllUser$.subscribe();
      getTestScheduler().flush();
      expect(mockUserService.getAllUsers).toHaveBeenCalledWith();
    });

    it('should emit load user action when saved successfully', () => {
      const user: User = {
        id: 'username',
        displayName: 'display Name',
        password: '12345678'
      };
      const loadAction = new LoadAll();
      const loadAllUsersSuccessAction = new LoadAllSuccess([user]);

      actions               =  hot('-a----', {a: loadAction});
      const serviceResponse = cold('-a----', {a: [user]});
      const expected        = cold('--a-', {a: loadAllUsersSuccessAction});

      mockUserService.getAllUsers.and.returnValue(serviceResponse);

      effects = TestBed.get(UsersEffects);
      expect(effects.loadAllUser$).toBeObservable(expected);
    });

    it('should emit load all user failure action when saving failed', () => {
      const loadAction = new LoadAll();
      const error = new Error('Loading failed.');
      const failAction = new LoadAllFailure(error);

      actions               =  hot('-a', {a: loadAction});
      const serviceResponse = cold('-#', {}, error);
      const expected        = cold('--a', {a: failAction});

      mockUserService.getAllUsers.and.returnValue(serviceResponse);

      effects = TestBed.get(UsersEffects);
      expect(effects.loadAllUser$).toBeObservable(expected);
    });
  });

  describe('delete user', () => {
    it('should call delete user service successfully', () => {
      const user: User = {
        id: 'username',
        displayName: 'display Name',
        password: '12345678'
      };
      const deleteAction = new DeleteUser(user.id);

      actions               =  hot('-a---', {a: deleteAction});
      const serviceResponse = cold('-a----', {a: user.id});

      mockUserService.deleteUser.and.returnValue(serviceResponse);

      effects = TestBed.get(UsersEffects);
      effects.deleteUser$.subscribe();
      getTestScheduler().flush();
      expect(mockUserService.deleteUser).toHaveBeenCalledWith(user.id);
    });

    it('should emit delete user action successfully', () => {
      const user: User = {
        id: 'username',
        displayName: 'display Name',
        password: '12345678'
      };
      const deleteAction = new DeleteUser(user.id);

      actions               =  hot('-a----', {a: deleteAction});
      const serviceResponse = cold('-a----', {a: user.id});
      const expected        = cold('--a-', {a: new DeleteUserSuccess(user.id)});

      mockUserService.deleteUser.and.returnValue(serviceResponse);

      effects = TestBed.get(UsersEffects);
      expect(effects.deleteUser$).toBeObservable(expected);
    });

    it('should emit delete user palette failure action when deleting failed', () => {
      const user: User = {
        id: 'username',
        displayName: 'display Name',
        password: '12345678'
      };
      const deleteAction = new DeleteUser(user.id);
      const error = new Error('Deleting failed.');
      const failAction = new DeleteUserFailure(error);

      actions               =  hot('-a', {a: deleteAction});
      const serviceResponse = cold('-#', {}, error);
      const expected        = cold('--a', {a: failAction});

      mockUserService.deleteUser.and.returnValue(serviceResponse);

      effects = TestBed.get(UsersEffects);
      expect(effects.deleteUser$).toBeObservable(expected);
    });
  });
});


