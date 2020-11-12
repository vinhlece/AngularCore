import {DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {Store} from '@ngrx/store';
import {of} from 'rxjs';
import {mockDashboard, mockTabs} from '../../../common/testing/mocks/dashboards';
import * as placeholderActions from '../../actions/placeholders.actions';
import * as tabsActions from '../../actions/tabs.actions';
import {DashboardTabsContainer} from './dashboard-tabs.container';
import {AddInstance, RemoveInstance} from '../../actions/tab-editor.actions';
import {GlobalFilters} from '../../actions/tabs.actions';

describe('DashboardTabsContainer', () => {
  let fixture: ComponentFixture<DashboardTabsContainer>;
  let comp: DashboardTabsContainer;
  let de: DebugElement;
  let store: any;
  const tabs = mockTabs();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule],
      declarations: [DashboardTabsContainer],
      providers: [
        {provide: Store, useValue: jasmine.createSpyObj('store', ['pipe', 'dispatch'])}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardTabsContainer);
    comp = fixture.componentInstance;
    comp.dashboard = mockDashboard();
    de = fixture.debugElement;
    store = TestBed.get(Store);
  });

  describe('init', () => {
    it('should get tabs from store', () => {
      store.pipe.and.returnValue(of(tabs));
      fixture.detectChanges();
      expect(store.pipe).toHaveBeenCalled();
    });
  });

  describe('select a tab', () => {
    it('should dispatch actions if it is not a current tab', () => {
      store.pipe.and.returnValue(of(tabs));
      fixture.detectChanges();

      const el = de.query(By.css('app-dashboard-tabs'));
      el.triggerEventHandler('onSelectTab', {tab: tabs[0], isCurrentTab: false});

      expect(store.dispatch).toHaveBeenCalledWith(new tabsActions.Select(tabs[0]));
      expect(store.dispatch).toHaveBeenCalledWith(new tabsActions.Exit());
    });

    it('should do nothing if it is current tab', () => {
      store.pipe.and.returnValue(of(tabs));
      fixture.detectChanges();

      const el = de.query(By.css('app-dashboard-tabs'));
      el.triggerEventHandler('onSelectTab', {tab: tabs[0], isCurrentTab: true});

      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('delete a tab', () => {
    it('should dispatch delete tab action', () => {
      const tab = tabs[0];
      store.pipe.and.returnValue(of(tabs));
      fixture.detectChanges();
      const el = de.query(By.css('app-dashboard-tabs'));
      el.triggerEventHandler('onDeleteTab', {tab, isCurrentTab: true});
      expect(store.dispatch).toHaveBeenCalledWith(new tabsActions.Delete(tab));
    });

    it('should dispatch release placeholders action if delete current tab', () => {
      const tab = tabs[0];
      store.pipe.and.returnValue(of(tabs));
      fixture.detectChanges();
      const el = de.query(By.css('app-dashboard-tabs'));
      el.triggerEventHandler('onDeleteTab', {tab, isCurrentTab: true});
      expect(store.dispatch).toHaveBeenCalledWith(new placeholderActions.ReleasePlaceholders());
    });

    it('should not dispatch release placeholders action if delete another tab', () => {
      const tab = tabs[0];
      store.pipe.and.returnValue(of(tabs));
      fixture.detectChanges();
      const el = de.query(By.css('app-dashboard-tabs'));
      el.triggerEventHandler('onDeleteTab', {tab, isCurrentTab: false});
      expect(store.dispatch).not.toHaveBeenCalledWith(new placeholderActions.ReleasePlaceholders());
    });
  });

  describe('add tab', () => {
    it('should emit add tab envent', () => {
      const spy = spyOn(comp.onAddTab, 'emit');
      store.pipe.and.returnValue(of(tabs));
      fixture.detectChanges();
      const el = de.query(By.css('app-dashboard-tabs'));
      el.triggerEventHandler('onAddTab', {});
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('add instances to global filters', () => {
    it('should emit add instance event', () => {
      store.pipe.and.returnValue(of(tabs));
      fixture.detectChanges();
      const data = 'tab id';
      const el = de.query(By.css('app-dashboard-tabs'));
      el.triggerEventHandler('onAddInstance', data);
      expect(store.dispatch).toHaveBeenCalledWith(new AddInstance(data));
    });
  });

  describe('remove instances out of global filters', () => {
    it('should emit remove instance event', () => {
      store.pipe.and.returnValue(of(tabs));
      fixture.detectChanges();
      const data = {id: 'tab id', instance: 'a instance'};
      const el = de.query(By.css('app-dashboard-tabs'));
      el.triggerEventHandler('onRemoveInstance', data);
      expect(store.dispatch).toHaveBeenCalledWith(new RemoveInstance(data));
    });
  });

  describe('dispatch global filters to converter', () => {
    it('should emit dispatching global filters event', () => {
      store.pipe.and.returnValue(of(tabs));
      fixture.detectChanges();
      const data = ['global filters'];
      const el = de.query(By.css('app-dashboard-tabs'));
      el.triggerEventHandler('onGlobalFilters', data);
      expect(store.dispatch).toHaveBeenCalledWith(new GlobalFilters(data));
    });
  });
});
