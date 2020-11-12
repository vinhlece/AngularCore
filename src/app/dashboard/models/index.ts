import {ViewContainerRef} from '@angular/core';
import {WidgetMouseEvent} from '../../charts/models';
import {Model} from '../../common/models';
import {Widget, WidgetPoint, WidgetSize} from '../../widgets/models';
import {Draggable, ExportType, TimeRangeType} from './enums';
import {PollingInterval} from '../../realtime/models/index';

export interface TimeRangeInterval {
  type: TimeRangeType;
  value: number;
  label?: string;
}

export interface TimeRange {
  startTimestamp: number;
  endTimestamp: number;
}

export interface TimeRangeSetting {
  interval?: TimeRangeInterval;
  range?: TimeRange;
  step?: number;
  dataPointInterval?: {
    intervals: TimeRangeInterval[];
    value: TimeRangeInterval;
  };
}

export interface PredictiveSetting {
  intervals: TimeRangeInterval[];
  available?: TimeRangeInterval[];
  value: TimeRangeInterval;
}

export interface PollingConfig {
  timeRangeSettings?: TimeRangeSetting;
  predictiveSettings?: PredictiveSetting;
  pollingInterval?: PollingInterval;
  realTimeInterval?: number;
}

export interface Dashboard extends Model {
  id?: string;
  userId?: string;
  name: string;
  tabs?: any[];
  description?: string;
}

export interface DashboardStatus {
  measures?: string[];
  dimensions?: string[];
  windows?: string[];
  widgets?: string[];
}

export interface ExportEvent {
  type: ExportType;
  data: any;
}

export interface Tab extends Model {
  id?: string;
  name: string;
  dashboardId: string;
  size?: WidgetSize;
  placeholders?: any[];
  globalFilters?: string[];
}

export interface Placeholder extends Model {
  id?: string;
  widgetId?: string;
  tabId?: string;
  size?: WidgetSize;
  position?: WidgetPoint;
  avatar?: string;
}

export interface GridMetrics {
  innerGridHeight?: number;
  innerGridWidth?: number;
  innerRowHeight?: number;
  innerRowWidth?: number;
  gridLinesHeight?: number;
  gridLinesWidth?: number;
  gridLinesRowWidth?: number;
  gridLinesRowHeight?: number;
  padding?: { top?: number, right?: number, bottom?: number, left?: number };
}

export interface PlotPoint {
  trigger?: string;
  widgetId?: string;
  dataType?: string;
  dimension?: string;
  window?: string;
  instance?: string;
  measure?: string;
  agent?: string;
  queue?: string;
  segmentType?: string;
  node?: string;
  otherParams?: object;
  groupParams?: GroupParams;
}

export interface GroupParams {
  group?: string;
  timestamps?: number[];
  instance?: string[];
  measure?: string[];
}


export interface UpdateOnPlotOptions {
  widgetId: string;
  strategy?: 'add' | 'replace';
  sideEffects?: UpdateOnPlotSideEffects;
  validatorFn?: (widget: Widget, point: PlotPoint) => boolean;
}

export interface UpdateOnPlotSideEffects {
  rename?: { instance?: boolean, measure?: boolean };
  addColumn?: boolean;
  updateMeasureRelationship?: boolean;
}

export interface DeleteOnPlotOptions {
  widgetId: string;
  strategy?: 'remove' | 'reset';
  sideEffects?: DeleteOnPlotSideEffects;
}

export interface DeleteOnPlotSideEffects {
  deleteColumn?: boolean;
}

export interface CreationSideEffects {
  updateMeasureRelationship?: boolean;
}

export interface DndPayload {
  parent: ViewContainerRef;
  event: WidgetMouseEvent;
  draggable?: Draggable;
  hideDraggable?: boolean;
}

export interface UpdateMetricsPayload {
  // To trigger update metrics, provide these properties
  widgetId?: string;
  confirmation?: any;
  dimension?: UpdateMetricsOptions;
  instance?: UpdateMetricsOptions;
  measure?: UpdateMetricsOptions;
  agent?: UpdateMetricsOptions;
  queue?: UpdateMetricsOptions;
  segmentType?: UpdateMetricsOptions;
  window?: UpdateMetricsOptions;

  // To execute update metrics, add 3 more properties:
  srcWidget?: Widget;
  targetWidget?: Widget;
  point?: PlotPoint;
}

export interface UpdateMetricsOptions {
  strategy?: any;
  targetProp?: any;
  validatorFn?: (widget: Widget, point: PlotPoint) => boolean;
  sideEffects?: UpdateMetricsSideEffects;
  valueGetter?: MetricValueGetter;
}

export type MetricValueGetter = (srcWidget: Widget, targetWidget: Widget, srcValue: string | string[] | number[]) => string;

export interface UpdateMetricsSideEffects {
  updateSubTitle?: boolean;
  addColumn?: boolean;
  editColumn?: boolean;
  deleteColumn?: boolean;
  updateMeasureRelationship?: boolean;
}

export interface UpdateMetricsConfirmation {
  message: string;
  choices: string[];
}

export interface WidgetPosition {
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
}
