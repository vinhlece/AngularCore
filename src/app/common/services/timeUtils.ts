import {Injectable} from '@angular/core';
import * as moment from 'moment';
import {isNullOrUndefined} from 'util';
import {TimeRangeType} from '../../dashboard/models/enums';
import {AppDateTimeFormat} from '../models/enums';
import {DateTime, TimeUtils} from '.';
import {TimeGroupBy} from '../../widgets/models/enums';

export const getMomentByTimestamp = (timestamp) => {
  return moment.utc(timestamp);
};

export const getMomentByLocaleTimestamp = (timestamp, locale) => {
  return moment.utc(timestamp).locale(locale);
};

export const getLocalMomentByTimestamp = (timestamp) => {
  return moment(timestamp);
};

export const getCurrentMoment = () => {
  return moment.utc();
};

export const getMomentByDate = (date: string, format: string = AppDateTimeFormat.date) => {
  return moment.utc(date, format);
};

export const getDateByLocalMoment = (date: string, format: string = AppDateTimeFormat.yyyyMMddDate) => {
  return moment(date).format(format);
};

export const getDateByMoment = (date: string, format: string = AppDateTimeFormat.yyyyMMddDate) => {
  return moment.utc(date).format(format);
};

export const getMomentByDateTime = (dataTime: string) => {
  return moment.utc(dataTime, AppDateTimeFormat.dateTime);
};

export const getMomentByString = (dataTime: string) => {
  return moment.utc(dataTime);
};

export const getFullMomentByString = (dataTime: string, format: string = AppDateTimeFormat.dateTime) => {
  return moment.utc(dataTime, format, true);
};

export const convertUTCMomentToLocal = (dataTime) => {
  return moment(dataTime);
};

@Injectable()
export class TimeUtilsImpl implements TimeUtils {
  getCurrentTimestamp(): number {
    return +moment.utc();
  }

  getTimestampOfDay(date: string, format: string = AppDateTimeFormat.date): number {
    return +moment.utc(date, format);
  }

  getTimestampByDate(dateTime: DateTime): number {
    const day = isNullOrUndefined(dateTime.day) ? 1 : dateTime.day;
    const month = isNullOrUndefined(dateTime.month) ? 1 : dateTime.month;
    const year = isNullOrUndefined(dateTime.year) ? 1970 : dateTime.year;
    const hour = isNullOrUndefined(dateTime.hour) ? 0 : dateTime.hour;
    const minute = isNullOrUndefined(dateTime.minute) ? 0 : dateTime.minute;
    const second = isNullOrUndefined(dateTime.second) ? 0 : dateTime.second;

    const strDate = `${day}/${month}/${year}, ${hour}:${minute}:${second}`;
    return +moment.utc(strDate, AppDateTimeFormat.dateTime);
  }

  add(timestamp: number, value: number, type: string): number {
    return +getMomentByTimestamp(timestamp).add(value, type as moment.unitOfTime.DurationConstructor);
  }

  subtract(timestamp: number, value: number, type: string): number {
    return +getMomentByTimestamp(timestamp).subtract(value, type as moment.unitOfTime.DurationConstructor);
  }

  startOf(timestamp: number, type: TimeRangeType): number {
    return +getMomentByTimestamp(timestamp).startOf(type);
  }

  duration(value: number, type: TimeRangeType): number {
    const endTimestamp = this.getCurrentTimestamp();
    const startTimestamp = this.subtract(endTimestamp, value, type);
    return endTimestamp - startTimestamp;
  }

  getTimeRange(type: string, range: {startTimeRange?: number, endTimeRange?: number}): {startTimestamp?: number, endTimestamp?: number} {
    let startTimestamp = null;
    let endTimestamp = null;
    const endMainTimeRange = range && range.endTimeRange ? range.endTimeRange : +getCurrentMoment().endOf('day');
    switch (type) {
      case TimeGroupBy.Today:
        endTimestamp = +getMomentByTimestamp(endMainTimeRange);
        startTimestamp = +getMomentByTimestamp(endTimestamp).startOf('day');
        break;
      case TimeGroupBy.Yesterday:
        endTimestamp = +getMomentByTimestamp(endMainTimeRange).subtract(1, 'days').endOf('day');
        startTimestamp = +getMomentByTimestamp(endTimestamp).startOf('day');
        break;
      case TimeGroupBy.Last24Hours:
        endTimestamp = +getMomentByTimestamp(endMainTimeRange);
        startTimestamp = +getMomentByTimestamp(endTimestamp).subtract(24, 'hours');
        break;
      case TimeGroupBy.Last7Days:
        endTimestamp = +getMomentByTimestamp(endMainTimeRange);
        startTimestamp = +getMomentByTimestamp(endTimestamp).subtract(7, 'days');
        break;
      case TimeGroupBy.Last30Days:
        endTimestamp = +getMomentByTimestamp(endMainTimeRange);
        startTimestamp = +getMomentByTimestamp(endTimestamp).subtract(30, 'days');
        break;
      case TimeGroupBy.ThisMonth:
        endTimestamp = +getMomentByTimestamp(endMainTimeRange);
        startTimestamp = +getMomentByTimestamp(endTimestamp).startOf('month').startOf('day');
        break;
      case TimeGroupBy.CustomRange:
        if (!range || !range.startTimeRange || !range.endTimeRange) {
          return {startTimestamp, endTimestamp};
        }
        const {startTimeRange, endTimeRange} = range;
        startTimestamp = +getMomentByTimestamp(startTimeRange).startOf('day');
        endTimestamp = +getMomentByTimestamp(endTimeRange).endOf('day');
        break;
      default:
        return null;
    }
    return {startTimestamp, endTimestamp};
  }
}
