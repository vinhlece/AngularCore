import {Location} from '@angular/common';
import {TestBed} from '@angular/core/testing';
import {provideMockActions} from '@ngrx/effects/testing';
import {Action, Store} from '@ngrx/store';
import {cold, getTestScheduler, hot} from 'jasmine-marbles';
import {Observable} from 'rxjs';
import {ColorPalette} from '../../common/models';
import {getDefaultColorPalettes} from '../../common/utils/color';
import {
  AddUserPalette,
  AddUserPaletteFailure,
  AddUserPaletteSuccess,
  ChangeColorPalette, DeletePalette, DeletePaletteFailure, DeletePaletteSuccess,
  LoadAllPalettes,
  LoadAllPalettesFailure,
  LoadAllPalettesSuccess, UpdatePaletteSuccess, UpdateUserPalette
} from '../actions/palette.actions';
import {Update} from '../actions/user.actions';
import {User} from '../models/user';
import {UserPaletteService} from '../services/settings/user-palette.service';
import {UserPaletteEffects} from './user-palette.effects';

describe('UserPaletteEffects', () => {
  let mockUserPaletteService;
  let mockStore;
  let mockLocation;
  let actions: Observable<Action>;
  let effects: UserPaletteEffects;
  const user = {id: 'user01', displayName: 'user 01'};

  beforeEach(() => {
    mockUserPaletteService = jasmine.createSpyObj('UserPaletteService',
      ['addColorPalette', 'getColorPalette', 'deletePaletteById', 'updateColorPalette']);
    mockLocation = jasmine.createSpyObj('location', ['back']);
    mockStore = jasmine.createSpyObj('store', ['pipe', 'dispatch']);
    TestBed.configureTestingModule({
      providers: [
        UserPaletteEffects,
        provideMockActions(() => actions),
        {
          provide: Store,
          useValue: mockStore
        },
        {
          provide: UserPaletteService,
          useValue: mockUserPaletteService
        },
        {provide: Location, useValue: mockLocation}
      ]
    });
  });

  describe('add user palette', () => {
    it('should call user palette service successfully', () => {
      const palette: ColorPalette = {
        name: 'palette name',
        colors: ['#000000', '#111111', '#222222', '#333333', '#444444'],
        threshold: ['#000000', '#111111', '#222222']
      };
      const addAction = new AddUserPalette(palette);

      actions               =  hot('-a', {a: addAction});
      const serviceResponse = cold('-a', {a: {...palette, userId: 'user01'}});
      const storeUser       = cold('-a', {a: user});
      mockUserPaletteService.addColorPalette.and.returnValue(serviceResponse);
      mockStore.pipe.and.returnValue(storeUser);

      effects = TestBed.get(UserPaletteEffects);
      effects.addUserPalette$.subscribe();
      getTestScheduler().flush();
      expect(mockUserPaletteService.addColorPalette).toHaveBeenCalledWith({...palette, userId: 'user01'});
    });

    it('should emit user palette action when saved successfully', () => {
      const palette: ColorPalette = {
        name: 'palette name',
        colors: ['#000000', '#111111', '#222222', '#333333', '#444444'],
        threshold: ['#000000', '#111111', '#222222']
      };
      const addAction = new AddUserPalette(palette);
      const successAction = new AddUserPaletteSuccess({...palette, userId: 'user01'});

      actions               =  hot('-a-', {a: addAction});
      const storeUser       = cold('a-', {a: user});
      const serviceResponse = cold('-a-', {a: {...palette, userId: 'user01'}});
      const expected        = cold('--a', {a: successAction});

      mockUserPaletteService.addColorPalette.and.returnValue(serviceResponse);
      mockStore.pipe.and.returnValue(storeUser);
      mockLocation.back.and.returnValue('');

      effects = TestBed.get(UserPaletteEffects);
      expect(effects.addUserPalette$).toBeObservable(expected);
    });

    it('should emit add user palette failure action when saving failed', () => {
      const palette: ColorPalette = {
        name: 'palette name',
        colors: ['#000000', '#111111', '#222222', '#333333', '#444444'],
        threshold: ['#000000', '#111111', '#222222']
      };
      const addAction = new AddUserPalette(palette);
      const error = new Error('Saving failed.');
      const failAction = new AddUserPaletteFailure(error);

      actions               =  hot('-a', {a: addAction});
      const storeUser       = cold('a-', {a: user});
      const serviceResponse = cold('-#', {}, error);
      const expected        = cold('--a', {a: failAction});

      mockStore.pipe.and.returnValue(storeUser);
      mockUserPaletteService.addColorPalette.and.returnValue(serviceResponse);

      effects = TestBed.get(UserPaletteEffects);
      expect(effects.addUserPalette$).toBeObservable(expected);
    });
  });

  describe('load all user palettes', () => {
    it('should call load all user palette service successfully', () => {
      const palette: ColorPalette = {
        name: 'palette name', id: 'palate01', userId: 'user01',
        colors: ['#000000', '#111111', '#222222', '#333333', '#444444'],
        threshold: ['#000000', '#111111', '#222222']
      };
      const loadAction = new LoadAllPalettes();

      actions               =  hot('-a', {a: loadAction});
      const storeUser       = cold('a-', {a: user});
      const serviceResponse = cold('-a', {a: [palette]});

      mockStore.pipe.and.returnValue(storeUser);
      mockUserPaletteService.getColorPalette.and.returnValue(serviceResponse);

      effects = TestBed.get(UserPaletteEffects);
      effects.loadAllPalettes$.subscribe();
      getTestScheduler().flush();
      expect(mockUserPaletteService.getColorPalette).toHaveBeenCalledWith(user.id);
    });

    it('should emit load user palette action when saved successfully', () => {
      const palette: ColorPalette = {
        name: 'palette name', id: 'palate01', userId: 'user01',
        colors: ['#000000', '#111111', '#222222', '#333333', '#444444'],
        threshold: ['#000000', '#111111', '#222222']
      };
      const loadAction = new LoadAllPalettes();
      const loadAllSuccessAction = new LoadAllPalettesSuccess([...getDefaultColorPalettes(), palette]);

      actions               =  hot('-a----', {a: loadAction});
      const storeUser       = cold('a-----', {a: {...user, selectedPalette: 'palate01'}});
      const serviceResponse = cold('-a----', {a: [palette]});
      const expected        = cold('--a-', {a: loadAllSuccessAction});

      mockStore.pipe.and.returnValue(storeUser);
      mockUserPaletteService.getColorPalette.and.returnValue(serviceResponse);

      effects = TestBed.get(UserPaletteEffects);
      expect(effects.loadAllPalettes$).toBeObservable(expected);
    });

    it('should emit load all user palette failure action when saving failed', () => {
      const loadAction = new LoadAllPalettes();
      const error = new Error('Loading failed.');
      const failAction = new LoadAllPalettesFailure(error);

      actions               =  hot('-a', {a: loadAction});
      const storeUser       = cold('a-', {a: user});
      const serviceResponse = cold('-#', {}, error);
      const expected        = cold('--a', {a: failAction});

      mockStore.pipe.and.returnValue(storeUser);
      mockUserPaletteService.getColorPalette.and.returnValue(serviceResponse);

      effects = TestBed.get(UserPaletteEffects);
      expect(effects.loadAllPalettes$).toBeObservable(expected);
    });
  });

  describe('change user palettes', () => {
    it('should call change user palette action successfully', () => {
      const palette: ColorPalette = {
        name: 'palette name',
        colors: ['#000000', '#111111', '#222222', '#333333', '#444444'],
        threshold: ['#000000', '#111111', '#222222'],
        userId: 'user01',
        id: 'palate01'
      };
      const changeAction = new ChangeColorPalette(palette);

      actions         =  hot('-a---', {a: changeAction});
      const storeUser = cold('a----', {a: user});
      const expected  = cold('-a-', {
        a: new Update({...user, selectedPalette: palette.id} as User),
      });

      mockStore.pipe.and.returnValue(storeUser);

      effects = TestBed.get(UserPaletteEffects);
      expect(effects.changeUserPalette$).toBeObservable(expected);
    });
  });

  describe('delete user palettes', () => {
    it('should call delete user palette service successfully', () => {
      const palette: ColorPalette = {
        name: 'palette name',
        colors: ['#000000', '#111111', '#222222', '#333333', '#444444'],
        threshold: ['#000000', '#111111', '#222222'],
        userId: 'user01',
        id: 'palate01'
      };
      const deleteAction = new DeletePalette(palette.id);

      actions               =  hot('-a---', {a: deleteAction});
      const serviceResponse = cold('-a----', {a: palette.id});

      mockUserPaletteService.deletePaletteById.and.returnValue(serviceResponse);

      effects = TestBed.get(UserPaletteEffects);
      effects.deletePalette$.subscribe();
      getTestScheduler().flush();
      expect(mockUserPaletteService.deletePaletteById).toHaveBeenCalledWith(palette.id);
    });

    it('should call delete user palette action successfully', () => {
      const palette: ColorPalette = {
        name: 'palette name',
        colors: ['#000000', '#111111', '#222222', '#333333', '#444444'],
        threshold: ['#000000', '#111111', '#222222'],
        userId: 'user01',
        id: 'palate01'
      };
      const deleteAction = new DeletePalette(palette.id);

      actions               =  hot('-a---', {a: deleteAction});
      const serviceResponse = cold('-a----', {a: palette.id});
      const expected        = cold('--(a)', {a: new DeletePaletteSuccess(palette.id)});

      mockUserPaletteService.deletePaletteById.and.returnValue(serviceResponse);

      effects = TestBed.get(UserPaletteEffects);
      expect(effects.deletePalette$).toBeObservable(expected);
    });

    it('should emit delete user palette failure action when deleting failed', () => {
      const palette: ColorPalette = {
        name: 'palette name',
        colors: ['#000000', '#111111', '#222222', '#333333', '#444444'],
        threshold: ['#000000', '#111111', '#222222'],
        userId: 'user01',
        id: 'palate01'
      };
      const error = new Error('Deleting failed.');
      const failAction = new DeletePaletteFailure(error);
      const deleteAction = new DeletePalette(palette.id);

      actions               =  hot('-a', {a: deleteAction});
      const serviceResponse = cold('-#', {}, error);
      const expected        = cold('--a', {a: failAction});

      mockUserPaletteService.deletePaletteById.and.returnValue(serviceResponse);

      effects = TestBed.get(UserPaletteEffects);
      expect(effects.deletePalette$).toBeObservable(expected);
    });
  });

  describe('update user palettes', () => {
    it('should call update user palette service successfully', () => {
      const palette: ColorPalette = {
        name: 'palette name',
        colors: ['#000000', '#111111', '#222222', '#333333', '#444444'],
        threshold: ['#000000', '#111111', '#222222'],
        userId: 'user01',
        id: 'palate01'
      };
      const updateAction = new UpdateUserPalette(palette);

      actions               =  hot('-a---', {a: updateAction});
      const serviceResponse = cold('-a----', {a: palette});

      mockUserPaletteService.updateColorPalette.and.returnValue(serviceResponse);

      effects = TestBed.get(UserPaletteEffects);
      effects.updatePalette$.subscribe();
      getTestScheduler().flush();
      expect(mockUserPaletteService.updateColorPalette).toHaveBeenCalledWith(palette);
    });

    it('should call update user palette action successfully', () => {
      const palette: ColorPalette = {
        name: 'palette name',
        colors: ['#000000', '#111111', '#222222', '#333333', '#444444'],
        threshold: ['#000000', '#111111', '#222222'],
        userId: 'user01',
        id: 'palate01'
      };
      const updateAction = new UpdateUserPalette(palette);

      actions               =  hot('-a---', {a: updateAction});
      const serviceResponse = cold('-a----', {a: palette});
      const expected        = cold('--(a)', {a: new UpdatePaletteSuccess(palette)});

      mockUserPaletteService.updateColorPalette.and.returnValue(serviceResponse);

      effects = TestBed.get(UserPaletteEffects);
      expect(effects.updatePalette$).toBeObservable(expected);
    });

    it('should emit delete user palette failure action when deleting failed', () => {
      const palette: ColorPalette = {
        name: 'palette name',
        colors: ['#000000', '#111111', '#222222', '#333333', '#444444'],
        threshold: ['#000000', '#111111', '#222222'],
        userId: 'user01',
        id: 'palate01'
      };
      const error = new Error('Updating failed.');
      const failAction = new AddUserPaletteFailure(error);
      const updateAction = new UpdateUserPalette(palette);

      actions               =  hot('-a', {a: updateAction});
      const serviceResponse = cold('-#', {}, error);
      const expected        = cold('--a', {a: failAction});

      mockUserPaletteService.updateColorPalette.and.returnValue(serviceResponse);

      effects = TestBed.get(UserPaletteEffects);
      expect(effects.updatePalette$).toBeObservable(expected);
    });
  });
});
