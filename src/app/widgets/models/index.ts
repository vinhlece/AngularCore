import {Model} from '../../common/models';
import {DisplayMode, IntervalUnit, LabelMode} from '../../dashboard/models/enums';
import {WidgetType} from '../constants/widget-types';
import {DataDisplayType, InstanceType, TrendType, WidgetThresholdColor} from './enums';

export interface Widget extends Model {
  id?: string;
  userId?: string;
  name?: string;
  subtitle?: string;
  type: WidgetType;
  defaultSize?: WidgetSize;
  dataType?: string;
  instances?: string[];
  dimensions?: WidgetDimension[];
  measures?: string[];
  windows?: string[];
  showAllData?: boolean;
  isTemplate?: boolean;
  font?: WidgetFont;
  urls?: Url[];
  timestamps?: number[];
  titlePosition?: string;
  hideLegend?: boolean;
  legendOptions?: LegendOption[];
  stackBy?: string[];
}

export interface WidgetWindow {
  windowType: string;
  window: string;
}

export interface WidgetDimension {
  dimension: string;
  systemInstances: string[];
  customInstances: string[];
}

export interface ChartWidget extends Widget {
  chartType?: string;
  xAxisLabel?: string;
  xAxisMin?: number;
  yAxisLabel?: string;
  yAxisMin?: number;
  yAxisMax?: number;
}

export interface LineWidget extends ChartWidget {
  enableNavigator?: boolean;
  thresholdLine?: ThresholdLine;
  customTimeRange?: TimeGroup;
  hideKPI?: KpiThresholds;
}

export interface GeoMapWidget extends ChartWidget {
  stateColor: StateColor;
  displayMode?: DisplayMode;
}

export interface BarWidget extends ChartWidget {
  mode?: BarMode;
  chartStyle?: string;
  stackBy?: string[];
}

export interface BubbleWidget extends ChartWidget {
}

export interface BillboardWidget extends Widget {
  thresholdColor?: WidgetThresholdColorConfig;
  color?: string;
  flashing?: boolean;
}

export interface EventViewerWidget extends Widget {
  thresholdColor?: WidgetThresholdColorConfig;
  color?: string;
  flashing?: boolean;
}

export interface LiquidFillGaugeWidget extends Widget {
  minValue?: number;
  maxValue?: number;
  circleThickness?: number;
  circleFillGap?: number;
  circleColor?: string;
  waveHeight?: number;
  waveCount?: number;
  waveRiseTime?: number;
  waveAnimateTime?: number;
  waveRise?: boolean;
  waveHeightScaling?: boolean;
  waveAnimate?: boolean;
  waveColor?: string;
  waveOffset?: number;
  textVertPosition?: number;
  textSize?: number;
  valueCountUp?: boolean;
  displayPercent?: boolean;
  textColor?: string;
  waveTextColor?: string;
}

export interface CallTimeLineWidget extends ChartWidget {
  mode?: string;
  queues?: string[];
  agents?: string[];
  segmentTypes?: string[];
  filters?: string[];
  groupBy?: string;
  enableNavigator?: boolean;
}

export interface TrendDiffWidget extends ChartWidget {
  trendType?: TrendType;
  period?: number;
  numberOfLines?: number;
}

export interface SunburstWidget extends ChartWidget {
  stateColor?: StateColor;
  displayMode?: DisplayMode;
  labelMode?: LabelMode;
}

export interface Column {
  id?: string;
  type?: string;
  title?: string;
  visibility?: boolean;
  group?: Group;
  aggFunc?: string;
  threshold?: BreakpointThreshold;
  width?: number;
  groupBy?: string;
  groupRange?: number;
}

export interface Group {
  enable: boolean;
  priority?: number | null;
}

export interface SankeyWidget extends Widget {
  nodes?: SankeyNode[];
}

export interface SolidGaugeWidget extends ChartWidget {
  gaugeThreshold?: BreakpointThreshold;
  displayMode?: DisplayMode;
  gaugeValue?: GaugeValue;
  arcWidth?: number;
}

export interface TabularWidget extends Widget {
  columns?: Column[];
  displayData?: DataDisplayType;
  thresholdColor?: WidgetThresholdColorConfig;
  paging?: Paging;
  flashing?: boolean;
  customTimeRange?: TimeGroup;
  hideIcon?: boolean;
}

export interface WidgetPoint {
  x: number;
  y: number;
}

export interface SideBarItem {
  type: string;
  payload: any;
}

export interface BreakpointThreshold {
  breakpoints: number[];
  colors: ThresholdColor[];
}

export interface ThresholdColor {
  value: string;
  autoInvokeUrl: boolean;
}

export interface WidgetThresholdColorConfig {
  greater: WidgetThresholdColor;
  lesser: WidgetThresholdColor;
}

export interface ThresholdLine {
  enable: boolean;
  value: number;
}

export interface WidgetSize {
  rows: number;
  columns: number;
}

export interface Paging {
  size: number;
  index: number;
}

export interface StateColor {
  parentStateColor: string;
  capitalColor: string;
}

export interface MouseEventWrapper {
  event: MouseEvent;
  payload?: any;
}

export interface ClickSelectedItemEvent {
  item: any;
  index: number;
}

export interface Position {
  top: number;
  left: number;
}

export interface DragEvent {
  originalEvent?: MouseEvent;
  target?: HTMLElement;
  position?: Position;
  type?: string;
}

export interface WidgetFont {
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
}

export interface SankeyNode {
  id: string;
  column?: number;
  color?: string;
}

export interface Url {
  name?: string;
  baseUrl: string;
  measure: string;
}

export interface BarMode {
  value: string;
  timeGroup?: TimeGroup;
}

export interface TimeGroup {
  type: string;
  interval?: TimeInterval;
  range: InputRange;
}

export interface InputRange {
  startDay?: number;
  endDay?: number;
}

export interface TimeInterval {
  value: number;
  unit: IntervalUnit;
}

export interface GaugeValue {
  min: number;
  max: number;
  color: string;
}

export interface PairItem {
  key: string;
  value: string;
}

export interface KpiThresholds {
  lower: boolean;
  upper: boolean;
}

export interface LegendOption {
  instance: string;
  measure: string;
  hideMeasure?: boolean;
  hideInstance?: boolean;
  hideWindow?: boolean;
  alias?: string;
}

