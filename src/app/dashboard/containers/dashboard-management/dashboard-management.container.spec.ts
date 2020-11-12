import {CdkTableModule} from '@angular/cdk/table';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import {By} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {Store} from '@ngrx/store';
import {of} from 'rxjs';
import * as dashboardActions from '../../actions/dashboards.action';
import {DashboardListComponent} from '../../components/dashboard-list/dashboard-list.component';
import {DashboardManagementContainer} from './dashboard-management.container';
import {TranslateModule} from '@ngx-translate/core';
import {ThemeModule} from '../../../theme/theme.module';

describe('DashboardManagementContainer', () => {
  let component: DashboardManagementContainer;
  let fixture: ComponentFixture<DashboardManagementContainer>;
  let dialogServiceSpy;
  let dialogRefSpy;
  let store;
  let storeSpy;

  beforeEach(async(() => {
    dialogServiceSpy = jasmine.createSpyObj('MatDialog', ['open']);
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['open', 'close', 'afterClosed']);
    storeSpy = jasmine.createSpyObj('store', ['pipe', 'dispatch']);

    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        RouterTestingModule,
        MatTableModule,
        MatButtonModule,
        MatInputModule,
        MatDialogModule,
        RouterTestingModule,
        CdkTableModule,
        MatMenuModule,
        MatIconModule,
        MatSortModule,
        TranslateModule.forRoot(),
        ThemeModule
      ],
      declarations: [
        DashboardManagementContainer,
        DashboardListComponent
      ],
      providers: [
        {provide: MatDialog, useValue: dialogServiceSpy},
        {provide: Store, useValue: storeSpy}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardManagementContainer);
    component = fixture.componentInstance;
    store = TestBed.get(Store);
  });

  describe('#ngOnInit function', () => {
    const dashboards = [
      {id: '1', name: 'dashboard 1', tabs: []},
      {id: '2', name: 'dashboard 2', tabs: [{id: '1', name: 'tab1', dashboardId: '2'}]}
    ];

    it('should dispatch load all dashboard action', () => {
      store.pipe.and.returnValues(of(dashboards), of({id: 'admin', displayName: 'Admin'}));
      fixture.detectChanges();
      expect(store.dispatch).toHaveBeenCalledWith(jasmine.any(dashboardActions.LoadAll));
    });
  });

  describe('#AddNewButton', () => {
    let uiComponent: DashboardListComponent;
    const dashboards = [
      {id: '1', name: 'dashboard 1', tabs: []},
      {id: '2', name: 'dashboard 2', tabs: [{id: '1', name: 'tab1', dashboardId: '2'}]}
    ];

    it('The Create new dashboard dialog should be opened after click add button.', () => {
      store.pipe.and.returnValues(of(dashboards), of({id: 'admin', displayName: 'Admin'}));
      fixture.detectChanges();
      uiComponent = fixture.debugElement.query(By.directive(DashboardListComponent)).componentInstance;

      const dashboard = {id: 1, name: 'dashboard 1'};
      dialogRefSpy.afterClosed.and.returnValue(of(dashboard));
      dialogServiceSpy.open.and.returnValue(dialogRefSpy);

      const button = fixture.debugElement.query(By.css('#btnOpenCreateNewDashboard'));
      button.nativeElement.click();
      fixture.detectChanges();
      expect(dialogServiceSpy.open).toHaveBeenCalledTimes(1);
    });
  });

  describe('#addDashboard function', () => {
    it('should dispatch action to add dashboard with correct data', () => {
      const dashboards = [
        {id: '1', userId: 'admin', name: 'dashboard 1', tabs: []},
        {id: '2', userId: 'admin', name: 'dashboard 2', tabs: [{id: '1', name: 'tab1', dashboardId: '2'}]}
      ];
      store.pipe.and.returnValues(of(dashboards), of({id: 'admin', displayName: 'Admin'}));
      fixture.detectChanges();
      const dashboard = {userId: 'admin', name: 'ABC'};
      component.addDashboard(dashboard);
      expect(storeSpy.dispatch).toHaveBeenCalledWith(jasmine.any(dashboardActions.Add));
    });
  });

  describe('#deleteDashboard function', () => {
    it('should call store.dispatch to delete dashboard with correct data', () => {
      const dashboard = {id: '1', name: 'ABC', tabs: ['A', 'B', 'C']};
      component.deleteDashboard(dashboard.id);
      expect(storeSpy.dispatch).toHaveBeenCalledWith(new dashboardActions.Delete(dashboard.id));
    });
  });

  describe('presentation config', () => {
    let uiComponent: DashboardListComponent;
    const dashboards = [
      {id: '1', name: 'dashboard 1', tabs: []},
      {id: '2', name: 'dashboard 2', tabs: [{id: '1', name: 'tab1', dashboardId: '2'}]}
    ];

    it('should pass correct value to input parameter', () => {
      store.pipe.and.returnValues(of(dashboards), of({id: 'admin', displayName: 'Admin'}));
      fixture.detectChanges();
      uiComponent = fixture.debugElement.query(By.directive(DashboardListComponent)).componentInstance;
      expect(uiComponent.dashboards).toBe(dashboards);
    });

    it('should pass correct delete dashboard event handler to output event parameter', () => {
      store.pipe.and.returnValues(of(dashboards), of({id: 'admin', displayName: 'Admin'}));
      fixture.detectChanges();
      uiComponent = fixture.debugElement.query(By.directive(DashboardListComponent)).componentInstance;

      const spy = spyOn(component, 'deleteDashboard');
      const dashboard = {id: 1, name: 'GHJ', tabs: ['G', 'H']};
      uiComponent.deleteDashboardEventEmitter.emit(dashboard.id);
      expect(spy).toHaveBeenCalledWith(dashboard.id);
    });
  });
});
