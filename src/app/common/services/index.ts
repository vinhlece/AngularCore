import {TimeRange, TimeRangeInterval, TimeRangeSetting} from '../../dashboard/models';
import {TimeRangeType} from '../../dashboard/models/enums';
import {Segment} from '../../realtime/models';

export interface DateTime {
  day?: number;
  month?: number;
  year?: number;
  hour?: number;
  minute?: number;
  second?: number;
}

export interface TimeUtils {
  getCurrentTimestamp(): number;

  getTimestampByDate(date: DateTime): number;

  getTimestampOfDay(date: string, format: string): number;

  add(timestamp: number, value: number, type: string): number;

  subtract(timestamp: number, value: number, type: string): number;

  startOf(timestamp: number, type: TimeRangeType): number;

  duration(value: number, type: TimeRangeType): number;

  getTimeRange(type: string, range: {startTimeRange?: number, endTimeRange?: number}): {startTimestamp?: number, endTimestamp?: number};
}

export interface TimeManager {
  normalizeTimeRange(timeRange: TimeRange): TimeRange;

  normalizeTimestamp(timestamp: number, segment: Segment): number;

  getDataPointInterval(duration: number): TimeRangeInterval;

  updateTimeRangeSettings(timeRangeSettings: TimeRangeSetting): void;
}
