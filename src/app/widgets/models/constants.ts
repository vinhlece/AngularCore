import {WidgetMode, WidgetType, WidgetTypeForGroup} from '../constants/widget-types';
import {DisplayMode} from '../../dashboard/models/enums';
import {PairItem} from './index';
import {
  AggFunctions,
  BarWidgetStyle,
  DataDisplayType,
  GroupOptions,
  LineChartTypes,
  TimeGroupBy,
  TrendType,
  WidgetThresholdColor
} from './enums';

export const MeasureTimestamp = 'MeasureTimestamp';
export const Key = 'Key';
export const PlaceholderDefaultSize = {
  rows: 4,
  columns: 4
};

export const Default_Config = {
  Bar: {
    mode: {
      value: WidgetMode.Instances,
      timeGroup: null
    },
    defaultSize: {
      rows: 5,
      columns: 6
    }
  },
  BillBoard: {
    defaultSize: {
      rows: 5,
      columns: 3
    }
  },
  LiquidFillGauge: {
    defaultSize: {
      rows: 5,
      columns: 3
    }
  },
  SolidGauge: {
    displayMode: DisplayMode.Latest,
    defaultSize: {
      rows: 5,
      columns: 3
    }
  },
  Line: {
    defaultSize: {
      rows: 6,
      columns: 12
    }
  },
  Sankey: {
    defaultSize: {
      rows: 5,
      columns: 8
    }
  },
  CallTimeLine: {
    defaultSize: {
      rows: 4,
      columns: 10
    }
  },
  Tabular: {
    defaultSize: {
      rows: 6,
      columns: 12
    }
  },
  Sunburst: {
    defaultSize: {
      rows: 5,
      columns: 4
    }
  },
  CallTimeline: {
    defaultSize: {
      rows: 6,
      columns: 12
    }
  },
  Trenddiff: {
    defaultSize: {
      rows: 6,
      columns: 12
    }
  },
  Label: {
    defaultSize: {
      rows: 1,
      columns: 12
    }
  },
  EventViewer: {
    defaultSize: {
      rows: 12,
      columns: 6 
    }
  }
};

export const BarStyleConst = [
  {
    key: BarWidgetStyle.Normal.toString(),
    value: 'select.bar_chart_style.normal'
  },
  {
    key: BarWidgetStyle.Stacked.toString(),
    value: 'select.bar_chart_style.stacked'
  }
];

export const TimeGroupConst = [
  {
    key: TimeGroupBy.Today.toString(),
    value: 'select.time_group.today'
  },
  {
    key: TimeGroupBy.Yesterday.toString(),
    value: 'select.time_group.yesterday'
  },
  {
    key: TimeGroupBy.Last24Hours.toString(),
    value: 'select.time_group.last_24_hours'
  },
  {
    key: TimeGroupBy.Last7Days.toString(),
    value: 'select.time_group.last_7_days'
  },
  {
    key: TimeGroupBy.Last30Days.toString(),
    value: 'select.time_group.last_30_days'
  },
  {
    key: TimeGroupBy.ThisMonth.toString(),
    value: 'select.time_group.this_month'
  },
  {
    key: TimeGroupBy.CustomRange.toString(),
    value: 'select.time_group.custom'
  }
];

export const DataDisplayTypeConst: PairItem[] = [
  {
    key: DataDisplayType.ShowInterval.toString(),
    value: 'select.data_display_type.show_interval'
  },
  {
    key: DataDisplayType.EndOfTimeline.toString(),
    value: 'select.data_display_type.end_of_timeline'
  }
];

export const LineChartTypesConst: PairItem[] = [
  {
    key: LineChartTypes.Line.toString(),
    value: 'select.line_chart_type.line'
  },
  {
    key: LineChartTypes.Area.toString(),
    value: 'select.line_chart_type.area'
  },
  {
    key: LineChartTypes.Spline.toString(),
    value: 'select.line_chart_type.spline'
  }
];

export const TrendTypeConst: PairItem[] = [
  {
    key: TrendType.Day.toString(),
    value: 'select.trend_type.day'
  },
  {
    key: TrendType.Shift.toString(),
    value: 'select.trend_type.shift'
  }
];

export const AggFunctionsConst: PairItem[] = [
  {
    key: AggFunctions.Sum.toString(),
    value: 'select.agg_function.sum'
  },
  {
    key: AggFunctions.Avg.toString(),
    value: 'select.agg_function.avg'
  },
  {
    key: AggFunctions.Min.toString(),
    value: 'select.agg_function.min'
  },
  {
    key: AggFunctions.Max.toString(),
    value: 'select.agg_function.max'
  },
  {
    key: AggFunctions.Count.toString(),
    value: 'select.agg_function.count'
  },
  {
    key: AggFunctions.First.toString(),
    value: 'select.agg_function.first'
  },
  {
    key: AggFunctions.Last.toString(),
    value: 'select.agg_function.last'
  }
];

export const GroupOptionsConst: PairItem[] = [
  {
    key: GroupOptions.Month.toString(),
    value: 'select.group_option.month'
  },
  {
    key: GroupOptions.Week.toString(),
    value: 'select.group_option.week'
  },
  {
    key: GroupOptions.Day.toString(),
    value: 'select.group_option.day'
  },
  {
    key: GroupOptions.Hour.toString(),
    value: 'select.group_option.hour'
  }
];

export const WidgetThresholdColorConst: PairItem[] = [
  {
    key: WidgetThresholdColor.Green.toString(),
    value: 'select.widget_threshold_color.green'
  },
  {
    key: WidgetThresholdColor.Red.toString(),
    value: 'select.widget_threshold_color.red'
  }
];

export const FontWeightLocale: PairItem[] = [
  {
    key: 'normal',
    value: 'select.font_weight.normal'
  },
  {
    key: 'bold',
    value: 'select.font_weight.bold'
  },
  {
    key: 'bolder',
    value: 'select.font_weight.bolder'
  },
  {
    key: 'lighter',
    value: 'select.font_weight.lighter'
  }
];

export const FontFamily: string[] = [
  'Poppins',
  'Roboto',
  'Arial',
  'Helvetica',
  'Verdana',
  'Calibri',
  'Lucida Sans',
  'Gill Sans',
  'Century Gothic',
  'Candara',
  'Futara',
  'Franklin Gothic Medium',
  'Trebuchet MS',
  'Geneva',
  'Segoe UI',
  'Optima',
  'Avanta Garde',
  'Times New Roman',
  'Big Caslon',
  'Bodoni MT',
  'Book Antiqua',
  'Bookman',
  'New Century Schoolbook',
  'Calisto MT',
  'Cambria',
  'Didot',
  'Garamond',
  'Georgia',
  'Goudy Old Style',
  'Hoefler Text',
  'Lucida Bright',
  'Palatino',
  'Perpetua',
  'Rockwell',
  'Rockwell Extra Bold',
  'Baskerville',
  'Consolas',
  'Courier',
  'Courier New',
  'Lucida Console',
  'Lucidatypewriter',
  'Lucida Sans Typewriter',
  'Monaco',
  'Andale Mono',
  'Comic Sans',
  'Comic Sans MS',
  'Apple Chancery',
  'Zapf Chancery',
  'Bradley Hand',
  'Brush Script MT',
  'Brush Script Std',
  'Snell Roundhan',
  'URW Chancery',
  'Coronet script',
  'Florence',
  'Impact',
  'Brushstroke',
  'Luminari',
  'Chalkduster',
  'Jazz LET',
  'Blippo',
  'Stencil Std',
  'Marker Felt',
  'Trattatello',
  'Arnoldboecklin',
  'Oldtown',
  'Copperplate',
  'papyrus'
];

export const DataModeLocale: PairItem[] = [
  {
    key: WidgetMode.Instances.toString(),
    value: 'select.data_mode.instances'
  },
  {
    key: WidgetMode.Measures.toString(),
    value: 'select.data_mode.measures'
  },
  {
    key: WidgetMode.TimeRange.toString(),
    value: 'select.data_mode.time_range'
  }
];

export const WidgetTypeGroupsConstant = [
  {
    key: Object.keys(WidgetType).filter(f => WidgetType[f] === WidgetType.GeoMap)[0],
    groups: Object.keys(WidgetType).filter(f => WidgetType[f] === WidgetType.GeoMap)
  },
  {
    key: Object.keys(WidgetType).filter(f => WidgetType[f] === WidgetType.SolidGauge)[0],
    groups: Object.keys(WidgetType).filter(f => WidgetType[f] === WidgetType.SolidGauge ||  WidgetType[f] === WidgetType.LiquidFillGauge || WidgetType[f] === WidgetType.Billboard)
  },
  {
    key: Object.keys(WidgetType).filter(f => WidgetType[f] === WidgetType.Sankey)[0],
    groups: Object.keys(WidgetType).filter(f => WidgetType[f] === WidgetType.Sankey ||  WidgetType[f] === WidgetType.CallTimeLine)
  },
  {
    key: Object.keys(WidgetType).filter(f => WidgetType[f] === WidgetType.TrendDiff)[0],
    groups: Object.keys(WidgetType).filter(f => WidgetType[f] === WidgetType.TrendDiff)
  },
  {
    key: Object.keys(WidgetType).filter(f => WidgetType[f] === WidgetType.Sunburst)[0],
    groups: Object.keys(WidgetType).filter(f => WidgetType[f] === WidgetType.Sunburst)
  },
  {
    key: Object.keys(WidgetType).filter(f => WidgetType[f] === WidgetType.Bubble)[0],
    groups: Object.keys(WidgetType).filter(f => WidgetType[f] === WidgetType.Bubble)
  },
  {
    key: Object.keys(WidgetType).filter(f => WidgetType[f] === WidgetType.Tabular)[0],
    groups: Object.keys(WidgetType).filter(f => WidgetType[f] === WidgetType.Tabular)
  }
];

export const Single_M_Single_D_Widget = [WidgetType.TrendDiff, WidgetType.Billboard, WidgetType.SolidGauge.toString().replace(' ', '')];
export const Multi_M_Multi_D_Widget = [WidgetType.Bar, WidgetType.Line, WidgetType.Tabular, WidgetType.Sankey];
export const Single_M_Multi_D_Widget = [WidgetType.GeoMap.toString().replace(' ', ''), WidgetType.Sunburst];
