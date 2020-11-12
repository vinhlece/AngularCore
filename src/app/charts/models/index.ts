import {EventEmitter} from '@angular/core';
import {IHeaderParams} from 'ag-grid-community';
import {TimeRange} from '../../dashboard/models';
import {DisplayMode} from '../../dashboard/models/enums';
import {Column, Widget} from '../../widgets/models';

export interface ZoomEvent {
  trigger?: string;
  timeRange?: TimeRange;
  rangeSelectorButton?: string;
  otherParams?: any;
}

export interface Brush {
  start: number;
  end: number;
}

export interface TabularDataElement {
  Key: string;
  MeasureTimestamp: string;
  latest: {};
  previous: {} | null;
}

export interface TabularCellValue {
  value: string | number;
  color: string;
  format: string;
}

export class WidgetMouseEvent extends MouseEvent {
  widget?: Widget;
  cell?: { keyCol: string, targetCol: string };
  column?: string;
  otherParams?: any;
  groupParams?: any;
}

export interface MoveColumnEvent {
  targetColumn?: Column;
  siblingColumn?: Column;
  columns?: Column[];
}

export interface REPStyles {
  backgroundColor?: string;
  color?: string;
  font?: string;
}

export interface DisplayModeEvent {
  currentMode: DisplayMode;
  newMode: DisplayMode;
}

export interface ChangeChartTypeEvent {
  currentChartType: string;
  newChartType: string;
}

export interface ChartReadyEvent {
  api: any;
}

export interface PlotLineLabel {
  name: string;
  value: number;
  color: string;
}

export interface Point {
  x: number;
  y: number;
}

export interface Dimension {
  width: number;
  height: number;
}

export interface HeaderParams extends IHeaderParams {
  onMouseDown: EventEmitter<WidgetMouseEvent>;
  widget: Widget;
  newColumn: Column;
}

export interface Legend {
  name: string;
  color: string;
  enabled: boolean;
}
