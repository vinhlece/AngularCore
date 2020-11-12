import {Measure, Package} from '../../../measures/models';
import {WidgetMode, WidgetType} from '../../../widgets/constants/widget-types';
import {
  BarWidget,
  BillboardWidget, CallTimeLineWidget,
  GeoMapWidget,
  LineWidget,
  SankeyWidget,
  SolidGaugeWidget,
  SunburstWidget,
  TabularWidget,
  TrendDiffWidget,
  Widget,
  WidgetSize
} from '../../../widgets/models';
import * as db from './db.json';
import {DbSchema} from './dbSchema';

export function mockWidget(): Widget {
  return mockWidgets()[0];
}

export function mockWidgetList(length: number): Widget[] {
  const widgets = [];
  for (let i = 0; i < length; i++) {
    if (i % 3 === 0) {
      widgets.push(mockTabularWidget({name: 'Tabular' + i}));
    } else {
      widgets.push(mockBarWidget({name: 'Bar' + i}));
    }
  }
  return widgets;
}

export function mockBarWidget(barWidgetInfo: any = {}): BarWidget {
  return {
    id: '10',
    name: barWidgetInfo.name || 'Calls by Agents',
    type: barWidgetInfo.type || 'Bar',
    dataType: barWidgetInfo.dataType || 'Queue Performance',
    defaultSize: barWidgetInfo.defaultSize || mockWidgetSize(),
    chartType: barWidgetInfo.chartType || mockBarChartTypes()[0],
    measures: barWidgetInfo.measures || ['CallsAbandoned'],
    dimensions: barWidgetInfo.dimensions || [{dimension: 'Instance', systemInstances: ['New Sale'], customInstances: []}],
    xAxisLabel: barWidgetInfo.xAxisLabel || 'Agent',
    yAxisLabel: barWidgetInfo.yAxisLabel || 'Value',
    mode: barWidgetInfo.mode || WidgetMode.Measures,
    timestamps: [],
    chartStyle: barWidgetInfo.chartStyle || 'Normal'
  };
}

export function mockTabularWidget(tabularWidgetInfo: any = {}): TabularWidget {
  const tabularWidget = mockWidgets().find(item => item.type === WidgetType.Tabular);
  return {...tabularWidget, ...tabularWidgetInfo};
}

export function mockLineWidget(options: any = {}): LineWidget {
  return mockWidgets().find((widget: Widget) => widget.type === WidgetType.Line) as LineWidget;
}

export function mockGeoMapWidget(options: any = {}): GeoMapWidget {
  return mockWidgets().find((widget: Widget) => widget.type === WidgetType.GeoMap) as GeoMapWidget;
}

export function mockSankeyWidget(options: any = {}): SankeyWidget {
  return mockWidgets().find((widget: Widget) => widget.type === WidgetType.Sankey) as SankeyWidget;
}

export function mockSolidGaugeWidget(): SolidGaugeWidget {
  return mockWidgets().find(widget => widget.type === WidgetType.SolidGauge) as SolidGaugeWidget;
}

export function mockSunburstWidget(): SunburstWidget {
  return mockWidgets().find(widget => widget.type === WidgetType.Sunburst) as SunburstWidget;
}

export function mockCallTimeLineWidget(): CallTimeLineWidget {
  return mockWidgets().find(widget => widget.type === WidgetType.CallTimeLine) as CallTimeLineWidget;
}

export function mockBillboardWidget(options: any = {}): BillboardWidget {
  return mockWidgets().find(widget => widget.type === WidgetType.Billboard) as BillboardWidget;
}

export const mockTrendDiffLineWidget = (): TrendDiffWidget => {
  return mockWidgets().find(item => item.type === WidgetType.TrendDiff) as TrendDiffWidget;
};

export function mockWidgetSize(rows?: number, columns?: number): WidgetSize {
  return {
    rows: rows || 1,
    columns: columns || 1
  };
}

export function mockWidgetTypes(): string[] {
  return ['Table', 'Bar', 'Pie'];
}

export function mockBarChartTypes(): string[] {
  return ['Vertical', 'Vertical stacked', 'Horizontal', 'Horizontal stacked'];
}

export function mockLineChartTypes(): string[] {
  return ['Line Chart', 'Line With Focus Chart'];
}

export function mockDataTypes(): string[] {
  return ['Queue Status', 'Queue Performance'];
}

export function mockMeasureNames(stream: string, dataType: string): string[] {
  if (stream === 'Queue') {
    if (dataType === 'Queue Performance') {
      return ['ContactsAnswered', 'ContactsAbandoned'];
    } else if (dataType === 'Queue Status') {
      return ['Avaiable', 'NotReady'];
    } else {
      return [];
    }
  } else if (stream === 'Agent') {
    return [];
  } else {
    return [];
  }
}

export function mockPackagesMeasures(stream: string, dataType: string): Package {
  if (stream === 'Queue') {
    if (dataType === 'Queue Performance') {
      return {
        name: 'Queue Performance',
        kafkaQueue: 'queue_perf',
        measures: [
          mockMeasure({
            name: 'ContactsOffered',
            relatedMeasures: [mockMeasure({name: 'ContactsAnswered'}),
              mockMeasure({name: 'ContactsAbandoned'})]
          })
        ]
      };
    } else if (dataType === 'Queue Status') {
      return {
        name: 'Queue Performance',
        kafkaQueue: 'queue_status',
        measures: [
          mockMeasure({name: 'Available'}), mockMeasure({name: 'NotReady'})]
      };
    } else {
      return null;
    }
  } else if (stream === 'Agent') {
    return {
      name: 'Agent',
      kafkaQueue: 'agent',
      measures: [
        mockMeasure({name: 'CallsAnswered'}), mockMeasure({name: 'CallsAbandoned'})]
    };
  } else {
    return null;
  }
}

export function mockMeasure(measureInfor: any = {}): Measure {
  return {
    name: measureInfor.name || 'ContactsAnswered',
    relatedMeasures: measureInfor.relatedMeasures || []
  };
}

export function mockWidgets(): Widget[] {
  return (db as DbSchema).widgets;
}

export function mockPackages(): Package[] {
  return (db as DbSchema).packages.map(item => {
    const i = {...item};
    delete i.package;
    i.dimensions = item.package;
    return i;
  });
}
