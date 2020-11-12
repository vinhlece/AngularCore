import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {
  ChangeChartTypeEvent,
  ChartReadyEvent,
  Dimension,
  DisplayModeEvent,
  MoveColumnEvent,
  REPStyles,
  WidgetMouseEvent,
  ZoomEvent
} from '../../../charts/models';
import {ContextMenuEvent} from '../../../layout/components/context-menu/context-menu.component';
import {DropEvent} from '../../../layout/components/droppable/droppable.directive';
import {TwinkleDirective} from '../../../layout/components/twinkle/twinkle.directive';
import {WidgetMode, WidgetType} from '../../../widgets/constants/widget-types';
import {BarWidget, BillboardWidget, Paging, Widget} from '../../../widgets/models';
import {PlaceholderUISettings} from '../../containers/tab-launcher-item/ui-behaviors';
import {ExportEvent, Placeholder, TimeRangeInterval, WidgetPosition} from '../../models';
import {DisplayMode, Draggable, ExportType} from '../../models/enums';
import {ColorPalette, InstanceColor} from '../../../common/models/index';
import {Measure} from '../../../measures/models/index';
import {getDefaultValue, isNullOrUndefined} from '../../../common/utils/function';
import { isChartWidget } from '../../../widgets/utils/functions';
import {ThemeService} from '../../../theme/theme.service';
import {Theme} from '../../../theme/model/index';
import {OutputFileType} from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';

declare let $: any;

@Component({
  selector: 'app-placeholder',
  templateUrl: './placeholder.component.html',
  styleUrls: ['./placeholder.component.scss'],
})
export class PlaceholderComponent implements OnInit {
  private _uiSettings: PlaceholderUISettings;
  readonly WIDGET_TYPES = WidgetType;

  contextMenuEvent: ContextMenuEvent;
  isSearch: boolean;
  overlayText: string;
  exportMenu: boolean = false;
  isDisplayMode: boolean = false;
  private _themeService: ThemeService;

  @Input() widget: Widget;
  @Input() showLegend: boolean;
  @Input() pauseLineChart: boolean;
  @Input() placeholder: Placeholder;
  @Input() data;
  @Input() chartSize: Dimension;
  @Input() zoom: ZoomEvent;
  @Input() callTimeLineZoom: ZoomEvent;
  @Input() displayMode: DisplayMode;
  @Input() chartType: string;
  @Input() interval: TimeRangeInterval;
  @Input() predictiveSetting: TimeRangeInterval;
  @Input() currentTimestamp: number;
  @Input() styles: REPStyles = {};
  @Input() colorPalette: ColorPalette;
  @Input() widgetPosition: WidgetPosition;
  @Input() globalFilters: string[];
  @Input() measures: Measure[];
  @Input() isRealTime: any;
  @Input() isMaximized: boolean;
  @Input() instanceColors: InstanceColor[];
  @Input() editingWidget: Widget;

  @Input()
  get uiSettings(): PlaceholderUISettings {
    return this._uiSettings;
  }

  set uiSettings(value: PlaceholderUISettings) {
    this._uiSettings = value || {};
  }

  @Output() onDelete = new EventEmitter<void>();
  @Output() onMaximize = new EventEmitter<void>();
  @Output() onMinimize = new EventEmitter<void>();
  @Output() onExport = new EventEmitter<ExportEvent>();
  @Output() onZoom = new EventEmitter<ZoomEvent>();
  @Output() onCopy = new EventEmitter<void>();
  @Output() onSearch = new EventEmitter<void>();
  @Output() onChangeTitle = new EventEmitter<string>();
  @Output() onChangeSubTitle = new EventEmitter<string>();
  @Output() onClick = new EventEmitter<WidgetMouseEvent>();
  @Output() onMouseDown = new EventEmitter<WidgetMouseEvent>();
  @Output() onContextMenu = new EventEmitter<WidgetMouseEvent>();
  @Output() onShowTimeLine = new EventEmitter<void>();
  @Output() onShowTable = new EventEmitter<void>();
  @Output() onShowBillboard = new EventEmitter<void>();
  @Output() onShowLiquidFillGauge = new EventEmitter<void>();
  @Output() onDeleteMetric = new EventEmitter<string>();
  @Output() onDropMetric = new EventEmitter<Draggable>();
  @Output() onMoveColumn = new EventEmitter<MoveColumnEvent>();
  @Output() onPage = new EventEmitter<Paging>();
  @Output() onSwitchDisplayMode = new EventEmitter<DisplayModeEvent>();
  @Output() onChangeChartType = new EventEmitter<ChangeChartTypeEvent>();
  @Output() onChartReady = new EventEmitter<ChartReadyEvent>();
  @Output() onColumnMouseDown = new EventEmitter<WidgetMouseEvent>();
  @Output() onInvokeUrl = new EventEmitter<void>();
  @Output() onAutoInvokeUrl = new EventEmitter<any>();
  @Output() onSearchChange = new EventEmitter<any>();
  @Output() onEdit = new EventEmitter<Widget>();
  @Output() onUpdateMeasure = new EventEmitter<any>();
  @Output() onAddMeasure = new EventEmitter<any>();
  @Output() onSetTimeRange = new EventEmitter<Widget>();
  @Output() onSetRealTimeMode = new EventEmitter<string>();
  @Output() onColumnResize = new EventEmitter<Widget>();
  @Output() onClickShiftTrendDiff = new EventEmitter<void>();
  @Output() onClickDayTrendDiff = new EventEmitter<void>();
  @Output() onClickWeekTrendDiff = new EventEmitter<void>();
  @Output() onLegendConfig = new EventEmitter<Widget>();
  @Output() onChangeShowLegend = new EventEmitter<boolean>();
  @Output() onChangePauseLineChart = new EventEmitter<boolean>();

  @ViewChild(TwinkleDirective) twinkle: TwinkleDirective;

  constructor(themeService: ThemeService) {
    this._themeService = themeService;
  }

  ngOnInit() {
    document.addEventListener('click', () => {
      this.contextMenuEvent = null;
    });
  }

  handleDelete() {
    this.onDelete.emit();
  }

  handleMaximize() {
    this.onMaximize.emit();
  }

  handleMinimize() {
    this.onMinimize.emit();
  }

  handleZoom(event: ZoomEvent) {
    this.onZoom.emit(event);
  }

  handleDrop(event: DropEvent) {
    this.onDropMetric.emit(this.getDraggableData(event).draggable);
  }

  handleClick(event: MouseEvent) {
    this.onClick.emit(event);
  }

  handleMouseDown(event: MouseEvent) {
    this.onMouseDown.emit(event);
  }

  handleContextMenu(event: MouseEvent) {
    this.buildContextMenuEventFromHtmlEvent(event);
    this.onContextMenu.emit(event);
  }

  handleShowTimeLineWidget() {
    this.onShowTimeLine.emit();
  }

  handleShowTableWidget() {
    this.onShowTable.emit();
  }

  handleShowBillboardWidget() {
    this.onShowBillboard.emit();
  }

  handleShowLiquidFillGaugeWidget() {
    this.onShowLiquidFillGauge.emit();
  }

  handleDeleteMetric(metric: string) {
    this.onDeleteMetric.emit(metric);
  }

  handleExport(type: ExportType) {
    const evt: ExportEvent = {
      type,
      data: this.data
    };
    this.onExport.emit(evt);
  }

  handleSearch() {
    this.isSearch = !this.isSearch;
  }

  handleCopy() {
    this.onCopy.emit();
  }

  handleChangeTitle(title: string) {
    this.onChangeTitle.emit(title);
  }

  handleChangeSubTitle(subTitle: string) {
    this.onChangeSubTitle.emit(subTitle);
  }

  handleBillboardDataChange() {
    if (this.twinkle && (this.widget as BillboardWidget).flashing) {
      this.twinkle.trigger();
    }
  }

  handleLiquidFillDataChange() {
    console.log('handleLiquidFillDataChange', this.widget, this.data);
  }

  handleMoveColumn(event: MoveColumnEvent) {
    this.onMoveColumn.emit(event);
  }

  handlePage(event: Paging) {
    this.onPage.emit(event);
  }

  handleSwitchDisplayMode(event: DisplayModeEvent) {
    this.onSwitchDisplayMode.emit(event);
  }

  handleChangeChartType(event: ChangeChartTypeEvent) {
    this.onChangeChartType.emit(event);
  }

  handleChartReady(event: ChartReadyEvent) {
    this.onChartReady.emit(event);
  }

  handleColumnMouseDown(event: WidgetMouseEvent) {
    this.onColumnMouseDown.emit(event);
  }

  handleInvokeUrl() {
    this.onInvokeUrl.emit();
  }

  handleAutoInvokeUrls(event: any) {
    if (!event) {
      return;
    }
    this.onAutoInvokeUrl.emit(event);
  }

  handleSearchChange(event: any) {
    if (!event) {
      return;
    }
    this.onSearchChange.emit(event);
  }

  handleEdit() {
    this.onEdit.emit(this.widget);
  }

  handleLegendConfig(event) {
    this.onLegendConfig.emit(event);
  }

  handleAddMeasure(newMeasure) {
    const data = {
      newMeasure,
      widget: this.widget
    };
    this.onAddMeasure.emit(data);
  }

  handleSetTimeRange() {
    this.onSetTimeRange.emit(this.widget);
  }

  handleSetRealTimeMode() {
    this.onSetRealTimeMode.emit(this.widget.id);
  }

  handleToggleExportMenu(event) {
    this.exportMenu = event;
  }

  handleToggleGaugeMode(event) {
    this.isDisplayMode = event;
  }

  handleUpdateColumnWidth(event) {
    this.onColumnResize.emit(event);
  }

  handleChangeShowLegend(event) {
    this.onChangeShowLegend.emit(event);
  }

  handleChangePauseLineChart(event) {
    this.onChangePauseLineChart.emit(event);
  }

  getHeaderStyle() {
    const isHeaderFont = this.colorPalette && this.colorPalette.headerFont;
    const font: any = {
      fontSize: isHeaderFont && this.colorPalette.headerFont.fontSize ? `${this.colorPalette.headerFont.fontSize}px` : '14px',
      fontFamily: isHeaderFont && this.colorPalette.headerFont.fontFamily ? this.colorPalette.headerFont.fontFamily : 'Poppins',
      lineHeight: '20px'
    };
    if (this.isOverlayWidget()) {
      return {
        ...font,
        'background': 'rgba(0, 0, 0, 0.57)'
      };
    }
    return font;
  }

  isOverlayEmpty(): boolean {
    return this.isEmptyData() && this.widget.type !== WidgetType.EventViewer;
  }

  getOverlayStyle() {
    let style = {};
    if (this.isOverlayWidget()) {
      return {
        'background': 'rgba(0, 0, 0, 0.57)'
      };
    }

    if (this.widget.type === WidgetType.SolidGauge && !this.isEmptyData()) {
      style = {
        top: '40px',
        height: 'calc(100% - 40px)'
      };
    }
    if (this._themeService.getCurrentTheme() === Theme.Dark) {
      style = {
        ...style,
        color: '#d7d7d7',
        opacity: 1
      };
    }
    if (Object.keys(style).length > 0) {
      return style;
    }
  }

  isOverlayWidget () {
    return this.editingWidget && (this.editingWidget.id !== this.widget.id);
  }

  isDisableRealTime() {
    if (this.widget.type === WidgetType.Bar && this.widget as BarWidget) {
      if ((this.widget as BarWidget).mode.value === WidgetMode.TimeRange) {
        return true;
      }
    }
    return false;
  }

  isEmptyData(): boolean {
    if (isNullOrUndefined(this.data)) {
      return true;
    } else if (Array.isArray(this.data)) {
      if (this.widget.type === WidgetType.GeoMap) {
        return this.data.length <= 1;
      }
      return this.data.length <= 0;
    } else {
      let emptyData = isNullOrUndefined(this.data.data) || this.data.data.length <= 0;
      if (emptyData && this.data.current) {
        emptyData = isNullOrUndefined(this.data.current.value);
      }
      return emptyData;
    }
  }

  handleUpdateMeasure(newMeasure: string) {
    const event = {
      widget: this.widget,
      newMeasure
    };
    this.onUpdateMeasure.emit(event);
  }

  checkMenuStyle(menu) {
    const menuWidth = 192;

    if (menu.left) {
      return (menu.left + menuWidth * 2 > this.widgetPosition.right) ? { left: '-192px'} : {left: '192px'};
    }
  }

  checkSelectedMeasure(item) {
    if (this.widget.measures.find((measure) => measure === item.name)) {
      return {
        pointerEvents: 'none',
        background: '#ddd',
        color: 'graytext'
      };
    }
  }

  getRealTimeMode() {
    return getDefaultValue(this.isRealTime, this.widget.id);
  }

  handleClickShiftTrendDiff() {
    this.onClickShiftTrendDiff.emit();
  }

  handleClickDayTrendDiff() {
    this.onClickDayTrendDiff.emit();
  }

  handleClickWeekTrendDiff() {
    this.onClickWeekTrendDiff.emit();
  }

  isSubTitle() {
    return this.widget.type !== WidgetType.LabelWidget || this.widget.subtitle;
  }

  private buildContextMenuEventFromHtmlEvent(evt: MouseEvent) {
    const menuItems = (Object.keys(this._uiSettings.contextMenu).filter(
      key => this._uiSettings.contextMenu[key]
    ));
    const menuHeight = menuItems.length * 32 + 16;
    const menuWidth = 192;

    this.contextMenuEvent = {
      type: evt.type,
      target: evt.target as HTMLElement,
      clientX: evt.clientX,
      clientY: evt.clientY
    };
    if (this.widgetPosition) {
      if (evt.clientX + menuWidth > this.widgetPosition.right) {
        this.contextMenuEvent.clientX = evt.clientX - menuWidth;
      }
      if (evt.clientY + menuHeight > this.widgetPosition.bottom) {
        this.contextMenuEvent.clientY = evt.clientY - menuHeight;
      }
    }
  }

  private getDraggableData(event: DropEvent) {
    return $(event.target).data('app-droppable-data');
  }
}
