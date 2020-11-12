import {DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {
  mockBarWidget,
  mockBillboardWidget,
  mockGeoMapWidget,
  mockLineWidget,
  mockSankeyWidget,
  mockSolidGaugeWidget,
  mockTabularWidget
} from '../../../common/testing/mocks/widgets';
import {DroppableDirective} from '../../../layout/components/droppable/droppable.directive';
import {ExportEvent} from '../../models';
import {Draggable, ExportType} from '../../models/enums';
import {PlaceholderComponent} from './placeholder.component';
import { BillboardWidget } from '../../../widgets/models';
import {TranslateModule} from '@ngx-translate/core';
import {CommonModule} from '../../../common/common.module';

declare let $: any;

describe('PlaceholderComponent', () => {
  let fixture: ComponentFixture<PlaceholderComponent>;
  let de: DebugElement;
  let comp: PlaceholderComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        TranslateModule.forRoot()
      ],
      declarations: [
        PlaceholderComponent,
        DroppableDirective
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaceholderComponent);
    comp = fixture.componentInstance;
    de = fixture.debugElement;
  });

  describe('line', () => {
    beforeEach(() => {
      comp.widget = mockLineWidget();
      comp.uiSettings = {
        contextMenu: true
      };
    });

    it('should show line chart', () => {
      fixture.detectChanges();
      const lineChart = de.query(By.css('app-line-chart'));
      expect(lineChart).not.toBeNull();
    });

    it('should emit events', () => {
      fixture.detectChanges();
      const lineChart = de.query(By.css('app-line-chart'));

      const zoomSpy = spyOn(comp.onZoom, 'emit');
      lineChart.triggerEventHandler('onZoom', {});
      expect(zoomSpy).toHaveBeenCalledTimes(1);

      const mouseDownSpy = spyOn(comp.onMouseDown, 'emit');
      lineChart.triggerEventHandler('onMouseDown', {});
      expect(mouseDownSpy).toHaveBeenCalledTimes(1);

      const contextMenuSpy = spyOn(comp.onContextMenu, 'emit');
      lineChart.triggerEventHandler('onContextMenu', {});
      expect(contextMenuSpy).toHaveBeenCalledTimes(1);

      const changeChartTypeSpy = spyOn(comp.onChangeChartType, 'emit');
      lineChart.triggerEventHandler('onChangeChartType', {});
      expect(changeChartTypeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('bar', () => {
    beforeEach(() => {
      comp.widget = mockBarWidget();
      comp.uiSettings = {
        contextMenu: true
      };
    });

    it('should render bar chart', () => {
      fixture.detectChanges();
      const barChart = de.query(By.css('app-bar-chart'));
      expect(barChart).not.toBeNull();
    });

    it('should emit events', () => {
      fixture.detectChanges();
      const barChart = de.query(By.css('app-bar-chart'));

      const clickSpy = spyOn(comp.onClick, 'emit');
      barChart.triggerEventHandler('onClick', {});
      expect(clickSpy).toHaveBeenCalledTimes(1);

      const mouseDownSpy = spyOn(comp.onMouseDown, 'emit');
      barChart.triggerEventHandler('onMouseDown', {});
      expect(mouseDownSpy).toHaveBeenCalledTimes(1);

      const contextMenuSpy = spyOn(comp.onContextMenu, 'emit');
      barChart.triggerEventHandler('onContextMenu', {});
      expect(contextMenuSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('billboard', () => {
    beforeEach(() => {
      comp.widget = { ...mockBillboardWidget(), flashing: true } as BillboardWidget;
      comp.uiSettings = {
        contextMenu: true
      };
    });

    it('should show billboard chart', () => {
      fixture.detectChanges();
      const billboardChart = de.query(By.css('app-billboard'));
      expect(billboardChart).not.toBeNull();
    });

    it('should emit mousedown event on mousedown', () => {
      const spy = spyOn(comp.onMouseDown, 'emit');
      fixture.detectChanges();
      const billboard = de.query(By.css('app-billboard'));
      billboard.triggerEventHandler('onMouseDown', {});
      expect(spy).toHaveBeenCalledTimes(1);
    });

    // TODO disabled until directive injection updated
    xit('should trigger twinkle animation on data change', () => {
      const twinkle = jasmine.createSpyObj('twinkle', ['trigger']);
      comp.twinkle = twinkle;
      fixture.detectChanges();
      const billboard = de.query(By.css('app-billboard'));
      billboard.triggerEventHandler('onChange', {});
      expect(twinkle.trigger).toHaveBeenCalledTimes(1);
    });
  });

  describe('tabular', () => {
    beforeEach(() => {
      comp.widget = mockTabularWidget();
      comp.uiSettings = {
        contextMenu: true
      };
    });

    it('should render a tabular display', () => {
      fixture.detectChanges();
      const tabular = de.query(By.css('app-table-component'));
      expect(tabular).not.toBeNull();
    });

    it('should emit events', () => {
      fixture.detectChanges();
      const tabular = de.query(By.css('app-table-component'));

      const mouseDownSpy = spyOn(comp.onMouseDown, 'emit');
      tabular.triggerEventHandler('onMouseDown', {});
      expect(mouseDownSpy).toHaveBeenCalledTimes(1);

      const contextMenuSpy = spyOn(comp.onContextMenu, 'emit');
      tabular.triggerEventHandler('onContextMenu', {});
      expect(contextMenuSpy).toHaveBeenCalledTimes(1);

      const moveColumnSpy = spyOn(comp.onMoveColumn, 'emit');
      tabular.triggerEventHandler('onMoveColumn', {});
      expect(moveColumnSpy).toHaveBeenCalledTimes(1);

      const pageSpy = spyOn(comp.onPage, 'emit');
      tabular.triggerEventHandler('onPage', {});
      expect(pageSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('sankey', () => {
    beforeEach(() => {
      comp.widget = mockSankeyWidget();
      comp.uiSettings = {
        contextMenu: true
      };
    });

    it('should render a sankey widget', () => {
      fixture.detectChanges();
      const sankey = de.query(By.css('app-sankey-chart'));
      expect(sankey).not.toBeNull();
    });
  });

  describe('solid gauge', () => {
    beforeEach(() => {
      comp.widget = mockSolidGaugeWidget();
      comp.uiSettings = {
        contextMenu: true
      };
    });

    it('should render a solid gauge', () => {
      fixture.detectChanges();
      const solidGauge = de.query(By.css('app-solid-gauge'));
      expect(solidGauge).not.toBeNull();
    });

    it('should emit events', () => {
      fixture.detectChanges();
      const solidGauge = de.query(By.css('app-solid-gauge'));

      const mouseDownSpy = spyOn(comp.onMouseDown, 'emit');
      solidGauge.triggerEventHandler('onMouseDown', {});
      expect(mouseDownSpy).toHaveBeenCalledTimes(1);

      const switchDisplayModeSpy = spyOn(comp.onSwitchDisplayMode, 'emit');
      solidGauge.triggerEventHandler('onSwitchDisplayMode', {});
      expect(switchDisplayModeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('geo map', () => {
    beforeEach(() => {
      comp.widget = mockGeoMapWidget();
      comp.uiSettings = {
        contextMenu: true
      };
    });

    it('should render a geo map', () => {
      fixture.detectChanges();
      const geoMap = de.query(By.css('app-geo-map'));
      expect(geoMap).not.toBeNull();
    });

    it('should emit events', () => {
      fixture.detectChanges();
      const geoMap = de.query(By.css('app-geo-map'));

      const mouseDownSpy = spyOn(comp.onMouseDown, 'emit');
      geoMap.triggerEventHandler('onMouseDown', {});
      expect(mouseDownSpy).toHaveBeenCalledTimes(1);

      const contextMenuSpy = spyOn(comp.onContextMenu, 'emit');
      geoMap.triggerEventHandler('onContextMenu', {});
      expect(contextMenuSpy).toHaveBeenCalledTimes(1);

      const switchDisplayModeSpy = spyOn(comp.onSwitchDisplayMode, 'emit');
      geoMap.triggerEventHandler('onSwitchDisplayMode', {});
      expect(switchDisplayModeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('header', () => {
    describe('delete', () => {
      it('should emit delete event on delete', () => {
        comp.widget = mockLineWidget();
        comp.uiSettings = {};
        const spy = spyOn(comp.onDelete, 'emit');
        fixture.detectChanges();
        const el = de.query(By.css('app-placeholder-header'));
        el.triggerEventHandler('onDelete', {});
        expect(spy).toHaveBeenCalledTimes(1);
      });
    });

    describe('maximize/minimize', () => {
      it('should emit maximize event on maximize', () => {
        comp.widget = mockLineWidget();
        comp.uiSettings = {
          contextMenu: true
        };
        const spy = spyOn(comp.onMaximize, 'emit');
        fixture.detectChanges();
        const el = de.query(By.css('app-placeholder-header'));
        el.triggerEventHandler('onMaximize', {});
        expect(spy).toHaveBeenCalledTimes(1);
      });

      it('should emit minimize event on minimize', () => {
        comp.widget = mockLineWidget();
        comp.uiSettings = {};
        const spy = spyOn(comp.onMinimize, 'emit');
        fixture.detectChanges();
        const el = de.query(By.css('app-placeholder-header'));
        el.triggerEventHandler('onMinimize', {});
        expect(spy).toHaveBeenCalledTimes(1);
      });
    });

    describe('drop', () => {
      beforeEach(() => {
        comp.widget = mockLineWidget();
        comp.uiSettings = {
          contextMenu: true
        };
      });

      it('should emit drop instance on drop instance', () => {
        const spy = spyOn(comp.onDropMetric, 'emit');
        fixture.detectChanges();

        const target = $('<app-draggable-metrics-container/>').data('app-droppable-data', {draggable: Draggable.Instance});
        const evt = {target};
        const el = de.query(By.directive(DroppableDirective));
        el.triggerEventHandler('onDrop', evt);

        expect(spy).toHaveBeenCalledTimes(1);
      });

      it('should emit drop measure on drop measure', () => {
        const spy = spyOn(comp.onDropMetric, 'emit');
        fixture.detectChanges();

        const target = $('<app-draggable-metrics-container/>').data('app-droppable-data', {draggable: Draggable.Measure});
        const evt = {target};
        const el = de.query(By.directive(DroppableDirective));
        el.triggerEventHandler('onDrop', evt);

        expect(spy).toHaveBeenCalledTimes(1);
      });

      it('should emit drop both on drop both measure & instance', () => {
        const spy = spyOn(comp.onDropMetric, 'emit');
        fixture.detectChanges();

        const target = $('<app-draggable-metrics-container/>').data('app-droppable-data', {draggable: Draggable.Both});
        const evt = {target};
        const el = de.query(By.directive(DroppableDirective));
        el.triggerEventHandler('onDrop', evt);

        expect(spy).toHaveBeenCalledTimes(1);
      });
    });

    describe('export', () => {
      it('should emit export event on export', () => {
        comp.widget = mockTabularWidget();
        comp.data = [];
        comp.uiSettings = {};
        const spy = spyOn(comp.onExport, 'emit');
        fixture.detectChanges();
        const el = de.query(By.css('app-placeholder-header'));
        const evt: ExportEvent = {
          data: [],
          type: ExportType.PDF
        };
        el.triggerEventHandler('onExport', ExportType.PDF);
        expect(spy).toHaveBeenCalledWith(evt);
      });
    });

    describe('search', () => {
      it('should set state to open search field', () => {
        comp.widget = mockTabularWidget();
        comp.data = [];
        comp.uiSettings = {};
        fixture.detectChanges();
        const el = de.query(By.css('app-placeholder-header'));
        el.triggerEventHandler('onSearch', {});
        expect(fixture.componentInstance.isSearch).toBeTruthy();
      });

      it('should set state to close search field', () => {
        comp.widget = mockTabularWidget();
        comp.data = [];
        comp.uiSettings = {};
        fixture.detectChanges();
        const el = de.query(By.css('app-placeholder-header'));
        el.triggerEventHandler('onSearch', {});
        el.triggerEventHandler('onSearch', {});
        expect(fixture.componentInstance.isSearch).toBeFalsy();
      });
    });

    describe('copy', () => {
      it('should emit copy event on copy', () => {
        comp.widget = mockLineWidget();
        comp.uiSettings = {};
        const spy = spyOn(comp.onCopy, 'emit');
        fixture.detectChanges();
        const el = de.query(By.css('app-placeholder-header'));
        el.triggerEventHandler('onCopy', {});
        expect(spy).toHaveBeenCalledTimes(1);
      });
    });

    describe('change title', () => {
      it('should emit change title event', () => {
        comp.widget = mockLineWidget();
        comp.uiSettings = {};
        const spy = spyOn(comp.onChangeTitle, 'emit');
        fixture.detectChanges();
        const el = de.query(By.css('app-placeholder-header'));
        el.triggerEventHandler('onChangeTitle', 'abc');
        expect(spy).toHaveBeenCalledWith('abc');
      });
    });
  });

  describe('overlay', () => {
    it('should show overlay', () => {
      comp.widget = mockLineWidget();
      comp.uiSettings = {overlay: true};
      fixture.detectChanges();
      const el = de.query(By.css('app-content-overlay'));
      expect(el).not.toBeNull();
    });

    it('should not show overlay', () => {
      comp.widget = mockBarWidget();
      comp.uiSettings = {overlay: false};
      const realTimeData = [
        {instance: 'New Sales', measureName: 'ContactsAnswered', measureTimestamp: 1515549600000, measureValue: 103},
      ];
      comp.data = realTimeData;
      fixture.detectChanges();
      const el = de.query(By.css('app-content-overlay'));
      expect(el).toBeNull();
    });
  });
  describe('menu', () => {
    it('should emit measure name when user change measure', () => {
      comp.widget = mockBarWidget();
      comp.uiSettings = {
        contextMenu: {
          editMeasure: true
        }
      };
      comp.measures = [{name: 'Contact Answered'}];
      fixture.detectChanges();
      const barChart = de.query(By.css('app-bar-chart'));
      barChart.triggerEventHandler('onContextMenu', {});
      fixture.detectChanges();
      const clickSpy = spyOn(comp.onUpdateMeasure, 'emit');
      const el = de.query(By.css('.edit-measure-item'));
      fixture.detectChanges();
      const measure = 'Contact Answered';
      el.triggerEventHandler('click', {measure});
      fixture.detectChanges();
      const event = {
        widget: comp.widget,
        newMeasure: measure
      };
      expect(clickSpy).toHaveBeenCalledWith(event);
    });
  });
});
