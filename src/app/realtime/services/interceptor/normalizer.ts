import * as _ from 'lodash';
import {Interceptor} from '.';
import {RealTimeDataProcessor} from '..';
import {TimeRangeInterval} from '../../../dashboard/models';
import {getMomentByTimestamp, TimeUtilsImpl} from '../../../common/services/timeUtils';
import {DataSet, RealtimeData} from '../../models';
import {AppDateTimeFormat} from '../../../common/models/enums';

/**
 * Make real time data distributing in the same time scale specified by a time interval
 *
 *           z'         duration      h'                       k'
 *           |-----x-------y--z-------|----------g-h-----------|----jk--------|
 * roundedOldestTimestamp   nextRoundedTimestamp      nextRoundedTimestamp
 *
 * We have 3 group: (x, y, z), (g, h), (j, k). After filter to get latest record of each group, we got z', h' and k'
 *
 * roundedOldestTimestamp is rounded by type of time range (minute, hour, month,..), eg:
 *  - minute: 10:00:39 -> 10:00:00
 *  - hour: 10:23:12 -> 10:00:00
 *  - month: 20/04/2018 10:23:23 -> 01/04/2018 00:00:00
 */
export class TimestampNormalizer implements Interceptor {
  private _processor: RealTimeDataProcessor;
  private _timeUtils = new TimeUtilsImpl();
  private _interval: TimeRangeInterval;
  private _roundedOldestTimestamp: number;
  private _duration: number;
  private _timestamps: number[];

  constructor(processor: RealTimeDataProcessor, interval: TimeRangeInterval, timestamps: number[] = null) {
    this._processor = processor;
    this._interval = interval;
    this._timestamps = timestamps;
    this.calculateDuration();
  }

  intercept(data: DataSet): DataSet {
    if (data.length === 0) {
      return [];
    }

    this.roundOldestTimestamp(data);

    // All records have same key, measureName and position will be in the same group
    const groupFn = (record: RealtimeData) => {
      const position = this.calculatePosition(record);
      const measureName = record.measureName;
      const key = record.instance;
      return [key, measureName, record.window, position, record.group];
    };

    const latestMapperFn = (records: DataSet) => {
      const current = this._processor.getLatestRecord(records);
      return {
        current,
        timestamps: _.intersectionWith(records, this._timestamps, (record, timestamp) => record.measureTimestamp === timestamp)
          .filter(value => value.measureTimestamp !== current.measureTimestamp)
      };
    } ;

    const roundTimestampMapperFn = (record: any) => {
      const position = this.calculatePosition(record.current);

      const roundedTimestamp = this._roundedOldestTimestamp + this._duration * position;
      return [{
        ...record.current,
        measureTimestamp: roundedTimestamp
      }, ...record.timestamps];
    };

    const arrays = _.chain(data).groupBy(groupFn).map(latestMapperFn).map(roundTimestampMapperFn).value();
    return arrays.reduce(function(acc, value) {
      return acc.concat(value);
    }, []);
  }

  private calculateDuration() {
    const {value, type} = this._interval;
    this._duration = this._timeUtils.duration(value, type);
  }

  private calculatePosition(record: RealtimeData): number {
    const timestamp = record.measureTimestamp;
    return Math.floor((timestamp - this._roundedOldestTimestamp) / this._duration);
  }

  private roundOldestTimestamp(data: DataSet) {
    const oldestRecord = this._processor.getOldestRecord(data);
    const oldestTimestamp = oldestRecord.measureTimestamp;
    this._roundedOldestTimestamp = this._timeUtils.startOf(oldestTimestamp, this._interval.type);
  }
}
