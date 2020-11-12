import {SandBoxFormulaMeasureFactory} from '../../../measures/services/formula/formula-measure.service';
import {RealtimeData} from '../../models';
import {RealTimeDataProcessorImpl} from '../real-time-data-processor.service';
import {KeyMeasureFilter, LatestPreviousFilter, MeasureFilter, TimeRangeFilter} from './filter';
import {ColorStyle} from '../../models/enum';

const realtimeData: RealtimeData[] = [
  {
    instance: 'New Sales',
    measureName: 'ContactsAnswered',
    measureTimestamp: 1515553200000,
    measureValue: 103,
    dataType: 'Queue Performance',
    dimension: 'Continent',
    window: 'INSTANTANEOUS'
  },
  {
    instance: 'Dog',
    measureName: 'ContactsAbandoned',
    measureTimestamp: 1515596400000,
    measureValue: 89,
    dataType: 'Queue Performance',
    dimension: 'Continent',
    window: 'INSTANTANEOUS'
  },
  {
    instance: 'Upgrades',
    measureName: 'ContactsOffered',
    measureTimestamp: 1515564000000,
    measureValue: 61,
    dataType: 'Queue Performance',
    dimension: 'Continent',
    window: 'INSTANTANEOUS'
  },
  {
    instance: 'New Sales',
    measureName: 'ContactsAbandoned',
    measureTimestamp: 1515600000000,
    measureValue: 53,
    dataType: 'Queue Performance',
    dimension: 'Continent',
    window: 'INSTANTANEOUS'
  },
  {
    instance: 'Cat',
    measureName: 'ContactsAnswered',
    measureTimestamp: 1517752800000,
    measureValue: 26,
    dataType: 'Queue Performance',
    dimension: 'Continent',
    window: 'INSTANTANEOUS'
  },
];

const processor = new RealTimeDataProcessorImpl(new SandBoxFormulaMeasureFactory());

describe('Filter Service', () => {
  describe('KeyMeasureFilter', () => {
    describe('#intercept', () => {
      it('with 0 key and 1 measure return empty result', () => {
        const filter = new KeyMeasureFilter('Queue Performance', [], ['ContactsAnswered'], ['INSTANTANEOUS'], processor);
        const filteredData = filter.intercept(realtimeData);
        const expectedValue = [];
        expect(filteredData).toEqual(expectedValue);
      });

      it('with 1 key and 1 measure return records of that instance with that measure', () => {
        const filter = new KeyMeasureFilter('Queue Performance', {Continent: ['New Sales']}, ['ContactsAnswered'], ['INSTANTANEOUS'], processor);
        const filteredData = filter.intercept(realtimeData);

        const expectedValue = [
          {
            instance: 'New Sales',
            measureName: 'ContactsAnswered',
            measureTimestamp: 1515553200000,
            measureValue: 103,
            dataType: 'Queue Performance',
            dimension: 'Continent',
            window: 'INSTANTANEOUS'
          },
        ];
        expect(filteredData).toEqual(expectedValue);
      });

      it('with 2 keys and 1 measure return records of those 2 instances with the measure', () => {
        const filter = new KeyMeasureFilter('Queue Performance', {Continent: ['New Sales', 'Cat']} , ['ContactsAnswered'], ['INSTANTANEOUS'], processor);
        const filteredData = filter.intercept(realtimeData);

        const expectedValue = [
          {
            instance: 'New Sales',
            measureName: 'ContactsAnswered',
            measureTimestamp: 1515553200000,
            measureValue: 103,
            dataType: 'Queue Performance',
            dimension: 'Continent',
            window: 'INSTANTANEOUS'
          },
          {
            instance: 'Cat',
            measureName: 'ContactsAnswered',
            measureTimestamp: 1517752800000,
            measureValue: 26,
            dataType: 'Queue Performance',
            dimension: 'Continent',
            window: 'INSTANTANEOUS'
          },
        ];
        expect(filteredData).toEqual(expectedValue);
      });

      it('with 1 key and 2 measures return records of that instance with 2 measures', () => {
        const filter = new KeyMeasureFilter('Queue Performance', {Continent: ['New Sales']},
          ['ContactsAnswered', 'ContactsAbandoned'], ['INSTANTANEOUS'], processor);
        const filteredData = filter.intercept(realtimeData);

        const expectedValue = [
          {
            instance: 'New Sales',
            measureName: 'ContactsAnswered',
            measureTimestamp: 1515553200000,
            measureValue: 103,
            dataType: 'Queue Performance',
            dimension: 'Continent',
            window: 'INSTANTANEOUS'
          },
          {
            instance: 'New Sales',
            measureName: 'ContactsAbandoned',
            measureTimestamp: 1515600000000,
            measureValue: 53,
            dataType: 'Queue Performance',
            dimension: 'Continent',
            window: 'INSTANTANEOUS'
          },
        ];
        expect(filteredData).toEqual(expectedValue);
      });

      it('with non-existing key and 1 measure  return empty array', () => {
        const filter = new KeyMeasureFilter('Queue Performance', {Continent: ['NonExisting']} , ['ContactsAnswered'], ['INSTANTANEOUS'], processor);
        const filteredData = filter.intercept(realtimeData);

        const expectedValue = [];
        expect(filteredData).toEqual(expectedValue);
      });

      it('with 1 key and non-existing measure return empty array', () => {
        const filter = new KeyMeasureFilter('Queue Performance', {Continent: ['New Sales']}, ['NonExisting'], ['INSTANTANEOUS'], processor);
        const filteredData = filter.intercept(realtimeData);

        const expectedValue = [];
        expect(filteredData).toEqual(expectedValue);
      });

      it('call filterDataByInstancesAndMeasures', () => {
        const mockProcessor = jasmine.createSpyObj('', ['filterDataByInstancesAndMeasures']);

        const filterWithMock = new KeyMeasureFilter('Queue Performance', {Continent: ['Instance']} , ['Measure'], ['INSTANTANEOUS'], mockProcessor);
        filterWithMock.intercept(realtimeData);

        expect(mockProcessor.filterDataByInstancesAndMeasures).toHaveBeenCalledWith(
          realtimeData,
          'Queue Performance',
          {Continent: ['Instance']},
          ['Measure'],
          ['INSTANTANEOUS']
        );
      });

      it('should return empty array when dataType is not match', () => {
        const filter = new KeyMeasureFilter('Queue Status', {Continent: ['New Sales']}, ['ContactsAnswered', 'ContactsAbandoned'],
          ['INSTANTANEOUS'], processor);
        const filteredData = filter.intercept(realtimeData);

        const expectedValue = [];
        expect(filteredData).toEqual(expectedValue);
      });
    });
  });

  describe('TimeRangeFilter', () => {
    it('#intercept call realtimeDataProcessor.getDataInTimeRange', () => {
      const spy = spyOn(processor, 'getDataInTimeRange');
      const timeRange = {startTimestamp: 0, endTimestamp: 1};
      const data = [];
      const service = new TimeRangeFilter(timeRange, processor);

      service.intercept(data);

      expect(spy).toHaveBeenCalledWith(data, timeRange);
    });
  });

  describe('LatestPreviousFilter', () => {
    describe('#filter', () => {
      it('should return latest data of each measure_instance', () => {
        const service = new LatestPreviousFilter(null, null, true, processor);
        const result = service.intercept(realtimeData);
        const expectData = [
          {
            instance: 'New Sales',
            measureName: 'ContactsAnswered',
            measureTimestamp: 1515553200000,
            measureValue: 103,
            dataType: 'Queue Performance',
            dimension: 'Continent',
            window: 'INSTANTANEOUS'
          },
          {
            instance: 'Dog',
            measureName: 'ContactsAbandoned',
            measureTimestamp: 1515596400000,
            measureValue: 89,
            dataType: 'Queue Performance',
            dimension: 'Continent',
            window: 'INSTANTANEOUS'
          },
          {
            instance: 'Upgrades',
            measureName: 'ContactsOffered',
            measureTimestamp: 1515564000000,
            measureValue: 61,
            dataType: 'Queue Performance',
            dimension: 'Continent',
            window: 'INSTANTANEOUS'
          },
          {
            instance: 'New Sales',
            measureName: 'ContactsAbandoned',
            measureTimestamp: 1515600000000,
            measureValue: 53,
            dataType: 'Queue Performance',
            dimension: 'Continent',
            window: 'INSTANTANEOUS'
          },
          {
            instance: 'Cat',
            measureName: 'ContactsAnswered',
            measureTimestamp: 1517752800000,
            measureValue: 26,
            dataType: 'Queue Performance',
            dimension: 'Continent',
            window: 'INSTANTANEOUS'
          },
        ];
        expect(result).toEqual(expectData);
      });

      it('with a previousTimestamp, should return latest data of each measure_instance and previous data', () => {
        const previousTimestamp = 1505596400000;
        const service = new LatestPreviousFilter(previousTimestamp, null, true, processor);
        const data = [
          {
            instance: 'New Sales',
            measureName: 'ContactsAnswered',
            measureTimestamp: 1515553200000,
            measureValue: 103,
            dataType: 'Queue Performance',
            dimension: 'Continent',
            window: 'INSTANTANEOUS'
          },
          {
            instance: 'Dog',
            measureName: 'ContactsAbandoned',
            measureTimestamp: 1515596400000,
            measureValue: 89,
            dataType: 'Queue Performance',
            dimension: 'Continent',
            window: 'INSTANTANEOUS'
          },
          {
            instance: 'Upgrades',
            measureName: 'ContactsOffered',
            measureTimestamp: 1515564000000,
            measureValue: 61,
            dataType: 'Queue Performance',
            dimension: 'Continent',
            window: 'INSTANTANEOUS'
          },
          {
            instance: 'New Sales',
            measureName: 'ContactsAnswered',
            measureTimestamp: 1505553200000,
            measureValue: 55,
            dataType: 'Queue Performance',
            dimension: 'Continent',
            window: 'INSTANTANEOUS'
          },
          {
            instance: 'Dog',
            measureName: 'ContactsAbandoned',
            measureTimestamp: 1505596400000,
            measureValue: 112,
            dataType: 'Queue Performance',
            dimension: 'Continent',
            window: 'INSTANTANEOUS'
          },
          {
            instance: 'Upgrades',
            measureName: 'ContactsOffered',
            measureTimestamp: 1505564000000,
            measureValue: 34,
            dataType: 'Queue Performance',
            dimension: 'Continent',
            window: 'INSTANTANEOUS'
          },
        ];
        const rs = service.intercept(data);
        const expectData = [
          {
            instance: 'New Sales',
            measureName: 'ContactsAnswered',
            measureTimestamp: 1515553200000,
            measureValue: 103,
            dataType: 'Queue Performance',
            dimension: 'Continent',
            window: 'INSTANTANEOUS'
          },
          {
            instance: 'New Sales',
            measureName: 'ContactsAnswered',
            measureTimestamp: 1505553200000,
            measureValue: 55,
            dataType: 'Queue Performance',
            group: ColorStyle.Slash,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'
          },
          {
            instance: 'Dog',
            measureName: 'ContactsAbandoned',
            measureTimestamp: 1515596400000,
            measureValue: 89,
            dataType: 'Queue Performance',
            dimension: 'Continent',
            window: 'INSTANTANEOUS'
          },
          {
            instance: 'Dog',
            measureName: 'ContactsAbandoned',
            measureTimestamp: 1505596400000,
            measureValue: 112,
            dataType: 'Queue Performance',
            group: ColorStyle.Slash,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'
          },
          {
            instance: 'Upgrades',
            measureName: 'ContactsOffered',
            measureTimestamp: 1515564000000,
            measureValue: 61,
            dataType: 'Queue Performance',
            dimension: 'Continent',
            window: 'INSTANTANEOUS'
          },
          {
            instance: 'Upgrades',
            measureName: 'ContactsOffered',
            measureTimestamp: 1505564000000,
            measureValue: 34,
            dataType: 'Queue Performance',
            group: ColorStyle.Slash,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'
          },
        ];

        expect(rs).toEqual(expectData);
      });
    });
  });

  describe('MeasureFilter', () => {
    describe('#intercept', () => {
      it('with 1 measure return records of that measure', () => {
        const filter = new MeasureFilter('Queue Performance', ['ContactsAnswered'], ['INSTANTANEOUS'], processor);
        const filteredData = filter.intercept(realtimeData);

        const expectedValue = [
          {
            instance: 'New Sales',
            measureName: 'ContactsAnswered',
            measureTimestamp: 1515553200000,
            measureValue: 103,
            dataType: 'Queue Performance',
            dimension: 'Continent',
            window: 'INSTANTANEOUS'
          },
          {
            instance: 'Cat',
            measureName: 'ContactsAnswered',
            measureTimestamp: 1517752800000,
            measureValue: 26,
            dataType: 'Queue Performance',
            dimension: 'Continent',
            window: 'INSTANTANEOUS'
          }
        ];
        expect(filteredData).toEqual(expectedValue);
      });

      it('with 2 measures return records of that instance with 2 measures', () => {
        const filter = new MeasureFilter('Queue Performance', ['ContactsAnswered', 'ContactsAbandoned'], ['INSTANTANEOUS'], processor);
        const filteredData = filter.intercept(realtimeData);

        const expectedValue = [
          {
            instance: 'New Sales',
            measureName: 'ContactsAnswered',
            measureTimestamp: 1515553200000,
            measureValue: 103,
            dataType: 'Queue Performance',
            dimension: 'Continent',
            window: 'INSTANTANEOUS'
          },
          {
            instance: 'Dog',
            measureName: 'ContactsAbandoned',
            measureTimestamp: 1515596400000,
            measureValue: 89,
            dataType: 'Queue Performance',
            dimension: 'Continent',
            window: 'INSTANTANEOUS'
          },
          {
            instance: 'New Sales',
            measureName: 'ContactsAbandoned',
            measureTimestamp: 1515600000000,
            measureValue: 53,
            dataType: 'Queue Performance',
            dimension: 'Continent',
            window: 'INSTANTANEOUS'
          },
          {
            instance: 'Cat',
            measureName: 'ContactsAnswered',
            measureTimestamp: 1517752800000,
            measureValue: 26,
            dataType: 'Queue Performance',
            dimension: 'Continent',
            window: 'INSTANTANEOUS'
          },
        ];
        expect(filteredData).toEqual(expectedValue);
      });

      it('with 1 key and non-existing measure return empty array', () => {
        const filter = new MeasureFilter('Queue Performance', ['NonExisting'], ['INSTANTANEOUS'], processor);
        const filteredData = filter.intercept(realtimeData);

        const expectedValue = [];
        expect(filteredData).toEqual(expectedValue);
      });

      it('call filterDataByMeasures', () => {
        const mockRealtimeDataProcessor = jasmine.createSpyObj('', ['filterDataByMeasures']);

        const filterWithMock = new MeasureFilter('Queue Performance', ['Measure'], ['INSTANTANEOUS'], mockRealtimeDataProcessor);
        filterWithMock.intercept(realtimeData);

        expect(mockRealtimeDataProcessor.filterDataByMeasures).toHaveBeenCalledWith(realtimeData, 'Queue Performance', ['Measure'], ['INSTANTANEOUS']);
      });

      it('should return empty array when dataType is not match', () => {
        const filter = new MeasureFilter('Queue Status', ['ContactsAnswered'], ['INSTANTANEOUS'], processor);
        const filteredData = filter.intercept(realtimeData);

        const expectedValue = [];
        expect(filteredData).toEqual(expectedValue);
      });
    });
  });
});
