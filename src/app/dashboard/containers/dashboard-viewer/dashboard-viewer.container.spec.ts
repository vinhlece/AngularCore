import {DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import {By} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';
import {of} from 'rxjs';
import {mockDashboard, mockTab} from '../../../common/testing/mocks/dashboards';
import * as pollingActions from '../../../realtime/actions/rest-api/polling.actions';
import * as creationOnPlotActions from '../../actions/creation-on-plot.actions';
import * as dashboardsActions from '../../actions/dashboards.action';
import * as replayActions from '../../actions/replay.actions';
import * as tabEditorActions from '../../actions/tab-editor.actions';
import * as tabsActions from '../../actions/tabs.actions';
import * as timePreferencesActions from '../../actions/time-preferences.actions';
import {DashboardViewerContainer} from './dashboard-viewer.container';
import {mockWidget} from '../../../common/testing/mocks/widgets';

xdescribe('DashboardViewerContainer', () => {
  let component: DashboardViewerContainer;
  let fixture: ComponentFixture<DashboardViewerContainer>;
  let de: DebugElement;
  let store: any;
  let sidenav: any;
  let dialogRefSpy: any;
  let dialogServiceSpy: any;

  beforeEach(async(() => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['open', 'close', 'afterClosed']);
    dialogServiceSpy = jasmine.createSpyObj('MatDialog', ['open']);
    dialogServiceSpy.open.and.returnValue(dialogRefSpy);

    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        MatSidenavModule
      ],
      declarations: [DashboardViewerContainer],
      providers: [
        {provide: ActivatedRoute, useValue: {params: of({id: '1'})}},
        {provide: Store, useValue: jasmine.createSpyObj('store', ['pipe', 'dispatch'])},
        {provide: MatDialog, useValue: dialogServiceSpy},
      ],
      // Tells the compiler not to error on unknown elements and attributes
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DashboardViewerContainer);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    store = TestBed.get(Store);
  }));

  describe('init', () => {
    it('should select dashboard from store', fakeAsync(() => {
      store.pipe.and.returnValue(of(mockDashboard()), of(mockDashboard()), of(mockWidget()));
      fixture.detectChanges();
      expect(store.pipe).toHaveBeenCalledTimes(3);
    }));
    it('should get replay status from store', fakeAsync(() => {
      store.pipe.and.returnValue(of(mockDashboard()), of(mockDashboard()), of(mockWidget()));
      fixture.detectChanges();
      expect(store.pipe).toHaveBeenCalledTimes(3);
    }));

    it('should dispatch actions to initialize dashboard', () => {
      store.pipe.and.returnValue(of(mockDashboard()));
      fixture.detectChanges();
      expect(store.dispatch).toHaveBeenCalledWith(new dashboardsActions.Load('1'));
      expect(store.dispatch).toHaveBeenCalledWith(new timePreferencesActions.Load());
      expect(store.dispatch).toHaveBeenCalledWith(new pollingActions.Start());
    });
  });

  describe('render', () => {
    it('should show child components if dashboards is available', () => {
      store.pipe.and.returnValue(of(mockDashboard()));
      fixture.detectChanges();

      const sideBar = de.query(By.css('app-header-container'));
      const searchSidebar = de.query(By.css('app-side-bar-container'));
      const dashboardTabs = de.query(By.css('app-dashboard-tabs-container'));

      expect(sideBar).not.toBeNull();
      expect(searchSidebar).not.toBeNull();
      expect(dashboardTabs).not.toBeNull();
    });

    it('should not show child components if dashboards is not available', fakeAsync(() => {
      store.pipe.and.returnValue(of(null));
      fixture.detectChanges();
      tick();

      const sidebar = de.query(By.css('app-header-container'));
      const searchSidebar = de.query(By.css('app-side-bar-container'));
      const dashboardTabs = de.query(By.css('app-dashboard-tabs-container'));

      expect(sidebar).toBeNull();
      expect(searchSidebar).toBeNull();
      expect(dashboardTabs).toBeNull();
    }));
  });

  describe('click search', () => {
    it('should show sidebar widgets when click search', () => {
      store.pipe.and.returnValue(of(mockDashboard()));
      fixture.detectChanges();

      const sidebar = de.query(By.css('app-header-container'));
      sidebar.triggerEventHandler('onTriggerAction', {actionName: 'handleClickSearch'});
      fixture.detectChanges();

      expect(component.searchSlideState).toEqual('in');
    });

    it('should hide sidebar widgets when click search again', () => {
      store.pipe.and.returnValue(of(mockDashboard()));
      fixture.detectChanges();

      const sidebar = de.query(By.css('app-header-container'));

      // Click the first time
      sidebar.triggerEventHandler('onClickSearch', {});
      fixture.detectChanges();

      // Click the second time
      sidebar.triggerEventHandler('onClickSearch', {});
      fixture.detectChanges();

      expect(component.searchSlideState).toEqual('out');
    });

    it('should emit action to update tab editor size on animation done', () => {
      component.handleAnimationDone();
      expect(store.dispatch).toHaveBeenCalledWith(new tabEditorActions.AdjustSize());
    });
  });

  describe('add tab', () => {
    it('should open add tab dialog', () => {
      dialogRefSpy.afterClosed.and.returnValue(of(mockTab()));
      store.pipe.and.returnValues(of(mockDashboard()), of(mockDashboard()), of(mockWidget()));
      fixture.detectChanges();

      const sidebar = de.query(By.css('app-header-container'));
      sidebar.triggerEventHandler('onClickAdd', mockTab());
      expect(dialogServiceSpy.open).toHaveBeenCalledTimes(1);
    });
  });

  describe('click replay', () => {
    it('should dispatch toggle replay action', () => {
      store.pipe.and.returnValue(of(mockDashboard()));
      fixture.detectChanges();
      const sidebar = de.query(By.css('app-header-container'));
      sidebar.triggerEventHandler('onClickReplay', {});
      expect(store.dispatch).toHaveBeenCalledWith(new replayActions.Toggle());
    });
  });

  describe('add shift trend diff', () => {
    it('should add shift trend diff action', () => {
      store.pipe.and.returnValue(of(mockDashboard()));
      fixture.detectChanges();
      const sidebar = de.query(By.css('app-header-container'));
      sidebar.triggerEventHandler('onClickShiftTrendDiff', {});
      expect(store.dispatch).toHaveBeenCalledWith(new creationOnPlotActions.CreateShiftTrendDiff());
    });
  });

  describe('add day trend diff', () => {
    it('should add day trend diff action', () => {
      store.pipe.and.returnValue(of(mockDashboard()));
      fixture.detectChanges();
      const sidebar = de.query(By.css('app-header-container'));
      sidebar.triggerEventHandler('onClickDayTrendDiff', {});
      expect(store.dispatch).toHaveBeenCalledWith(new creationOnPlotActions.CreateDayTrendDiff());
    });
  });

  describe('add week trend diff', () => {
    it('should add week trend diff action', () => {
      store.pipe.and.returnValue(of(mockDashboard()));
      fixture.detectChanges();
      const sidebar = de.query(By.css('app-sidebar'));
      sidebar.triggerEventHandler('onClickWeekTrendDiff', {});
      expect(store.dispatch).toHaveBeenCalledWith(new creationOnPlotActions.CreateWeekTrendDiff());
    });
  });

  describe('on destroy', () => {
    it('should dispatch action to exit current tab & stop update time explorer in real time', () => {
      component.ngOnDestroy();
      expect(store.dispatch).toHaveBeenCalledWith(new tabsActions.Exit());
      expect(store.dispatch).toHaveBeenCalledWith(new timePreferencesActions.StopUpdateInRealTime());
    });
  });
});
