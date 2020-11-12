import {getMomentByDate, TimeUtilsImpl} from './timeUtils';
import {TimeGroupBy} from '../../widgets/models/enums';
import {AppDateTimeFormat} from '../models/enums';

describe('TimeUtilsImpl', () => {

  describe('TimeUtilsImpl.getTimeRange', () => {
    let service;
    const current = +getMomentByDate('02/02/2019 12:12:12', AppDateTimeFormat.dateTimePicker);
    const fullDateTimeFormat = 'DD/MM/YYYY HH:mm:ss:SSS';

    beforeEach(() => {
      service = new TimeUtilsImpl();
    });

    it('should return valid time range with type is TODAY', () => {
      const timeRange = {
        startTimeRange: 0,
        endTimeRange: current
      };
      const result = service.getTimeRange(TimeGroupBy.Today, timeRange);
      const startDay = +getMomentByDate('02/02/2019 00:00:00', AppDateTimeFormat.dateTimePicker);
      const expected = {
        startTimestamp: startDay,
        endTimestamp: current
      };
      expect(result).toEqual(expected);
    });

    it('should return valid time range with type is YESTERDAY', () => {
      const timeRange = {
        startTimeRange: 0,
        endTimeRange: current
      };
      const result = service.getTimeRange(TimeGroupBy.Yesterday, timeRange);
      const startYesterday = +getMomentByDate('01/02/2019 00:00:00', AppDateTimeFormat.dateTimePicker);
      const endYesterday = +getMomentByDate('01/02/2019 23:59:59:999', fullDateTimeFormat);
      const expected = {
        startTimestamp: startYesterday,
        endTimestamp: endYesterday
      };
      expect(result).toEqual(expected);
    });

    it('should return valid time range with type is LAST24HOURS', () => {
      const timeRange = {
        startTimeRange: 0,
        endTimeRange: current
      };
      const result = service.getTimeRange(TimeGroupBy.Last24Hours, timeRange);
      const expected = {
        startTimestamp: +getMomentByDate('01/02/2019 12:12:12', AppDateTimeFormat.dateTimePicker),
        endTimestamp: current
      };
      expect(result).toEqual(expected);
    });

    it('should return valid time range with type is LAST7DAYS', () => {
      const timeRange = {
        startTimeRange: 0,
        endTimeRange: current
      };
      const result = service.getTimeRange(TimeGroupBy.Last7Days, timeRange);
      const expected = {
        startTimestamp: +getMomentByDate('26/01/2019 12:12:12', AppDateTimeFormat.dateTimePicker),
        endTimestamp: current
      };
      expect(result).toEqual(expected);
    });

    it('should return valid time range with type is LAST30DAYS', () => {
      const timeRange = {
        startTimeRange: 0,
        endTimeRange: current
      };
      const result = service.getTimeRange(TimeGroupBy.Last30Days, timeRange);
      const expected = {
        startTimestamp: +getMomentByDate('03/01/2019 12:12:12', AppDateTimeFormat.dateTimePicker),
        endTimestamp: current
      };
      expect(result).toEqual(expected);
    });

    it('should return valid time range with type is THISMONTH', () => {
      const timeRange = {
        startTimeRange: 0,
        endTimeRange: current
      };
      const result = service.getTimeRange(TimeGroupBy.ThisMonth, timeRange);
      const expected = {
        startTimestamp: +getMomentByDate('01/02/2019 00:00:00', AppDateTimeFormat.dateTimePicker),
        endTimestamp: current
      };
      expect(result).toEqual(expected);
    });

    it('should return valid time range with type is CUSTOMRANGE', () => {
      const timeRange = {
        startTimeRange: +getMomentByDate('11/11/2018 05:23:59', AppDateTimeFormat.dateTimePicker),
        endTimeRange: +getMomentByDate('02/02/2019 12:12:12', AppDateTimeFormat.dateTimePicker)
      };
      const result = service.getTimeRange(TimeGroupBy.CustomRange, timeRange);
      const expected = {
        startTimestamp: +getMomentByDate('11/11/2018 00:00:00', AppDateTimeFormat.dateTimePicker),
        endTimestamp: +getMomentByDate('02/02/2019 23:59:59:999', fullDateTimeFormat)
      };
      expect(result).toEqual(expected);
    });
  });
});
