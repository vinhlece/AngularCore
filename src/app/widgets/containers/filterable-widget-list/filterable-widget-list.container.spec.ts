import {CdkTableModule} from '@angular/cdk/table';
import {DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import {By} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {Store} from '@ngrx/store';
import {of} from 'rxjs';
import * as navigationActions from '../../../layout/actions/navigation.actions';
import {mockWidget, mockWidgets} from '../../../common/testing/mocks/widgets';
import * as widgetsActions from '../../actions/widgets.actions';
import {WidgetListComponent} from '../../components/widget-list/widget-list.component';
import {FilterableWidgetListContainer} from './filterable-widget-list.container';
import {TranslateModule} from '@ngx-translate/core';
import {ThemeModule} from '../../../theme/theme.module';

describe('FilterableWidgetListContainer', () => {
  let fixture: ComponentFixture<FilterableWidgetListContainer>;
  let comp: FilterableWidgetListContainer;
  let de: DebugElement;
  let store: any;

  beforeEach(() => {
    const storeSpy = jasmine.createSpyObj('store', ['pipe', 'dispatch']);

    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        MatTableModule,
        MatSortModule,
        MatMenuModule,
        MatIconModule,
        CdkTableModule,
        TranslateModule.forRoot(),
        ThemeModule
      ],
      declarations: [
        FilterableWidgetListContainer,
        WidgetListComponent
      ],
      providers: [
        {provide: Store, useValue: storeSpy},
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(FilterableWidgetListContainer);
    comp = fixture.componentInstance;
    de = fixture.debugElement;
    store = TestBed.get(Store);
  });

  describe('init', () => {
    it('should dispatch load$ action', () => {
      fixture.detectChanges();
      expect(store.dispatch).toHaveBeenCalledWith(jasmine.any(widgetsActions.LoadAll));
    });
  });

  describe('render', () => {
    it('should show child component if widgets is available', () => {
      const widgets = mockWidgets();
      store.pipe.and.returnValue(of(widgets));
      fixture.detectChanges();

      const child = de.query(By.css('app-widget-list'));
      expect(child).not.toBeNull();
      expect(child.componentInstance.widgets).toEqual(widgets);
    });

    it('should hide child component if widgets is not available', () => {
      store.pipe.and.returnValue(of(null));
      fixture.detectChanges();

      const child = de.query(By.css('app-widget-list'));
      expect(child).toBeNull();
    });
  });

  describe('onEdit', () => {
    it('should dispatch navigate action', async(() => {
      const widgets = mockWidgets();
      store.pipe.and.returnValue(of(widgets));
      fixture.detectChanges();

      const widget = {
        ...mockWidget(),
        id: 1
      };
      const child = de.query(By.css('app-widget-list'));
      child.triggerEventHandler('onEdit', widget);

      expect(store.dispatch).toHaveBeenCalledTimes(2);
      expect(store.dispatch).toHaveBeenCalledWith(jasmine.any(navigationActions.NavigateTo));
    }));
  });

  describe('onDelete', () => {
    it('should dispatch delete action to store', async(() => {
      const widget1 = {
        ...mockWidget(),
        id: 1
      };
      const widget2 = {
        ...mockWidget(),
        id: 2
      };
      const widgets = [widget1, widget2];
      store.pipe.and.returnValue(of(widgets));
      fixture.detectChanges();

      const child = de.query(By.css('app-widget-list'));
      child.triggerEventHandler('onDelete', 1);

      expect(store.dispatch).toHaveBeenCalledWith(jasmine.any(widgetsActions.Delete));
    }));
  });
});

