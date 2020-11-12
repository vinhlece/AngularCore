import {DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';
import {of} from 'rxjs';
import {AuthenticationService} from '../../../user/services/auth/authentication.service';
import {EditWidgetNavComponent} from './edit-widget-nav.component';

describe('EditWidgetNavComponent', () => {
  let fixture: ComponentFixture<EditWidgetNavComponent>;
  let comp: EditWidgetNavComponent;
  let de: DebugElement;
  let mockStore;

  beforeEach(() => {
    mockStore = jasmine.createSpyObj('Store', ['pipe']);
    TestBed.configureTestingModule({
      declarations: [
        EditWidgetNavComponent
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({id: 1}),
            queryParams: of({type: null})
          }
        },
        {provide: Store, useValue: mockStore},
        AuthenticationService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(EditWidgetNavComponent);
    comp = fixture.componentInstance;
    de = fixture.debugElement;
  });

  it('should show edit bar widget when widget type is bar', () => {
    mockStore.pipe.and.returnValue(of({url: '/widget/1/edit?type=Bar', queryParams: {type: 'Bar'}}));
    fixture.detectChanges();

    const editBarWidget = de.query(By.css('app-edit-bar-widget'));
    expect(editBarWidget).not.toBeNull();
  });

  it('should hide edit bar widget when widget type is not bar', () => {
    mockStore.pipe.and.returnValue(of({url: '/widget/1/edit?type=Line', queryParams: {type: 'Line'}}));

    fixture.detectChanges();

    const editBarWidget = de.query(By.css('app-edit-bar-widget'));
    expect(editBarWidget).toBeNull();
  });

  it('should display edit trend diff line widget when widget type is trendDiff', () => {
    mockStore.pipe.and.returnValue(of({url: '/widget/1/edit?type=TrendDiff', queryParams: {type: 'TrendDiff'}}));

    fixture.detectChanges();

    const editTrenDiffLineWidget = de.query(By.css('app-edit-trend-diff-line-widget'));
    expect(editTrenDiffLineWidget).not.toBeNull();
  });
});
