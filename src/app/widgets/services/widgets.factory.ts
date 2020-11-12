import {WidgetsFactory} from '.';
import {getColorScheme, getTransferenceColors} from '../../common/utils/color';
import {uuid} from '../../common/utils/uuid';
import {WidgetMode, WidgetType} from '../constants/widget-types';
import {
  BarWidget,
  BillboardWidget, BreakpointThreshold,
  CallTimeLineWidget,
  Column,
  GeoMapWidget,
  LineWidget,
  SankeyWidget,
  SolidGaugeWidget,
  TabularWidget, ThresholdColor,
  TrendDiffWidget,
  LiquidFillGaugeWidget,
  Widget,
  WidgetDimension, SunburstWidget
} from '../models';
import {BarWidgetStyle, DataDisplayType, LineChartTypes, TrendType, WidgetThresholdColor} from '../models/enums';
import {ColorPalette} from '../../common/models/index';
import {VERTICAL} from '../constants/bar-chart-types';
import {DisplayMode} from '../../dashboard/models/enums';

export class WidgetsFactoryImpl implements WidgetsFactory {
  create(options: any, colorPalette: ColorPalette): any {
    switch (options.type) {
      case WidgetType.LiquidFillGauge:
        return this.createLiquidFillGaugeWidget(options);
      case WidgetType.Bar:
        return this.createBarWidget(options);
      case WidgetType.Tabular:
        return this.createTableWidget(options);
      case WidgetType.Line:
        return this.createLineWidget(options);
      case WidgetType.TrendDiff:
        return this.createTrendDiffWidget(options);
      case WidgetType.Billboard:
        return this.createBillboardWidget(options);
      case WidgetType.SolidGauge:
        return this.createSolidGaugeWidget(options, colorPalette);
      case WidgetType.Sankey:
        return this.createSankeyWidget(options);
      case WidgetType.GeoMap:
        return this.createGeoMapWidget(options, colorPalette);
      case WidgetType.Sunburst:
        return this.createSunburstWidget(options);
      case WidgetType.CallTimeLine:
        return this.createCallTimeLineWidget(options);
      case WidgetType.Bubble:
        return this.createBubbleWidget(options);
      default:
        return options;
    }
  }

  createFromTemplate(template: Widget, widgets: Widget[]): Widget {
    const regex = new RegExp(`^${template.name}( \\(\\d+\\))?$`);
    const family = widgets
      .filter((widget: Widget) => !widget.isTemplate && regex.test(widget.name))
      .map((widget: Widget) => {
        const name = widget.name;
        const matches = regex.exec(name);
        if (matches[1]) {
          return +(matches[1].slice(2, matches[1].length - 1));
        } else {
          return 1;
        }
      })
      .sort();
    let index = 1;
    for (index; index <= family.length; index++) {
      if (family[index - 1] !== index) {
        break;
      }
    }
    return {
      ...template,
      id: uuid(),
      isTemplate: false,
      name: index > 1 ? `${template.name} (${index})` : template.name
    };
  }

  private createBlankWidget(options: any): Widget {
    return {...options, id: this.createId(), dimensions: [], windows: [], measures: []};
  }

  private createBubbleWidget(options: any): Widget {
    return this.createBlankWidget(options);
  }

  private createBarWidget(options: any): BarWidget {
    return {...this.createBlankWidget(options), mode: {value: WidgetMode.Instances, timeGroup: null}};
  }

  private createTableWidget(options: any): TabularWidget {
    return {...this.createBlankWidget(options), columns: []};
  }

  private createLineWidget(options: any): LineWidget {
    return {...this.createBlankWidget(options)};
  }

  private createTrendDiffWidget(options: any): TrendDiffWidget {
    return {...this.createBlankWidget(options), chartType: LineChartTypes.Line};
  }

  private createBillboardWidget(options: any): BillboardWidget {
    return this.createBlankWidget(options);
  }

  private createLiquidFillGaugeWidget(options: any): LiquidFillGaugeWidget {
    return this.createBlankWidget(options);
  }

  private createSolidGaugeWidget(options: any, colorPalette: ColorPalette = null): SolidGaugeWidget {
    const thresholdColor = createThresholdColor(colorPalette);
    if (thresholdColor) {
      options.gaugeThreshold = thresholdColor;
    }
    return this.createBlankWidget(options);
  }

  private createSunburstWidget(options: any): SunburstWidget {
    return {...this.createBlankWidget(options), displayMode: DisplayMode.Latest};
  }

  private createSankeyWidget(options: any): SankeyWidget {
    return this.createBlankWidget(options);
  }

  private createGeoMapWidget(options: any, colorPalette: ColorPalette = null): GeoMapWidget {
    const parentStateColor = colorPalette ? colorPalette.colors[0] : getTransferenceColors()[0];
    const capitalColor = colorPalette && colorPalette.colors ? colorPalette.colors[1] :
      getColorScheme()[getColorScheme().length - 1].primary;
    const stateColor = {parentStateColor, capitalColor};
    return {...this.createBlankWidget(options), stateColor, displayMode: DisplayMode.Latest};
  }

  private createCallTimeLineWidget(options: any): CallTimeLineWidget {
    return {...this.createBlankWidget(options),
      agents: [],
      queues: [],
      segmentTypes: []
    };
  }

  private createId(): string {
    return uuid();
  }
}

export function createThresholdColor(colorPalette: ColorPalette): BreakpointThreshold {
  if (!colorPalette || !colorPalette.threshold) {
    return null;
  }

  const defaultColor: ThresholdColor = {
    value: '',
    autoInvokeUrl: false
  };
  const threshold: BreakpointThreshold = {
    breakpoints: Array.from(Array(4)),
    colors: Array.from(Array(3))
  };
  threshold.colors[0] = colorPalette.threshold[0] ? { ...defaultColor, value: colorPalette.threshold[0] } : defaultColor;
  threshold.colors[1] = colorPalette.threshold[1] ? { ...defaultColor, value: colorPalette.threshold[1] } : defaultColor;
  threshold.colors[2] = colorPalette.threshold[2] ? { ...defaultColor, value: colorPalette.threshold[2] } : defaultColor;
  return threshold;
}

export function createTimelineWidget(dataType: string, measure: string, instance: string, dimension: string): LineWidget {
  return {
    name: instance + ' and ' + measure,
    type: WidgetType.Line,
    defaultSize: {rows: 3, columns: 3},
    dataType,
    chartType: LineChartTypes.Area,
    enableNavigator: false,
    xAxisLabel: 'x label',
    yAxisLabel: 'y label',
    dimensions: [{dimension: dimension, systemInstances: [instance], customInstances: []}],
    windows: [],
    measures: [measure]
  };
}

export function createBillboardWidget(dataType: string, measure: string, instance: string, dimension: string, window: string): BillboardWidget {
const windows = window === '' ? [] : [window];
return {
    name: instance + ' and ' + measure,
    type: WidgetType.Billboard,
    defaultSize: {rows: 3, columns: 3},
    dataType,
    thresholdColor: {
      greater: WidgetThresholdColor.Green,
      lesser: WidgetThresholdColor.Red,
    },
    dimensions: [{dimension: dimension, systemInstances: [instance], customInstances: []}],
    windows: windows,
    measures: [measure],
  };
}

export function createLiquidFillGaugeWidget(widget: LiquidFillGaugeWidget, measure: string, instance: string, dimension: string, window: string): LiquidFillGaugeWidget {
  const windows = window === '' ? [] : [window];
  return {
    name: instance + ' and ' + measure,
    type: WidgetType.LiquidFillGauge,
    defaultSize: {rows: 3, columns: 3},
    dataType: widget.dataType,
    instances: [instance],
    measures: [measure],
    dimensions: [{dimension: dimension, systemInstances: [instance], customInstances: []}],
    windows: windows,
    minValue: widget.minValue,
    maxValue: widget.maxValue,
    circleThickness: widget.circleThickness,
    circleFillGap: widget.circleFillGap,
    circleColor: widget.circleColor,
    waveHeight: widget.waveHeight,
    waveCount: widget.waveCount,
    waveRiseTime: widget.waveRiseTime,
    waveAnimateTime: widget.waveAnimateTime,
    waveRise: widget.waveRise,
    waveHeightScaling: widget.waveHeightScaling,
    waveAnimate: widget.waveAnimate,
    waveColor: widget.waveColor,
    waveOffset: widget.waveOffset,
    textVertPosition: widget.textVertPosition,
    textSize: widget.textSize,
    valueCountUp: widget.valueCountUp,
    displayPercent: widget.displayPercent,
    textColor: widget.textColor,
    waveTextColor: widget.waveTextColor,
  };
}

export function createTableWidget(dataType: string,
                                  measures: string[],
                                  dimensions: WidgetDimension[],
                                  widgetName: string,
                                  window: string): TabularWidget {
  const windows = window === '' ? [] : [window];
  return {
    name: `${widgetName} Table`,
    type: WidgetType.Tabular,
    defaultSize: {rows: 3, columns: 3},
    dataType,
    dimensions: dimensions,
    windows: windows,
    measures: measures,
    columns: generateTabularColumnsFromMeasures(measures),
    displayData: DataDisplayType.ShowInterval,
  };
}

function generateTabularColumnsFromMeasures(measures: string[]): Column[] {
  const instanceColumn = {
    id: 'Key', title: 'Instance', type: 'string', visibility: true
    , group: {enable: false, priority: null}, aggFunc: null
  };
  const dateTimeColumn = {
    id: 'MeasureTimestamp', title: 'Package Datetime', type: 'datetime', visibility: true
    , group: {enable: false, priority: null}, aggFunc: null
  };
  const measureColumns = measures.map((measure: string) => ({
    id: measure,
    title: measure,
    type: 'string',
    visibility: true,
    group: {enable: false, priority: null},
    aggFunc: null
  }));
  return [
    instanceColumn,
    dateTimeColumn,
    ...measureColumns
  ];
}

export function createDayTrendDiffWidget(input: any): TrendDiffWidget {
  return {
    userId: input.userId,
    name: 'Day Trend Diff',
    dataType: input.dataType,
    defaultSize: input.defaultSize,
    type: WidgetType.TrendDiff,
    chartType: LineChartTypes.Area,
    xAxisLabel: 'Time',
    yAxisLabel: 'Value',
    dimensions: input.dimensions,
    measures: [input.measure],
    trendType: TrendType.Day,
    period: 1,
  };
}

export function createShiftTrendDiffWidget(input: any): TrendDiffWidget {
  return {
    userId: input.userId,
    name: 'Shift Trend Diff',
    dataType: input.dataType,
    defaultSize: input.defaultSize,
    type: WidgetType.TrendDiff,
    chartType: LineChartTypes.Area,
    xAxisLabel: 'Time',
    yAxisLabel: 'Value',
    dimensions: input.dimensions,
    measures: [input.measure],
    trendType: TrendType.Shift,
    period: 8,
  };
}

export function createWeekTrendDiffWidget(input: any): TrendDiffWidget {
  return {
    userId: input.userId,
    name: 'Week Trend Diff',
    dataType: input.dataType,
    defaultSize: input.defaultSize,
    type: WidgetType.TrendDiff,
    chartType: LineChartTypes.Area,
    xAxisLabel: 'Time',
    yAxisLabel: 'Value',
    dimensions: [],
    measures: [],
    trendType: TrendType.Day,
    period: 7,
  };
}

