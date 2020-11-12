import {RealtimeData} from '../../models';
import {InstanceSorter, InstanceTimestampSorter, TimestampSorter} from './sorter';

describe('Sorter', () => {
  describe('TimestampSorter', () => {
    it('should throw error if the order is not valid', () => {
      const callFn = () => {
        const sorter = new TimestampSorter('abc');
      };
      expect(callFn).toThrow(new Error('Sorting order is invalid.'));
    });

    it('should throw error if data is null', () => {
      const sorter = new TimestampSorter();
      const callFn = () => {
        sorter.intercept(null);
      };
      expect(callFn).toThrow(new TypeError('A null object is not valid for sorting.'));
    });

    it('should return empty array if input is empty', () => {
      const sorter = new TimestampSorter();
      expect(sorter.intercept([])).toEqual([]);
    });

    it('should sort data by timestamp in ascending order by default', () => {
      const data: RealtimeData[] = [
        {instance: 'New Sales', measureName: 'ContactsAnswered', measureTimestamp: 1515553200000, measureValue: 103},
        {instance: 'Dog', measureName: 'ContactsAbandoned', measureTimestamp: 1515596400000, measureValue: 89},
        {instance: 'Upgrades', measureName: 'ContactsOffered', measureTimestamp: 1515564000000, measureValue: 61},
        {instance: 'New Sales', measureName: 'ContactsAbandoned', measureTimestamp: 1515600000000, measureValue: 53},
        {instance: 'Cat', measureName: 'ContactsAnswered', measureTimestamp: 1517752800000, measureValue: 26},
      ];
      const sorter = new TimestampSorter();
      const result = sorter.intercept(data);
      const expected: RealtimeData[] = [
        {instance: 'New Sales', measureName: 'ContactsAnswered', measureTimestamp: 1515553200000, measureValue: 103},
        {instance: 'Upgrades', measureName: 'ContactsOffered', measureTimestamp: 1515564000000, measureValue: 61},
        {instance: 'Dog', measureName: 'ContactsAbandoned', measureTimestamp: 1515596400000, measureValue: 89},
        {instance: 'New Sales', measureName: 'ContactsAbandoned', measureTimestamp: 1515600000000, measureValue: 53},
        {instance: 'Cat', measureName: 'ContactsAnswered', measureTimestamp: 1517752800000, measureValue: 26},
      ];
      expect(result).toEqual(expected);
    });

    it('should sort data by timestamp in descending order', () => {
      const data: RealtimeData[] = [
        {instance: 'New Sales', measureName: 'ContactsAnswered', measureTimestamp: 1515553200000, measureValue: 103},
        {instance: 'Dog', measureName: 'ContactsAbandoned', measureTimestamp: 1515596400000, measureValue: 89},
        {instance: 'Upgrades', measureName: 'ContactsOffered', measureTimestamp: 1515564000000, measureValue: 61},
        {instance: 'New Sales', measureName: 'ContactsAbandoned', measureTimestamp: 1515600000000, measureValue: 53},
        {instance: 'Cat', measureName: 'ContactsAnswered', measureTimestamp: 1517752800000, measureValue: 26},
      ];
      const sorter = new TimestampSorter('desc');
      const result = sorter.intercept(data);
      const expected: RealtimeData[] = [
        {instance: 'Cat', measureName: 'ContactsAnswered', measureTimestamp: 1517752800000, measureValue: 26},
        {instance: 'New Sales', measureName: 'ContactsAbandoned', measureTimestamp: 1515600000000, measureValue: 53},
        {instance: 'Dog', measureName: 'ContactsAbandoned', measureTimestamp: 1515596400000, measureValue: 89},
        {instance: 'Upgrades', measureName: 'ContactsOffered', measureTimestamp: 1515564000000, measureValue: 61},
        {instance: 'New Sales', measureName: 'ContactsAnswered', measureTimestamp: 1515553200000, measureValue: 103},
      ];
      expect(result).toEqual(expected);
    });
  });

  describe('InstanceSorter', () => {
    it('should throw error if the order is not valid', () => {
      const callFn = () => {
        const sorter = new InstanceSorter('abc');
      };
      expect(callFn).toThrow(new Error('Sorting order is invalid.'));
    });

    it('should throw error if data is null', () => {
      const sorter = new InstanceSorter();
      const callFn = () => {
        sorter.intercept(null);
      };
      expect(callFn).toThrow(new TypeError('A null object is not valid for sorting.'));
    });

    it('should return empty array if input is empty', () => {
      const sorter = new InstanceSorter();
      expect(sorter.intercept([])).toEqual([]);
    });

    it('should sort data by instance in ascending order by default', () => {
      const data: RealtimeData[] = [
        {instance: 'New Sales', measureName: 'ContactsAnswered', measureTimestamp: 1515553200000, measureValue: 103},
        {instance: 'Dog', measureName: 'ContactsAbandoned', measureTimestamp: 1515596400000, measureValue: 89},
        {instance: 'Upgrades', measureName: 'ContactsOffered', measureTimestamp: 1515564000000, measureValue: 61},
        {instance: 'New Sales', measureName: 'ContactsAbandoned', measureTimestamp: 1515600000000, measureValue: 53},
        {instance: 'Cat', measureName: 'ContactsAnswered', measureTimestamp: 1517752800000, measureValue: 26},
      ];
      const sorter = new InstanceSorter();
      const result = sorter.intercept(data);
      const expected: RealtimeData[] = [
        {instance: 'Cat', measureName: 'ContactsAnswered', measureTimestamp: 1517752800000, measureValue: 26},
        {instance: 'Dog', measureName: 'ContactsAbandoned', measureTimestamp: 1515596400000, measureValue: 89},
        {instance: 'New Sales', measureName: 'ContactsAnswered', measureTimestamp: 1515553200000, measureValue: 103},
        {instance: 'New Sales', measureName: 'ContactsAbandoned', measureTimestamp: 1515600000000, measureValue: 53},
        {instance: 'Upgrades', measureName: 'ContactsOffered', measureTimestamp: 1515564000000, measureValue: 61},
      ];
      expect(result).toEqual(expected);
    });

    it('should sort data by instance in descending order', () => {
      const data: RealtimeData[] = [
        {instance: 'New Sales', measureName: 'ContactsAnswered', measureTimestamp: 1515553200000, measureValue: 103},
        {instance: 'Dog', measureName: 'ContactsAbandoned', measureTimestamp: 1515596400000, measureValue: 89},
        {instance: 'Upgrades', measureName: 'ContactsOffered', measureTimestamp: 1515564000000, measureValue: 61},
        {instance: 'New Sales', measureName: 'ContactsAbandoned', measureTimestamp: 1515600000000, measureValue: 53},
        {instance: 'Cat', measureName: 'ContactsAnswered', measureTimestamp: 1517752800000, measureValue: 26},
      ];
      const sorter = new InstanceSorter('desc');
      const result = sorter.intercept(data);
      const expected: RealtimeData[] = [
        {instance: 'Upgrades', measureName: 'ContactsOffered', measureTimestamp: 1515564000000, measureValue: 61},
        {instance: 'New Sales', measureName: 'ContactsAnswered', measureTimestamp: 1515553200000, measureValue: 103},
        {instance: 'New Sales', measureName: 'ContactsAbandoned', measureTimestamp: 1515600000000, measureValue: 53},
        {instance: 'Dog', measureName: 'ContactsAbandoned', measureTimestamp: 1515596400000, measureValue: 89},
        {instance: 'Cat', measureName: 'ContactsAnswered', measureTimestamp: 1517752800000, measureValue: 26}
      ];
      expect(result).toEqual(expected);
    });
  });

  describe('InstanceTimestampSorter', () => {
    it('should throw error if the order is not valid', () => {
      const callFn = () => {
        const sorter = new InstanceTimestampSorter('abc', 'desc');
      };
      expect(callFn).toThrow(new Error('Sorting order is invalid.'));
    });

    it('should throw error if data is null', () => {
      const sorter = new InstanceTimestampSorter();
      const callFn = () => {
        sorter.intercept(null);
      };
      expect(callFn).toThrow(new TypeError('A null object is not valid for sorting.'));
    });

    it('should sort data by instance first, for each instance sort data by timestamp (ascending by default)', () => {
      const data: RealtimeData[] = [
        {instance: 'New Sales', measureName: 'ContactsAnswered', measureTimestamp: 7, measureValue: 103},
        {instance: 'Dog', measureName: 'ContactsAbandoned', measureTimestamp: 7, measureValue: 89},
        {instance: 'Upgrades', measureName: 'ContactsOffered', measureTimestamp: 3, measureValue: 61},
        {instance: 'New Sales', measureName: 'ContactsAbandoned', measureTimestamp: 3, measureValue: 53},
        {instance: 'Dog', measureName: 'ContactsAbandoned', measureTimestamp: 5, measureValue: 89},
        {instance: 'Cat', measureName: 'ContactsAnswered', measureTimestamp: 2, measureValue: 26},
        {instance: 'Dog', measureName: 'ContactsAbandoned', measureTimestamp: 1, measureValue: 89},
      ];
      const result = new InstanceTimestampSorter().intercept(data);
      const expected: RealtimeData[] = [
        {instance: 'Cat', measureName: 'ContactsAnswered', measureTimestamp: 2, measureValue: 26},
        {instance: 'Dog', measureName: 'ContactsAbandoned', measureTimestamp: 1, measureValue: 89},
        {instance: 'Dog', measureName: 'ContactsAbandoned', measureTimestamp: 5, measureValue: 89},
        {instance: 'Dog', measureName: 'ContactsAbandoned', measureTimestamp: 7, measureValue: 89},
        {instance: 'New Sales', measureName: 'ContactsAbandoned', measureTimestamp: 3, measureValue: 53},
        {instance: 'New Sales', measureName: 'ContactsAnswered', measureTimestamp: 7, measureValue: 103},
        {instance: 'Upgrades', measureName: 'ContactsOffered', measureTimestamp: 3, measureValue: 61},
      ];
      expect(result).toEqual(expected);
    });

    it('should sort data by instance in descending order first, for each instance sort data by timestamp in ascending order', () => {
      const data: RealtimeData[] = [
        {instance: 'New Sales', measureName: 'ContactsAnswered', measureTimestamp: 7, measureValue: 103},
        {instance: 'Dog', measureName: 'ContactsAbandoned', measureTimestamp: 7, measureValue: 89},
        {instance: 'Upgrades', measureName: 'ContactsOffered', measureTimestamp: 3, measureValue: 61},
        {instance: 'New Sales', measureName: 'ContactsAbandoned', measureTimestamp: 3, measureValue: 53},
        {instance: 'Dog', measureName: 'ContactsAbandoned', measureTimestamp: 5, measureValue: 89},
        {instance: 'Cat', measureName: 'ContactsAnswered', measureTimestamp: 2, measureValue: 26},
        {instance: 'Dog', measureName: 'ContactsAbandoned', measureTimestamp: 1, measureValue: 89},
      ];
      const result = new InstanceTimestampSorter('desc', 'asc').intercept(data);
      const expected: RealtimeData[] = [
        {instance: 'Upgrades', measureName: 'ContactsOffered', measureTimestamp: 3, measureValue: 61},
        {instance: 'New Sales', measureName: 'ContactsAbandoned', measureTimestamp: 3, measureValue: 53},
        {instance: 'New Sales', measureName: 'ContactsAnswered', measureTimestamp: 7, measureValue: 103},
        {instance: 'Dog', measureName: 'ContactsAbandoned', measureTimestamp: 1, measureValue: 89},
        {instance: 'Dog', measureName: 'ContactsAbandoned', measureTimestamp: 5, measureValue: 89},
        {instance: 'Dog', measureName: 'ContactsAbandoned', measureTimestamp: 7, measureValue: 89},
        {instance: 'Cat', measureName: 'ContactsAnswered', measureTimestamp: 2, measureValue: 26}
      ];
      expect(result).toEqual(expected);
    });
  });
});
