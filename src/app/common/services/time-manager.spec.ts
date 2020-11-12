import {TimeManager, TimeUtils} from '.';
import {TimeRangeType} from '../../dashboard/models/enums';
import {Segment} from '../../realtime/models';
import {TIME_RANGE_SETTINGS} from '../models/constants';
import {TimeManagerImpl} from './time-manager';
import {TimeUtilsImpl} from './timeUtils';

describe('TimeManager', () => {
  let timeUtils: TimeUtils;
  let timeManager: TimeManager;

  beforeEach(() => {
    timeUtils = new TimeUtilsImpl();
    timeManager = new TimeManagerImpl(timeUtils, TIME_RANGE_SETTINGS);
  });

  describe('normalizeTimestamp', () => {
    describe('1 minute', () => {
      it('should normalize to nearest end', () => {
        const timestamp = timeUtils.getTimestampByDate({minute: 3, second: 23});
        const segment: Segment = {dataPointInterval: {value: 1, type: TimeRangeType.Minute}};
        const result = timeManager.normalizeTimestamp(timestamp, segment);
        const expected = timeUtils.getTimestampByDate({minute: 4, second: 0});
        expect(result).toEqual(expected);
      });

      it('should not normalize if timestamp already in normalized form', () => {
        const timestamp = timeUtils.getTimestampByDate({minute: 3, second: 0});
        const segment: Segment = {dataPointInterval: {value: 1, type: TimeRangeType.Minute}};
        const result = timeManager.normalizeTimestamp(timestamp, segment);
        const expected = timeUtils.getTimestampByDate({minute: 3, second: 0});
        expect(result).toEqual(expected);
      });
    });

    describe('1 hour', () => {
      it('should normalize to nearest end', () => {
        const timestamp = timeUtils.getTimestampByDate({hour: 2, minute: 3, second: 23});
        const segment: Segment = {dataPointInterval: {value: 1, type: TimeRangeType.Hour}};
        const result = timeManager.normalizeTimestamp(timestamp, segment);
        const expected = timeUtils.getTimestampByDate({hour: 3, minute: 0, second: 0});
        expect(result).toEqual(expected);
      });

      it('should not normalize if timestamp already in normalized form', () => {
        const timestamp = timeUtils.getTimestampByDate({hour: 2, minute: 0, second: 0});
        const segment: Segment = {dataPointInterval: {value: 1, type: TimeRangeType.Hour}};
        const result = timeManager.normalizeTimestamp(timestamp, segment);
        const expected = timeUtils.getTimestampByDate({hour: 2, minute: 0, second: 0});
        expect(result).toEqual(expected);
      });
    });

    describe('1 month', () => {
      it('should normalize to nearest end', () => {
        const timestamp = timeUtils.getTimestampByDate({month: 3, hour: 2});
        const segment: Segment = {dataPointInterval: {value: 1, type: TimeRangeType.Month}};
        const result = timeManager.normalizeTimestamp(timestamp, segment);
        const expected = timeUtils.getTimestampByDate({month: 4, hour: 0});
        expect(result).toEqual(expected);
      });

      it('should not normalize if timestamp already in normalized form', () => {
        const timestamp = timeUtils.getTimestampByDate({month: 3});
        const segment: Segment = {dataPointInterval: {value: 1, type: TimeRangeType.Month}};
        const result = timeManager.normalizeTimestamp(timestamp, segment);
        const expected = timeUtils.getTimestampByDate({month: 3});
        expect(result).toEqual(expected);
      });
    });

    describe('1 year', () => {
      it('should normalize to nearest end', () => {
        const timestamp = timeUtils.getTimestampByDate({year: 2017, month: 2});
        const segment: Segment = {dataPointInterval: {value: 1, type: TimeRangeType.Year}};
        const result = timeManager.normalizeTimestamp(timestamp, segment);
        const expected = timeUtils.getTimestampByDate({year: 2018, month: 1});
        expect(result).toEqual(expected);
      });

      it('should not normalize if timestamp already in normalized form', () => {
        const timestamp = timeUtils.getTimestampByDate({year: 2018});
        const segment: Segment = {dataPointInterval: {value: 1, type: TimeRangeType.Year}};
        const result = timeManager.normalizeTimestamp(timestamp, segment);
        const expected = timeUtils.getTimestampByDate({year: 2018});
        expect(result).toEqual(expected);
      });
    });

    describe('15 minutes', () => {
      it('should normalize to nearest end', () => {
        let timestamp = timeUtils.getTimestampByDate({minute: 3, second: 23});
        let segment: Segment = {dataPointInterval: {value: 15, type: TimeRangeType.Minute}};
        let result = timeManager.normalizeTimestamp(timestamp, segment);
        let expected = timeUtils.getTimestampByDate({minute: 15, second: 0});
        expect(result).toEqual(expected);

        timestamp = timeUtils.getTimestampByDate({minute: 15, second: 23});
        segment = {dataPointInterval: {value: 15, type: TimeRangeType.Minute}};
        result = timeManager.normalizeTimestamp(timestamp, segment);
        expected = timeUtils.getTimestampByDate({minute: 30, second: 0});
        expect(result).toEqual(expected);

        timestamp = timeUtils.getTimestampByDate({minute: 39, second: 12});
        segment = {dataPointInterval: {value: 15, type: TimeRangeType.Minute}};
        result = timeManager.normalizeTimestamp(timestamp, segment);
        expected = timeUtils.getTimestampByDate({minute: 45, second: 0});
        expect(result).toEqual(expected);
      });

      it('should not normalize if timestamp already in normalized form', () => {
        let timestamp = timeUtils.getTimestampByDate({minute: 15, second: 0});
        let segment: Segment = {dataPointInterval: {value: 15, type: TimeRangeType.Minute}};
        let result = timeManager.normalizeTimestamp(timestamp, segment);
        let expected = timeUtils.getTimestampByDate({minute: 15, second: 0});
        expect(result).toEqual(expected);

        timestamp = timeUtils.getTimestampByDate({minute: 0, second: 0});
        segment = {dataPointInterval: {value: 15, type: TimeRangeType.Minute}};
        result = timeManager.normalizeTimestamp(timestamp, segment);
        expected = timeUtils.getTimestampByDate({minute: 0, second: 0});
        expect(result).toEqual(expected);

        timestamp = timeUtils.getTimestampByDate({minute: 30, second: 0});
        segment = {dataPointInterval: {value: 15, type: TimeRangeType.Minute}};
        result = timeManager.normalizeTimestamp(timestamp, segment);
        expected = timeUtils.getTimestampByDate({minute: 30, second: 0});
        expect(result).toEqual(expected);
      });
    });

    describe('6 hours', () => {
      it('should normalize to nearest end', () => {
        let timestamp = timeUtils.getTimestampByDate({hour: 3, minute: 3, second: 23});
        let segment: Segment = {dataPointInterval: {value: 6, type: TimeRangeType.Hour}};
        let result = timeManager.normalizeTimestamp(timestamp, segment);
        let expected = timeUtils.getTimestampByDate({hour: 6, minute: 0, second: 0});
        expect(result).toEqual(expected);

        timestamp = timeUtils.getTimestampByDate({hour: 6, minute: 3, second: 23});
        segment = {dataPointInterval: {value: 6, type: TimeRangeType.Hour}};
        result = timeManager.normalizeTimestamp(timestamp, segment);
        expected = timeUtils.getTimestampByDate({hour: 12, minute: 0, second: 0});
        expect(result).toEqual(expected);

        timestamp = timeUtils.getTimestampByDate({hour: 14, minute: 3, second: 23});
        segment = {dataPointInterval: {value: 6, type: TimeRangeType.Hour}};
        result = timeManager.normalizeTimestamp(timestamp, segment);
        expected = timeUtils.getTimestampByDate({hour: 18, minute: 0, second: 0});
        expect(result).toEqual(expected);
      });

      it('should not normalize if timestamp already in normalized form', () => {
        let timestamp = timeUtils.getTimestampByDate({hour: 6, minute: 0, second: 0});
        let segment: Segment = {dataPointInterval: {value: 6, type: TimeRangeType.Hour}};
        let result = timeManager.normalizeTimestamp(timestamp, segment);
        let expected = timeUtils.getTimestampByDate({hour: 6, minute: 0, second: 0});
        expect(result).toEqual(expected);

        timestamp = timeUtils.getTimestampByDate({hour: 0, minute: 0, second: 0});
        segment = {dataPointInterval: {value: 6, type: TimeRangeType.Hour}};
        result = timeManager.normalizeTimestamp(timestamp, segment);
        expected = timeUtils.getTimestampByDate({hour: 0, minute: 0, second: 0});
        expect(result).toEqual(expected);

        timestamp = timeUtils.getTimestampByDate({hour: 12, minute: 0, second: 0});
        segment = {dataPointInterval: {value: 6, type: TimeRangeType.Hour}};
        result = timeManager.normalizeTimestamp(timestamp, segment);
        expected = timeUtils.getTimestampByDate({hour: 12, minute: 0, second: 0});
        expect(result).toEqual(expected);
      });
    });
  });
});
