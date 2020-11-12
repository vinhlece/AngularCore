import * as _ from 'lodash';
import {RealTimeDataProcessor} from '..';
import {DataSet, RealtimeData} from '../../models';
import {propertiesGrouperFn} from '../grouper/grouper';
import {Interceptor} from './index';
import {KpiThresholds, TimeInterval, Widget} from '../../../widgets/models/index';
import {WidgetType} from '../../../widgets/constants/widget-types';
import {ColorStyle} from '../../models/enum';

export abstract class Filter implements Interceptor {
  realTimeDataProcessor: RealTimeDataProcessor;

  constructor(realTimeDataProcessor: RealTimeDataProcessor) {
    this.realTimeDataProcessor = realTimeDataProcessor;
  }

  intercept(data: DataSet): DataSet {
    throw new Error('Not implemented.');
  }
}

/**
 * Filter records which have instance and measure defined in instances and measures list.
 */

export class KeyMeasureFilter extends Filter {
  private _instances: string[];
  private _measures: string[];
  private _dataType: string;
  private _widget: Widget;
  private _windows: string[];

  constructor(dataType: string, instances: any, measures: string[], windows: string[],
              realtimeDataProcessor: RealTimeDataProcessor, widget: Widget = null) {
    super(realtimeDataProcessor);
    this._instances = instances;
    this._measures = measures;
    this._dataType = dataType;
    this._widget = widget;
    this._windows = windows;
  }

  intercept(data: DataSet): DataSet {
    return this._widget && this._widget.type === WidgetType.Sankey ?
      this.realTimeDataProcessor.filterDataByIdentifyInstances(data, this._dataType, this._instances, this._measures) :
     this.realTimeDataProcessor.filterDataByInstancesAndMeasures(data, this._dataType, this._instances, this._measures, this._windows);
  }
}

export class MeasureFilter extends Filter {
  private _measures: string[];
  private _windows: string[];
  private _dataType: string;

  constructor(dataType: string, measures: string[], windows: string[], realtimeDataProcessor: RealTimeDataProcessor) {
    super(realtimeDataProcessor);
    this._measures = measures;
    this._dataType = dataType;
    this._windows = windows;
  }

  intercept(data: DataSet): DataSet {
    return this.realTimeDataProcessor.filterDataByMeasures(data, this._dataType, this._measures, this._windows);
  }
}

export class InstanceFormatFilter extends Filter {
  private _instanceFormat: RegExp;
  private _dataType: string;

  constructor(dataType: string, instanceFormat: RegExp, realtimeDataProcessor: RealTimeDataProcessor) {
    super(realtimeDataProcessor);
    this._instanceFormat = instanceFormat;
    this._dataType = dataType;
  }

  intercept(data: DataSet): DataSet {
    return this.realTimeDataProcessor.filterDataByInstanceFormat(data, this._dataType, this._instanceFormat);
  }
}

/**
 * Get all records in a specified time range
 */
export class TimeRangeFilter extends Filter {
  private _timeRange: { startTimestamp: number; endTimestamp: number };

  constructor(timeRange: { startTimestamp: number, endTimestamp: number }, processor: RealTimeDataProcessor) {
    super(processor);
    this._timeRange = timeRange;
  }

  intercept(data: DataSet): DataSet {
    return this.realTimeDataProcessor.getDataInTimeRange(data, this._timeRange);
  }
}

/**
 * Get the records at latest time along with the records at previousTime for each instance-measure
 */
export class LatestPreviousFilter extends Filter {
  private _previousTimestamp: number | null;
  private _historicalTimestamp: number | null;
  protected _realTimeMode: boolean;

  constructor(previousTimestamp: number | null, historicalTimestamp: number = null,
              realTimeMode: boolean = true, processor: RealTimeDataProcessor) {
    super(processor);
    this._previousTimestamp = previousTimestamp;
    this._historicalTimestamp = historicalTimestamp;
    this._realTimeMode = realTimeMode;
  }

  intercept(data: DataSet): DataSet {
    const filteredRecords: DataSet = [];

    const groupFn = (item: RealtimeData) => propertiesGrouperFn({
      instance: item.instance,
      measureName: item.measureName,
      window: item.window
    });

    const forEachFn = (records: DataSet) => {
      const latest = this.realTimeDataProcessor.getLatestRecord(records);
      if (this._realTimeMode) {
        filteredRecords.push(latest);
      }
      if (this._historicalTimestamp && this._historicalTimestamp < latest.measureTimestamp) {
        const previousDataSet = records.find((item: RealtimeData) => item.measureTimestamp === this._historicalTimestamp);
        if (previousDataSet && this.getTimestampCondition()) {
          filteredRecords.push({...previousDataSet, group: this._realTimeMode ? ColorStyle.Dash : ColorStyle.Solid});
        }
      }
      if (this._previousTimestamp && this._previousTimestamp < latest.measureTimestamp) {
        const previousDataSet = records.filter((item: RealtimeData) => item.measureTimestamp <= this._previousTimestamp);
        if (previousDataSet.length > 0) {
          const latestPreviousRecord = this.realTimeDataProcessor.getLatestRecord(previousDataSet);
          filteredRecords.push({...latestPreviousRecord, group: ColorStyle.Slash});
        }
      }
    };

    _.chain(data).groupBy(groupFn).forEach(forEachFn).value();

    return filteredRecords;
  }

  protected getTimestampCondition(): boolean {
    return true;
  }
}

export class LatestPreviousTimestampFilter extends LatestPreviousFilter {
  protected getTimestampCondition(): boolean {
    return !this._realTimeMode;
  }
}

/**
 * Get latest record of each instance-measure group
 */
export class LatestFilter extends Filter {
  constructor(processor: RealTimeDataProcessor) {
    super(processor);
  }

  intercept(data: DataSet): DataSet {
    const filteredRecords: DataSet = [];

    const groupFn = (item: RealtimeData) => propertiesGrouperFn({
      instance: item.instance,
      measureName: item.measureName
    });

    const forEachFn = (records: DataSet) => {
      if (records.length > 0) {
        const record = this.realTimeDataProcessor.getLatestRecord(records);
        filteredRecords.push(record);
      }
    };

    _.chain(data).groupBy(groupFn).forEach(forEachFn).value();

    return filteredRecords;
  }
}

/**
 * Get latest record which has timestamp less than a specified measureTimestamp for each instance-measure group
 */
export class PreviousFilter extends Filter {
  private _previousTimestamp: number;
  private _filteredRecords: DataSet = [];

  constructor(previousTimestamp: number, processor: RealTimeDataProcessor) {
    super(processor);
    this._previousTimestamp = previousTimestamp;
  }

  intercept(data: DataSet): DataSet {
    const groupFn = (item: RealtimeData) => propertiesGrouperFn({
      instance: item.instance,
      measureName: item.measureName
    });

    const forEachFn = (records: DataSet) => {
      const previousDataSet = records.filter(item => item.measureTimestamp <= this._previousTimestamp);
      if (previousDataSet.length > 0) {
        const record = this.realTimeDataProcessor.getLatestRecord(previousDataSet);
        this._filteredRecords.push(record);
      }
    };

    _.chain(data).groupBy(groupFn).forEach(forEachFn).value();

    return this._filteredRecords;
  }
}

export class TimestampFilter extends Filter {
  private _previousTimestamp: number;
  private _filteredRecords: DataSet = [];

  constructor(previousTimestamp: number, processor: RealTimeDataProcessor) {
    super(processor);
    this._previousTimestamp = previousTimestamp;
  }

  intercept(data: DataSet): DataSet {
    const groupFn = (item: RealtimeData) => propertiesGrouperFn({
      instance: item.instance,
      measureName: item.measureName
    });

    const forEachFn = (records: DataSet) => {
      const previousDataSet = records.find(item => item.measureTimestamp === this._previousTimestamp);
      if (previousDataSet) {
        this._filteredRecords.push(previousDataSet);
      }
    };

    _.chain(data).groupBy(groupFn).forEach(forEachFn).value();

    return this._filteredRecords;
  }
}

export class AgentFilter extends Filter {
  private _agents: string[];

  constructor(agents: string[], processor: RealTimeDataProcessor) {
    super(processor);
    this._agents = agents;
  }

  intercept(data: DataSet): DataSet {
    return data.filter((record: RealtimeData) => this._agents.includes(record.agent));
  }
}

export class QueueFilter extends Filter {
  private _queues: string[];

  constructor(queues: string[], processor: RealTimeDataProcessor) {
    super(processor);
    this._queues = queues;
  }

  intercept(data: DataSet): DataSet {
    return data.filter((record: RealtimeData) => this._queues.includes(record.queue));
  }
}

export class SegmentTypeFilter extends Filter {
  private _segmentTypes: string[];

  constructor(segmentTypes: string[], processor: RealTimeDataProcessor) {
    super(processor);
    this._segmentTypes = segmentTypes;
  }

  intercept(data: DataSet): DataSet {
    return data.filter((record: RealtimeData) => this._segmentTypes.includes(record.segmentType));
  }
}

/**
 * Get all records in a specified input range (time range + interval value)
 */
export class InputRangeIntervalFilter extends Filter {
  private _timeRange: { startTimestamp: number; endTimestamp: number };
  private _interval: TimeInterval;
  private _historicalTimeStamp: number[];

  constructor(timeRange: { startTimestamp: number; endTimestamp: number },
              interval: TimeInterval, historicalTimeStamp: number[], processor: RealTimeDataProcessor) {
    super(processor);
    this._timeRange = timeRange;
    this._interval = interval;
    this._historicalTimeStamp = historicalTimeStamp;
  }

  intercept(data: DataSet): DataSet {
    return this.realTimeDataProcessor.getDataInInputRange(data, this._timeRange, this._interval, this._historicalTimeStamp);
  }
}

export class InputRangeFilter extends Filter {
  private _timeRange: { startTimestamp: number; endTimestamp: number };

  constructor(timeRange: { startTimestamp: number; endTimestamp: number }, processor: RealTimeDataProcessor) {
    super(processor);
    this._timeRange = timeRange;
  }

  intercept(data: DataSet): DataSet {
    return this.realTimeDataProcessor.getDataInTimeRange(data, this._timeRange);
  }
}

export class TrendDiffTimeFilter extends Filter {
  private _timestamps: number[];

  constructor(timestamps: number[], processor: RealTimeDataProcessor) {
    super(processor);
    this._timestamps = timestamps;
  }

  intercept(data: DataSet): DataSet {
    return this.realTimeDataProcessor.getDataTrendDiffRange(data, this._timestamps);
  }
}

export class KpiFilter extends Filter {
  private _hideKpi: KpiThresholds;

  constructor(hideKpi: KpiThresholds, processor: RealTimeDataProcessor) {
    super(processor);
    this._hideKpi = hideKpi;
  }

  intercept(data: DataSet): DataSet {
    return this.realTimeDataProcessor.getKpiData(data, this._hideKpi);
  }
}
