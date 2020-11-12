import {getRealTimeDataProcessor} from '../../../common/testing/mocks/processor';
import {RealtimeData} from '../../models';
import {getGroupKey} from './grouper.spec';
import {InstanceGrouper, MeasureGrouper} from './single';

describe('Single Grouper', () => {
  const processor = getRealTimeDataProcessor();

  describe('MeasureGrouper', () => {
    it('should group data by measure name', () => {
      const data: RealtimeData[] = [
        {
          instance: 'Ireland,Sales',
          measureName: 'SankeyLayer1',
          measureTimestamp: 1515553200000,
          measureValue: 20
        },
        {
          instance: 'Ireland,Sales,iPhone',
          measureName: 'SankeyLayer1',
          measureTimestamp: 1515596400000,
          measureValue: 15
        },
        {
          instance: 'Ireland,Sales,iPhone,v7',
          measureName: 'SankeyLayer1',
          measureTimestamp: 1515596400000,
          measureValue: 10
        },
        {
          instance: 'Ireland,Sales,iPhone,v6',
          measureName: 'SankeyLayer1',
          measureTimestamp: 1515596400000,
          measureValue: 5
        },
        {
          instance: 'Ireland,Sales,iPad',
          measureName: 'SankeyLayer1',
          measureTimestamp: 1515596400000,
          measureValue: 5
        },
        {
          instance: 'Ireland,Sales,iPad,v7',
          measureName: 'SankeyLayer1',
          measureTimestamp: 1515596400000,
          measureValue: 1
        },
        {
          instance: 'Ireland,Sales,iPad,v6',
          measureName: 'SankeyLayer1',
          measureTimestamp: 1515596400000,
          measureValue: 4
        },
        {
          instance: 'UK,Sales',
          measureName: 'SankeyLayer2',
          measureTimestamp: 1515567600000,
          measureValue: 40
        },
        {
          instance: 'UK,Sales,iPhone',
          measureName: 'SankeyLayer2',
          measureTimestamp: 1515567600000,
          measureValue: 15
        },
        {
          instance: 'UK,Sales,iPhone,v7',
          measureName: 'SankeyLayer2',
          measureTimestamp: 1515567600000,
          measureValue: 8
        },
        {
          instance: 'UK,Sales,iPhone,v6',
          measureName: 'SankeyLayer2',
          measureTimestamp: 1515567600000,
          measureValue: 7
        },
        {
          instance: 'UK,Sales,iPad',
          measureName: 'SankeyLayer2',
          measureTimestamp: 1515567600000,
          measureValue: 25
        },
        {
          instance: 'UK,Sales,iPad,v7',
          measureName: 'SankeyLayer2',
          measureTimestamp: 1515567600000,
          measureValue: 11
        },
        {
          instance: 'UK,Sales,iPad,v6',
          measureName: 'SankeyLayer2',
          measureTimestamp: 1515567600000,
          measureValue: 14
        },
      ];

      const expected = {
        [getGroupKey({measureName: 'SankeyLayer1'})]: [
          {
            instance: 'Ireland,Sales',
            measureName: 'SankeyLayer1',
            measureTimestamp: 1515553200000,
            measureValue: 20
          },
          {
            instance: 'Ireland,Sales,iPhone',
            measureName: 'SankeyLayer1',
            measureTimestamp: 1515596400000,
            measureValue: 15
          },
          {
            instance: 'Ireland,Sales,iPhone,v7',
            measureName: 'SankeyLayer1',
            measureTimestamp: 1515596400000,
            measureValue: 10
          },
          {
            instance: 'Ireland,Sales,iPhone,v6',
            measureName: 'SankeyLayer1',
            measureTimestamp: 1515596400000,
            measureValue: 5
          },
          {
            instance: 'Ireland,Sales,iPad',
            measureName: 'SankeyLayer1',
            measureTimestamp: 1515596400000,
            measureValue: 5
          },
          {
            instance: 'Ireland,Sales,iPad,v7',
            measureName: 'SankeyLayer1',
            measureTimestamp: 1515596400000,
            measureValue: 1
          },
          {
            instance: 'Ireland,Sales,iPad,v6',
            measureName: 'SankeyLayer1',
            measureTimestamp: 1515596400000,
            measureValue: 4
          },
        ],
        [getGroupKey({measureName: 'SankeyLayer2'})]: [
          {
            instance: 'UK,Sales',
            measureName: 'SankeyLayer2',
            measureTimestamp: 1515567600000,
            measureValue: 40
          },
          {
            instance: 'UK,Sales,iPhone',
            measureName: 'SankeyLayer2',
            measureTimestamp: 1515567600000,
            measureValue: 15
          },
          {
            instance: 'UK,Sales,iPhone,v7',
            measureName: 'SankeyLayer2',
            measureTimestamp: 1515567600000,
            measureValue: 8
          },
          {
            instance: 'UK,Sales,iPhone,v6',
            measureName: 'SankeyLayer2',
            measureTimestamp: 1515567600000,
            measureValue: 7
          },
          {
            instance: 'UK,Sales,iPad',
            measureName: 'SankeyLayer2',
            measureTimestamp: 1515567600000,
            measureValue: 25
          },
          {
            instance: 'UK,Sales,iPad,v7',
            measureName: 'SankeyLayer2',
            measureTimestamp: 1515567600000,
            measureValue: 11
          },
          {
            instance: 'UK,Sales,iPad,v6',
            measureName: 'SankeyLayer2',
            measureTimestamp: 1515567600000,
            measureValue: 14
          },
        ]
      };

      const measureGrouper = new MeasureGrouper(processor);
      const result = measureGrouper.groupData(data);

      expect(result).toEqual(expected);
    });
  });

  describe('InstanceGrouper', () => {
    it('should group data by instance', () => {
      const data: RealtimeData[] = [
        {instance: 'New Sales', measureName: 'ContactsAnswered', measureTimestamp: 10, measureValue: 1},
        {instance: 'New Sales', measureName: 'ContactsAbandoned', measureTimestamp: 10, measureValue: 2},
        {instance: 'Upgrade', measureName: 'ContactsAnswered', measureTimestamp: 10, measureValue: 3},
        {instance: 'Upgrade', measureName: 'ContactsAbandoned', measureTimestamp: 10, measureValue: 4},
        {instance: 'New Sales', measureName: 'ContactsAnswered', measureTimestamp: 20, measureValue: 5},
        {instance: 'New Sales', measureName: 'ContactsAbandoned', measureTimestamp: 20, measureValue: 6},
        {instance: 'Upgrade', measureName: 'ContactsAnswered', measureTimestamp: 20, measureValue: 7},
        {instance: 'Upgrade', measureName: 'ContactsAbandoned', measureTimestamp: 20, measureValue: 8},
      ];

      const expected = {
        [getGroupKey({instance: 'New Sales'})]: [
          {instance: 'New Sales', measureName: 'ContactsAnswered', measureTimestamp: 10, measureValue: 1},
          {instance: 'New Sales', measureName: 'ContactsAbandoned', measureTimestamp: 10, measureValue: 2},
          {instance: 'New Sales', measureName: 'ContactsAnswered', measureTimestamp: 20, measureValue: 5},
          {instance: 'New Sales', measureName: 'ContactsAbandoned', measureTimestamp: 20, measureValue: 6},
        ],
        [getGroupKey({instance: 'Upgrade'})]: [
          {instance: 'Upgrade', measureName: 'ContactsAnswered', measureTimestamp: 10, measureValue: 3},
          {instance: 'Upgrade', measureName: 'ContactsAbandoned', measureTimestamp: 10, measureValue: 4},
          {instance: 'Upgrade', measureName: 'ContactsAnswered', measureTimestamp: 20, measureValue: 7},
          {instance: 'Upgrade', measureName: 'ContactsAbandoned', measureTimestamp: 20, measureValue: 8},
        ]
      };

      const instanceGrouper = new InstanceGrouper(processor);
      const result = instanceGrouper.groupData(data);

      expect(result).toEqual(expected);
    });
  });
});
