import {select, Store} from '@ngrx/store';
import {combineLatest, Observable, of} from 'rxjs';
import {delay, map} from 'rxjs/operators';
import {isNullOrUndefined} from 'util';
import {WidgetType} from '../../../widgets/constants/widget-types';
import {CallTimeLineWidget, Widget} from '../../../widgets/models';
import * as placeholdersActions from '../../actions/placeholders.actions';
import {PlotPoint} from '../../models';
import {LaunchType, PlaceholderSize} from '../../models/enums';
import * as fromDashboards from '../../reducers';

export interface PlaceholderUISettings {
  add?: boolean;
  delete?: boolean;
  copy?: boolean;
  minimize?: boolean;
  maximize?: boolean;
  exportMenu?: boolean;
  search?: boolean;
  contextMenu?: boolean | any;
  overlay?: boolean;
  edit?: boolean;
  timeMode?: boolean;
  realTimeMode?: boolean;
  highchartExport?: boolean;
  gaugeMode?: boolean;
  legend?: boolean;
  displayMode?: boolean;
  chartType?: boolean;
  movingTime?: boolean;
}

export interface UIBehavior {
  configure(): Observable<PlaceholderUISettings>;

  focus();

  blur();
}

export class DoNotHaveUI implements UIBehavior {
  configure(): Observable<PlaceholderUISettings> {
    return of({});
  }

  focus() {
    // no op
  }

  blur() {
    // no op
  }
}

export abstract class AbstractUIBehavior implements UIBehavior {
  private _store: Store<fromDashboards.State>;
  private _placeholderId: string;
  private _widget: Widget;
  private _plotPoint: PlotPoint;

  constructor(store: Store<fromDashboards.State>, placeholderId: string, widget: Widget) {
    this._store = store;
    this._placeholderId = placeholderId;
    this._widget = widget;
  }

  get store(): Store<fromDashboards.State> {
    return this._store;
  }

  get widget(): Widget {
    return this._widget;
  }

  get plotPoint(): PlotPoint {
    return this._plotPoint;
  }

  configure(): Observable<PlaceholderUISettings> {
    const placeholderSize$ = this._store.pipe(select(fromDashboards.getPlaceholderSize(this._placeholderId)));
    const launchMode$ = this._store.pipe(select(fromDashboards.getLaunchMode));
    const focus$ = this._store.pipe(select(fromDashboards.getPlaceholderFocusState(this._placeholderId)));
    const plotPoint$ = this._store.pipe(select(fromDashboards.getPlotPoint));

    return combineLatest(placeholderSize$, launchMode$, focus$, plotPoint$).pipe(
      delay(0),
      map(([size, mode, focus, plotPoint]) => {
        if (plotPoint && plotPoint.trigger === 'contextmenu') {
          this._plotPoint = plotPoint;
        }

        if (!focus) {
          return this.getDefaultSettings();
        }

        if (mode === LaunchType.INTEGRATED) {
          return this.getIntegratedModeSettings(size, plotPoint);
        }

        if (mode === LaunchType.STANDALONE) {
          return this.getStandaloneModeSettings();
        }

        return this.getDefaultSettings();
      })
    );
  }

  focus() {
    this._store.dispatch(new placeholdersActions.Focus(this._placeholderId));
  }

  blur() {
    this._store.dispatch(new placeholdersActions.Blur(this._placeholderId));
  }

  getContextMenuSettings(point: PlotPoint) {
    return null;
  }

  getOverlayOptions(): boolean {
    return false;
  }

  useAddMeasure(): boolean {
    return true;
  }

  useRealTimeMode(): boolean {
    return false;
  }

  useHighChartExport(): boolean {
    return true;
  }

  useTimeRange(): boolean {
    return false;
  }

  getDimensionInstances(): string[] {
    return this._widget.dimensions.reduce((acc, item) => {
      acc.push(...item.customInstances, ...item.systemInstances);
      return acc;
    }, []);
  }

  private getIntegratedModeSettings(size: PlaceholderSize, point: PlotPoint): PlaceholderUISettings {
    return {
      delete: size === PlaceholderSize.MINIMUM,
      copy: this._widget.type !== WidgetType.LabelWidget,
      minimize: size === PlaceholderSize.MAXIMUM,
      maximize: size === PlaceholderSize.MINIMUM && this.allowSetting(this._widget.type, 'maximize'),
      // maximize: size === PlaceholderSize.MINIMUM && this._widget.type !== WidgetType.LabelWidget,
      exportMenu:  this._widget.type === WidgetType.Tabular,
      search: false,
      contextMenu: this.getContextMenuSettings(point),
      overlay: this.getOverlayOptions(),
      edit: true,
      add: this.useAddMeasure(),
      timeMode: this.useTimeRange(),
      realTimeMode: this.useRealTimeMode(),
      highchartExport: this.useHighChartExport(),
      gaugeMode: this._widget.type === WidgetType.SolidGauge,
      legend: this._widget.type === WidgetType.Line || this._widget.type === WidgetType.Bar || this._widget.type === WidgetType.GeoMap,
      chartType: this._widget.type === WidgetType.Line,
      displayMode: this._widget.type === WidgetType.SolidGauge || this._widget.type === WidgetType.GeoMap || this._widget.type === WidgetType.Sunburst,
      movingTime: this._widget.type === WidgetType.Line,

    };
  }

  private getStandaloneModeSettings(): PlaceholderUISettings {
    return {
      delete: false,
      copy: this.allowSetting(this._widget.type, 'copy'),
      minimize: false,
      maximize: false,
      exportMenu: this._widget.type === WidgetType.Tabular,
      search: false,
      contextMenu: false,
      overlay: this.getOverlayOptions(),
      edit: true,
      add: this.useAddMeasure(),
      timeMode: this.useTimeRange(),
      realTimeMode: this.useRealTimeMode(),
      highchartExport: this.useHighChartExport(),
      gaugeMode: this._widget.type === WidgetType.SolidGauge,
      legend: this._widget.type === WidgetType.Line || this._widget.type === WidgetType.Bar || this._widget.type === WidgetType.GeoMap,
      chartType: this._widget.type === WidgetType.Line,
      displayMode: this._widget.type === WidgetType.SolidGauge || this._widget.type === WidgetType.GeoMap || this._widget.type === WidgetType.Sunburst,
      movingTime: this._widget.type === WidgetType.Line,
    };
  }

  private allowSetting<T, K extends keyof PlaceholderUISettings>(type: WidgetType, setting: string) {
    if (setting === 'copy' || setting === 'maximize') {
      return type !== WidgetType.LabelWidget && type !== WidgetType.EventViewer;
    }
  }

  private getDefaultSettings(): PlaceholderUISettings {
    return {
      overlay: this.getOverlayOptions()
    };
  }
}

export class LineUIBehavior extends AbstractUIBehavior {
  constructor(store: Store<fromDashboards.State>, placeholderId: string, widget: Widget) {
    super(store, placeholderId, widget);
  }

  getContextMenuSettings() {
    return {
      createTimeLine: false,
      createBillboard: false,
      deleteInstance: true,
      deleteMeasure: true,
      invokeUrl: true,
      editMeasure: true,
      shiftTrenddiff: true,
      dayTrenddiff: true,
      weekTrenddiff: true
    };
  }

  getOverlayOptions(): boolean {
    const {measures, dimensions, windows, showAllData} = this.widget;
    return measures.length === 0 || dimensions.length === 0 || windows.length === 0 || (this.getDimensionInstances().length === 0 && !showAllData);
  }

  useTimeRange(): boolean {
    return true;
  }
}

export class TrendDiffUIBehavior extends AbstractUIBehavior {
  constructor(store: Store<fromDashboards.State>, placeholderId: string, widget: Widget) {
    super(store, placeholderId, widget);
  }

  getOverlayOptions(): boolean {
    const {measures} = this.widget;
    return measures.length === 0 || this.getDimensionInstances().length === 0;
  }

  getContextMenuSettings() {
    return {
      invokeUrl: true,
      editMeasure: true
    };
  }

  useAddMeasure() {
    return false;
  }
}

export class TabularUIBehavior extends AbstractUIBehavior {
  constructor(store: Store<fromDashboards.State>, placeholderId: string, widget: Widget) {
    super(store, placeholderId, widget);
  }

  getContextMenuSettings() {
    return {
      createTimeLine: false,
      createBillboard: this.plotPoint && !isNullOrUndefined(this.plotPoint.measure) && !isNullOrUndefined(this.plotPoint.instance),
      deleteInstance: this.plotPoint && !isNullOrUndefined(this.plotPoint.instance),
      deleteMeasure: this.plotPoint && !isNullOrUndefined(this.plotPoint.measure),
      invokeUrl: this.plotPoint && !isNullOrUndefined(this.plotPoint.measure),
      editMeasure: true
    };
  }

  getOverlayOptions(): boolean {
    const {measures, dimensions, windows, showAllData} = this.widget;
    return measures.length === 0 || dimensions.length === 0 || windows.length === 0 || (this.getDimensionInstances().length === 0 && !showAllData);
  }

  useTimeRange(): boolean {
    return true;
  }
}

export class BarUIBehavior extends AbstractUIBehavior {
  constructor(store: Store<fromDashboards.State>, placeholderId: string, widget: Widget) {
    super(store, placeholderId, widget);
  }

  getContextMenuSettings() {
    return {
      createTable: true,
      createTimeLine: true,
      createBillboard: false,
      deleteInstance: true,
      deleteMeasure: true,
      invokeUrl: true,
      editMeasure: true
    };
  }

  getOverlayOptions(): boolean {
    const {measures, dimensions, windows, showAllData} = this.widget;
    return measures.length === 0 || dimensions.length === 0 || windows.length === 0 || (this.getDimensionInstances().length === 0 && !showAllData);
  }

  useRealTimeMode(): boolean {
    return true;
  }

  useTimeRange(): boolean {
    return true;
  }
}

export class BillboardUIBehavior extends AbstractUIBehavior {
  constructor(store: Store<fromDashboards.State>, placeholderId: string, widget: Widget) {
    super(store, placeholderId, widget);
  }

  getOverlayOptions(): boolean {
    const {measures, dimensions, windows, showAllData} = this.widget;
    return measures.length === 0 || dimensions.length === 0 || windows.length === 0 || (this.getDimensionInstances().length === 0 && !showAllData);
  }

  getContextMenuSettings() {
    return {
      invokeUrl: true,
      editMeasure: true
    };
  }

  useAddMeasure() {
    return false;
  }

  useRealTimeMode(): boolean {
    return true;
  }
}


export class LiquidFillGaugeUIBehavior extends AbstractUIBehavior {
  constructor(store: Store<fromDashboards.State>, placeholderId: string, widget: Widget) {
    super(store, placeholderId, widget);
  }

  getOverlayOptions(): boolean {
    const {measures, dimensions, windows, showAllData} = this.widget;
    return measures.length === 0 || dimensions.length === 0 || windows.length === 0 || (this.getDimensionInstances().length === 0 && !showAllData);
  }

  getContextMenuSettings() {
    return {
      invokeUrl: true,
      editMeasure: true
    };
  }

  useAddMeasure() {
    return false;
  }

  useRealTimeMode(): boolean {
    return true;
  }
}

export class SolidGaugeUIBehavior extends AbstractUIBehavior {
  constructor(store: Store<fromDashboards.State>, placeholderId: string, widget: Widget) {
    super(store, placeholderId, widget);
  }

  getOverlayOptions(): boolean {
    const {measures} = this.widget;
    return measures.length === 0 || this.getDimensionInstances().length === 0;
  }

  getContextMenuSettings() {
    return {
      invokeUrl: true,
      editMeasure: true
    };
  }

  useAddMeasure() {
    return false;
  }
}

export class SunburstUIBehavior extends AbstractUIBehavior {
  constructor(store: Store<fromDashboards.State>, placeholderId: string, widget: Widget) {
    super(store, placeholderId, widget);
  }

  getContextMenuSettings(point: PlotPoint) {
    return {
      deleteInstance: point && point.instance,
      deleteMeasure: true,
      invokeUrl: true,
      editMeasure: true
    };
  }

  getOverlayOptions(): boolean {
    const {measures, dimensions, windows, showAllData} = this.widget;
    return measures.length === 0 || dimensions.length === 0 || windows.length === 0 || (this.getDimensionInstances().length === 0 && !showAllData);
  }

  useAddMeasure() {
    return false;
  }
}

export class SankeyUIBehavior extends AbstractUIBehavior {
  constructor(store: Store<fromDashboards.State>, placeholderId: string, widget: Widget) {
    super(store, placeholderId, widget);
  }

  getContextMenuSettings() {
    return {
      invokeUrl: true,
      editMeasure: true
    };
  }

  getOverlayOptions(): boolean {
    const {measures, dimensions, windows, showAllData} = this.widget;
    return measures.length === 0 || dimensions.length === 0 || windows.length === 0 || (this.getDimensionInstances().length === 0 && !showAllData);
  }
}

export class GeoMapUIBehavior extends AbstractUIBehavior {
  constructor(store: Store<fromDashboards.State>, placeholderId: string, widget: Widget) {
    super(store, placeholderId, widget);
  }

  useAddMeasure() {
    return false;
  }

  getContextMenuSettings() {
    return {
      createTimeLine: false,
      createBillboard: false,
      deleteInstance: true,
      deleteMeasure: true,
      invokeUrl: true,
      editMeasure: true
    };
  }

  getOverlayOptions(): boolean {
    const {measures, dimensions, windows, showAllData} = this.widget;
    return measures.length === 0 || dimensions.length === 0 || windows.length === 0 || (this.getDimensionInstances().length === 0 && !showAllData);
  }
}

export class CallTimeLineUIBehavior extends AbstractUIBehavior {
  constructor(store: Store<fromDashboards.State>, placeholderId: string, widget: Widget) {
    super(store, placeholderId, widget);
  }

  getContextMenuSettings() {
    return {
      deleteAgent: true,
      deleteQueue: true,
      deleteSegmentType: true,
      invokeUrl: true,
      editMeasure: false
    };
  }

  getOverlayOptions(): boolean {
    const {measures, agents, queues, segmentTypes} = this.widget as CallTimeLineWidget;
    return measures.length === 0 || agents.length === 0 || queues.length === 0 || segmentTypes.length === 0;
  }

  useAddMeasure(): boolean {
    return false;
  }
}

export class LabelBehavior extends AbstractUIBehavior {
  constructor(store: Store<fromDashboards.State>, placeholderId: string, widget: Widget) {
    super(store, placeholderId, widget);
  }

  useAddMeasure(): boolean {
    return false;
  }

  useHighChartExport(): boolean {
    return false;
  }

  getOverlayOptions(): boolean {
    return false;
  }
}

export class BubbleUIBehavior extends AbstractUIBehavior {
  constructor(store: Store<fromDashboards.State>, placeholderId: string, widget: Widget) {
    super(store, placeholderId, widget);
  }

  getContextMenuSettings() {
    return {
      deleteInstance: true,
      deleteMeasure: true,
      invokeUrl: true,
      editMeasure: true
    };
  }

  getOverlayOptions(): boolean {
    const {measures, dimensions, windows, showAllData} = this.widget;
    return measures.length === 0 || dimensions.length === 0 || windows.length === 0 || (this.getDimensionInstances().length === 0 && !showAllData);
  }
}

export class EventViewerBehavior extends AbstractUIBehavior {
  constructor(store: Store<fromDashboards.State>, placeholderId: string, widget: Widget) {
    super(store, placeholderId, widget);
  }

  useAddMeasure(): boolean {
    return false;
  }

  useHighChartExport(): boolean {
    return false;
  }

  getOverlayOptions(): boolean {
    return false;
  }
}
