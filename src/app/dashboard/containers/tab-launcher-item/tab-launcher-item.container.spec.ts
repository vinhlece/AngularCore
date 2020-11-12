import {DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {combineReducers, Store, StoreModule} from '@ngrx/store';
import * as fromRoot from '../../../reducers';
import {mockDashboard} from '../../../common/testing/mocks/dashboards';
import {mockWidgets} from '../../../common/testing/mocks/widgets';
import * as widgetsActions from '../../../widgets/actions/widgets.actions';
import {Widget} from '../../../widgets/models';
import * as fromWidgets from '../../../widgets/reducers';
import * as dashboardsActions from '../../actions/dashboards.action';
import * as tabEditorActions from '../../actions/tab-editor.actions';
import {ExportEvent} from '../../models';
import {ExportType} from '../../models/enums';
import * as fromDashboards from '../../reducers';
import {LauncherItemFactory} from './createItem';
import {DummyItem, LauncherItem} from './items';
import {TabLauncherItemContainer} from './tab-launcher-item.container';
import {UpdateMeasure} from '../../actions/edit-on-plot.actions';
import * as editOnPlotActions from '../../actions/edit-on-plot.actions';

xdescribe('TabLauncherItemContainer', () => {
  let comp: TabLauncherItemContainer;
  let fixture: ComponentFixture<TabLauncherItemContainer>;
  let de: DebugElement;
  let store: any;
  let launcherItemFactory: any;
  let launcherItem: LauncherItem;
  let widget: Widget;

  beforeEach(async(() => {
    launcherItemFactory = jasmine.createSpyObj('launcherItemFactory', ['create']);

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRoot.reducers,
          dashboards: combineReducers(fromDashboards.reducers),
          widgets: combineReducers(fromWidgets.reducers)
        })
      ],
      declarations: [
        TabLauncherItemContainer,
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(TabLauncherItemContainer, {
      set: {
        providers: [{provide: LauncherItemFactory, useValue: launcherItemFactory}]
      }
    });
  }));

  beforeEach(() => {
    const widgets = mockWidgets();
    const dashboard = mockDashboard();
    const placeholder = dashboard.tabs[0].placeholders[0];
    widget = widgets.find((item: Widget) => item.id === placeholder.widgetId);

    fixture = TestBed.createComponent(TabLauncherItemContainer);
    de = fixture.debugElement;

    launcherItem = new DummyItem(store, '', widget);
    launcherItemFactory.create.and.returnValue(launcherItem);

    comp = fixture.componentInstance;
    comp.placeholderId = placeholder.id;

    store = TestBed.get(Store);
    store.dispatch(new widgetsActions.LoadSuccess(widget));
    store.dispatch(new dashboardsActions.AddSuccess(dashboard));
  });

  describe('init', () => {
    it('should create launcher item when widget is available', () => {
      fixture.detectChanges();
      expect(launcherItemFactory.create).toHaveBeenCalledWith(widget);
    });

    it('should tell launcher item to generate data', () => {
      const spy = spyOn(launcherItem, 'generateData');
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should tell launcher item to configure ui', () => {
      const spy = spyOn(launcherItem, 'configureUI');
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should tell launcher item to get chart size', () => {
      const spy = spyOn(launcherItem, 'getChartSize');
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('show time line', () => {
    it('should call show time line from launcher item', () => {
      fixture.detectChanges();
      const spy = spyOn(launcherItem, 'createTimeLine');
      const el = de.query(By.css('app-placeholder'));
      el.triggerEventHandler('onShowTimeLine', {});
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('show bill board', () => {
    it('should call show bill board from launcher item', () => {
      fixture.detectChanges();
      const spy = spyOn(launcherItem, 'createBillboard');
      const el = de.query(By.css('app-placeholder'));
      el.triggerEventHandler('onShowBillboard', {});
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('show table', () => {
    it('should call show table from launcher item', () => {
      fixture.detectChanges();
      const spy = spyOn(launcherItem, 'createTable');
      const el = de.query(By.css('app-placeholder'));
      el.triggerEventHandler('onShowTable', {});
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('delete instance', () => {
    it('should call delete instance from launcher item', () => {
      fixture.detectChanges();
      const spy = spyOn(launcherItem, 'deleteMetric');
      const el = de.query(By.css('app-placeholder'));
      el.triggerEventHandler('onDeleteInstance', {});
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('delete measure', () => {
    it('should call delete measure from launcher item', () => {
      fixture.detectChanges();
      const spy = spyOn(launcherItem, 'deleteMetric');
      const el = de.query(By.css('app-placeholder'));
      el.triggerEventHandler('onDeleteMeasure', {});
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('click', () => {
    it('should call handle plot from launcher item', () => {
      fixture.detectChanges();
      const spy = spyOn(launcherItem, 'plot');
      const el = de.query(By.css('app-placeholder'));
      const evt = new MouseEvent('click');
      el.triggerEventHandler('onClick', evt);
      expect(spy).toHaveBeenCalledWith(evt);
    });
  });

  describe('mousedown', () => {
    it('should call handle plot from launcher item', () => {
      fixture.detectChanges();
      const spy = spyOn(launcherItem, 'plot');
      const el = de.query(By.css('app-placeholder'));
      const evt = new MouseEvent('mousedown');
      el.triggerEventHandler('onMouseDown', evt);
      expect(spy).toHaveBeenCalledWith(evt);
    });
  });

  describe('contextmenu', () => {
    it('should call handle plot from launcher item', () => {
      fixture.detectChanges();
      const spy = spyOn(launcherItem, 'plot');
      const el = de.query(By.css('app-placeholder'));
      const evt = new MouseEvent('contextmenu');
      el.triggerEventHandler('onContextMenu', evt);
      expect(spy).toHaveBeenCalledWith(evt);
    });
  });

  describe('export', () => {
    it('should call export data from launcher item', () => {
      fixture.detectChanges();
      const spy = spyOn(launcherItem, 'exportData');
      const el = de.query(By.css('app-placeholder'));
      const evt: ExportEvent = {type: ExportType.PDF, data: []};
      el.triggerEventHandler('onExport', evt);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('minimize/maximize', () => {
    it('should call minimize from launcher item on minimize', () => {
      const spy = spyOn(launcherItem, 'minimize');
      fixture.detectChanges();
      const el = de.query(By.css('app-placeholder'));
      el.triggerEventHandler('onMinimize', {});
      expect(spy).toHaveBeenCalled();
    });

    it('should call maximize from launcher item on maximize', () => {
      const spy = spyOn(launcherItem, 'maximize');
      fixture.detectChanges();
      const el = de.query(By.css('app-placeholder'));
      el.triggerEventHandler('onMaximize', {});
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should dispatch remove widget', () => {
      const spy = spyOn(store, 'dispatch');
      fixture.detectChanges();
      const el = de.query(By.css('app-placeholder'));
      el.triggerEventHandler('onDelete', {});
      expect(spy).toHaveBeenCalledWith(new tabEditorActions.RemoveWidget(comp.placeholderId));
    });
  });

  describe('copy', () => {
    it('should call copy embedded widget from launcher item', () => {
      fixture.detectChanges();
      const spy = spyOn(launcherItem, 'copyEmbeddedWidget');
      const el = de.query(By.css('app-placeholder'));
      el.triggerEventHandler('onCopy', {});
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('focus/blur', () => {
    it('should call focus from launcher item on mouse enter', () => {
      const spy = spyOn(launcherItem, 'focus');
      fixture.detectChanges();
      fixture.nativeElement.dispatchEvent(new MouseEvent('mouseenter'));
      expect(spy).toHaveBeenCalled();
    });

    it('should call blur from launcher item on mouse leave', () => {
      const spy = spyOn(launcherItem, 'blur');
      fixture.detectChanges();
      fixture.nativeElement.dispatchEvent(new MouseEvent('mouseleave'));
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('zoom', () => {
    it('should call zoom from launcher item on zoom', () => {
      const spy = spyOn(launcherItem, 'zoom');
      fixture.detectChanges();
      const el = de.query(By.css('app-placeholder'));
      el.triggerEventHandler('onZoom', {});
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('rename', () => {
    it('should call rename from launcher item on change title', () => {
      const spy = spyOn(launcherItem, 'rename');
      fixture.detectChanges();
      const el = de.query(By.css('app-placeholder'));
      el.triggerEventHandler('onChangeTitle', 'abc');
      expect(spy).toHaveBeenCalledWith('abc');
    });
  });

  describe('moveColumn', () => {
    it('should call moveColumn from launcher item on moveColumn', () => {
      const spy = spyOn(launcherItem, 'moveColumn');
      fixture.detectChanges();
      const el = de.query(By.css('app-placeholder'));
      el.triggerEventHandler('onMoveColumn', {});
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('onPage', () => {
    it('should call page from launcher item on page', () => {
      const spy = spyOn(launcherItem, 'page');
      fixture.detectChanges();
      const el = de.query(By.css('app-placeholder'));
      el.triggerEventHandler('onPage', {});
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('dropInstance', () => {
    it('should call drop instance from launcher item on drop instance', () => {
      const spy = spyOn(launcherItem, 'dropMetric');
      fixture.detectChanges();
      const el = de.query(By.css('app-placeholder'));
      el.triggerEventHandler('onDropInstance', {});
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('dropMeasure', () => {
    it('should call drop measure from launcher item on drop measure', () => {
      const spy = spyOn(launcherItem, 'dropMetric');
      fixture.detectChanges();
      const el = de.query(By.css('app-placeholder'));
      el.triggerEventHandler('onDropMeasure', {});
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('dropBoth', () => {
    it('should call drop both from launcher item on drop both instance and measure', () => {
      const spy = spyOn(launcherItem, 'dropMetric');
      fixture.detectChanges();
      const el = de.query(By.css('app-placeholder'));
      el.triggerEventHandler('onDropBoth', {});
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('switchDisplayMode', () => {
    it('should call switchDisplayMode from launcher item on switchDisplayMode', () => {
      const spy = spyOn(launcherItem, 'switchDisplayMode');
      fixture.detectChanges();
      const el = de.query(By.css('app-placeholder'));
      el.triggerEventHandler('onSwitchDisplayMode', {});
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('changeChartType', () => {
    it('should call changeChartType from launcher item on changeChartType', () => {
      const spy = spyOn(launcherItem, 'changeChartType');
      fixture.detectChanges();
      const el = de.query(By.css('app-placeholder'));
      el.triggerEventHandler('onChangeChartType', {});
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('searchChange', () => {
    it('should call search change from launcher item on SearchChange', () => {
      const newWidget = {
        ...this.widget,
        agents: [
          'Sean',
          'Tom',
          'Tony',
        ],
        queues: [
          'Advisory',
          'Sell',
          'Support'
        ],
        groupBy: 'agent',
        measures: ['CallTimeLine'],
        segmentTypes: [
          'ContactsAnswered',
          'QueueTime',
          'TalkTime'
        ],
        filters: ['callID: 1', 'callID: 11']
      };
      const spy = spyOn(store, 'dispatch');
      fixture.detectChanges();
      const el = de.query(By.css('app-placeholder'));
      el.triggerEventHandler('onSearchChange', {...newWidget});
      expect(spy).toHaveBeenCalledWith(new widgetsActions.Update({...newWidget}));
    });
  });

  describe('updateMeasure', () => {
    it('should call update measure event from launcher item on UpdateMeasureChange', () => {
      const newWidget = mockWidgets()[0];
      const spy = spyOn(store, 'dispatch');
      fixture.detectChanges();
      const el = de.query(By.css('app-placeholder'));
      const data = {
        widget: newWidget,
        newMeasure: 'a newMeasure'
      };
      el.triggerEventHandler('onUpdateMeasure', data);
      expect(spy).toHaveBeenCalledWith(new editOnPlotActions.UpdateMeasure(data));
    });
  });
});
