export enum TimeRangeType {
  Minute = 'minute',
  Hour = 'hour',
  Day = 'day',
  Week = 'week',
  Month = 'month',
  Year = 'year',
  Second = 'second'
}

export enum TimeRangeStep {
  OneSecond = 1 * 1000,
  OneMinute = 1 * 60 * 1000,
  FiveMinutes = 5 * 60 * 1000,
  FifteenMinutes = 15 * 60 * 1000,
  ThirtyMinutes = 30 * 50 * 1000,
  OneHour = 60 * 60 * 1000,
  SixHours = 6 * 60 * 60 * 1000,
  TwelveHours = 12 * 60 * 60 * 1000,
  OneDay = 24 * 60 * 60 * 1000,
  OneWeek = 7 * 24 * 60 * 60 * 1000,
}

export enum PlaceholderSize {
  MAXIMUM = 'Maximum',
  MINIMUM = 'Minimum'
}

export enum ExportType {
  PDF = 'pdf',
  CSV = 'csv',
  XLS = 'xlsx'
}

export enum ReplayStatus {
  RESUME = 'Resume',
  PAUSE = 'Pause',
  STOP = 'Stop'
}

export enum LaunchType {
  STANDALONE = 'Standalone',
  INTEGRATED = 'Integrated'
}

export enum Draggable {
  Disabled = 'Disabled',
  Instance = 'Instance',
  Measure = 'Measure',
  Both = 'Both'
}

export enum DisplayMode {
  Latest = 'Latest',
  Historical = 'Historical',
  Timestamp = 'Timestamp'
}

export enum Strategy {
  ADD = 'add',
  ADDS = 'adds',
  REPLACE = 'replace',
  DELETE = 'delete',
  EDIT = 'edit'
}

export enum Metric {
  DIMENSION = 'dimension',
  DIMENSIONS = 'dimensions',
  INSTANCE = 'instance',
  INSTANCES = 'instances',
  MEASURE = 'measure',
  MEASURES = 'measures',
  AGENT = 'agent',
  QUEUE = 'queue',
  SEGMENT_TYPE = 'segmentType',
  NODE = 'node',
  TIMESTAMP = 'timestamp',
  TIMESTAMPS = 'timestamps',
  WINDOW = 'window',
  WINDOWS = 'windows'
}

export enum IntervalUnit {
  Day = 'Day',
  Hour = 'Hour',
  Minute = 'Minute'
}

export enum DragOption {
  AddInstance = 'Add Instance',
  AddMeasure = 'Add Measure',
  AddTimestamp = 'Add Timestamp'
}

export enum LabelMode {
  None = 'None',
  ShowName = 'Show Name',
  ShowValue = 'Show Value'
}

export enum TextAlignment {
  Left = 'Left',
  Center = 'Center',
  Right = 'Right',
  Justify = 'Justify'
}

export enum DashboardFilter {
  Widget = 'widgets',
  Dimension = 'dimensions',
  Measure = 'measures',
  Window = 'windows'
}
