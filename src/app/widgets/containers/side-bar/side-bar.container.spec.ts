import {DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {Store} from '@ngrx/store';
import * as searchActions from '../../actions/search.actions';
import {SideBarContainer} from './side-bar.container';

describe('SideBarContainer', () => {
  let fixture: ComponentFixture<SideBarContainer>;
  let comp: SideBarContainer;
  let de: DebugElement;
  let store;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
      ],
      declarations: [
        SideBarContainer
      ],
      providers: [
        {provide: Store, useValue: jasmine.createSpyObj('store', ['pipe', 'dispatch'])},
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideBarContainer);
    de = fixture.debugElement;
    comp = fixture.componentInstance;
    store = TestBed.get(Store);
  });

  it('should dispatch search action on search event', () => {
    fixture.detectChanges();
    comp.currentLibrary = { label: 'widgets', params: { searchType: 'all' } };
    const el = de.query(By.css('app-side-bar'));
    el.triggerEventHandler('searchTextChangeEvent', 'search token');
    expect(store.dispatch).toHaveBeenCalledWith(new searchActions.Search(comp.currentLibrary.params.searchType + ':search token'));
  });
});
