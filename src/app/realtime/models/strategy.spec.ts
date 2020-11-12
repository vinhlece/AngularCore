import {RealtimeData} from '.';
import {TIME_RANGE_SETTINGS} from '../../common/models/constants';
import {TimeUtils} from '../../common/services';
import {TimeManagerImpl} from '../../common/services/time-manager';
import {TimeUtilsImpl} from '../../common/services/timeUtils';
import {TimeRange} from '../../dashboard/models';
import {NormalizeStrategy} from './strategy';

describe('process strategy', () => {
  let timeUtils: TimeUtils;
  let timeManager: any;

  beforeEach(() => {
    timeUtils = new TimeUtilsImpl();
    timeManager = new TimeManagerImpl(timeUtils, TIME_RANGE_SETTINGS);
  });

  it('should normalize data in zoom segment', () => {
    const record: RealtimeData = {
      instance: 'instance 1',
      measureName: 'measure 1',
      measureTimestamp: timeUtils.getTimestampByDate({day: 3, minute: 5, second: 12}),
      measureValue: 2
    };
    const mainTimeRange: TimeRange = {
      startTimestamp: timeUtils.getTimestampByDate({day: 1}),
      endTimestamp: timeUtils.getTimestampByDate({day: 6})
    };
    const zoomTimeRange: TimeRange = {
      startTimestamp: timeUtils.getTimestampByDate({day: 2}),
      endTimestamp: timeUtils.getTimestampByDate({day: 4})
    };
    const strategy = new NormalizeStrategy(timeManager, mainTimeRange, zoomTimeRange);
    const result = strategy.process(record);
    const expected: RealtimeData = {
      instance: 'instance 1',
      measureName: 'measure 1',
      measureTimestamp: timeUtils.getTimestampByDate({day: 3, minute: 10, second: 0}),
      measureValue: 2
    };
    expect(result).toEqual(expected);
  });

  it('should normalize data in main segment', () => {
    const record: RealtimeData = {
      instance: 'instance 1',
      measureName: 'measure 1',
      measureTimestamp: timeUtils.getTimestampByDate({month: 2, day: 3, hour: 12, minute: 5, second: 12}),
      measureValue: 2
    };
    const mainTimeRange: TimeRange = {
      startTimestamp: timeUtils.getTimestampByDate({month: 2, day: 1}),
      endTimestamp: timeUtils.getTimestampByDate({month: 2, day: 10})
    };
    const zoomTimeRange: TimeRange = {
      startTimestamp: timeUtils.getTimestampByDate({month: 2, day: 5}),
      endTimestamp: timeUtils.getTimestampByDate({month: 2, day: 6})
    };
    const strategy = new NormalizeStrategy(timeManager, mainTimeRange, zoomTimeRange);
    const result = strategy.process(record);
    const expected: RealtimeData = {
      instance: 'instance 1',
      measureName: 'measure 1',
      measureTimestamp: timeUtils.getTimestampByDate({month: 2, day: 3, hour: 12, minute: 10, second: 0}),
      measureValue: 2
    };
    expect(result).toEqual(expected);
  });

  it('should return null if record not in main time range', () => {
    const record: RealtimeData = {
      instance: 'instance 1',
      measureName: 'measure 1',
      measureTimestamp: timeUtils.getTimestampByDate({day: 7, minute: 5, second: 12}),
      measureValue: 2
    };
    const mainTimeRange: TimeRange = {
      startTimestamp: timeUtils.getTimestampByDate({day: 1}),
      endTimestamp: timeUtils.getTimestampByDate({day: 6})
    };
    const zoomTimeRange: TimeRange = {
      startTimestamp: timeUtils.getTimestampByDate({day: 2}),
      endTimestamp: timeUtils.getTimestampByDate({day: 4})
    };
    const strategy = new NormalizeStrategy(timeManager, mainTimeRange, zoomTimeRange);
    const result = strategy.process(record);
    expect(result).not.toBeNull();
  });
});
