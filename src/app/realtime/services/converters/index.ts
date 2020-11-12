import {DataSet, GroupKey, WidgetData} from '../../models';

export interface ChartDataConverterService {
  convert(data: DataSet): WidgetData;
}

export interface PropertyEvaluator<Result> {
  evaluate(data: DataSet, key: GroupKey): Result;
}

export interface BillboardData {
  current: { timestamp: number, value: number };
  passed: { timestamp: number, value: number };
}

export interface LiquidFillGaugeData {
  current: { timestamp: number, value: number };
  passed: { timestamp: number, value: number };
}

export interface EventViewerData {
  // ?? is this needed
}