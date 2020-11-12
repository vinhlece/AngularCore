import * as _ from 'lodash';
import * as moment from 'moment';
import {Observable, of} from 'rxjs';
import {TimeRange, TimeRangeInterval} from '../../../../src/app/dashboard/models';
import {TimeRangeType} from '../../../../src/app/dashboard/models/enums';
import {RealtimeData, Segment, StartOptions} from '../../../../src/app/realtime/models';
import {SampleDataGenerator} from '../../../../src/app/realtime/services/fake/sample-data-generator';
import {getCurrentMoment} from '../../../../src/app/common/services/timeUtils';
import getTopic from '../utils/get-topic';
import {MeasureFilter, WebSocketSubscription} from '../../../../src/app/realtime/models/web-socket/widget-container';
import {isNumber} from 'util';

export class DataCache {
  private static _instance: DataCache;

  private _rangeByTopics = {};
  get rangeByTopics(): any {
    return this._rangeByTopics;
  }
  protected _generator: SampleDataGenerator;

  static getInstance(generator: SampleDataGenerator): DataCache {
    if (!this._instance) {
      this._instance = new DataCache(generator);
    }
    return this._instance;
  }

  protected constructor(generator: SampleDataGenerator) {
    this._generator = generator;
  }

  getDataOfTopic(topic: string): Observable<RealtimeData[]> {
    const options = this._rangeByTopics[topic];
    if (!options) {
      return of([]);
    }

    const {packageName, segments, measureFilters} = options;

    const segment = this.getNextSegment(segments);
    const predictiveRange: TimeRangeInterval = {
      value: 8,
      type: TimeRangeType.Hour
    };
    const predictiveSegment = this.getRealTimeSegment(segments, predictiveRange);
    return segment ? this.generateHistoricalData(packageName, segment, predictiveSegment, measureFilters) :
      this.generateRealTimeData(packageName, predictiveSegment, measureFilters);
  }

  addOptions(options: StartOptions) {
    Object.keys(this._rangeByTopics).forEach(topic => {
      const currentSegments = this._rangeByTopics[topic] ? this._rangeByTopics[topic].segments : [];
      const startTimestamp = this.prettifyTimestamp(options.startDate);
      const endTimestamp = this.prettifyTimestamp(options.endDate);
      if ((endTimestamp - startTimestamp) === this._rangeByTopics[topic].intervals) {
        return;
      }
      const segments = this.split({startTimestamp, endTimestamp});
      const newSegments = _.differenceWith(segments, currentSegments, (a: Segment, b: Segment) => (
        _.isEqual(a.timeRange, b.timeRange) && _.isEqual(a.dataPointInterval, b.dataPointInterval)
      ));
      this._rangeByTopics[topic] = {
        packageName: this._rangeByTopics[topic].packageName,
        segments: [...newSegments, ...currentSegments],
        intervals: endTimestamp - startTimestamp,
        measureFilters: this._rangeByTopics[topic].measureFilters
      };
    });
  }

  addSubscriptions(subscription: WebSocketSubscription) {
    const topic = getTopic(subscription.packageName);
    if (!this._rangeByTopics[topic]) {
      this._rangeByTopics[topic] = {
        packageName: subscription.packageName,
        segments: [],
        intervals: 0,
        measureFilters: subscription.measureFilters
      };
    } else {
      this._rangeByTopics[topic].measureFilters = subscription.measureFilters;
    }
  }

  deleteCacheData() {
    this._rangeByTopics = {};
  }

  private generateHistoricalData(packageName: string, segment: Segment, predictiveSegment: Segment, measureFilters: MeasureFilter[]): Observable<RealtimeData[]> {
    let data = of([]);
    if (segment) {
      data = this._generator.getDataForPackage(packageName, segment, predictiveSegment, measureFilters);
      segment.dirty = false;
    }
    return data;
  }

  public generateRealTimeData(packageName: string, predictiveSegment: Segment, measureFilters: MeasureFilter[]): Observable<RealtimeData[]> {
    const data = this._generator.getDataForPackage(packageName, predictiveSegment, null, measureFilters);
    predictiveSegment.dirty = false;
    return data;
  }

  private getRealTimeSegment(segments: Segment[], options?: TimeRangeInterval): Segment {
    const predictive20MRange: TimeRangeInterval = {
      value: 1,
      type: TimeRangeType.Minute
    };
    const startTimestamp = +moment.utc();
    let endTimestamp = +moment.utc(startTimestamp).add(1, 'minutes');
    let dataPointInterval: TimeRangeInterval;
    const lastSegment = segments && segments.length > 0 ? segments[segments.length - 1] : null;
    if (lastSegment && (lastSegment.timeRange.endTimestamp - lastSegment.timeRange.startTimestamp) <= this.getTenMinutesDuration()) {
      dataPointInterval = {value: 1, type: TimeRangeType.Second};
      if (options) {
        endTimestamp = +moment.utc(startTimestamp).add(25, TimeRangeType.Second);
      }
    } else if (lastSegment && (lastSegment.timeRange.endTimestamp - lastSegment.timeRange.startTimestamp) <= this.getTwentyMinutesDuration()) {
      dataPointInterval = {value: 3, type: TimeRangeType.Second};
      if (options) {
        endTimestamp = +moment.utc(startTimestamp).add(predictive20MRange.value, predictive20MRange.type);
      }
    } else {
      dataPointInterval = {value: 1, type: TimeRangeType.Minute};
      if (options) {
        endTimestamp = +moment.utc(startTimestamp).add(options.value, options.type);
      }
    }
    return {
      timeRange: {startTimestamp, endTimestamp},
      dirty: true,
      dataPointInterval
    };
  }

  private split(timeRange: TimeRange): Segment[] {
    const tenMinutesDuration = this.getTenMinutesDuration();
    const twentyMinutesDuration = this.getTwentyMinutesDuration();
    const oneHourDuration = this.getOneHourDuration();
    const threeDaysDuration = this.getThreeDaysDuration();
    const oneDaysDuration = this.getOneDaysDuration();
    const oneWeekDuration = this.getOneWeekDuration();
    const oneMonthDuration = this.getOneMonthDuration();
    const oneYearDuration = this.getOneYearDuration();

    const duration = timeRange.endTimestamp - timeRange.startTimestamp;
    if (duration <= tenMinutesDuration) {
      return this.splitNano(timeRange);
    } else if (duration <= twentyMinutesDuration) {
      return this.splitMicro(timeRange);
    } else if (duration <= oneHourDuration) {
      return this.splitMini(timeRange);
    } else if (duration <= oneDaysDuration) {
      return this.splitSmallTiny(timeRange);
    } else if (duration <= threeDaysDuration) {
      return this.splitTiny(timeRange);
    } else if (duration <= oneWeekDuration) {
      return this.splitLargeTiny(timeRange);
    } else if (duration <= oneMonthDuration) {
      return this.splitSmall(timeRange);
    } else if (duration <= oneYearDuration) {
      return this.splitMedium(timeRange);
    } else {
      return this.splitLarge(timeRange);
    }
  }

  private splitNano(timeRange: TimeRange): Segment[] {
    const splitInterval: TimeRangeInterval = {value: 25, type: TimeRangeType.Second};
    const dataPointInterval: TimeRangeInterval = {value: 1, type: TimeRangeType.Second};
    return this.splitInternal(timeRange, splitInterval, dataPointInterval);
  }

  private splitMicro(timeRange: TimeRange): Segment[] {
    const splitInterval: TimeRangeInterval = {value: 1.5, type: TimeRangeType.Minute};
    const dataPointInterval: TimeRangeInterval = {value: 3, type: TimeRangeType.Second};
    return this.splitInternal(timeRange, splitInterval, dataPointInterval);
  }

  private splitMini(timeRange: TimeRange): Segment[] {
    const splitInterval: TimeRangeInterval = {value: 30, type: TimeRangeType.Minute};
    const dataPointInterval: TimeRangeInterval = {value: 1, type: TimeRangeType.Minute};
    return this.splitInternal(timeRange, splitInterval, dataPointInterval);
  }

  private splitSmallTiny(timeRange: TimeRange): Segment[] {
    const splitInterval: TimeRangeInterval = {value: 1, type: TimeRangeType.Hour};
    const dataPointInterval: TimeRangeInterval = {value: 5, type: TimeRangeType.Minute};
    return this.splitInternal(timeRange, splitInterval, dataPointInterval);
  }

  private splitTiny(timeRange: TimeRange): Segment[] {
    const splitInterval: TimeRangeInterval = {value: 2, type: TimeRangeType.Hour};
    const dataPointInterval: TimeRangeInterval = {value: 10, type: TimeRangeType.Minute};
    return this.splitInternal(timeRange, splitInterval, dataPointInterval);
  }

  private splitLargeTiny(timeRange: TimeRange): Segment[] {
    const splitInterval: TimeRangeInterval = {value: 2, type: TimeRangeType.Hour};
    const dataPointInterval: TimeRangeInterval = {value: 15, type: TimeRangeType.Minute};
    return this.splitInternal(timeRange, splitInterval, dataPointInterval);
  }

  private splitSmall(timeRange: TimeRange): Segment[] {
    const splitInterval: TimeRangeInterval = {value: 1, type: TimeRangeType.Day};
    const dataPointInterval: TimeRangeInterval = {value: 1, type: TimeRangeType.Hour};
    return this.splitInternal(timeRange, splitInterval, dataPointInterval);
  }

  private splitMedium(timeRange: TimeRange): Segment[] {
    const splitInterval: TimeRangeInterval = {value: 3, type: TimeRangeType.Day};
    const dataPointInterval: TimeRangeInterval = {value: 6, type: TimeRangeType.Hour};
    return this.splitInternal(timeRange, splitInterval, dataPointInterval);
  }

  private splitLarge(timeRange: TimeRange): Segment[] {
    const splitInterval: TimeRangeInterval = {value: 15, type: TimeRangeType.Day};
    const dataPointInterval: TimeRangeInterval = {value: 1, type: TimeRangeType.Day};
    return this.splitInternal(timeRange, splitInterval, dataPointInterval);
  }

  private splitInternal(timeRange: TimeRange, splitInterval: TimeRangeInterval, dataPointInterval: TimeRangeInterval): Segment[] {
    const segments: Segment[] = [];
    const {value, type} = splitInterval;

    let startTimestamp = timeRange.startTimestamp;
    let endTimestamp = +moment.utc(startTimestamp).add(value, type);
    while (endTimestamp < timeRange.endTimestamp) {
      segments.push({
        timeRange: {startTimestamp, endTimestamp},
        dirty: true,
        dataPointInterval
      });
      startTimestamp = endTimestamp;
      endTimestamp = +moment.utc(startTimestamp).add(value, type);
    }

    segments.push({
      timeRange: {startTimestamp, endTimestamp: timeRange.endTimestamp},
      dirty: true,
      dataPointInterval
    });

    return segments;
  }

  private getNextSegment(segments: Segment[]): Segment {
    return segments.find((segment: Segment) => segment.dirty);
  }

  private getOneHourDuration(): number {
    return this.getDuration(1, 'hours');
  }

  private getTenMinutesDuration(): number {
    return this.getDuration(10, 'minutes');
  }

  private getTwentyMinutesDuration(): number {
    return this.getDuration(20, 'minutes');
  }

  private getThreeDaysDuration(): number {
    return this.getDuration(3, 'days');
  }

  private getOneDaysDuration(): number {
    return this.getDuration(1, 'days');
  }

  private getOneMonthDuration(): number {
    return this.getDuration(1, 'months');
  }

  private getOneWeekDuration(): number {
    return this.getDuration(1, 'weeks');
  }

  private getOneYearDuration(): number {
    return this.getDuration(1, 'years');
  }

  private getDuration(value: number, unit): number {
    const end = getCurrentMoment();
    const start = end.clone().subtract(value, unit);
    return this.duration(start, end);
  }

  private duration(start, end): number {
    return +moment.duration(end.diff(start));
  }

  private prettifyTimestamp(timestamp: number): number {
    return +moment.utc(timestamp).add('1', 'minutes');
  }
}

export class PolicyGroupCache extends DataCache {
  static _policyInstance: PolicyGroupCache;

  static getPolicyInstance(generator: SampleDataGenerator): PolicyGroupCache {
    if (!this._policyInstance) {
      this._policyInstance = new PolicyGroupCache(generator);
    }
    return this._policyInstance;
  }

  public addUpdate(policyGroupId: string, body: any) {
    this.rangeByTopics[policyGroupId] = body;
  }

  public get(policyGroupId: string): any {
    return this.rangeByTopics[policyGroupId];
  }

  public generateData(policyGroupId: string): any[] {
    const body = this.get(policyGroupId);
    if (!body) {
      return [];
    }
    const triggers = () => [
      this.randomData('GREATER', 140),
      this.randomData('LESS', -140)
    ];
    return body.map(item => ({...item, triggers: triggers()}));
  }

  private randomData(triggerType: string, delta: number) {
    const value = this._generator.generateMeasureValue({name: '', format: 'number'});
    return {
      keyPath: 'value',
      triggerType,
      value: isNumber(value) ? value + delta : value
    };
  }
}
