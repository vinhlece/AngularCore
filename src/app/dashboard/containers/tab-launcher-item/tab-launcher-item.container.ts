import {
  Component, ElementRef, HostListener, Input, OnDestroy, OnInit,
  ViewContainerRef
} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Observable, of, Subject} from 'rxjs';
import {filter, map, tap} from 'rxjs/operators';
import {isNullOrUndefined} from 'util';
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
import {ChartWidget, Paging, SolidGaugeWidget, Widget} from '../../../widgets/models';
import * as tabEditorActions from '../../actions/tab-editor.actions';
import {ExportEvent, Placeholder, PredictiveSetting, TimeRangeInterval, WidgetPosition} from '../../models';
import {DisplayMode, Draggable} from '../../models/enums';
import * as fromDashboards from '../../reducers';
import {LauncherItemFactory} from './createItem';
import {LauncherItem} from './items';
import {PlaceholderUISettings} from './ui-behaviors';
import {ColorPalette, InstanceColor} from '../../../common/models/index';
import * as fromUser from '../../../user/reducers';
import * as widgetsActions from '../../../widgets/actions/widgets.actions';
import * as editWidgetActions from '../../../widgets/actions/editing-widget.actions';
import {Measure} from '../../../measures/models/index';
import * as fromMeasures from '../../../measures/reducers/index';
import {distinctUntilChanged, takeUntil} from 'rxjs/internal/operators';
import {WidgetType} from '../../../widgets/constants/widget-types';
import {MeasureFormat} from '../../../widgets/models/enums';
import * as creationOnPlotActions from '../../actions/creation-on-plot.actions';
import * as fromWidget from '../../../widgets/reducers/index';
import * as placeholdersActions from '../../actions/placeholders.actions';

@Component({
  selector: 'app-tab-launcher-item-container',
  templateUrl: './tab-launcher-item.container.html',
  styleUrls: ['./tab-launcher-item.container.scss'],
  providers: [LauncherItemFactory]
})
export class TabLauncherItemContainer implements OnInit, OnDestroy {
  private _store: Store<fromDashboards.State>;
  private _launcherItem: LauncherItem;
  private _launcherItemFactory: LauncherItemFactory;
  private _styles: REPStyles;
  private _api: any;
  private _viewContainerRef;
  private _previousWidget: Widget = null;
  private _unsubscribe = new Subject<void>();

  widget$: Observable<Widget>;
  showLegend$: Observable<boolean>;
  pauseLineChart$: Observable<boolean>;
  placeholder$: Observable<Placeholder>;
  data$: Observable<any>;
  zoom$: Observable<ZoomEvent>;
  displayMode$: Observable<DisplayMode>;
  chartType$: Observable<string>;
  uiSettings$: Observable<PlaceholderUISettings>;
  interval$: Observable<TimeRangeInterval>;
  predictiveSetting$: Observable<TimeRangeInterval>;
  currentTimestamp$: Observable<number>;
  chartSize$: Observable<Dimension>;
  preview$: Observable<boolean>;
  callTimeLineZoom$: Observable<ZoomEvent>;
  colorPalette$: Observable<ColorPalette>;
  widgetPosition$: Observable<WidgetPosition>;
  globalFilters$: Observable<string[]>;
  realTimeMode$: Observable<any>;
  measures$: Observable<Measure[]> = null;
  instanceColors$: Observable<InstanceColor[]>;
  editingWidget$: Observable<Widget>;
  el: ElementRef;

  @Input() placeholderId: string;
  @Input() avatar: string;
  @Input() isMaximized: boolean;

  @Input()
  get styles(): REPStyles {
    return this._styles;
  }


  set styles(value: REPStyles) {
    const defaultStyles: REPStyles = {
      backgroundColor: '#ffffff',
      color: '#333',
      font: 'Poppins'
    };
    this._styles = value ? value : defaultStyles;
  }

  constructor(el: ElementRef,
              viewContainerRef: ViewContainerRef,
              store: Store<fromDashboards.State>,
              launcherItemFactory: LauncherItemFactory) {
    this.el = el;
    this._viewContainerRef = viewContainerRef;
    this._store = store;
    this._launcherItemFactory = launcherItemFactory;
    this.styles = this.styles;
  }

  @HostListener('mouseenter', ['$event']) onMouseEnter(event) {
    this.focus();
    const rect = event.target.getBoundingClientRect();
    this.widgetPosition$ = of({
      right: rect.right,
      bottom: rect.bottom
    });
  }

  @HostListener('mouseleave', ['$event']) onMouseLeave(event) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    const {left, top, width, height} = event.target.getBoundingClientRect();

    // mouseleave event is triggered when click menu button, so we need to check this case by checking click position in container or not
    if ((mouseX >= left && mouseX <= left + width) && (mouseY >= top && mouseY <= top + height)) {
      return;
    }

    this.blur();
  }

  ngOnInit() {
    this.widget$ = this.getWidgetObservable().pipe(
      takeUntil(this._unsubscribe),
      filter((widget: Widget) => !isNullOrUndefined(widget)),
      distinctUntilChanged());
      // Fix bug can not subscription widget change when adding instances for dimensions
      // distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)));
    this.widget$.subscribe((widget: Widget) => {
        if (!widget.type) {
          return;
        }
        this.createLauncherItem(widget);
        this.generateData();
        this.configureUI();
        this.configureResponsive();
        this.loadMeasures(widget.dataType);
        if (this._previousWidget && this._previousWidget.type === WidgetType.SolidGauge) {
          const newDisplayMode = (widget as SolidGaugeWidget).displayMode;
          const oldDisplayMode = (this._previousWidget as SolidGaugeWidget).displayMode;
          if (newDisplayMode !== oldDisplayMode) {
            this.handleSwitchDisplayMode({
              currentMode: oldDisplayMode,
              newMode: newDisplayMode
            });
          }
        } else if (this._previousWidget &&
          (this._previousWidget.type === WidgetType.Line || this._previousWidget.type === WidgetType.TrendDiff)) {
          const newDisplayMode = (widget as ChartWidget).chartType;
          const oldDisplayMode = (this._previousWidget as ChartWidget).chartType;
          if (newDisplayMode !== oldDisplayMode) {
            this.handleChangeChartType({
              currentChartType: oldDisplayMode,
              newChartType: newDisplayMode
            });
          }
        }

        // Trigger show legend when changing legend on preferences
        if (!widget.hideLegend && this._previousWidget) {
          this.handleChangeShowLegend(true);
        }
        this._previousWidget = widget;
      });
    this.placeholder$ = this._store.pipe(select(fromDashboards.getPlaceholderById(this.placeholderId)));
    this.data$ = this._store.pipe(select(fromDashboards.getWidgetData(this.placeholderId)));
    this.zoom$ = this._store.pipe(select(fromDashboards.getZoom));
    this.displayMode$ = this._store.pipe(select(fromDashboards.getPlaceholderDisplayMode(this.placeholderId)));
    this.chartType$ = this._store.pipe(select(fromDashboards.getPlaceholderChartType(this.placeholderId)));
    this.interval$ = this._store.pipe(select(fromDashboards.getTimeRangeInterval));
    this.predictiveSetting$ = this._store.pipe(select(fromDashboards.getPredictiveSetting));
    this.currentTimestamp$ = this._store.pipe(select(fromDashboards.getCurrentTimestamp));
    this.preview$ = this.getWidgetObservable().pipe(map((widget: Widget) => isNullOrUndefined(widget)));
    this.callTimeLineZoom$ = this._store.pipe(select(fromDashboards.getCallTimeLineZoom));
    this.colorPalette$ = this._store.pipe(select(fromUser.getCurrentColorPalette));
    this.globalFilters$ = this._store.pipe(select(fromDashboards.getGlobalFilters));
    this.realTimeMode$ = this._store.pipe(select(fromDashboards.getRealTimeMode));
    this.instanceColors$ = this._store.pipe(select(fromDashboards.getInstanceColors));
    this.showLegend$ = this._store.pipe(select(fromDashboards.getShowLegend(this.placeholderId)));
    this.pauseLineChart$ = this._store.pipe(select(fromDashboards.getStartPauseLineChart(this.placeholderId)));
    this.editingWidget$ = this._store.pipe(select(fromWidget.getEditingWidget));
  }

  ngOnDestroy() {
    this._unsubscribe.next();
    this._unsubscribe.unsubscribe();
  }

  isValidWidget(): boolean {
    return this.avatar && !this.avatar.endsWith(`${WidgetType.LabelWidget.toString().toLowerCase()}.svg`);
  }

  handleChartReady(event: ChartReadyEvent) {
    this._api = event.api;
  }

  handleShowTimeLine() {
    this._launcherItem.createTimeLine();
  }

  handleShowTable() {
    this._launcherItem.createTable();
  }

  handleShowBillboard() {
    this._launcherItem.createBillboard();
  }

  handleShowLiquidFillGauge() {
    this._launcherItem.createLiquidFillGauge();

  }
  handleDeleteMetric(metric: string) {
    this._launcherItem.deleteMetric(metric);
  }

  handleDropMetric(draggable: Draggable) {
    this._launcherItem.dropMetric(draggable);
  }

  handleDelete() {
    this._store.dispatch(new tabEditorActions.RemoveWidget(this.placeholderId, this._previousWidget.id));
  }

  handleMaximize() {
    this._launcherItem.maximize();
  }

  handleMinimize() {
    this._launcherItem.minimize();
  }

  handleZoom(event: ZoomEvent) {
    this._launcherItem.zoom(event);
  }

  handleClick(event: WidgetMouseEvent) {
    this._launcherItem.plot(event);
  }

  handleMouseDown(event: WidgetMouseEvent) {
    this._launcherItem.dragOnPoint(event, this._viewContainerRef);
    this._launcherItem.plot(event);
  }

  handleColumnMouseDown(event: WidgetMouseEvent) {
    this._launcherItem.dragOnHeader(event, this._viewContainerRef);
    this._launcherItem.plot(event);
  }

  handleContextMenu(event: WidgetMouseEvent) {
    this._launcherItem.plot(event);
  }

  handleExport(event: ExportEvent) {
    const {type, data} = event;
    this._launcherItem.exportData(type, data, this._api);
  }

  handleCopy() {
    this._launcherItem.copyEmbeddedWidget();
  }

  handleChangeTitle(title: string) {
    this._launcherItem.rename(title);
  }

  handleChangeSubTitle(subTitle: string) {
    this._launcherItem.updateSubTitle(subTitle);
  }

  handleMoveColumn(event: MoveColumnEvent) {
    this._launcherItem.moveColumn(event);
  }

  handlePage(event: Paging) {
    this._launcherItem.page(event);
  }

  handleSwitchDisplayMode(event: DisplayModeEvent) {
    this._launcherItem.switchDisplayMode(event);
  }

  handleChangeChartType(event: ChangeChartTypeEvent) {
    this._launcherItem.changeChartType(event);
  }

  handleInvokeUrl() {
    this._launcherItem.invokeUrl();
  }

  handleAutoInvokeUrl(event: any) {
    this._launcherItem.autoInvokeUrl(event);
  }

  handleSearchChange(event: any) {
    this._store.dispatch(new widgetsActions.Update({...event}));
  }

  handleEdit(widget: Widget) {
    this._store.dispatch(new editWidgetActions.Edit(widget));
  }

  handleUpdateMeasure(event: any) {
    this._launcherItem.updateMeasure(event);
  }

  handleAddMeasure(event: any) {
    this._launcherItem.addMeasure(event);
  }

  handleSetTimeRange(event: Widget) {
    this._launcherItem.setTimeRange(event);
  }

  handleSetRealTimeMode(widgetId: string) {
    this._launcherItem.setRealTimeMode(widgetId);
  }

  handleClickShiftTrendDiff() {
    this._store.dispatch(new creationOnPlotActions.CreateShiftTrendDiff());
  }

  handleClickDayTrendDiff() {
    this._store.dispatch(new creationOnPlotActions.CreateDayTrendDiff());
  }

  handleClickWeekTrendDiff() {
    this._store.dispatch(new creationOnPlotActions.CreateWeekTrendDiff());
  }

  private createLauncherItem(widget: Widget): void {
    this._launcherItem = this._launcherItemFactory.create(this.placeholderId, widget);
  }

  private generateData(): void {
    this._launcherItem.generateData();
  }

  private configureUI(): void {
    this.uiSettings$ = this._launcherItem.configureUI();
  }

  private configureResponsive() {
    this.chartSize$ = this._launcherItem.getChartSize(this.el);
  }

  private focus() {
    if (this._launcherItem) {
      this._launcherItem.focus();
    }
  }

  private blur() {
    if (this._launcherItem) {
      this._launcherItem.blur();
    }
  }

  private getWidgetObservable(): Observable<Widget> {
    return this._store.pipe(select(fromDashboards.getPlaceholderWidget(this.placeholderId)));
  }

  private loadMeasures(dataType: string) {
    if (dataType) {
      this.measures$ = this._store.pipe(
        select(fromMeasures.getMeasuresByDataType(dataType, ['number', MeasureFormat.time]))
      );
    }
  }

  public handleUpdateColumnWidth(event) {
    this._store.dispatch(new widgetsActions.Update(event));
  }

  handleLegendConfig(event) {
    this._store.dispatch(new widgetsActions.Update(event));
  }

  handleChangeShowLegend(event: boolean) {
    this._store.dispatch(new placeholdersActions.ShowLegends({placeholderId: this.placeholderId, isShow: event}));
  }

  handleChangePauseLineChart(event: boolean) {
    this._store.dispatch(new placeholdersActions.StartPauseLineChart({placeholderId: this.placeholderId, isPause: event}));
  }
}
