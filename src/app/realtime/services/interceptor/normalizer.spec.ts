import {TimeRangeInterval} from '../../../dashboard/models';
import {TimeRangeType} from '../../../dashboard/models/enums';
import {mockRealtimeData} from '../../../common/testing/mocks/realtime-data.mocks';
import {TimeUtilsImpl} from '../../../common/services/timeUtils';
import {SandBoxFormulaMeasureFactory} from '../../../measures/services/formula/formula-measure.service';
import {RealtimeData} from '../../models';
import {RealTimeDataProcessorImpl} from '../real-time-data-processor.service';
import {TimestampNormalizer} from './normalizer';

describe('TimestampNormalizer', () => {
  const processor = new RealTimeDataProcessorImpl(new SandBoxFormulaMeasureFactory());
  const timeUtils = new TimeUtilsImpl();

  it('should normalize timestamp by 1 minutes interval', () => {
    const realTimeData = mockRealtimeData();
    const data: RealtimeData[] = [
      {
        instance: 'New Sales',
        measureName: 'ContactsAnswered',
        measureValue: 18,
        measureTimestamp: timeUtils.getTimestampByDate({day: 20, month: 4, year: 2018, hour: 10, minute: 0, second: 1})
      },
      {
        instance: 'New Sales',
        measureName: 'ContactsAnswered',
        measureValue: 10,
        measureTimestamp: timeUtils.getTimestampByDate({day: 20, month: 4, year: 2018, hour: 10, minute: 0, second: 3})
      },
      {
        instance: 'New Sales',
        measureName: 'ContactsAnswered',
        measureValue: 22,
        measureTimestamp: timeUtils.getTimestampByDate({day: 20, month: 4, year: 2018, hour: 10, minute: 0, second: 49})
      }
    ];
    const expected: RealtimeData[] = [
      {
        instance: 'New Sales',
        measureName: 'ContactsAnswered',
        measureValue: 22,
        measureTimestamp: timeUtils.getTimestampByDate({day: 20, month: 4, year: 2018, hour: 10, minute: 0, second: 0})
      }
    ];
    const interval: TimeRangeInterval = {type: TimeRangeType.Minute, value: 1};
    const interceptor = new TimestampNormalizer(processor, interval);
    const result = interceptor.intercept(data);

    expect(result).toEqual(expected);
  });

  it('should normalize timestamp by 5 minutes interval', () => {
    const realTimeData = mockRealtimeData();
    const data: RealtimeData[] = [
      {
        instance: 'New Sales',
        measureName: 'ContactsAnswered',
        measureValue: 18,
        measureTimestamp: timeUtils.getTimestampByDate({day: 20, month: 4, year: 2018, hour: 10, minute: 0, second: 1})
      },
      {
        instance: 'New Sales',
        measureName: 'ContactsAnswered',
        measureValue: 10,
        measureTimestamp: timeUtils.getTimestampByDate({day: 20, month: 4, year: 2018, hour: 10, minute: 3, second: 49})
      },
      {
        instance: 'New Sales',
        measureName: 'ContactsAnswered',
        measureValue: 22,
        measureTimestamp: timeUtils.getTimestampByDate({day: 20, month: 4, year: 2018, hour: 10, minute: 4, second: 20})
      }
    ];
    const expected: RealtimeData[] = [
      {
        instance: 'New Sales',
        measureName: 'ContactsAnswered',
        measureValue: 22,
        measureTimestamp: timeUtils.getTimestampByDate({day: 20, month: 4, year: 2018, hour: 10, minute: 0, second: 0})
      }
    ];
    const interval: TimeRangeInterval = {type: TimeRangeType.Minute, value: 5};
    const interceptor = new TimestampNormalizer(processor, interval);
    const result = interceptor.intercept(data);

    expect(result).toEqual(expected);
  });

  it('should distinguish records have different key', () => {
    const realTimeData = mockRealtimeData();
    const data: RealtimeData[] = [
      {
        instance: 'New Sales',
        measureName: 'ContactsAnswered',
        measureValue: 18,
        measureTimestamp: timeUtils.getTimestampByDate({day: 20, month: 4, year: 2018, hour: 10, minute: 0, second: 1})
      },
      {
        instance: 'New Sales',
        measureName: 'ContactsAnswered',
        measureValue: 10,
        measureTimestamp: timeUtils.getTimestampByDate({day: 20, month: 4, year: 2018, hour: 10, minute: 0, second: 3})
      },
      {
        instance: 'Upgrade',
        measureName: 'ContactsAnswered',
        measureValue: 22,
        measureTimestamp: timeUtils.getTimestampByDate({day: 20, month: 4, year: 2018, hour: 10, minute: 0, second: 49})
      }
    ];
    const expected: RealtimeData[] = [
      {
        instance: 'New Sales',
        measureName: 'ContactsAnswered',
        measureValue: 10,
        measureTimestamp: timeUtils.getTimestampByDate({day: 20, month: 4, year: 2018, hour: 10, minute: 0, second: 0})
      },
      {
        instance: 'Upgrade',
        measureName: 'ContactsAnswered',
        measureValue: 22,
        measureTimestamp: timeUtils.getTimestampByDate({day: 20, month: 4, year: 2018, hour: 10, minute: 0, second: 0})
      }
    ];
    const interval: TimeRangeInterval = {type: TimeRangeType.Minute, value: 1};
    const interceptor = new TimestampNormalizer(processor, interval);
    const result = interceptor.intercept(data);

    expect(result).toEqual(expected);
  });

  it('should distinguish records have different measure', () => {
    const realTimeData = mockRealtimeData();
    const data: RealtimeData[] = [
      {
        instance: 'New Sales',
        measureName: 'ContactsAnswered',
        measureValue: 18,
        measureTimestamp: timeUtils.getTimestampByDate({day: 20, month: 4, year: 2018, hour: 10, minute: 0, second: 1})
      },
      {
        instance: 'New Sales',
        measureName: 'ContactsAnswered',
        measureValue: 10,
        measureTimestamp: timeUtils.getTimestampByDate({day: 20, month: 4, year: 2018, hour: 10, minute: 0, second: 3})
      },
      {
        instance: 'New Sales',
        measureName: 'ContactsAbandoned',
        measureValue: 22,
        measureTimestamp: timeUtils.getTimestampByDate({day: 20, month: 4, year: 2018, hour: 10, minute: 0, second: 49})
      }
    ];
    const expected: RealtimeData[] = [
      {
        instance: 'New Sales',
        measureName: 'ContactsAnswered',
        measureValue: 10,
        measureTimestamp: timeUtils.getTimestampByDate({day: 20, month: 4, year: 2018, hour: 10, minute: 0, second: 0})
      },
      {
        instance: 'New Sales',
        measureName: 'ContactsAbandoned',
        measureValue: 22,
        measureTimestamp: timeUtils.getTimestampByDate({day: 20, month: 4, year: 2018, hour: 10, minute: 0, second: 0})
      }
    ];
    const interval: TimeRangeInterval = {type: TimeRangeType.Minute, value: 1};
    const interceptor = new TimestampNormalizer(processor, interval);
    const result = interceptor.intercept(data);

    expect(result).toEqual(expected);
  });
});
