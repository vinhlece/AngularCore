import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {Store} from '@ngrx/store';
import { RoleFormContainerComponent } from './role-form-container.component';
import {of} from 'rxjs/index';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import {RoleFormComponent} from '../../components/role-form/role-form.component';
import {ContextMenuComponent} from '../../../layout/components/context-menu/context-menu.component';
import {By} from '@angular/platform-browser';
import * as RoleActions from '../../actions/role.action';
import {ThemeModule} from '../../../theme/theme.module';

describe('RoleFormContainerComponent', () => {
  let component: RoleFormContainerComponent;
  let fixture: ComponentFixture<RoleFormContainerComponent>;
  let storeSpy;
  let dialogRefSpy: any;
  let dialogServiceSpy;

  beforeEach(async(() => {
    storeSpy = jasmine.createSpyObj('store', ['pipe', 'dispatch']);
    const roles = [
      {id: '1', name: 'role1'},
      {id: '2', name: 'role2'},
    ];
    storeSpy.pipe.and.returnValue(of(roles));
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['open', 'close', 'afterClosed']);
    dialogServiceSpy = jasmine.createSpyObj('MatDialog', ['open']);
    dialogServiceSpy.open.and.returnValue(dialogRefSpy);

    TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        MatIconModule,
        MatTableModule,
        MatButtonModule,
        ThemeModule
      ],
      declarations: [
        RoleFormContainerComponent,
        RoleFormComponent,
        ContextMenuComponent
      ],
      providers: [
        {provide: Store, useValue: storeSpy},
        {provide: MatDialog, useValue: dialogServiceSpy}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleFormContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('constructor', () => {
    it('call store.pipe and MatDialog', () => {
      expect(storeSpy.pipe).toHaveBeenCalled();
    });
  });

  describe('#AddNewButton', () => {
    let uiComponent: RoleFormComponent;

    it('The Create new role dialog should be opened after click add button.', () => {
      uiComponent = fixture.debugElement.query(By.directive(RoleFormComponent)).componentInstance;

      const role = {id: '3', name: 'role3'};
      dialogRefSpy.afterClosed.and.returnValue(of(role));
      dialogServiceSpy.open.and.returnValue(dialogRefSpy);

      const button = fixture.debugElement.query(By.css('#btnOpenCreateNewRole'));
      button.nativeElement.click();
      fixture.detectChanges();
      expect(dialogServiceSpy.open).toHaveBeenCalledTimes(1);
    });
  });

  describe('#addRole function', () => {
    it('should dispatch action to add user with correct data', () => {
      const role = {id: '3', name: 'role3'};
      component.addRole(role.name);
      expect(storeSpy.dispatch).toHaveBeenCalledWith(jasmine.any(RoleActions.Add));
    });
  });

  describe('#deleteRole function', () => {
    it('should call store.dispatch to delete role with correct data', () => {
      const role = {id: '3', name: 'role3'};
      component.deleteRoleByID(role.id);
      expect(storeSpy.dispatch).toHaveBeenCalledWith(new RoleActions.Delete(role.id));
    });
  });

  describe('presentation config', () => {
    let uiComponent: RoleFormComponent;
    const roles = [
      {id: '1', name: 'role1'},
      {id: '2', name: 'role2'},
    ];
    it('should pass correct value to input parameter', () => {
      uiComponent = fixture.debugElement.query(By.directive(RoleFormComponent)).componentInstance;
      expect(uiComponent.roles).toEqual(roles);
    });

    it('should pass correct delete user event handler to output event parameter', () => {
      uiComponent = fixture.debugElement.query(By.directive(RoleFormComponent)).componentInstance;
      const spy = spyOn(component, 'deleteRoleByID');
      const role = {id: '4', name: 'user 04'};
      uiComponent.deleteRoleEventEmitter.emit(role.id);
      expect(spy).toHaveBeenCalledWith(role.id);
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
