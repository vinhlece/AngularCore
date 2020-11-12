import {RealtimeData} from '.';
import {Collection} from './collection';

describe('Collection', () => {
  let records: RealtimeData[];

  beforeEach(() => {
    records = [
      {dataType: 'queue', instance: 'instance 3', measureName: 'measure 3', measureTimestamp: 5, measureValue: 6},
      {dataType: 'queue', instance: 'instance 4', measureName: 'measure 1', measureTimestamp: 1, measureValue: 2},
      {dataType: 'queue', instance: 'instance 4', measureName: 'measure 1', measureTimestamp: 1, measureValue: 3},
      {dataType: 'queue', instance: 'instance 2', measureName: 'measure 2', measureTimestamp: 3, measureValue: 3},
      {dataType: 'queue', instance: 'instance 1', measureName: 'measure 1', measureTimestamp: 1, measureValue: 1},
    ];
  });

  describe('insert', () => {
    it('should insert one record', () => {
      const collection = new Collection();
      const result = collection.insert(records[0]);
      expect(result).toEqual(records[0]);
      expect(collection.size()).toEqual(1);
    });

    it('should process the record first if process strategy is provided', () => {
      const record: RealtimeData = {
        dataType: 'queue',
        instance: 'instance 2',
        measureName: 'measure 3',
        measureTimestamp: 4,
        measureValue: 12
      };
      const proceedRecord: RealtimeData = {
        dataType: 'queue',
        instance: 'instance 2',
        measureName: 'measure 3',
        measureTimestamp: 1,
        measureValue: 12
      };

      const strategy = jasmine.createSpyObj('strategy', ['process']);
      strategy.process.and.returnValue(proceedRecord);
      const collection = new Collection();
      const result = collection.insert(record, strategy);

      expect(strategy.process).toHaveBeenCalledWith(record);
      expect(result).toEqual(proceedRecord);
      expect(collection.records).toEqual([proceedRecord]);
    });

    it('should do nothing if record already exists', () => {
      const collection = new Collection();
      collection.insert(records[0]);
      const result = collection.insert(records[0]);
      expect(result).toEqual(null);
      expect(collection.size()).toEqual(1);
    });
  });

  describe('bulkInsert', () => {
    it('should sort by measure timestamp in ascending order (default)', () => {
      const collection = new Collection();
      collection.bulkInsert(records);
      const expected: RealtimeData[] = [
        {dataType: 'queue', instance: 'instance 1', measureName: 'measure 1', measureTimestamp: 1, measureValue: 1},
        {dataType: 'queue', instance: 'instance 4', measureName: 'measure 1', measureTimestamp: 1, measureValue: 2},
        {dataType: 'queue', instance: 'instance 2', measureName: 'measure 2', measureTimestamp: 3, measureValue: 3},
        {dataType: 'queue', instance: 'instance 3', measureName: 'measure 3', measureTimestamp: 5, measureValue: 6},
      ];
      const expectedNewRecords: RealtimeData[] = [
        {dataType: 'queue', instance: 'instance 3', measureName: 'measure 3', measureTimestamp: 5, measureValue: 6},
        {dataType: 'queue', instance: 'instance 4', measureName: 'measure 1', measureTimestamp: 1, measureValue: 2},
        {dataType: 'queue', instance: 'instance 2', measureName: 'measure 2', measureTimestamp: 3, measureValue: 3},
        {dataType: 'queue', instance: 'instance 1', measureName: 'measure 1', measureTimestamp: 1, measureValue: 1},
      ];
      expect(collection.size()).toEqual(4);
      expect(collection.records).toEqual(expected);
    });

    it('should sort by measure timestamp in descending order', () => {
      const collection = new Collection('desc');
      collection.bulkInsert(records);
      const expected: RealtimeData[] = [
        {dataType: 'queue', instance: 'instance 3', measureName: 'measure 3', measureTimestamp: 5, measureValue: 6},
        {dataType: 'queue', instance: 'instance 2', measureName: 'measure 2', measureTimestamp: 3, measureValue: 3},
        {dataType: 'queue', instance: 'instance 4', measureName: 'measure 1', measureTimestamp: 1, measureValue: 2},
        {dataType: 'queue', instance: 'instance 1', measureName: 'measure 1', measureTimestamp: 1, measureValue: 1},
      ];
      expect(collection.size()).toEqual(4);
      expect(collection.records).toEqual(expected);
    });
  });

  describe('update', () => {
    it('should update record if it exists', () => {
      const collection = new Collection();
      collection.bulkInsert(records);
      const record = {
        dataType: 'queue',
        instance: 'instance 2',
        measureName: 'measure 2',
        measureTimestamp: 3,
        measureValue: 12
      };
      const result = collection.update(record);
      expect(collection.getRecord(record)).toEqual(record);
      expect(result).toEqual(record);
    });

    it('should do nothing if record does not exists', () => {
      const collection = new Collection();
      collection.bulkInsert(records);
      const record = {
        dataType: 'queue',
        instance: 'instance 100',
        measureName: 'measure 100',
        measureTimestamp: 3,
        measureValue: 12
      };
      const result = collection.update(record);
      expect(collection.getRecord(record)).toEqual(null);
      expect(result).toEqual(null);
    });

    it('should process the record first if process strategy is provided', () => {
      const record: RealtimeData = {
        dataType: 'queue',
        instance: 'instance 2',
        measureName: 'measure 3',
        measureTimestamp: 4,
        measureValue: 12
      };
      const proceedRecord: RealtimeData = {
        dataType: 'queue',
        instance: 'instance 2',
        measureName: 'measure 3',
        measureTimestamp: 4,
        measureValue: 16
      };
      const strategy = jasmine.createSpyObj('strategy', ['process']);
      strategy.process.and.returnValue(proceedRecord);
      const collection = new Collection();
      collection.insert(record);
      collection.update(record, strategy);
      expect(strategy.process).toHaveBeenCalledWith(record);
      expect(collection.records).toEqual([proceedRecord]);
    });
  });

  describe('upsert', () => {
    it('should update measure value of existing record', () => {
      const collection = new Collection();
      collection.bulkInsert(records);
      const record = {
        dataType: 'queue',
        instance: 'instance 2',
        measureName: 'measure 2',
        measureTimestamp: 3,
        measureValue: 12
      };
      collection.resetRecordsState();
      const result = collection.upsert(record);
      const expected: RealtimeData[] = [
        {dataType: 'queue', instance: 'instance 1', measureName: 'measure 1', measureTimestamp: 1, measureValue: 1},
        {dataType: 'queue', instance: 'instance 4', measureName: 'measure 1', measureTimestamp: 1, measureValue: 2},
        {dataType: 'queue', instance: 'instance 2', measureName: 'measure 2', measureTimestamp: 3, measureValue: 12},
        {dataType: 'queue', instance: 'instance 3', measureName: 'measure 3', measureTimestamp: 5, measureValue: 6},
      ];
      const expectedUpdatedRecords: RealtimeData[] = [
        {dataType: 'queue', instance: 'instance 2', measureName: 'measure 2', measureTimestamp: 3, measureValue: 12},
      ];
      expect(result).toEqual(expectedUpdatedRecords[0]);
      expect(collection.records).toEqual(expected);
    });

    it('should insert new record if it not exist', () => {
      const collection = new Collection();
      collection.bulkInsert(records);
      const record = {
        dataType: 'queue',
        instance: 'instance 2',
        measureName: 'measure 3',
        measureTimestamp: 4,
        measureValue: 12
      };
      collection.resetRecordsState();
      const result = collection.upsert(record);
      const expected: RealtimeData[] = [
        {dataType: 'queue', instance: 'instance 1', measureName: 'measure 1', measureTimestamp: 1, measureValue: 1},
        {dataType: 'queue', instance: 'instance 4', measureName: 'measure 1', measureTimestamp: 1, measureValue: 2},
        {dataType: 'queue', instance: 'instance 2', measureName: 'measure 2', measureTimestamp: 3, measureValue: 3},
        {dataType: 'queue', instance: 'instance 2', measureName: 'measure 3', measureTimestamp: 4, measureValue: 12},
        {dataType: 'queue', instance: 'instance 3', measureName: 'measure 3', measureTimestamp: 5, measureValue: 6},
      ];
      const expectedNewRecords: RealtimeData[] = [
        {dataType: 'queue', instance: 'instance 2', measureName: 'measure 3', measureTimestamp: 4, measureValue: 12}
      ];
      expect(result).toEqual(expectedNewRecords[0]);
      expect(collection.records).toEqual(expected);
    });
  });

  describe('bulkUpsert', () => {
    it('should update measure value if exist, or add new record if not exists', () => {
      const collection = new Collection();
      collection.bulkInsert(records);
      collection.resetRecordsState();
      collection.bulkUpsert([
        {dataType: 'queue', instance: 'instance 1', measureName: 'measure 1', measureTimestamp: 1, measureValue: 2},
        {dataType: 'queue', instance: 'instance 4', measureName: 'measure 1', measureTimestamp: 7, measureValue: 2},
      ]);
      const expected: RealtimeData[] = [
        {dataType: 'queue', instance: 'instance 1', measureName: 'measure 1', measureTimestamp: 1, measureValue: 2},
        {dataType: 'queue', instance: 'instance 4', measureName: 'measure 1', measureTimestamp: 1, measureValue: 2},
        {dataType: 'queue', instance: 'instance 2', measureName: 'measure 2', measureTimestamp: 3, measureValue: 3},
        {dataType: 'queue', instance: 'instance 3', measureName: 'measure 3', measureTimestamp: 5, measureValue: 6},
        {dataType: 'queue', instance: 'instance 4', measureName: 'measure 1', measureTimestamp: 7, measureValue: 2},
      ];
      expect(collection.records).toEqual(expected);
    });
  });

  describe('remove', () => {
    it('should remove existing record', () => {
      const collection = new Collection();
      collection.bulkInsert(records);
      const result = collection.remove(records[1]);
      const expected: RealtimeData[] = [
        {dataType: 'queue', instance: 'instance 1', measureName: 'measure 1', measureTimestamp: 1, measureValue: 1},
        {dataType: 'queue', instance: 'instance 2', measureName: 'measure 2', measureTimestamp: 3, measureValue: 3},
        {dataType: 'queue', instance: 'instance 3', measureName: 'measure 3', measureTimestamp: 5, measureValue: 6},
      ];
      expect(result).toBeTruthy();
      expect(collection.records).toEqual(expected);
    });

    it('should do nothing if record does not exists', () => {
      const collection = new Collection();
      collection.bulkInsert(records);
      const result = collection.remove({...records[1], dataType: 'something'});
      expect(result).toBeFalsy();
      expect(collection.size()).toEqual(4);
    });
  });

  describe('bulkRemove', () => {
    it('remove many', () => {
      const collection = new Collection();
      collection.bulkInsert(records);
      collection.bulkRemove([records[1], records[3]]);
      const expected: RealtimeData[] = [
        {dataType: 'queue', instance: 'instance 1', measureName: 'measure 1', measureTimestamp: 1, measureValue: 1},
        {dataType: 'queue', instance: 'instance 3', measureName: 'measure 3', measureTimestamp: 5, measureValue: 6},
      ];
      expect(collection.records).toEqual(expected);
    });
  });

  describe('findRecords', () => {
    let collection;

    beforeEach(() => {
      collection = new Collection();
      collection.bulkInsert(records);
    });

    describe('by instance', () => {
      it('$eq', () => {
        const result = collection.findRecords({instance: {$eq: 'instance 3'}});
        const expected = [
          {dataType: 'queue', instance: 'instance 3', measureName: 'measure 3', measureTimestamp: 5, measureValue: 6},
        ];
        expect(result).toEqual(expected);
      });

      it('$in', () => {
        const result = collection.findRecords({instance: {$in: ['instance 1', 'instance 4']}});
        const expected = [
          {dataType: 'queue', instance: 'instance 1', measureName: 'measure 1', measureTimestamp: 1, measureValue: 1},
          {dataType: 'queue', instance: 'instance 4', measureName: 'measure 1', measureTimestamp: 1, measureValue: 2},
        ];
        expect(result).toEqual(expected);
      });

      it('mixed', () => {
        const result = collection.findRecords({instance: {$gt: 'instance 1', $in: ['instance 1', 'instance 2']}});
        const expected = [
          {dataType: 'queue', instance: 'instance 2', measureName: 'measure 2', measureTimestamp: 3, measureValue: 3},
        ];
        expect(result).toEqual(expected);
      });
    });

    describe('by measure name', () => {
      it('$eq', () => {
        const result = collection.findRecords({measureName: {$eq: 'measure 2'}});
        const expected = [
          {dataType: 'queue', instance: 'instance 2', measureName: 'measure 2', measureTimestamp: 3, measureValue: 3},
        ];
        expect(result).toEqual(expected);
      });

      it('$in', () => {
        const result = collection.findRecords({measureName: {$in: ['measure 1', 'measure 2']}});
        const expected = [
          {dataType: 'queue', instance: 'instance 1', measureName: 'measure 1', measureTimestamp: 1, measureValue: 1},
          {dataType: 'queue', instance: 'instance 4', measureName: 'measure 1', measureTimestamp: 1, measureValue: 2},
          {dataType: 'queue', instance: 'instance 2', measureName: 'measure 2', measureTimestamp: 3, measureValue: 3},
        ];
        expect(result).toEqual(expected);
      });

      it('mixed', () => {
        const result = collection.findRecords({measureName: {$gt: 'measure 1', $in: ['measure 1', 'measure 2']}});
        const expected = [
          {dataType: 'queue', instance: 'instance 2', measureName: 'measure 2', measureTimestamp: 3, measureValue: 3},
        ];
        expect(result).toEqual(expected);
      });
    });

    describe('by measure timestamp', () => {
      it('$eq', () => {
        const result = collection.findRecords({measureTimestamp: {$eq: 1}});
        const expected = [
          {dataType: 'queue', instance: 'instance 1', measureName: 'measure 1', measureTimestamp: 1, measureValue: 1},
          {dataType: 'queue', instance: 'instance 4', measureName: 'measure 1', measureTimestamp: 1, measureValue: 2},
        ];
        expect(result).toEqual(expected);
      });

      it('$gt', () => {
        const result = collection.findRecords({measureTimestamp: {$gt: 1}});
        const expected = [
          {dataType: 'queue', instance: 'instance 2', measureName: 'measure 2', measureTimestamp: 3, measureValue: 3},
          {dataType: 'queue', instance: 'instance 3', measureName: 'measure 3', measureTimestamp: 5, measureValue: 6},
        ];
        expect(result).toEqual(expected);
      });

      it('$lt', () => {
        const result = collection.findRecords({measureTimestamp: {$lt: 5}});
        const expected = [
          {dataType: 'queue', instance: 'instance 1', measureName: 'measure 1', measureTimestamp: 1, measureValue: 1},
          {dataType: 'queue', instance: 'instance 4', measureName: 'measure 1', measureTimestamp: 1, measureValue: 2},
          {dataType: 'queue', instance: 'instance 2', measureName: 'measure 2', measureTimestamp: 3, measureValue: 3},
        ];
        expect(result).toEqual(expected);
      });

      it('$gte', () => {
        const result = collection.findRecords({measureTimestamp: {$gte: 3}});
        const expected = [
          {dataType: 'queue', instance: 'instance 2', measureName: 'measure 2', measureTimestamp: 3, measureValue: 3},
          {dataType: 'queue', instance: 'instance 3', measureName: 'measure 3', measureTimestamp: 5, measureValue: 6},
        ];
        expect(result).toEqual(expected);
      });

      it('$lt', () => {
        const result = collection.findRecords({measureTimestamp: {$lte: 3}});
        const expected = [
          {dataType: 'queue', instance: 'instance 1', measureName: 'measure 1', measureTimestamp: 1, measureValue: 1},
          {dataType: 'queue', instance: 'instance 4', measureName: 'measure 1', measureTimestamp: 1, measureValue: 2},
          {dataType: 'queue', instance: 'instance 2', measureName: 'measure 2', measureTimestamp: 3, measureValue: 3},
        ];
        expect(result).toEqual(expected);
      });

      it('mixed', () => {
        const result = collection.findRecords({measureTimestamp: {$gt: 2, $lt: 5}});
        const expected = [
          {dataType: 'queue', instance: 'instance 2', measureName: 'measure 2', measureTimestamp: 3, measureValue: 3},
        ];
        expect(result).toEqual(expected);
      });
    });

    describe('mixed property', () => {
      it('$in', () => {
        const result = collection.findRecords({
          instance: {$in: ['instance 1', 'instance 2']},
          measureName: {$in: ['measure 1', 'measure 2']}
        });
        const expected = [
          {dataType: 'queue', instance: 'instance 1', measureName: 'measure 1', measureTimestamp: 1, measureValue: 1},
          {dataType: 'queue', instance: 'instance 2', measureName: 'measure 2', measureTimestamp: 3, measureValue: 3},
        ];
        expect(result).toEqual(expected);
      });
    });
  });

  describe('getRecord', () => {
    it('should return founded record if found', () => {
      const collection = new Collection();
      collection.bulkInsert(records);
      const record: RealtimeData = {
        dataType: 'queue', instance: 'instance 3', measureName: 'measure 3', measureTimestamp: 5, measureValue: 6
      };
      const result = collection.getRecord(record);
      expect(result).toEqual(record);
    });

    it('should return null if record is not found', () => {
      const collection = new Collection();
      collection.bulkInsert(records);
      const record: RealtimeData = {
        dataType: 'queue', instance: 'instance 10', measureName: 'measure 3', measureTimestamp: 5, measureValue: 6
      };
      const result = collection.getRecord(record);
      expect(result).toBeNull();
    });
  });
})
;
