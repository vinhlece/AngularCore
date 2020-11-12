import * as _ from 'lodash';
import { RealTimeDataProcessor } from '..';
import { getMomentByTimestamp, TimeUtilsImpl } from '../../../common/services/timeUtils';
import { getChartColors, getColorScheme } from '../../../common/utils/color';
import { TimeRangeType } from '../../../dashboard/models/enums';
import { WidgetMode } from '../../../widgets/constants/widget-types';
import { CallTimeLineWidget, Column, TabularWidget } from '../../../widgets/models';
import { DataDisplayType } from '../../../widgets/models/enums';
import { DataSet, GroupKey, RealtimeData, USState } from '../../models';
import { INSTANCE, MEASURE_NAME, MEASURE_TIMESTAMP, US_STATES } from '../../models/constants';
import { formatMeasureValue } from '../../utils/formatter';
import { PropertyEvaluator } from '../converters';
import { SeriesColorEvaluator } from './color';
import { ColorPalette, InstanceColor } from '../../../common/models/index';
import { isNullOrUndefined } from 'util';
import { Agent, Queue, Region } from '../../../common/models/constants';
import { Key } from '../../../widgets/models/constants';
import { getInstanceColor } from '../../../common/utils/function';
import { addThousandSeparator } from '../../../common/utils/function';
import { AppDateTimeFormat } from '../../../common/models/enums';

export class DayTrendDiffSeriesPointsEvaluator implements PropertyEvaluator<any> {
  evaluate(data: DataSet, key: GroupKey): any {
    return data.map((item: RealtimeData) => ({
      x: item.measureTimestamp - getMomentByTimestamp(item.measureTimestamp).startOf('day').valueOf(),
      y: formatMeasureValue(item.measureValue)
    }));
  }
}

export class ShiftTrendDiffSeriesPointsEvaluator implements PropertyEvaluator<any> {
  private _period: number;

  constructor(period: number) {
    this._period = period;
  }

  evaluate(data: DataSet, key: GroupKey): any {
    const timeUtils = new TimeUtilsImpl();

    return data.map((item: RealtimeData) => {
      const startTimestamp = timeUtils.startOf(item.measureTimestamp, TimeRangeType.Day);
      const elapsed = item.measureTimestamp - startTimestamp;
      const period = timeUtils.duration(this._period, TimeRangeType.Hour);

      return {
        x: elapsed - period * Math.floor(elapsed / period),
        y: formatMeasureValue(item.measureValue)
      };
    });
  }
}

export abstract class BarSeriesPointsEvaluator implements PropertyEvaluator<any> {
  private _propertyName: string;
  private _mode: string;
  private _widget: string;

  constructor(widget) {
    this._widget = widget;
    this._mode = widget.mode.value;
    this._propertyName = this._mode === WidgetMode.Instances ? INSTANCE :
      this._mode === WidgetMode.Measures ? MEASURE_NAME : MEASURE_TIMESTAMP;
  }

  get property(): string {
    return this._propertyName;
  }

  get mode(): string {
    return this._mode;
  }

  get widget(): any {
    return this._widget;
  }

  evaluate(dataSet: DataSet, key: GroupKey): any {
    throw new TypeError('Method not implemented.');
  }
}

export class HighchartsBarSeriesPointsEvaluator extends BarSeriesPointsEvaluator {
  private _instanceColors = [];
  private _colorScheme = getColorScheme();
  private _colorIdx: number = 0;
  private _stackBy: string[] = [];

  constructor(widget) {
    super(widget);
    this._stackBy = widget.stackBy;
  }

  evaluate(dataSet: DataSet, key: GroupKey): any {
    return dataSet.map((item: RealtimeData) => {
      const data = {};
      const axixX = this.property === MEASURE_TIMESTAMP ? 'x' : 'name';
      const instance = item[this.property];
      const splitInstance = instance.split(',');

      data[axixX] = instance;
      data['tooltip'] = this.getTooltip(item);
      data['y'] = formatMeasureValue(item.measureValue);

      if (this._stackBy && this._stackBy.length && this._stackBy.length != splitInstance.length && this.mode === WidgetMode.Instances) {
        const stackInstance = this.getStackInstance(instance);
        data[axixX] = stackInstance.value;
        data['tooltip'] = stackInstance.tooltip;
        data['color'] = this.getNextInstanceColor(stackInstance.tooltip);
      }
      return data;
    });
  }

  private getStackInstance(instance) {
    const dimension = this.widget.dimensions[0].dimension.split(',');
    const stackIndex = this._stackBy.map(stack => dimension.findIndex(dim => dim === stack));
    const splitInstance = instance.split(',');
    let newInstance = stackIndex.reduce((newIns, idx) => {
      newIns.push(splitInstance[idx]);
      return newIns;
    }, []);
    newInstance = newInstance.join(',');
    let tooltip = instance.replace(newInstance, '');
    tooltip = tooltip.replace(/^\,/, '');
    tooltip = tooltip.replace(/,$/, '');

    return { value: newInstance, tooltip };
  }

  private getNextInstanceColor(instance) {
    let color = null;
    const instanceColor = getInstanceColor(instance, this._instanceColors);
    if (!instanceColor) {
      color = this.getColorByIndex().primary;
      this._instanceColors.push({ name: instance, color });
      this._colorIdx++;
    } else {
      color = instanceColor.color;
    }
    return color;
  }

  private getColorByIndex(): { primary: string, secondary: string } {
    const colors = this._colorScheme;
    const numberOfColors = colors.length;
    return colors[this._colorIdx % numberOfColors];
  }

  getTooltip(item: RealtimeData) {
    if (this.mode === WidgetMode.TimeRange) {
      return `${item.measureName} (${item.instance})`;
    }
    const timestamp = getMomentByTimestamp(item.measureTimestamp).format(AppDateTimeFormat.dateTime);
    if (this.mode === WidgetMode.Instances) {
      return `${item.measureName} - ${item.window} (${timestamp})`;
    } else if (this.mode === WidgetMode.Measures) {
      return `${item.instance} - ${item.window} (${timestamp})`;
    }
  }
}

export class LineSeriesPointsEvaluator implements PropertyEvaluator<any> {
  evaluate(dataSet: DataSet, key: GroupKey): any {
    return dataSet.map((item: RealtimeData) => ({
      x: item.measureTimestamp,
      y: formatMeasureValue(item.measureValue)
    }));
  }
}

export class BubbleSeriesPointsEvaluator implements PropertyEvaluator<any> {
  evaluate(dataSet: DataSet, key: GroupKey): any {
    return dataSet.map((item: RealtimeData) => {
      const value = formatMeasureValue(item.measureValue);
      return {
        x: item.measureTimestamp,
        y: value,
        z: value,
        name: addThousandSeparator(item.measureValue)
      };
    });
  }
}

export class TabularSeriesPointsEvaluator implements PropertyEvaluator<any> {
  private _widget: TabularWidget;

  constructor(widget: TabularWidget) {
    this._widget = widget;
  }

  evaluate(data: DataSet, key: GroupKey): any {
    const extraColumns = this._widget.columns.filter(column => column.type === 'string' && column.id !== Key);
    const initialValue = {
      Key: {
        primary: { value: data[0].instance, color: 'inherit', autoInvokeUrl: false, format: 'string' },
        secondary: null
      },
      AutoInvokeUrls: [],
      MeasureTimestamp: {
        primary: {
          value: data[0].measureTimestamp,
          color: 'inherit',
          autoInvokeUrl: false,
          format: 'datetime'
        },
        secondary: null
      },
      Id: this.getRowId(data[0]),
      Agent: {
        primary: { value: this.getFormatValue(data, extraColumns, Agent), color: 'inherit', autoInvokeUrl: false, format: 'string' },
        secondary: null
      },
      Queue: {
        primary: { value: this.getFormatValue(data, extraColumns, Queue), color: 'inherit', autoInvokeUrl: false, format: 'string' },
        secondary: null
      },
      Region: {
        primary: { value: this.getFormatValue(data, extraColumns, Region), color: 'inherit', autoInvokeUrl: false, format: 'string' },
        secondary: null
      }
    };
    if (this._widget.displayData === DataDisplayType.EndOfTimeline) {
      return _
        .chain(data)
        .groupBy(MEASURE_NAME)
        .reduce((accumulator, group: DataSet) => {
          const cellData = this.convertRecord(group[0], group.length > 1 ? group[1] : null);
          if (cellData[group[0].measureName].primary.autoInvokeUrl) {
            accumulator.AutoInvokeUrls.push({ measureName: group[0].measureName });
          }
          return {
            ...accumulator,
            ...cellData
          };
        }, initialValue)
        .value();
    } else {
      return data.reduce((accumulator, currentRecord) => {
        const cellData = this.convertRecord(currentRecord, null);
        if (cellData[currentRecord.measureName].primary.autoInvokeUrl) {
          accumulator.AutoInvokeUrls.push({ measureName: currentRecord.measureName });
        }
        return { ...accumulator, ...cellData };
      }, initialValue);
    }
  }

  private convertRecord(primaryRecord: RealtimeData, secondaryRecord: RealtimeData) {
    return {
      [primaryRecord.measureName]: {
        primary: this.convertPrimaryRecord(primaryRecord),
        secondary: secondaryRecord ? this.convertSecondaryRecord(secondaryRecord) : null
      }
    };
  }

  private getFormatValue(data: DataSet, columns: Column[], title: string) {
    if (columns.length <= 0) {
      return null;
    }
    const formatInstances = data[0].instance.trim().split(',');
    const position = columns.findIndex(column => column.id === title);
    return formatInstances[position];
  }

  private getRowId(item: any): string {
    return this._widget.displayData === DataDisplayType.ShowInterval ? `${item.measureTimestamp}_${item.instance}` : item.instance;
  }

  private convertPrimaryRecord(record: RealtimeData) {
    const value = this.getCellValue(record);
    const { color, autoInvokeUrl } = this.getPrimaryColor(record.measureName, value);
    return {
      value,
      color: color,
      autoInvokeUrl: autoInvokeUrl,
      format: this.getColumnFormat(record.measureName)
    };
  }

  private getPrimaryColor(columnName: string, value: string | number): any {
    const column = this.getColumn(columnName);
    if (!column || !column.threshold || column.type !== 'number') {
      return { color: 'inherit', autoInvokeUrl: false };
    }

    const { breakpoints, colors } = column.threshold;
    const hasBreakpoints = breakpoints && !isNullOrUndefined(breakpoints[1]) && !isNullOrUndefined(breakpoints[2]);
    const hasColors = colors && !isNullOrUndefined(colors[0]) && !isNullOrUndefined(colors[1]) && !isNullOrUndefined(colors[2]);

    if (hasBreakpoints && hasColors) {
      if (value < breakpoints[1]) {
        return {
          color: colors[0].value ? colors[0].value : 'inherit',
          autoInvokeUrl: colors[0].autoInvokeUrl ? colors[0].autoInvokeUrl : false
        };
      } else if (value >= breakpoints[2]) {
        return {
          color: colors[2].value ? colors[2].value : 'inherit',
          autoInvokeUrl: colors[2].autoInvokeUrl ? colors[2].autoInvokeUrl : false
        };
      } else {
        return {
          color: colors[1].value ? colors[1].value : 'inherit',
          autoInvokeUrl: colors[1].autoInvokeUrl ? colors[1].autoInvokeUrl : false
        };
      }
    }
    return {
      color: 'inherit',
      autoInvokeUrl: false
    };
  }

  private convertSecondaryRecord(secondaryRecord: RealtimeData) {
    return {
      value: this.getCellValue(secondaryRecord),
      color: 'black',
      format: this.getColumnFormat(secondaryRecord.measureName)
    };
  }

  private getColumnFormat(name: string): string {
    // TODO: find a way to determine column data type when column not found in widget
    const column = this.getColumn(name);
    return column ? column.type : null;
  }

  private getColumn(name: string): Column {
    return this._widget.columns.find((item: Column) => item.id === name);
  }

  private getCellValue(record: RealtimeData) {
    const column = this.getColumn(record.measureName);
    return formatMeasureValue(record.measureValue, column.type);
  }
}

export class SankeyPointEvaluator implements PropertyEvaluator<any> {
  private _processor: RealTimeDataProcessor;

  constructor(processor: RealTimeDataProcessor) {
    this._processor = processor;
  }

  evaluate(data: DataSet, key: GroupKey): any {
    return data.map((record: RealtimeData) => {
      const instance = record.instance;
      const keys = instance.split(',');
      const sankeyKeys = keys.slice(keys.length - 2);
      const [from, to] = sankeyKeys;
      const weight = formatMeasureValue(record.measureValue);
      return { from, to, weight };
    });
  }
}

export class SolidGaugeSeriesPointsEvaluator implements PropertyEvaluator<any> {
  evaluate(data: DataSet, key: GroupKey): any {
    return data.map((record: RealtimeData) => formatMeasureValue(record.measureValue));
  }
}

export class SunburstSeriesPointsEvaluator implements PropertyEvaluator<any> {
  private _colorEvaluator;
  private _instanceColors;

  constructor(colorPalette: ColorPalette, instanceColors: InstanceColor[]) {
    this._colorEvaluator = new SeriesColorEvaluator(colorPalette);
    this._instanceColors = instanceColors;
  }

  evaluate(data: DataSet, key: GroupKey): any {
    if (data.length <= 0) {
      return [];
    }
    return data.reduce((nodes, record: RealtimeData) => {
      nodes.push(...this.convert(record, nodes));
      return nodes;
    }, [this.createRootNode(data[0])]);
  }

  private convert(record: RealtimeData, nodes) {
    const nodeNames = record.instance.split(',');
    return nodeNames.reduce((acc, name: string, idx: number) => {
      if (nodes.find((item) => !this.isLeafNode(idx, nodeNames.length) && item.id === this.createParentNodeID(record, name))) {
        return acc;
      }

      const instanceColor = getInstanceColor(name, this._instanceColors);
      let color = null;
      if (this.isRootNode(idx)) {
        color = this._colorEvaluator.getNextColor();
      } else if (instanceColor) {
        color = instanceColor.color;
      } else {
        if (acc.length > 0 && getInstanceColor(acc[acc.length - 1].name, this._instanceColors)) {
          color = this._colorEvaluator.getLightenColor();
        }
      }

      acc.push({
        name,
        id: this.isLeafNode(idx, nodeNames.length) ? this.createLeafNodeID(record, name) : this.createParentNodeID(record, name),
        parent: this.isRootNode(idx) ? record.measureName : this.createParentNodeID(record, nodeNames[idx - 1]),
        value: this.isLeafNode(idx, nodeNames.length) ? formatMeasureValue(record.measureValue) : null,
        color
      });
      return acc;
    }, []);
  }

  private createRootNode(record: RealtimeData) {
    return {
      id: record.measureName,
      name: record.measureName,
      color: '#ffffff',
    };
  }

  private createLeafNodeID(record: RealtimeData, nodeName: string): string {
    return `${record.instance}$${nodeName}`;
  }

  private createParentNodeID(record: RealtimeData, nodeName: string): string {
    const nodeNames = record.instance.split(',');
    const idx = nodeNames.findIndex((name: string) => name === nodeName);
    return `${nodeNames.slice(0, idx + 1).join(',')}$${nodeName}`;
  }

  private isLeafNode(level: number, height: number): boolean {
    return level === height - 1;
  }

  private isRootNode(level: number): boolean {
    return level === 0;
  }
}

export class GeoMapSeriesPointsEvaluator implements PropertyEvaluator<any> {
  private _instanceColors;

  constructor(instanceColors: InstanceColor[]) {
    this._instanceColors = instanceColors;
  }

  evaluate(data: DataSet, key: GroupKey): any {
    return data.map((record: RealtimeData) => {
      const state = US_STATES.find((item: USState) => record.instance === `${item.parentState}-${item.capital}`);
      const instanceColor = getInstanceColor(record.instance, this._instanceColors);
      const result = { ...state, z: formatMeasureValue(record.measureValue) };
      if (instanceColor) {
        result['color'] = instanceColor.color;
      }
      return result;
    });
  }
}

export class CallTimeLinePointsEvaluator implements PropertyEvaluator<any> {
  private _widget: CallTimeLineWidget;
  private _colors = {};
  private _y = -1;
  private _palette: ColorPalette;

  constructor(widget: CallTimeLineWidget, palette: ColorPalette = null) {
    this._widget = widget;
    this._palette = palette;
    this.initColorMap();
  }

  initColorMap() {
    const COLORS = this._palette ? this._palette.colors : getChartColors();
    this._widget.segmentTypes.map((currentValue, index) => {
      this._colors[currentValue] = COLORS[index];
    });
  }

  evaluate(data: DataSet, key: GroupKey): any {

    this._y++;
    return data.map((record: RealtimeData) => {
      return {
        name: `${record.callID}-${record.agent}-${record.queue}-${record.segmentType}`,
        start: record.measureTimestamp,
        end: record.measureTimestamp + formatMeasureValue(record.measureValue),
        color: this._colors[record.segmentType],
        y: this._y,
        ...record
      };
    });
  }
}
