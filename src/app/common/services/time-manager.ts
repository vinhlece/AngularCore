import {Inject, Injectable} from '@angular/core';
import {TimeManager, TimeUtils} from '.';
import {TimeRange, TimeRangeInterval, TimeRangeSetting} from '../../dashboard/models';
import {TimeRangeType} from '../../dashboard/models/enums';
import {Segment} from '../../realtime/models';
import {TIME_RANGE_SETTINGS_TOKEN, TIME_UTILS} from './tokens';

// TODO Is this root scope service??
// Yes, When you provide the service at the root level.
// Angular creates a single, shared instance of service and injects it into any class that asks for it.
@Injectable({providedIn: 'root'})
export class TimeManagerImpl implements TimeManager {
  private _timeUtils: TimeUtils;
  private _settings: TimeRangeSetting[];

  constructor(@Inject(TIME_UTILS) timeUtils: TimeUtils, @Inject(TIME_RANGE_SETTINGS_TOKEN) settings: TimeRangeSetting[]) {
    this._timeUtils = timeUtils;
    this._settings = settings;
  }

  normalizeTimeRange(timeRange: TimeRange): TimeRange {
    if (!timeRange) {
      return null;
    }
    const segment = this.getSegment(timeRange);
    const startTimestamp = this.normalizeTimestamp(timeRange.startTimestamp, segment);
    const endTimestamp = this.normalizeTimestamp(timeRange.endTimestamp, segment);
    return {startTimestamp, endTimestamp};
  }

  normalizeTimestamp(timestamp: number, segment: Segment): number {
    const value = segment.dataPointInterval.value;
    if (value === 1) {
      return this.normalizeUnitInterval(timestamp, segment);
    } else {
      return this.normalizeMultiInterval(timestamp, segment);
    }
  }

  getDataPointInterval(duration: number): TimeRangeInterval {
    for (const settings of this._settings) {
      if (duration <= this._timeUtils.duration(settings.interval.value, settings.interval.type)) {
        return settings.dataPointInterval.value;
      }
    }
  }

  updateTimeRangeSettings(setting: TimeRangeSetting): void {
    const idx = this._settings.findIndex((item: TimeRangeSetting) => {
      return item.interval.value === setting.interval.value && item.interval.type === setting.interval.type;
    });
    this._settings[idx].dataPointInterval.value = setting.dataPointInterval.value;
  }

  private getSegment(timeRange: TimeRange): Segment {
    return timeRange ? {
      timeRange,
      dataPointInterval: this.getDataPointInterval(timeRange.endTimestamp - timeRange.startTimestamp)
    } : null;
  }

  private normalizeUnitInterval(timestamp: number, segment: Segment): number {
    const type = segment.dataPointInterval.type;
    const lowerBound = this._timeUtils.startOf(timestamp, type);
    const upperBound = this._timeUtils.startOf(this._timeUtils.add(timestamp, 1, type), type);
    return timestamp === lowerBound ? lowerBound : upperBound;
  }

  private normalizeMultiInterval(timestamp: number, segment: Segment): number {
    const {value, type} = segment.dataPointInterval;
    const startTimestamp = this._timeUtils.startOf(timestamp, this.getParentTimeRangeType(type));
    const pointIntervalDuration = this._timeUtils.duration(value, type);
    const step = Math.floor((timestamp - startTimestamp) / pointIntervalDuration);
    const lowerBound = startTimestamp + step * pointIntervalDuration;
    const upperBound = startTimestamp + (step + 1) * pointIntervalDuration;
    return timestamp === lowerBound ? lowerBound : upperBound;
  }

  private getParentTimeRangeType(type: TimeRangeType): TimeRangeType {
    switch (type) {
      case TimeRangeType.Second:
        return TimeRangeType.Minute;
      case TimeRangeType.Minute:
        return TimeRangeType.Hour;
      case TimeRangeType.Hour:
        return TimeRangeType.Day;
      case TimeRangeType.Day:
        return TimeRangeType.Month;
      case TimeRangeType.Month:
        return TimeRangeType.Week;
    }
  }
}
