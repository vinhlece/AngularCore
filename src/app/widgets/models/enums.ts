export enum LineChartTypes {
  Line = 'Line',
  Area = 'Area',
  Spline = 'Spline'
}

export enum DataDisplayType {
  ShowInterval = 'Show Interval',
  EndOfTimeline = 'End of Timeline'
}

export enum TrendType {
  Day = 'Day',
  Shift = 'Shift'
}

export enum AggFunctions {
  Sum = 'sum',
  Avg = 'avg',
  Min = 'min',
  Max = 'max',
  Count = 'count',
  First = 'first',
  Last = 'last'
}

export enum GroupOptions {
  Month = 'month',
  Week = 'week',
  Day = 'day',
  Hour = 'hour'
}

export enum WidgetThresholdColor {
  Red = 'Red',
  Green = 'Green',
  Black = 'Black',
}

export enum CallTimeLineGroupBy {
  Agent = 'agent',
  Queue = 'queue',
  SegmentType = 'segmentType',
  CallId = 'callID'
}

export enum TimeGroupBy {
  Today = 'Today',
  Yesterday = 'Yesterday',
  Last24Hours = 'Last 24 hours',
  Last7Days = 'Last 7 days',
  Last30Days = 'Last 30 days',
  ThisMonth = 'This month',
  CustomRange = 'Custom range'
}

export enum ChartIcons {
  LiquidFillGauge = 'liquidfillgauge',
  Bar = 'bar',
  Line = 'line',
  TrendDiff = 'trenddiff',
  Tabular = 'new-tabular',
  Billboard = 'billboard',
  Sankey = 'sankey',
  SolidGauge = 'solid-gauge',
  GeoMap = 'geo-map',
  Sunburst = 'sunburst',
  CallTimeLine = 'call-timeline',
  Label = 'label',
  Bubble = 'bubble'
}

export enum BarWidgetStyle {
  Normal = 'Normal',
  Stacked = 'Stacked'
}

export enum EditWidgetType {
  OnWidget = 0,
  OnData = 1,
  OnAppearance = 2
}

export enum WidgetItem {
  Dimension = 'dimensions',
  Measure = 'measures',
  Window = 'windows',
  Instance = 'instance'
}

export enum InstanceType {
  RealTime = 'realtime',
  Custom = 'custom'
}

export enum MeasureFormat {
  time = 'time',
  datetime = 'datetime',
  number = 'number',
  string = 'string'
}

export enum WidgetSection {
  info = 'Widget Info',
  appearance = 'Appearance',
  data = 'Data Picker'
}
