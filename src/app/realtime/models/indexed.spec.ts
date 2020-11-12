import {RealtimeData} from '.';
import {Collection} from './collection';
import {Indexed} from './indexed';
import {PrimitiveWrapper} from './key';

describe('indexed (by measure name)', () => {
  let records: RealtimeData[];

  beforeEach(() => {
    records = [
      {dataType: 'queue', instance: 'instance 3', measureName: 'measure 3', measureTimestamp: 5, measureValue: 6},
      {dataType: 'queue', instance: 'instance 4', measureName: 'measure 1', measureTimestamp: 1, measureValue: 2},
      {dataType: 'queue', instance: 'instance 4', measureName: 'measure 1', measureTimestamp: 1, measureValue: 2},
      {dataType: 'queue', instance: 'instance 2', measureName: 'measure 2', measureTimestamp: 0, measureValue: 3},
      {dataType: 'queue', instance: 'instance 1', measureName: 'measure 1', measureTimestamp: 1, measureValue: 1},
    ];
  });

  describe('insert', () => {
    it('should insert new record', () => {
      const collection = new Indexed((record: RealtimeData) => new PrimitiveWrapper(record.measureName));
      collection.insert(records[0]);
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
      const indexed = new Indexed((item: RealtimeData) => new PrimitiveWrapper(item.measureName));
      const result = indexed.insert(record, strategy);
      const expected: RealtimeData[] = [proceedRecord];

      expect(strategy.process).toHaveBeenCalledWith(record);
      expect(result).toEqual(proceedRecord);
      expect(indexed.records).toEqual(expected);
      expect(indexed.newCollections.reduce((acc: RealtimeData[], col: Collection) => [...acc, ...col.records], [])).toEqual(expected);
    });
  });

  describe('bulkInsert', () => {
    it('insert many - sort by measure name first, for each measure name sort by measure timestamp (both in ascending order)', () => {
      const collection = new Indexed((record: RealtimeData) => new PrimitiveWrapper(record.measureName));
      collection.bulkInsert(records);
      const expected: RealtimeData[] = [
        {dataType: 'queue', instance: 'instance 1', measureName: 'measure 1', measureTimestamp: 1, measureValue: 1},
        {dataType: 'queue', instance: 'instance 4', measureName: 'measure 1', measureTimestamp: 1, measureValue: 2},
        {dataType: 'queue', instance: 'instance 2', measureName: 'measure 2', measureTimestamp: 0, measureValue: 3},
        {dataType: 'queue', instance: 'instance 3', measureName: 'measure 3', measureTimestamp: 5, measureValue: 6},
      ];
      expect(collection.size()).toEqual(4);
      expect(collection.records).toEqual(expected);
    });

    it('insert many - sort by measure name in desc order, for each measure name sort by measure timestamp in asc order', () => {
      const collection = new Indexed((record: RealtimeData) => new PrimitiveWrapper(record.measureName), '', 'desc');
      collection.bulkInsert(records);
      const expected: RealtimeData[] = [
        {dataType: 'queue', instance: 'instance 3', measureName: 'measure 3', measureTimestamp: 5, measureValue: 6},
        {dataType: 'queue', instance: 'instance 2', measureName: 'measure 2', measureTimestamp: 0, measureValue: 3},
        {dataType: 'queue', instance: 'instance 1', measureName: 'measure 1', measureTimestamp: 1, measureValue: 1},
        {dataType: 'queue', instance: 'instance 4', measureName: 'measure 1', measureTimestamp: 1, measureValue: 2},
      ];
      expect(collection.size()).toEqual(4);
      expect(collection.records).toEqual(expected);
    });
  });

  describe('update', () => {
    it('should update record if it esists', () => {
      const indexed = new Indexed((record: RealtimeData) => new PrimitiveWrapper(record.measureName));
      indexed.bulkInsert(records);
      const updatedRecord = {...records[0], measureValue: 12};
      const result = indexed.update(updatedRecord);
      const expected: RealtimeData[] = [
        {dataType: 'queue', instance: 'instance 1', measureName: 'measure 1', measureTimestamp: 1, measureValue: 1},
        {dataType: 'queue', instance: 'instance 4', measureName: 'measure 1', measureTimestamp: 1, measureValue: 2},
        {dataType: 'queue', instance: 'instance 2', measureName: 'measure 2', measureTimestamp: 0, measureValue: 3},
        {dataType: 'queue', instance: 'instance 3', measureName: 'measure 3', measureTimestamp: 5, measureValue: 12},
      ];
      const updatedColsRecords = indexed.updatedCollections.reduce((acc: RealtimeData[], col: Collection) => [...acc, ...col.records], []);
      expect(result).toEqual(updatedRecord);
      expect(indexed.records).toEqual(expected);
      expect(updatedColsRecords).toEqual([updatedRecord]);
    });

    it('should do nothing if record does not exist', () => {
      const indexed = new Indexed((record: RealtimeData) => new PrimitiveWrapper(record.measureName));
      indexed.bulkInsert(records);
      const doesNotExistRecord: RealtimeData = {...records[0], dataType: 'agent'};
      const result = indexed.update(doesNotExistRecord);
      const expected: RealtimeData[] = [
        {dataType: 'queue', instance: 'instance 1', measureName: 'measure 1', measureTimestamp: 1, measureValue: 1},
        {dataType: 'queue', instance: 'instance 4', measureName: 'measure 1', measureTimestamp: 1, measureValue: 2},
        {dataType: 'queue', instance: 'instance 2', measureName: 'measure 2', measureTimestamp: 0, measureValue: 3},
        {dataType: 'queue', instance: 'instance 3', measureName: 'measure 3', measureTimestamp: 5, measureValue: 6},
      ];
      const updatedColsRecords = indexed.updatedCollections.reduce((acc: RealtimeData[], col: Collection) => [...acc, ...col.records], []);
      expect(result).toBeNull();
      expect(indexed.records).toEqual(expected);
      expect(updatedColsRecords).toEqual([]);
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
      const indexed = new Indexed((item: RealtimeData) => new PrimitiveWrapper(item.measureName));
      indexed.insert(record);
      indexed.update(record, strategy);
      const updatedColsRecords = indexed.updatedCollections.reduce((acc: RealtimeData[], col: Collection) => [...acc, ...col.records], []);
      expect(strategy.process).toHaveBeenCalledWith(record);
      expect(indexed.records).toEqual([proceedRecord]);
      expect(updatedColsRecords).toEqual([proceedRecord]);
    });
  });

  describe('upsert', () => {
    it('should update measure value of existing record', () => {
      const collection = new Indexed((record: RealtimeData) => new PrimitiveWrapper(record.measureName));
      collection.bulkInsert(records);
      const updatedRecord = {...records[0], measureValue: 12};
      const result = collection.upsert(updatedRecord);
      const expected: RealtimeData[] = [
        {dataType: 'queue', instance: 'instance 1', measureName: 'measure 1', measureTimestamp: 1, measureValue: 1},
        {dataType: 'queue', instance: 'instance 4', measureName: 'measure 1', measureTimestamp: 1, measureValue: 2},
        {dataType: 'queue', instance: 'instance 2', measureName: 'measure 2', measureTimestamp: 0, measureValue: 3},
        {dataType: 'queue', instance: 'instance 3', measureName: 'measure 3', measureTimestamp: 5, measureValue: 12},
      ];
      expect(result).toEqual(updatedRecord);
      expect(collection.records).toEqual(expected);
    });

    it('should add new record if it does not exist', () => {
      const collection = new Indexed((record: RealtimeData) => new PrimitiveWrapper(record.measureName));
      collection.bulkInsert(records);
      const newRecord = {...records[0], measureName: 'measure 12'};
      const result = collection.upsert(newRecord);
      const expected: RealtimeData[] = [
        {dataType: 'queue', instance: 'instance 1', measureName: 'measure 1', measureTimestamp: 1, measureValue: 1},
        {dataType: 'queue', instance: 'instance 4', measureName: 'measure 1', measureTimestamp: 1, measureValue: 2},
        {dataType: 'queue', instance: 'instance 3', measureName: 'measure 12', measureTimestamp: 5, measureValue: 6},
        {dataType: 'queue', instance: 'instance 2', measureName: 'measure 2', measureTimestamp: 0, measureValue: 3},
        {dataType: 'queue', instance: 'instance 3', measureName: 'measure 3', measureTimestamp: 5, measureValue: 6},
      ];
      expect(result).toEqual(newRecord);
      expect(collection.records).toEqual(expected);
    });
  });

  describe('bulkUpsert', () => {

  });

  describe('remove', () => {
    it('remove one', () => {
      const indexed = new Indexed((record: RealtimeData) => new PrimitiveWrapper(record.measureName));
      indexed.bulkInsert(records);
      indexed.remove(records[2]);
      const expected: RealtimeData[] = [
        {dataType: 'queue', instance: 'instance 1', measureName: 'measure 1', measureTimestamp: 1, measureValue: 1},
        {dataType: 'queue', instance: 'instance 2', measureName: 'measure 2', measureTimestamp: 0, measureValue: 3},
        {dataType: 'queue', instance: 'instance 3', measureName: 'measure 3', measureTimestamp: 5, measureValue: 6},
      ];
      expect(indexed.records).toEqual(expected);
      expect(indexed.updatedCollections.length).toEqual(1);
      expect(indexed.updatedCollections[0].size()).toEqual(1);

      indexed.remove(records[4]);
      expect(indexed.updatedCollections.length).toEqual(0);
      expect(indexed.removedCollections.length).toEqual(1);
      expect(indexed.removedCollections[0].size()).toEqual(0);
    });

    it('remove many', () => {
      const collection = new Indexed((record: RealtimeData) => new PrimitiveWrapper(record.measureName));
      collection.bulkInsert(records);
      collection.bulkRemove([records[1], records[3]]);
      const expected: RealtimeData[] = [
        {dataType: 'queue', instance: 'instance 1', measureName: 'measure 1', measureTimestamp: 1, measureValue: 1},
        {dataType: 'queue', instance: 'instance 3', measureName: 'measure 3', measureTimestamp: 5, measureValue: 6},
      ];
      expect(collection.records).toEqual(expected);
    });
  });

  describe('get', () => {
    it('should return record if it exist', () => {
      const collection = new Indexed((record: RealtimeData) => new PrimitiveWrapper(record.measureName));
      collection.bulkInsert(records);
      const expectedRecord: RealtimeData = records[0];
      const result = collection.getRecord(expectedRecord);
      expect(result).toEqual(expectedRecord);
    });

    it('should return null if record does not exist', () => {
      const collection = new Indexed((record: RealtimeData) => new PrimitiveWrapper(record.measureName));
      collection.bulkInsert(records);
      const rc: RealtimeData = {...records[0], dataType: 'agent'};
      const result = collection.getRecord(rc);
      expect(result).toBeNull();
    });
  });

  describe('findRecords', () => {
    let collection: Indexed;

    beforeEach(() => {
      collection = new Indexed((record: RealtimeData) => new PrimitiveWrapper(record.measureName));
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
          {dataType: 'queue', instance: 'instance 2', measureName: 'measure 2', measureTimestamp: 0, measureValue: 3},
        ];
        expect(result).toEqual(expected);
      });
    });

    describe('by measure name', () => {
      it('$eq', () => {
        const result = collection.findRecords({measureName: {$eq: 'measure 2'}});
        const expected = [
          {dataType: 'queue', instance: 'instance 2', measureName: 'measure 2', measureTimestamp: 0, measureValue: 3},
        ];
        expect(result).toEqual(expected);
      });

      it('$in', () => {
        const result = collection.findRecords({measureName: {$in: ['measure 1', 'measure 2']}});
        const expected = [
          {dataType: 'queue', instance: 'instance 1', measureName: 'measure 1', measureTimestamp: 1, measureValue: 1},
          {dataType: 'queue', instance: 'instance 4', measureName: 'measure 1', measureTimestamp: 1, measureValue: 2},
          {dataType: 'queue', instance: 'instance 2', measureName: 'measure 2', measureTimestamp: 0, measureValue: 3},
        ];
        expect(result).toEqual(expected);
      });

      it('mixed', () => {
        const result = collection.findRecords({measureName: {$gt: 'measure 1', $in: ['measure 1', 'measure 2']}});
        const expected = [
          {dataType: 'queue', instance: 'instance 2', measureName: 'measure 2', measureTimestamp: 0, measureValue: 3},
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
          {dataType: 'queue', instance: 'instance 3', measureName: 'measure 3', measureTimestamp: 5, measureValue: 6},
        ];
        expect(result).toEqual(expected);
      });

      it('$lt', () => {
        const result = collection.findRecords({measureTimestamp: {$lt: 5}});
        const expected = [
          {dataType: 'queue', instance: 'instance 1', measureName: 'measure 1', measureTimestamp: 1, measureValue: 1},
          {dataType: 'queue', instance: 'instance 4', measureName: 'measure 1', measureTimestamp: 1, measureValue: 2},
          {dataType: 'queue', instance: 'instance 2', measureName: 'measure 2', measureTimestamp: 0, measureValue: 3},
        ];
        expect(result).toEqual(expected);
      });

      it('$gte', () => {
        const result = collection.findRecords({measureTimestamp: {$gte: 3}});
        const expected = [
          {dataType: 'queue', instance: 'instance 3', measureName: 'measure 3', measureTimestamp: 5, measureValue: 6},
        ];
        expect(result).toEqual(expected);
      });

      it('$lt', () => {
        const result = collection.findRecords({measureTimestamp: {$lte: 3}});
        const expected = [
          {dataType: 'queue', instance: 'instance 1', measureName: 'measure 1', measureTimestamp: 1, measureValue: 1},
          {dataType: 'queue', instance: 'instance 4', measureName: 'measure 1', measureTimestamp: 1, measureValue: 2},
          {dataType: 'queue', instance: 'instance 2', measureName: 'measure 2', measureTimestamp: 0, measureValue: 3},
        ];
        expect(result).toEqual(expected);
      });

      it('mixed', () => {
        const result = collection.findRecords({measureTimestamp: {$gt: 2, $lt: 6}});
        const expected = [
          {dataType: 'queue', instance: 'instance 3', measureName: 'measure 3', measureTimestamp: 5, measureValue: 6},
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
          {dataType: 'queue', instance: 'instance 2', measureName: 'measure 2', measureTimestamp: 0, measureValue: 3},
        ];
        expect(result).toEqual(expected);
      });
    });
  });
});
