import {ElementRef, ViewContainerRef} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {
  ChangeChartTypeEvent,
  Dimension,
  DisplayModeEvent,
  MoveColumnEvent,
  WidgetMouseEvent,
  ZoomEvent
} from '../../../charts/models';
import {Paging, Widget} from '../../../widgets/models';
import {Draggable, ExportType} from '../../models/enums';
import * as fromDashboards from '../../reducers';
import {ChartBehavior, ChartBehaviorImpl, NotUseChart} from './chart-behaviors';
import {CopyBehavior, CopyBehaviorImpl, DoNotCopy} from './copy-behaviors';
import {
  CreateBillboard,
  CreateTable,
  CreateTimeLine,
  CreationOnPlotBehavior,
  DoNotCreateOnPlot
} from './creation-on-plot-behaviors';
import {DisplayModeBehaviors, DoNotHaveDisplayMode, GaugeDisplayMode} from './display-mode-behaviors';
import {CommonDndBehavior, DndBehavior, NoDnd, TableDndBehavior} from './dnd-behaviors';
import {
  DeleteMetricBehavior,
  DeleteTableMetricBehavior,
  DoNotEditOnPlot,
  DropOnBar,
  DropOnBillboard,
  DropOnCallTimeline,
  DropOnGeoMap,
  DropOnLine,
  DropOnSolidGauge,
  DropOnSunburst,
  DropOnTable,
  DropOnTrendDiff,
  EditOnPlotBehavior,
  DropOnLiquidFillGauge,
  DropOnSankey
} from './edit-on-plot-behaviors';
import {AgGridExport, DoNotExport, ExportBehavior, MatTableExport} from './export-behaviors';
import {GenerateNothing, GeneratorBehavior, GoBackGenerator, TimeRangeGenerator} from './generator-behaviors';
import {CanNotMoveColumn, MoveColumnBehavior, OrderColumn, OrderColumnNewTable} from './move-column-behaviors';
import {DoNotPaging, DoPaging, PagingBehavior} from './paging-behaviors';
import {
  DoNotPlot,
  PlotBehavior,
  PlotOnBar, PlotOnBubble,
  PlotOnCallTimeLine,
  PlotOnGeoMap,
  PlotOnLine,
  PlotOnSankey,
  PlotOnSingleInstanceMeasureWidget,
  PlotOnSunburst,
  PlotOnTabular,
} from './plot-behaviors';
import {CanNotRename, CanRename, RenameBehavior} from './rename-behaviors';
import {DoNotResize, ResizeBehavior, ResizeBehaviorImpl} from './resize-behaviors';
import {DoNotResponsive, ResponsiveBehavior, ResponsiveBehaviorImpl} from './responsive-behaviors';
import {TemplateBehaviorImpl} from './template-behaviors';
import {
  BarUIBehavior,
  BillboardUIBehavior,
  CallTimeLineUIBehavior,
  DoNotHaveUI,
  GeoMapUIBehavior,
  LineUIBehavior,
  PlaceholderUISettings,
  SankeyUIBehavior,
  SolidGaugeUIBehavior,
  SunburstUIBehavior,
  TabularUIBehavior,
  TrendDiffUIBehavior,
  UIBehavior,
  LiquidFillGaugeUIBehavior, LabelBehavior, BubbleUIBehavior,
  EventViewerBehavior
} from './ui-behaviors';
import {DefaultUrlBehavior, DoNotHaveUrl, UrlBehavior} from './url-behaviors';
import {CanNotZoom, ZoomBehavior, ZoomOnCallTimeLine, ZoomOnLine} from './zoom-behaviors';
import {
  BarMeasureBehavior, CommonMeasureBehavior, DefaultMeasureBehavior, MeasureBehaviors,
  TableMeasureBehavior
} from './measure-behaviors';
import * as editOnPlotActions from '../../actions/edit-on-plot.actions';
import * as placeholdersActions from '../../actions/placeholders.actions';
import {CanNotUpdateSubTitle, CanUpdateSubTitle, UpdateSubTitleBehavior} from './update-sub-title-behaviors';

export abstract class LauncherItem {
  private _store: Store<any>;
  private _placeholderId: string;
  private _widget: Widget;

  generatorBehavior: GeneratorBehavior = new GenerateNothing();
  uiBehavior: UIBehavior = new DoNotHaveUI();
  exportBehavior: ExportBehavior = new DoNotExport();
  copyBehavior: CopyBehavior = new DoNotCopy();
  resizeBehavior: ResizeBehavior = new DoNotResize();
  zoomBehavior: ZoomBehavior = new CanNotZoom();
  renameBehavior: RenameBehavior = new CanNotRename();
  plotBehavior: PlotBehavior = new DoNotPlot();
  dropMetricBehavior: EditOnPlotBehavior = new DoNotEditOnPlot();
  dndBehavior: DndBehavior = new NoDnd();
  deleteMetricBehavior: EditOnPlotBehavior = new DoNotEditOnPlot();
  createBillboardBehavior: CreationOnPlotBehavior = new DoNotCreateOnPlot();
  createLiquidFillGaugeBehavior: CreationOnPlotBehavior = new DoNotCreateOnPlot();
  createTimeLineBehavior: CreationOnPlotBehavior = new DoNotCreateOnPlot();
  createTableBehavior: CreationOnPlotBehavior = new DoNotCreateOnPlot();
  moveColumnBehavior: MoveColumnBehavior = new CanNotMoveColumn();
  pagingBehavior: PagingBehavior = new DoNotPaging();
  displayModeBehavior: DisplayModeBehaviors = new DoNotHaveDisplayMode();
  chartBehavior: ChartBehavior = new NotUseChart();
  responsiveBehavior: ResponsiveBehavior = new DoNotResponsive();
  urlBehavior: UrlBehavior = new DoNotHaveUrl();
  measureBehavior: MeasureBehaviors = new DefaultMeasureBehavior();
  updateSubTitleBehavior: UpdateSubTitleBehavior = new CanNotUpdateSubTitle();

  constructor(store: Store<fromDashboards.State>, placeholderId: string, widget: Widget) {
    this._store = store;
    this._placeholderId = placeholderId;
    this._widget = widget;

    if (this._widget.isTemplate) {
      const templateBehavior = new TemplateBehaviorImpl(store, placeholderId);
      templateBehavior.createWidgetFromTemplate();
    }
  }

  get store(): Store<fromDashboards.State> {
    return this._store;
  }

  get widget(): Widget {
    return this._widget;
  }

  configureUI(): Observable<PlaceholderUISettings> {
    return this.uiBehavior.configure();
  }

  createTimeLine(): void {
    this.createTimeLineBehavior.create();
  }

  createTable(): void {
    this.createTableBehavior.create();
  }

  createBillboard(): void {
    this.createBillboardBehavior.create();
  }

  createLiquidFillGauge(): void {
    this.createLiquidFillGaugeBehavior.create();
  }

  deleteMetric(metric: string): void {
    this.deleteMetricBehavior.edit(metric);
  }

  dropMetric(draggable: Draggable): void {
    this.dropMetricBehavior.edit(draggable);
  }

  dragOnPoint(event: WidgetMouseEvent, viewContainerRef: ViewContainerRef): void {
    this.dndBehavior.dragOnPoint(event, viewContainerRef);
  }

  dragOnHeader(event: WidgetMouseEvent, viewContainerRef: ViewContainerRef): void {
    this.dndBehavior.dragOnHeader(event, viewContainerRef);
  }

  generateData(): void {
    this.generatorBehavior.generate();
  }

  plot(event: WidgetMouseEvent) {
    this.plotBehavior.plot(event);
  }

  exportData(type: ExportType, data: any, api) {
    this.exportBehavior.exportData(type, data, api);
  }

  copyEmbeddedWidget() {
    this.copyBehavior.copyEmbeddedWidget();
  }

  minimize() {
    this.resizeBehavior.minimize();
  }

  maximize() {
    this.resizeBehavior.maximize();
  }

  focus() {
    this.uiBehavior.focus();
  }

  blur() {
    this.uiBehavior.blur();
  }

  zoom(event: ZoomEvent) {
    this.zoomBehavior.zoom(event);
  }

  rename(name: string) {
    this.renameBehavior.rename(name);
  }

  moveColumn(event: MoveColumnEvent) {
    this.moveColumnBehavior.move(event);
  }

  page(paging: Paging) {
    this.pagingBehavior.page(paging);
  }

  switchDisplayMode(event: DisplayModeEvent) {
    this.displayModeBehavior.switchDisplayMode(event);
  }

  changeChartType(event: ChangeChartTypeEvent) {
    this.chartBehavior.changeChartType(event);
  }

  getChartSize(el: ElementRef): Observable<Dimension> {
    return this.responsiveBehavior.getChartSize(el);
  }

  invokeUrl() {
    this.urlBehavior.invoke();
  }

  autoInvokeUrl(event: any) {
    this.urlBehavior.autoInvoke(event);
  }

  updateMeasure(event: any) {
    this.measureBehavior.update(event);
  }

  addMeasure(event) {
    this.measureBehavior.add(event);
  }

  setTimeRange(event: Widget) {
    this._store.dispatch(new editOnPlotActions.ChangeTimeRange(event));
  }

  setRealTimeMode(widgetId: string) {
    this._store.dispatch(new placeholdersActions.SetRealTimeMode(widgetId));
  }

  updateSubTitle(subTitle: string) {
    this.updateSubTitleBehavior.updateSubTitle(subTitle);
  }
}

export class DummyItem extends LauncherItem {
  constructor(store: Store<fromDashboards.State>, placeholderId: string, widget: Widget) {
    super(store, placeholderId, widget);
  }
}

export class LineItem extends LauncherItem {
  constructor(store: Store<fromDashboards.State>, placeholderId: string, widget: Widget) {
    super(store, placeholderId, widget);
    this.generatorBehavior = new GoBackGenerator(this.store, this.widget);
    this.uiBehavior = new LineUIBehavior(store, placeholderId, widget);
    this.copyBehavior = new CopyBehaviorImpl(placeholderId);
    this.resizeBehavior = new ResizeBehaviorImpl(store, placeholderId);
    this.zoomBehavior = new ZoomOnLine(store);
    this.renameBehavior = new CanRename(store, widget);
    this.plotBehavior = new PlotOnLine(store, widget);
    this.dndBehavior = new CommonDndBehavior(store);
    this.dropMetricBehavior = new DropOnLine(store, widget);
    this.deleteMetricBehavior = new DeleteMetricBehavior(store, widget);
    this.chartBehavior = new ChartBehaviorImpl(store, placeholderId, widget);
    this.responsiveBehavior = new ResponsiveBehaviorImpl(store, placeholderId);
    this.urlBehavior = new DefaultUrlBehavior(store, widget);
    this.measureBehavior = new CommonMeasureBehavior(store, widget);
    this.updateSubTitleBehavior = new CanUpdateSubTitle(store, widget);
  }
}

export class BarItem extends LauncherItem {
  constructor(store: Store<fromDashboards.State>, placeholderId: string, widget: Widget) {
    super(store, placeholderId, widget);
    this.createTimeLineBehavior = new CreateTimeLine(store, {updateMeasureRelationship: true});
    this.createBillboardBehavior = new CreateBillboard(store);
    this.createTableBehavior = new CreateTable(store);
    this.generatorBehavior = new TimeRangeGenerator(this.store, this.widget);
    this.uiBehavior = new BarUIBehavior(store, placeholderId, widget);
    this.copyBehavior = new CopyBehaviorImpl(placeholderId);
    this.resizeBehavior = new ResizeBehaviorImpl(store, placeholderId);
    this.renameBehavior = new CanRename(store, widget);
    this.plotBehavior = new PlotOnBar(store, widget);
    this.dndBehavior = new CommonDndBehavior(store);
    this.dropMetricBehavior = new DropOnBar(store, widget);
    this.deleteMetricBehavior = new DeleteMetricBehavior(store, widget);
    this.responsiveBehavior = new ResponsiveBehaviorImpl(store, placeholderId);
    this.urlBehavior = new DefaultUrlBehavior(store, widget);
    this.measureBehavior = new BarMeasureBehavior(store, widget);
    this.updateSubTitleBehavior = new CanUpdateSubTitle(store, widget);
  }
}

export class TabularItem extends LauncherItem {
  constructor(store: Store<fromDashboards.State>, placeholderId: string, widget: Widget) {
    super(store, placeholderId, widget);
    this.createTimeLineBehavior = new CreateTimeLine(store, {updateMeasureRelationship: true});
    this.createBillboardBehavior = new CreateBillboard(store);
    this.generatorBehavior = new TimeRangeGenerator(this.store, this.widget);
    this.uiBehavior = new TabularUIBehavior(store, placeholderId, widget);
    this.exportBehavior = new MatTableExport(this.widget);
    this.copyBehavior = new CopyBehaviorImpl(placeholderId);
    this.resizeBehavior = new ResizeBehaviorImpl(store, placeholderId);
    this.renameBehavior = new CanRename(store, widget);
    this.plotBehavior = new PlotOnTabular(store, widget);
    this.dndBehavior = new CommonDndBehavior(store);
    this.dropMetricBehavior = new DropOnTable(store, widget);
    this.deleteMetricBehavior = new DeleteTableMetricBehavior(store, widget);
    this.moveColumnBehavior = new OrderColumn(store, widget);
    this.pagingBehavior = new DoPaging(store, widget);
    this.responsiveBehavior = new ResponsiveBehaviorImpl(store, placeholderId);
    this.measureBehavior = new TableMeasureBehavior(store, widget);
    this.updateSubTitleBehavior = new CanUpdateSubTitle(store, widget);
  }
}

export class TableItem extends LauncherItem {
  constructor(store: Store<fromDashboards.State>, placeholderId: string, widget: Widget) {
    super(store, placeholderId, widget);
    this.createTimeLineBehavior = new CreateTimeLine(store, {updateMeasureRelationship: true});
    this.createBillboardBehavior = new CreateBillboard(store);
    this.generatorBehavior = new TimeRangeGenerator(this.store, this.widget);
    this.uiBehavior = new TabularUIBehavior(store, placeholderId, widget);
    this.exportBehavior = new AgGridExport(this.widget);
    this.copyBehavior = new CopyBehaviorImpl(placeholderId);
    this.resizeBehavior = new ResizeBehaviorImpl(store, placeholderId);
    this.renameBehavior = new CanRename(store, widget);
    this.plotBehavior = new PlotOnTabular(store, widget);
    this.dndBehavior = new TableDndBehavior(store);
    this.dropMetricBehavior = new DropOnTable(store, widget);
    this.deleteMetricBehavior = new DeleteTableMetricBehavior(store, widget);
    this.moveColumnBehavior = new OrderColumnNewTable(store, widget);
    this.pagingBehavior = new DoPaging(store, widget);
    this.responsiveBehavior = new ResponsiveBehaviorImpl(store, placeholderId);
    this.urlBehavior = new DefaultUrlBehavior(store, widget);
    this.measureBehavior = new TableMeasureBehavior(store, widget);
    this.updateSubTitleBehavior = new CanUpdateSubTitle(store, widget);
  }
}

export class TrendDiffItem extends LauncherItem {
  constructor(store: Store<fromDashboards.State>, placeholderId: string, widget: Widget) {
    super(store, placeholderId, widget);
    this.generatorBehavior = new TimeRangeGenerator(this.store, this.widget);
    this.uiBehavior = new TrendDiffUIBehavior(store, placeholderId, widget);
    this.copyBehavior = new CopyBehaviorImpl(placeholderId);
    this.resizeBehavior = new ResizeBehaviorImpl(store, placeholderId);
    this.renameBehavior = new CanRename(store, widget);
    this.plotBehavior = new PlotOnSingleInstanceMeasureWidget(store, widget);
    this.dndBehavior = new CommonDndBehavior(store);
    this.dropMetricBehavior = new DropOnTrendDiff(store, widget);
    this.chartBehavior = new ChartBehaviorImpl(store, placeholderId, widget);
    this.responsiveBehavior = new ResponsiveBehaviorImpl(store, placeholderId);
    this.urlBehavior = new DefaultUrlBehavior(store, widget);
    this.measureBehavior = new CommonMeasureBehavior(store, widget);
    this.updateSubTitleBehavior = new CanUpdateSubTitle(store, widget);
  }
}

export class BillboardItem extends LauncherItem {
  constructor(store: Store<fromDashboards.State>, placeholderId: string, widget: Widget) {
    super(store, placeholderId, widget);
    this.generatorBehavior = new TimeRangeGenerator(this.store, this.widget);
    this.uiBehavior = new BillboardUIBehavior(store, placeholderId, widget);
    this.copyBehavior = new CopyBehaviorImpl(placeholderId);
    this.resizeBehavior = new ResizeBehaviorImpl(store, placeholderId);
    this.renameBehavior = new CanRename(store, widget);
    this.plotBehavior = new PlotOnSingleInstanceMeasureWidget(store, widget);
    this.dndBehavior = new CommonDndBehavior(store);
    this.dropMetricBehavior = new DropOnBillboard(store, widget);
    this.responsiveBehavior = new ResponsiveBehaviorImpl(store, placeholderId);
    this.urlBehavior = new DefaultUrlBehavior(store, widget);
    this.measureBehavior = new CommonMeasureBehavior(store, widget);
    this.updateSubTitleBehavior = new CanUpdateSubTitle(store, widget);
  }
}

export class LiquidFillGaugeItem extends LauncherItem {
  constructor(store: Store<fromDashboards.State>, placeholderId: string, widget: Widget) {
    super(store, placeholderId, widget);
    this.generatorBehavior = new TimeRangeGenerator(this.store, this.widget);
    this.uiBehavior = new LiquidFillGaugeUIBehavior(store, placeholderId, widget);
    this.copyBehavior = new CopyBehaviorImpl(placeholderId);
    this.resizeBehavior = new ResizeBehaviorImpl(store, placeholderId);
    this.renameBehavior = new CanRename(store, widget);
    this.plotBehavior = new PlotOnSingleInstanceMeasureWidget(store, widget);
    this.dndBehavior = new CommonDndBehavior(store);
    this.dropMetricBehavior = new DropOnLiquidFillGauge(store, widget);
    this.responsiveBehavior = new ResponsiveBehaviorImpl(store, placeholderId);
    this.urlBehavior = new DefaultUrlBehavior(store, widget);
    this.measureBehavior = new CommonMeasureBehavior(store, widget);
    this.updateSubTitleBehavior = new CanUpdateSubTitle(store, widget);
  }
}

export class SankeyItem extends LauncherItem {
  constructor(store: Store<fromDashboards.State>, placeholderId: string, widget: Widget) {
    super(store, placeholderId, widget);
    this.generatorBehavior = new TimeRangeGenerator(this.store, this.widget);
    this.uiBehavior = new SankeyUIBehavior(store, placeholderId, widget);
    this.copyBehavior = new CopyBehaviorImpl(placeholderId);
    this.resizeBehavior = new ResizeBehaviorImpl(store, placeholderId);
    this.renameBehavior = new CanRename(store, widget);
    this.dndBehavior = new CommonDndBehavior(store);
    this.plotBehavior = new PlotOnSankey(store, widget);
    this.responsiveBehavior = new ResponsiveBehaviorImpl(store, placeholderId);
    this.urlBehavior = new DefaultUrlBehavior(store, widget);
    this.measureBehavior = new CommonMeasureBehavior(store, widget);
    this.updateSubTitleBehavior = new CanUpdateSubTitle(store, widget);
    this.dropMetricBehavior = new DropOnSankey(store, widget);
  }
}

export class SolidGaugeItem extends LauncherItem {
  constructor(store: Store<fromDashboards.State>, placeholderId: string, widget: Widget) {
    super(store, placeholderId, widget);
    this.generatorBehavior = new TimeRangeGenerator(this.store, this.widget);
    this.uiBehavior = new SolidGaugeUIBehavior(store, placeholderId, widget);
    this.copyBehavior = new CopyBehaviorImpl(placeholderId);
    this.resizeBehavior = new ResizeBehaviorImpl(store, placeholderId);
    this.renameBehavior = new CanRename(store, widget);
    this.plotBehavior = new PlotOnSingleInstanceMeasureWidget(store, widget);
    this.dndBehavior = new CommonDndBehavior(store);
    this.dropMetricBehavior = new DropOnSolidGauge(store, widget);
    this.displayModeBehavior = new GaugeDisplayMode(store, placeholderId, widget);
    this.responsiveBehavior = new ResponsiveBehaviorImpl(store, placeholderId);
    this.urlBehavior = new DefaultUrlBehavior(store, widget);
    this.measureBehavior = new CommonMeasureBehavior(store, widget);
    this.updateSubTitleBehavior = new CanUpdateSubTitle(store, widget);
  }
}

export class SunburstItem extends LauncherItem {
  constructor(store: Store<fromDashboards.State>, placeholderId: string, widget: Widget) {
    super(store, placeholderId, widget);
    this.generatorBehavior = new TimeRangeGenerator(this.store, this.widget);
    this.uiBehavior = new SunburstUIBehavior(store, placeholderId, widget);
    this.copyBehavior = new CopyBehaviorImpl(placeholderId);
    this.resizeBehavior = new ResizeBehaviorImpl(store, placeholderId);
    this.renameBehavior = new CanRename(store, widget);
    this.plotBehavior = new PlotOnSunburst(store, widget);
    this.dndBehavior = new CommonDndBehavior(store);
    this.dropMetricBehavior = new DropOnSunburst(store, widget);
    this.deleteMetricBehavior = new DeleteMetricBehavior(store, widget);
    this.displayModeBehavior = new GaugeDisplayMode(store, placeholderId, widget);
    this.responsiveBehavior = new ResponsiveBehaviorImpl(store, placeholderId);
    this.urlBehavior = new DefaultUrlBehavior(store, widget);
    this.measureBehavior = new CommonMeasureBehavior(store, widget);
    this.updateSubTitleBehavior = new CanUpdateSubTitle(store, widget);
  }
}

export class GeoMapItem extends LauncherItem {
  constructor(store: Store<fromDashboards.State>, placeholderId: string, widget: Widget) {
    super(store, placeholderId, widget);
    this.generatorBehavior = new TimeRangeGenerator(this.store, this.widget);
    this.uiBehavior = new GeoMapUIBehavior(store, placeholderId, widget);
    this.copyBehavior = new CopyBehaviorImpl(placeholderId);
    this.resizeBehavior = new ResizeBehaviorImpl(store, placeholderId);
    this.renameBehavior = new CanRename(store, widget);
    this.plotBehavior = new PlotOnGeoMap(store, widget);
    this.dndBehavior = new CommonDndBehavior(store);
    this.dropMetricBehavior = new DropOnGeoMap(store, widget);
    this.deleteMetricBehavior = new DeleteMetricBehavior(store, widget);
    this.displayModeBehavior = new GaugeDisplayMode(store, placeholderId, widget);
    this.responsiveBehavior = new ResponsiveBehaviorImpl(store, placeholderId);
    this.urlBehavior = new DefaultUrlBehavior(store, widget);
    this.measureBehavior = new CommonMeasureBehavior(store, widget);
    this.updateSubTitleBehavior = new CanUpdateSubTitle(store, widget);
  }
}

export class CallTimeLineItem extends LauncherItem {
  constructor(store: Store<fromDashboards.State>, placeholderId: string, widget: Widget) {
    super(store, placeholderId, widget);
    this.generatorBehavior = new TimeRangeGenerator(this.store, this.widget);
    this.uiBehavior = new CallTimeLineUIBehavior(store, placeholderId, widget);
    this.copyBehavior = new CopyBehaviorImpl(placeholderId);
    this.resizeBehavior = new ResizeBehaviorImpl(store, placeholderId);
    this.renameBehavior = new CanRename(store, widget);
    this.responsiveBehavior = new ResponsiveBehaviorImpl(store, placeholderId);
    this.plotBehavior = new PlotOnCallTimeLine(store, widget);
    this.zoomBehavior = new ZoomOnCallTimeLine(store);
    this.dndBehavior = new CommonDndBehavior(store);
    this.dropMetricBehavior = new DropOnCallTimeline(store, widget);
    this.deleteMetricBehavior = new DeleteMetricBehavior(store, widget);
    this.urlBehavior = new DefaultUrlBehavior(store, widget);
    this.measureBehavior = new CommonMeasureBehavior(store, widget);
    this.updateSubTitleBehavior = new CanUpdateSubTitle(store, widget);
  }
}

export class LabelItem extends LauncherItem {
  constructor(store: Store<fromDashboards.State>, placeholderId: string, widget: Widget) {
    super(store, placeholderId, widget);
    this.uiBehavior = new LabelBehavior(store, placeholderId, widget);
    this.resizeBehavior = new ResizeBehaviorImpl(store, placeholderId);
    this.updateSubTitleBehavior = new CanUpdateSubTitle(store, widget);
    this.renameBehavior = new CanRename(store, widget);
  }
}

export class BubbleItem extends LauncherItem {
  constructor(store: Store<fromDashboards.State>, placeholderId: string, widget: Widget) {
    super(store, placeholderId, widget);
    this.generatorBehavior = new TimeRangeGenerator(this.store, this.widget);
    this.uiBehavior = new BubbleUIBehavior(store, placeholderId, widget);
    this.copyBehavior = new CopyBehaviorImpl(placeholderId);
    this.resizeBehavior = new ResizeBehaviorImpl(store, placeholderId);
    this.renameBehavior = new CanRename(store, widget);
    this.dndBehavior = new CommonDndBehavior(store);
    this.plotBehavior = new PlotOnBubble(store, widget);
    this.responsiveBehavior = new ResponsiveBehaviorImpl(store, placeholderId);
    this.measureBehavior = new CommonMeasureBehavior(store, widget);
    this.updateSubTitleBehavior = new CanUpdateSubTitle(store, widget);
  }
}

export class EventViewerItem extends LauncherItem {
  constructor(store: Store<fromDashboards.State>, placeholderId: string, widget: Widget) {
    super(store, placeholderId, widget);
    this.uiBehavior = new EventViewerBehavior(store, placeholderId, widget);
    this.resizeBehavior = new ResizeBehaviorImpl(store, placeholderId);
    this.updateSubTitleBehavior = new CanUpdateSubTitle(store, widget);
    this.renameBehavior = new CanRename(store, widget);
  }
}
