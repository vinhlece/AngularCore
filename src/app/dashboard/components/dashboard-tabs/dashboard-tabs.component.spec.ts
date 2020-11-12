import {DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {mockTabs} from '../../../common/testing/mocks/dashboards';
import {DashboardTabsComponent, TabEvent} from './dashboard-tabs.component';
import {ThemeModule} from '../../../theme/theme.module';

describe('DashboardTabsComponent', () => {
  let fixture: ComponentFixture<DashboardTabsComponent>;
  let de: DebugElement;
  let comp: DashboardTabsComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, ThemeModule],
      declarations: [DashboardTabsComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardTabsComponent);
    de = fixture.debugElement;
    comp = fixture.componentInstance;
    comp.tabs = mockTabs();
    fixture.detectChanges();
  });

  it('should set selectedTabIdx = 0 by default', () => {
    expect(comp.selectedTabIdx).toEqual(0);
  });

  it('should emit select tab event and update selectedTabIdx', () => {
    const spy = spyOn(comp.onSelectTab, 'emit');
    const el = de.query(By.css('mat-tab-group'));
    el.triggerEventHandler('selectedIndexChange', 1);

    const tab = comp.tabs[1];
    const isCurrentTab = false;
    const expected: TabEvent = {tab, isCurrentTab};
    expect(spy).toHaveBeenCalledWith(expected);
    expect(comp.selectedTabIdx).toEqual(1);
  });

  it('should emit add tab event', () => {
    const spy = spyOn(comp.onAddTab, 'emit');
    comp.handleAddTab(new MouseEvent('click'));

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should emit delete tab event', () => {
    const spy = spyOn(comp.onDeleteTab, 'emit');
    comp.handleDeleteTab(new MouseEvent('click'), comp.tabs[0]);

    const expected: TabEvent = {tab: comp.tabs[0], isCurrentTab: true};
    expect(spy).toHaveBeenCalledWith(expected);
  });

  it('should emit adding global instance event', () => {
    const spy = spyOn(comp.onAddInstance, 'emit');
    comp.handleAddInstance({});

    const expected = comp.tabs[comp.selectedTabIdx].id;
    expect(spy).toHaveBeenCalledWith(expected);
  });

  it('should emit removing global instance event', () => {
    const expected = {
      id: comp.tabs[comp.selectedTabIdx].id,
      instance: 'a instance'
    };
    const spy = spyOn(comp.onRemoveInstance, 'emit');
    comp.handleRemoveInstance(expected.instance);

    expect(spy).toHaveBeenCalledWith(expected);
  });

  it('should emit dispatching global instance event', () => {
    const spy = spyOn(comp.onGlobalFilters, 'emit');
    const fakeTabs = mockTabs();
    fakeTabs[comp.selectedTabIdx].globalFilters = ['a global filters'];
    comp.tabs = fakeTabs;
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith(comp.tabs[comp.selectedTabIdx].globalFilters);
  });
});
