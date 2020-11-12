import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UserManageContainerComponent} from './user-manage-container.component';
import {UserManageComponent} from '../../components/user-manage/user-manage.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import {ContextMenuComponent} from '../../../layout/components/context-menu/context-menu.component';
import {Store} from '@ngrx/store';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {of} from 'rxjs/index';
import * as userActions from '../../actions/user.actions';
import {By} from '@angular/platform-browser';
import {UserNavigator} from '../../../layout/navigator/user.navigator';
import {ThemeModule} from '../../../theme/theme.module';

describe('UserManageContainerComponent', () => {
  let component: UserManageContainerComponent;
  let fixture: ComponentFixture<UserManageContainerComponent>;
  let dialogServiceSpy;
  let dialogRefSpy;
  let storeSpy;
  let store;
  let mockNavigation;

  beforeEach(async(() => {
    dialogServiceSpy = jasmine.createSpyObj('MatDialog', ['open']);
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['open', 'close', 'afterClosed']);
    storeSpy = jasmine.createSpyObj('store', ['pipe', 'dispatch']);
    mockNavigation = jasmine.createSpyObj('userNavigator', ['navigateToUserDetails']);
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        RouterTestingModule,
        MatTableModule,
        MatButtonModule,
        MatInputModule,
        MatDialogModule,
        RouterTestingModule,
        MatMenuModule,
        MatIconModule,
        MatSortModule,
        ThemeModule
      ],
      declarations: [
        UserManageContainerComponent,
        UserManageComponent,
        ContextMenuComponent
      ],
      providers: [
        {provide: MatDialog, useValue: dialogServiceSpy},
        {provide: Store, useValue: storeSpy},
        {
          provide: UserNavigator, useValue: mockNavigation
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserManageContainerComponent);
    component = fixture.componentInstance;
    store = TestBed.get(Store);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#ngOnInit function', () => {
    const users = [
      {id: 'user01', displayName: 'user 01', password: 'user01' },
      {id: 'user02', displayName: 'user 02', password: 'user02' },
    ];

    it('should dispatch load all user action', () => {
      store.pipe.and.returnValues(of(users), of({id: 'admin', displayName: 'Admin', password: '12345678'}));
      fixture.detectChanges();
      expect(store.dispatch).toHaveBeenCalledWith(jasmine.any(userActions.LoadAll));
    });
  });

  describe('#AddNewButton', () => {
    let uiComponent: UserManageComponent;
    const users = [
      {id: 'user01', displayName: 'user 01', password: 'user01' },
      {id: 'user02', displayName: 'user 02', password: 'user02' },
    ];

    it('The Create new dashboard dialog should be opened after click add button.', () => {
      store.pipe.and.returnValues(of(users), of({id: 'admin', displayName: 'Admin', password: '12345678'}));
      fixture.detectChanges();
      uiComponent = fixture.debugElement.query(By.directive(UserManageComponent)).componentInstance;

      const user = {id: 'user03', displayName: 'user 03', password: 'user03' };
      dialogRefSpy.afterClosed.and.returnValue(of(user));
      dialogServiceSpy.open.and.returnValue(dialogRefSpy);

      const button = fixture.debugElement.query(By.css('#btnOpenCreateNewUser'));
      button.nativeElement.click();
      fixture.detectChanges();
      expect(dialogServiceSpy.open).toHaveBeenCalledTimes(1);
    });
  });

  describe('#addUser function', () => {
    it('should dispatch action to add user with correct data', () => {
      const users = [
        {id: 'user01', displayName: 'user 01', password: 'user01' },
        {id: 'user02', displayName: 'user 02', password: 'user02' },
      ];
      store.pipe.and.returnValues(of(users), of({id: 'admin', displayName: 'Admin', password: '12345678'}));
      fixture.detectChanges();
      const user = {id: 'admin', displayName: 'ABC', password: '12345678'};
      component.addUser(user);
      expect(storeSpy.dispatch).toHaveBeenCalledWith(jasmine.any(userActions.AddUser));
    });
  });

  describe('#deleteUser function', () => {
    it('should call store.dispatch to delete user with correct data', () => {
      const user = {id: 'admin', displayName: 'ABC', password: '12345678'};
      component.deleteUser(user.id);
      expect(storeSpy.dispatch).toHaveBeenCalledWith(new userActions.DeleteUser(user.id));
    });
  });

  describe('presentation config', () => {
    let uiComponent: UserManageComponent;
    const users = [
      {id: 'user01', displayName: 'user 01', password: 'user01' },
      {id: 'user02', displayName: 'user 02', password: 'user02' },
    ];

    it('should pass correct value to input parameter', () => {
      store.pipe.and.returnValues(of(users), of({id: 'admin', displayName: 'ABC', password: '12345678'}));
      fixture.detectChanges();
      uiComponent = fixture.debugElement.query(By.directive(UserManageComponent)).componentInstance;
      expect(uiComponent.users).toBe(users);
    });

    it('should pass correct delete user event handler to output event parameter', () => {
      store.pipe.and.returnValues(of(users), of({id: 'admin', displayName: 'ABC', password: '12345678'}));
      fixture.detectChanges();
      uiComponent = fixture.debugElement.query(By.directive(UserManageComponent)).componentInstance;

      const spy = spyOn(component, 'deleteUser');
      const user = {id: 'user04', displayName: 'user 04', password: 'user04'};
      uiComponent.deleteUserEventEmitter.emit(user.id);
      expect(spy).toHaveBeenCalledWith(user.id);
    });
  });
});
