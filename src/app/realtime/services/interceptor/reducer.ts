import {Interceptor} from '.';
import {RealTimeDataProcessor} from '..';
import {TimeRange, TimeRangeInterval} from '../../../dashboard/models';
import {TimeRangeType} from '../../../dashboard/models/enums';
import {DataSet} from '../../models';
import {TimestampNormalizer} from './normalizer';

export class SegmentReducer implements Interceptor {
  private _processor: RealTimeDataProcessor;
  private _segments: TimeRange[];
  private _threshold: number;

  constructor(processor: RealTimeDataProcessor, breakpoints: number[], threshold: number = 100) {
    this._processor = processor;
    this._threshold = threshold;

    const reducer = (accumulator, currentBreakpoint, idx) => {
      if (idx < breakpoints.length - 1) {
        accumulator.push({
          startTimestamp: currentBreakpoint,
          endTimestamp: breakpoints[idx + 1]
        });
      }
      return accumulator;
    };
    this._segments = breakpoints.reduce(reducer, []);
  }

  intercept(data: DataSet): DataSet {
    const reducer = (accumulator, currentSegment) => {
      const segmentData = this._processor.getDataInTimeRange(data, currentSegment);
      return [
        ...accumulator,
        ...this.reduce(segmentData, currentSegment, this._threshold)
      ];
    };
    return this._segments.reduce(reducer, []);
  }

  private reduce(data: DataSet, segment: TimeRange, numberOfPoints: number): DataSet {
    const segmentDuration = segment.endTimestamp - segment.startTimestamp;
    const stepInMinute = Math.floor(segmentDuration / numberOfPoints / 1000 / 60);
    const stepInterval: TimeRangeInterval = {value: stepInMinute, type: TimeRangeType.Minute};
    const timestampNormalizer = new TimestampNormalizer(this._processor, stepInterval);
    return timestampNormalizer.intercept(data);
  }
}
