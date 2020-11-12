import {SandBoxFormulaMeasureFactory} from '../../../measures/services/formula/formula-measure.service';
import {RealtimeData} from '../../models';
import {RealTimeDataProcessorImpl} from '../real-time-data-processor.service';
import {getGroupKey} from './grouper.spec';
import {InstanceMeasureGrouper, InstanceTimestampGrouper, MeasureTimestampGrouper} from './pair';

describe('Pair Grouper', () => {
  const processor = new RealTimeDataProcessorImpl(new SandBoxFormulaMeasureFactory());

  describe('MeasureTimestampGrouper', () => {
    it('2 measures single timestamp - should return 2 lists', () => {
      const grouper = new MeasureTimestampGrouper(processor);
      const data: RealtimeData[] = [
        {instance: 'New Sales', measureName: 'ContactsAnswered', measureTimestamp: 10, measureValue: 1,
          dimension: 'Continent',
          window: 'INSTANTANEOUS'},
        {instance: 'New Sales', measureName: 'ContactsAbandoned', measureTimestamp: 10, measureValue: 2,
          dimension: 'Continent',
          window: 'INSTANTANEOUS'},
        {instance: 'Upgrade', measureName: 'ContactsAnswered', measureTimestamp: 10, measureValue: 3,
          dimension: 'Continent',
          window: 'INSTANTANEOUS'},
        {instance: 'Upgrade', measureName: 'ContactsAbandoned', measureTimestamp: 10, measureValue: 4,
          dimension: 'Continent',
          window: 'INSTANTANEOUS'},
      ];
      const groupedData = grouper.groupData(data);

      const expected = {
        [getGroupKey({measureName: 'ContactsAnswered', measureTimestamp: 10, window: 'INSTANTANEOUS'})]: [
          {instance: 'New Sales', measureName: 'ContactsAnswered', measureTimestamp: 10, measureValue: 1,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'},
          {instance: 'Upgrade', measureName: 'ContactsAnswered', measureTimestamp: 10, measureValue: 3,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'},
        ],
        [getGroupKey({measureName: 'ContactsAbandoned', measureTimestamp: 10, window: 'INSTANTANEOUS'})]: [
          {instance: 'New Sales', measureName: 'ContactsAbandoned', measureTimestamp: 10, measureValue: 2,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'},
          {instance: 'Upgrade', measureName: 'ContactsAbandoned', measureTimestamp: 10, measureValue: 4,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'},
        ]
      };

      expect(groupedData).toEqual(expected);
    });

    it('1 measures 2 timestamps - should return 2 lists', () => {
      const data: RealtimeData[] = [
        {instance: 'New Sales', measureName: 'ContactsAnswered', measureTimestamp: 10, measureValue: 1,
          dimension: 'Continent',
          window: 'INSTANTANEOUS'},
        {instance: 'New Sales', measureName: 'ContactsAnswered', measureTimestamp: 20, measureValue: 2,
          dimension: 'Continent',
          window: 'INSTANTANEOUS'},
        {instance: 'Upgrade', measureName: 'ContactsAnswered', measureTimestamp: 10, measureValue: 3,
          dimension: 'Continent',
          window: 'INSTANTANEOUS'},
        {instance: 'Upgrade', measureName: 'ContactsAnswered', measureTimestamp: 20, measureValue: 4,
          dimension: 'Continent',
          window: 'INSTANTANEOUS'},
      ];

      const grouper = new MeasureTimestampGrouper(processor);

      const groupedData = grouper.groupData(data);

      const expected = {
        [getGroupKey({measureName: 'ContactsAnswered', measureTimestamp: 20, window: 'INSTANTANEOUS'})]: [
          {instance: 'New Sales', measureName: 'ContactsAnswered', measureTimestamp: 20, measureValue: 2,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'},
          {instance: 'Upgrade', measureName: 'ContactsAnswered', measureTimestamp: 20, measureValue: 4,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'},
        ],
        [getGroupKey({measureName: 'ContactsAnswered', measureTimestamp: 10, window: 'INSTANTANEOUS'})]: [
          {instance: 'New Sales', measureName: 'ContactsAnswered', measureTimestamp: 10, measureValue: 1,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'},
          {instance: 'Upgrade', measureName: 'ContactsAnswered', measureTimestamp: 10, measureValue: 3,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'},
        ]
      };

      expect(groupedData).toEqual(expected);
    });

    it('2 measures 2 timestamps - should return 4 lists', () => {
      const data: RealtimeData[] = [
        {instance: 'New Sales', measureName: 'ContactsAnswered', measureTimestamp: 10, measureValue: 1,
          dimension: 'Continent',
          window: 'INSTANTANEOUS'},
        {instance: 'New Sales', measureName: 'ContactsAbandoned', measureTimestamp: 10, measureValue: 2,
          dimension: 'Continent',
          window: 'INSTANTANEOUS'},
        {instance: 'Upgrade', measureName: 'ContactsAnswered', measureTimestamp: 10, measureValue: 3,
          dimension: 'Continent',
          window: 'INSTANTANEOUS'},
        {instance: 'Upgrade', measureName: 'ContactsAbandoned', measureTimestamp: 10, measureValue: 4,
          dimension: 'Continent',
          window: 'INSTANTANEOUS'},
        {instance: 'New Sales', measureName: 'ContactsAnswered', measureTimestamp: 20, measureValue: 5,
          dimension: 'Continent',
          window: 'INSTANTANEOUS'},
        {instance: 'New Sales', measureName: 'ContactsAbandoned', measureTimestamp: 20, measureValue: 6,
          dimension: 'Continent',
          window: 'INSTANTANEOUS'},
        {instance: 'Upgrade', measureName: 'ContactsAnswered', measureTimestamp: 20, measureValue: 7,
          dimension: 'Continent',
          window: 'INSTANTANEOUS'},
        {instance: 'Upgrade', measureName: 'ContactsAbandoned', measureTimestamp: 20, measureValue: 8,
          dimension: 'Continent',
          window: 'INSTANTANEOUS'},
      ];
      const grouper = new MeasureTimestampGrouper(processor);

      const groupedData = grouper.groupData(data);

      const expected = {
        [getGroupKey({measureName: 'ContactsAnswered', measureTimestamp: 20, window: 'INSTANTANEOUS'})]: [
          {instance: 'New Sales', measureName: 'ContactsAnswered', measureTimestamp: 20, measureValue: 5,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'},
          {instance: 'Upgrade', measureName: 'ContactsAnswered', measureTimestamp: 20, measureValue: 7,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'},
        ],
        [getGroupKey({measureName: 'ContactsAnswered', measureTimestamp: 10, window: 'INSTANTANEOUS'})]: [
          {instance: 'New Sales', measureName: 'ContactsAnswered', measureTimestamp: 10, measureValue: 1,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'},
          {instance: 'Upgrade', measureName: 'ContactsAnswered', measureTimestamp: 10, measureValue: 3,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'},
        ],
        [getGroupKey({measureName: 'ContactsAbandoned', measureTimestamp: 20, window: 'INSTANTANEOUS'})]: [
          {instance: 'New Sales', measureName: 'ContactsAbandoned', measureTimestamp: 20, measureValue: 6,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'},
          {instance: 'Upgrade', measureName: 'ContactsAbandoned', measureTimestamp: 20, measureValue: 8,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'},
        ],
        [getGroupKey({measureName: 'ContactsAbandoned', measureTimestamp: 10, window: 'INSTANTANEOUS'})]: [
          {instance: 'New Sales', measureName: 'ContactsAbandoned', measureTimestamp: 10, measureValue: 2,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'},
          {instance: 'Upgrade', measureName: 'ContactsAbandoned', measureTimestamp: 10, measureValue: 4,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'},
        ]
      };

      expect(groupedData).toEqual(expected);
    });
  });

  describe('InstanceTimestampGrouper', () => {
    it('2 instances single timestamp - should return 2 lists', () => {
      const grouper = new InstanceTimestampGrouper(processor);
      const data: RealtimeData[] = [
        {instance: 'New Sales', measureName: 'ContactsAnswered', measureTimestamp: 10, measureValue: 1,
          dimension: 'Continent',
          window: 'INSTANTANEOUS'},
        {instance: 'New Sales', measureName: 'ContactsAbandoned', measureTimestamp: 10, measureValue: 2,
          dimension: 'Continent',
          window: 'INSTANTANEOUS'},
        {instance: 'Upgrade', measureName: 'ContactsAnswered', measureTimestamp: 10, measureValue: 3,
          dimension: 'Continent',
          window: 'INSTANTANEOUS'},
        {instance: 'Upgrade', measureName: 'ContactsAbandoned', measureTimestamp: 10, measureValue: 4,
          dimension: 'Continent',
          window: 'INSTANTANEOUS'},
      ];

      const groupedData = grouper.groupData(data);

      const expected = {
        [getGroupKey({instance: 'New Sales', measureTimestamp: 10, window: 'INSTANTANEOUS'})]: [
          {instance: 'New Sales', measureName: 'ContactsAnswered', measureTimestamp: 10, measureValue: 1,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'},
          {instance: 'New Sales', measureName: 'ContactsAbandoned', measureTimestamp: 10, measureValue: 2,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'},
        ],
        [getGroupKey({instance: 'Upgrade', measureTimestamp: 10, window: 'INSTANTANEOUS'})]: [
          {instance: 'Upgrade', measureName: 'ContactsAnswered', measureTimestamp: 10, measureValue: 3,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'},
          {instance: 'Upgrade', measureName: 'ContactsAbandoned', measureTimestamp: 10, measureValue: 4,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'},
        ]
      };

      expect(groupedData).toEqual(expected);
    });

    it('1 instance 2 timestamps - should return 2 lists', () => {
      const data: RealtimeData[] = [
        {instance: 'New Sales', measureName: 'ContactsAnswered', measureTimestamp: 10, measureValue: 1,
          dimension: 'Continent',
          window: 'INSTANTANEOUS'},
        {instance: 'New Sales', measureName: 'ContactsAbandoned', measureTimestamp: 10, measureValue: 2,
          dimension: 'Continent',
          window: 'INSTANTANEOUS'},
        {instance: 'New Sales', measureName: 'ContactsAnswered', measureTimestamp: 20, measureValue: 3,
          dimension: 'Continent',
          window: 'INSTANTANEOUS'},
        {instance: 'New Sales', measureName: 'ContactsAbandoned', measureTimestamp: 20, measureValue: 4,
          dimension: 'Continent',
          window: 'INSTANTANEOUS'},
      ];
      const grouper = new InstanceTimestampGrouper(processor);

      const groupedData = grouper.groupData(data);

      const expected = {
        [getGroupKey({instance: 'New Sales', measureTimestamp: 10, window: 'INSTANTANEOUS'})]: [
          {instance: 'New Sales', measureName: 'ContactsAnswered', measureTimestamp: 10, measureValue: 1,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'},
          {instance: 'New Sales', measureName: 'ContactsAbandoned', measureTimestamp: 10, measureValue: 2,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'},
        ],
        [getGroupKey({instance: 'New Sales', measureTimestamp: 20, window: 'INSTANTANEOUS'})]: [
          {instance: 'New Sales', measureName: 'ContactsAnswered', measureTimestamp: 20, measureValue: 3,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'},
          {instance: 'New Sales', measureName: 'ContactsAbandoned', measureTimestamp: 20, measureValue: 4,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'}
        ]
      };

      expect(groupedData).toEqual(expected);
    });

    it('2 instances 2 timestamps - should return 4 lists', () => {
      const data: RealtimeData[] = [
        {instance: 'New Sales', measureName: 'ContactsAnswered', measureTimestamp: 10, measureValue: 1,
          dimension: 'Continent',
          window: 'INSTANTANEOUS'},
        {instance: 'New Sales', measureName: 'ContactsAbandoned', measureTimestamp: 10, measureValue: 2,
          dimension: 'Continent',
          window: 'INSTANTANEOUS'},
        {instance: 'Upgrade', measureName: 'ContactsAnswered', measureTimestamp: 10, measureValue: 3,
          dimension: 'Continent',
          window: 'INSTANTANEOUS'},
        {instance: 'Upgrade', measureName: 'ContactsAbandoned', measureTimestamp: 10, measureValue: 4,
          dimension: 'Continent',
          window: 'INSTANTANEOUS'},
        {instance: 'New Sales', measureName: 'ContactsAnswered', measureTimestamp: 20, measureValue: 5,
          dimension: 'Continent',
          window: 'INSTANTANEOUS'},
        {instance: 'New Sales', measureName: 'ContactsAbandoned', measureTimestamp: 20, measureValue: 6,
          dimension: 'Continent',
          window: 'INSTANTANEOUS'},
        {instance: 'Upgrade', measureName: 'ContactsAnswered', measureTimestamp: 20, measureValue: 7,
          dimension: 'Continent',
          window: 'INSTANTANEOUS'},
        {instance: 'Upgrade', measureName: 'ContactsAbandoned', measureTimestamp: 20, measureValue: 8,
          dimension: 'Continent',
          window: 'INSTANTANEOUS'},
      ];
      const grouper = new InstanceTimestampGrouper(processor);

      const groupedData = grouper.groupData(data);

      const expected = {
        [getGroupKey({instance: 'New Sales', measureTimestamp: 10, window: 'INSTANTANEOUS'})]: [
          {instance: 'New Sales', measureName: 'ContactsAnswered', measureTimestamp: 10, measureValue: 1,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'},
          {instance: 'New Sales', measureName: 'ContactsAbandoned', measureTimestamp: 10, measureValue: 2,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'}
        ],
        [getGroupKey({instance: 'Upgrade', measureTimestamp: 10, window: 'INSTANTANEOUS'})]: [
          {instance: 'Upgrade', measureName: 'ContactsAnswered', measureTimestamp: 10, measureValue: 3,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'},
          {instance: 'Upgrade', measureName: 'ContactsAbandoned', measureTimestamp: 10, measureValue: 4,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'}
        ],
        [getGroupKey({instance: 'New Sales', measureTimestamp: 20, window: 'INSTANTANEOUS'})]: [
          {instance: 'New Sales', measureName: 'ContactsAnswered', measureTimestamp: 20, measureValue: 5,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'},
          {instance: 'New Sales', measureName: 'ContactsAbandoned', measureTimestamp: 20, measureValue: 6,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'}
        ],
        [getGroupKey({instance: 'Upgrade', measureTimestamp: 20, window: 'INSTANTANEOUS'})]: [
          {instance: 'Upgrade', measureName: 'ContactsAnswered', measureTimestamp: 20, measureValue: 7,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'},
          {instance: 'Upgrade', measureName: 'ContactsAbandoned', measureTimestamp: 20, measureValue: 8,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'}
        ],
      };

      expect(groupedData).toEqual(expected);
    });
  });

  describe('InstanceMeasureGrouper', () => {
    it('2 instances single measure - should return 2 lists', () => {
      const grouper = new InstanceMeasureGrouper(processor);
      const data: RealtimeData[] = [
        {instance: 'New Sales', measureName: 'ContactsAnswered', measureTimestamp: 10, measureValue: 1,
          dimension: 'Continent',
          window: 'INSTANTANEOUS'},
        {instance: 'New Sales', measureName: 'ContactsAnswered', measureTimestamp: 10, measureValue: 2,
          dimension: 'Continent',
          window: 'INSTANTANEOUS'},
        {instance: 'Upgrade', measureName: 'ContactsAnswered', measureTimestamp: 10, measureValue: 3,
          dimension: 'Continent',
          window: 'INSTANTANEOUS'},
        {instance: 'Upgrade', measureName: 'ContactsAnswered', measureTimestamp: 10, measureValue: 4,
          dimension: 'Continent',
          window: 'INSTANTANEOUS'},
      ];

      const groupedData = grouper.groupData(data);

      const expected = {
        [getGroupKey({instance: 'Upgrade', measureName: 'ContactsAnswered'})]: [
          {instance: 'Upgrade', measureName: 'ContactsAnswered', measureTimestamp: 10, measureValue: 3,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'},
          {instance: 'Upgrade', measureName: 'ContactsAnswered', measureTimestamp: 10, measureValue: 4,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'},
        ],
        [getGroupKey({instance: 'New Sales', measureName: 'ContactsAnswered'})]: [
          {instance: 'New Sales', measureName: 'ContactsAnswered', measureTimestamp: 10, measureValue: 1,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'},
          {instance: 'New Sales', measureName: 'ContactsAnswered', measureTimestamp: 10, measureValue: 2,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'},
        ]
      };

      expect(groupedData).toEqual(expected);
    });

    it('1 instance 2 measure - should return 2 lists', () => {
      const data: RealtimeData[] = [
        {instance: 'New Sales', measureName: 'ContactsAnswered', measureTimestamp: 10, measureValue: 1,
          dimension: 'Continent',
          window: 'INSTANTANEOUS'},
        {instance: 'New Sales', measureName: 'ContactsAbandoned', measureTimestamp: 10, measureValue: 2,
          dimension: 'Continent',
          window: 'INSTANTANEOUS'},
        {instance: 'New Sales', measureName: 'ContactsAnswered', measureTimestamp: 20, measureValue: 3,
          dimension: 'Continent',
          window: 'INSTANTANEOUS'},
        {instance: 'New Sales', measureName: 'ContactsAbandoned', measureTimestamp: 20, measureValue: 4,
          dimension: 'Continent',
          window: 'INSTANTANEOUS'},
      ];

      const grouper = new InstanceMeasureGrouper(processor);

      const groupedData = grouper.groupData(data);

      const expected = {
        [getGroupKey({instance: 'New Sales', measureName: 'ContactsAnswered'})]: [
          {instance: 'New Sales', measureName: 'ContactsAnswered', measureTimestamp: 10, measureValue: 1,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'},
          {instance: 'New Sales', measureName: 'ContactsAnswered', measureTimestamp: 20, measureValue: 3,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'},
        ],
        [getGroupKey({instance: 'New Sales', measureName: 'ContactsAbandoned'})]: [
          {instance: 'New Sales', measureName: 'ContactsAbandoned', measureTimestamp: 10, measureValue: 2,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'},
          {instance: 'New Sales', measureName: 'ContactsAbandoned', measureTimestamp: 20, measureValue: 4,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'},
        ]
      };

      expect(groupedData).toEqual(expected);
    });

    it('2 instances 2 measures - should return 4 lists', () => {
      const data: RealtimeData[] = [
        {instance: 'New Sales', measureName: 'ContactsAnswered', measureTimestamp: 10, measureValue: 1,
          dimension: 'Continent',
          window: 'INSTANTANEOUS'},
        {instance: 'New Sales', measureName: 'ContactsAbandoned', measureTimestamp: 10, measureValue: 2,
          dimension: 'Continent',
          window: 'INSTANTANEOUS'},
        {instance: 'Upgrade', measureName: 'ContactsAnswered', measureTimestamp: 10, measureValue: 3,
          dimension: 'Continent',
          window: 'INSTANTANEOUS'},
        {instance: 'Upgrade', measureName: 'ContactsAbandoned', measureTimestamp: 10, measureValue: 4,
          dimension: 'Continent',
          window: 'INSTANTANEOUS'},
        {instance: 'New Sales', measureName: 'ContactsAnswered', measureTimestamp: 20, measureValue: 5,
          dimension: 'Continent',
          window: 'INSTANTANEOUS'},
        {instance: 'New Sales', measureName: 'ContactsAbandoned', measureTimestamp: 20, measureValue: 6,
          dimension: 'Continent',
          window: 'INSTANTANEOUS'},
        {instance: 'Upgrade', measureName: 'ContactsAnswered', measureTimestamp: 20, measureValue: 7,
          dimension: 'Continent',
          window: 'INSTANTANEOUS'},
        {instance: 'Upgrade', measureName: 'ContactsAbandoned', measureTimestamp: 20, measureValue: 8,
          dimension: 'Continent',
          window: 'INSTANTANEOUS'},
      ];

      const grouper = new InstanceMeasureGrouper(processor);

      const groupedData = grouper.groupData(data);

      const expected = {
        [getGroupKey({instance: 'Upgrade', measureName: 'ContactsAnswered'})]: [
          {instance: 'Upgrade', measureName: 'ContactsAnswered', measureTimestamp: 10, measureValue: 3,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'},
          {instance: 'Upgrade', measureName: 'ContactsAnswered', measureTimestamp: 20, measureValue: 7,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'}
        ],
        [getGroupKey({instance: 'Upgrade', measureName: 'ContactsAbandoned'})]: [
          {instance: 'Upgrade', measureName: 'ContactsAbandoned', measureTimestamp: 10, measureValue: 4,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'},
          {instance: 'Upgrade', measureName: 'ContactsAbandoned', measureTimestamp: 20, measureValue: 8,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'}
        ],
        [getGroupKey({instance: 'New Sales', measureName: 'ContactsAnswered'})]: [
          {instance: 'New Sales', measureName: 'ContactsAnswered', measureTimestamp: 10, measureValue: 1,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'},
          {instance: 'New Sales', measureName: 'ContactsAnswered', measureTimestamp: 20, measureValue: 5,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'}
        ],
        [getGroupKey({instance: 'New Sales', measureName: 'ContactsAbandoned'})]: [
          {instance: 'New Sales', measureName: 'ContactsAbandoned', measureTimestamp: 10, measureValue: 2,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'},
          {instance: 'New Sales', measureName: 'ContactsAbandoned', measureTimestamp: 20, measureValue: 6,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'}
        ]
      };

      expect(groupedData).toEqual(expected);
    });
  });
});
