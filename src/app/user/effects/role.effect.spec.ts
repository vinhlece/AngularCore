import {TestBed} from '@angular/core/testing';
import {provideMockActions} from '@ngrx/effects/testing';
import {Action, Store} from '@ngrx/store';
import {cold, getTestScheduler, hot} from 'jasmine-marbles';
import {Observable} from 'rxjs';
import {ColorPalette, Role} from '../../common/models';
import {getDefaultColorPalettes} from '../../common/utils/color';
import {RoleEffects} from './role.effect';
import {RolesService} from '../services/settings/roles.service';
import * as RoleActions from '../actions/role.action';

describe('RoleEffects', () => {
  let mockRoleService;
  let mockStore;
  let actions: Observable<Action>;
  let effects: RoleEffects;
  const user = {id: 'user01', displayName: 'user 01'};

  beforeEach(() => {
    mockRoleService = jasmine.createSpyObj('RolesService',
      ['getAllRoles', 'createRole', 'deleteRole']);
    mockStore = jasmine.createSpyObj('store', ['pipe', 'dispatch']);
    TestBed.configureTestingModule({
      providers: [
        RoleEffects,
        provideMockActions(() => actions),
        {
          provide: Store,
          useValue: mockStore
        },
        {
          provide: RolesService,
          useValue: mockRoleService
        },
      ]
    });
  });

  describe('add role', () => {
    it('should call roll service successfully', () => {
      const role: Role = {
        id: '1',
        name: 'dashboard'
      };
      const addAction = new RoleActions.Add(role.name);

      actions               =  hot('-a', {a: addAction});
      const serviceResponse = cold('-a', {a: {role}});
      mockRoleService.createRole.and.returnValue(serviceResponse);

      effects = TestBed.get(RoleEffects);
      effects.addRole$.subscribe();
      getTestScheduler().flush();
      expect(mockRoleService.createRole).toHaveBeenCalledWith(role.name);
    });

    it('should emit add role success action when saved successfully', () => {
      const role: Role = {
        id: '1',
        name: 'dashboard'
      };
      const addAction = new RoleActions.Add(role.name);
      const successAction = new RoleActions.AddSuccess(role);

      actions               =  hot('-a-', {a: addAction});
      const serviceResponse = cold('-a-', {a: {...role}});
      const expected        = cold('--a', {a: successAction});

      mockRoleService.createRole.and.returnValue(serviceResponse);

      effects = TestBed.get(RoleEffects);
      expect(effects.addRole$).toBeObservable(expected);
    });

    it('should emit add role failure action when saving failed', () => {
      const role: Role = {
        id: '1',
        name: 'dashboard'
      };
      const addAction = new RoleActions.Add(role.name);
      const error = new Error('Saving failed.');
      const failAction = new RoleActions.ActionError(error);

      actions               =  hot('-a', {a: addAction});
      const serviceResponse = cold('-#', {}, error);
      const expected        = cold('--a', {a: failAction});

      mockRoleService.createRole.and.returnValue(serviceResponse);

      effects = TestBed.get(RoleEffects);
      expect(effects.addRole$).toBeObservable(expected);
    });
  });

  describe('load all role', () => {
    it('should call load all role service successfully', () => {
      const role: Role = {
        id: '1',
        name: 'dashboard'
      };
      const loadAction = new RoleActions.LoadAll();

      actions               =  hot('-a', {a: loadAction});
      const serviceResponse = cold('-a', {a: [role]});

      mockRoleService.getAllRoles.and.returnValue(serviceResponse);

      effects = TestBed.get(RoleEffects);
      effects.loadAllRole$.subscribe();
      getTestScheduler().flush();
      expect(mockRoleService.getAllRoles).toHaveBeenCalled();
    });

    it('should emit load all role action successfully', () => {
      const role: Role = {
        id: '1',
        name: 'dashboard'
      };
      const loadAction = new RoleActions.LoadAll();
      const loadAllSuccessAction = new RoleActions.LoadAllSuccess([role]);

      actions               =  hot('-a----', {a: loadAction});
      const serviceResponse = cold('-a----', {a: [role]});
      const expected        = cold('--a-', {a: loadAllSuccessAction});

      mockRoleService.getAllRoles.and.returnValue(serviceResponse);

      effects = TestBed.get(RoleEffects);
      expect(effects.loadAllRole$).toBeObservable(expected);
    });

    it('should emit load all role failure action', () => {
      const loadAction = new RoleActions.LoadAll();
      const error = new Error('Loading failed.');
      const failAction = new RoleActions.ActionError(error);

      actions               =  hot('-a', {a: loadAction});
      const serviceResponse = cold('-#', {}, error);
      const expected        = cold('--a', {a: failAction});

      mockRoleService.getAllRoles.and.returnValue(serviceResponse);

      effects = TestBed.get(RoleEffects);
      expect(effects.loadAllRole$).toBeObservable(expected);
    });
  });

  describe('delete role', () => {
    it('should call delete role service successfully', () => {
      const role: Role = {
        id: '1',
        name: 'dashboard'
      };
      const deleteAction = new RoleActions.Delete(role.id);

      actions               =  hot('-a---', {a: deleteAction});
      const serviceResponse = cold('-a----', {a: role.id});

      mockRoleService.deleteRole.and.returnValue(serviceResponse);

      effects = TestBed.get(RoleEffects);
      effects.deleteRole$.subscribe();
      getTestScheduler().flush();
      expect(mockRoleService.deleteRole).toHaveBeenCalledWith(role.id);
    });

    it('should call delete role action successfully', () => {
      const role: Role = {
        id: '1',
        name: 'dashboard'
      };
      const deleteAction = new RoleActions.Delete(role.id);
      const deleteActionSuccess = new RoleActions.DeleteSuccess(role.id);

      actions               =  hot('-a---', {a: deleteAction});
      const serviceResponse = cold('-a----', {a: role.id});
      const expected        = cold('--(a)', {a: deleteActionSuccess});

      mockRoleService.deleteRole.and.returnValue(serviceResponse);

      effects = TestBed.get(RoleEffects);
      expect(effects.deleteRole$).toBeObservable(expected);
    });

    it('should emit delete user palette failure action when deleting failed', () => {
      const role: Role = {
        id: '1',
        name: 'dashboard'
      };
      const error = new Error('Deleting failed.');
      const failAction = new RoleActions.ActionError(error);
      const deleteAction = new RoleActions.Delete(role.id);

      actions               =  hot('-a', {a: deleteAction});
      const serviceResponse = cold('-#', {}, error);
      const expected        = cold('--a', {a: failAction});

      mockRoleService.deleteRole.and.returnValue(serviceResponse);

      effects = TestBed.get(RoleEffects);
      expect(effects.deleteRole$).toBeObservable(expected);
    });
  });
});
