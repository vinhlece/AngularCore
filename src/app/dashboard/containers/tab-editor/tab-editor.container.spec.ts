import {DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {Store} from '@ngrx/store';
import {of} from 'rxjs';
import {mockPlaceholder} from '../../../common/testing/mocks/dashboards';
import * as dndActions from '../../actions/dnd.actions';
import * as placeholdersActions from '../../actions/placeholders.actions';
import * as tabEditorActions from '../../actions/tab-editor.actions';
import {GridMetrics} from '../../models';
import {TabEditorContainer} from './tab-editor.container';

describe('TabEditorContnainer', () => {
  let fixture: ComponentFixture<TabEditorContainer>;
  let comp: TabEditorContainer;
  let de: DebugElement;
  let store: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TabEditorContainer],
      providers: [
        {provide: Store, useValue: jasmine.createSpyObj('store', ['pipe', 'dispatch'])},
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TabEditorContainer);
    comp = fixture.componentInstance;
    comp.tabId = '1';
    de = fixture.debugElement;
    store = TestBed.get(Store);
  });

  describe('render', () => {
    it('should show tab grid when placeholders is available', () => {
      const placeholders = [mockPlaceholder(), mockPlaceholder()];
      store.pipe.and.returnValues(of(placeholders), of(null), of(null));
      fixture.detectChanges();
      const tabGrid = de.query(By.css('app-tab-grid'));
      expect(tabGrid).not.toBeNull();
    });

    it('should not show tab grid when placeholders is not available', () => {
      store.pipe.and.returnValue(of(null));
      fixture.detectChanges();
      const tabGrid = de.query(By.css('app-tab-grid'));
      expect(tabGrid).toBeNull();
    });
  });

  describe('onReady', () => {
    it('should dispatch action to initialize tab editor', () => {
      const placeholders = [mockPlaceholder(), mockPlaceholder()];
      store.pipe.and.returnValues(of(placeholders), of(null), of(null));
      fixture.detectChanges();
      const tabGrid = de.query(By.css('app-tab-grid'));
      tabGrid.triggerEventHandler('onReady', {});
      expect(store.dispatch).toHaveBeenCalledWith(new tabEditorActions.Initialize('1'));
    });
  });

  describe('onPlaceholderChange', () => {
    it('should dispatch edit placeholder action & update editing tab action', () => {
      const placeholders = [mockPlaceholder(), mockPlaceholder()];
      store.pipe.and.returnValues(of(placeholders), of(null), of(null));
      fixture.detectChanges();

      const tabGrid = de.query(By.css('app-tab-grid'));
      tabGrid.triggerEventHandler('onChange', placeholders);

      expect(store.dispatch).toHaveBeenCalledWith(jasmine.any(placeholdersActions.Set));
      expect(store.dispatch).toHaveBeenCalledWith(new tabEditorActions.UpdateEditingTab(comp.tabId));
    });
  });

  describe('onDragStart', () => {
    it('should dispatch drag start action & toggle grid lines action', () => {
      const placeholders = [mockPlaceholder(), mockPlaceholder()];
      store.pipe.and.returnValues(of(placeholders), of(null), of(null));
      fixture.detectChanges();

      const tabGrid = de.query(By.css('app-tab-grid'));
      tabGrid.triggerEventHandler('onDragStart', {});

      expect(store.dispatch).toHaveBeenCalledWith(new dndActions.DragStart({}));
      expect(store.dispatch).toHaveBeenCalledWith(new tabEditorActions.ToggleGridLines());
    });
  });

  describe('onDrag', () => {
    it('should dispatch drag action', () => {
      const placeholders = [mockPlaceholder(), mockPlaceholder()];
      store.pipe.and.returnValues(of(placeholders), of(null), of(null));
      fixture.detectChanges();

      const tabGrid = de.query(By.css('app-tab-grid'));
      tabGrid.triggerEventHandler('onDrag', {});

      expect(store.dispatch).toHaveBeenCalledWith(new dndActions.Drag({}));
    });
  });

  describe('onDragStop', () => {
    it('should dispatch drag stop action & toggle grid lines action', () => {
      const placeholders = [mockPlaceholder(), mockPlaceholder()];
      store.pipe.and.returnValues(of(placeholders), of(null), of(null));
      fixture.detectChanges();

      const tabGrid = de.query(By.css('app-tab-grid'));
      tabGrid.triggerEventHandler('onDragStop', {});

      expect(store.dispatch).toHaveBeenCalledWith(new dndActions.DragStop({}));
      expect(store.dispatch).toHaveBeenCalledWith(new tabEditorActions.ToggleGridLines());
    });
  });

  describe('onResizeStart', () => {
    it('should dispatch toggle grid lines action', () => {
      const placeholders = [mockPlaceholder(), mockPlaceholder()];
      store.pipe.and.returnValues(of(placeholders), of(null), of(null));
      fixture.detectChanges();

      const tabGrid = de.query(By.css('app-tab-grid'));
      tabGrid.triggerEventHandler('onResizeStart', {});

      expect(store.dispatch).toHaveBeenCalledWith(new tabEditorActions.ToggleGridLines());
    });
  });

  describe('onResizeStop', () => {
    it('should dispatch toggle grid lines action', () => {
      const placeholders = [mockPlaceholder(), mockPlaceholder()];
      store.pipe.and.returnValues(of(placeholders), of(null), of(null));
      fixture.detectChanges();

      const tabGrid = de.query(By.css('app-tab-grid'));
      tabGrid.triggerEventHandler('onResizeStop', {});

      expect(store.dispatch).toHaveBeenCalledWith(new tabEditorActions.ToggleGridLines());
    });
  });

  describe('maximized placeholder', () => {
    it('should show maximized placeholder if maximized placeholder is available', () => {
      const placeholders = [mockPlaceholder(), mockPlaceholder()];
      const metrics: GridMetrics = {
        innerGridHeight: 100,
        padding: {top: 20, left: 20, bottom: 20, right: 20}
      };
      const storePlaceholders = of(placeholders);
      const storeMaximizedPlaceholder = of(placeholders[0]);
      const storeMetrics = of(metrics);
      store.pipe.and.returnValues(storePlaceholders, storeMaximizedPlaceholder, storeMetrics);
      fixture.detectChanges();
      const el = de.query(By.css('.maximized-container'));
      expect(el).not.toBeNull();
    });

    it('should not show maximized placeholder if maximized placeholder is not available', () => {
      const placeholders = [mockPlaceholder(), mockPlaceholder()];
      const storePlaceholders = of(placeholders);
      const storeMaximizedPlaceholder = of(null);
      const storeMetrics = of(null);
      store.pipe.and.returnValues(storePlaceholders, storeMaximizedPlaceholder, storeMetrics);
      fixture.detectChanges();
      const el = de.query(By.css('.maximized-container'));
      expect(el).toBeNull();
    });
  });
});
