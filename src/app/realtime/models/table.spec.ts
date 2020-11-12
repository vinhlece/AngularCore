import {RealtimeData} from './index';
import {Table} from './table';

describe('Table', () => {
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
      const record = records[0];
      const table = new Table();
      table.insert(record);
      expect(table.size()).toEqual(1);
      expect(table.getRecord(record)).toEqual(record);
      expect(table.records).toEqual([record]);
      expect(table.newCollections.length).toEqual(1);
      expect(table.newCollections[0].records).toEqual([record]);
    });

    it('should process record before insert', () => {
      const record = records[0];
      const proceedRecord = {...record, measureValue: 12};
      const strategy = jasmine.createSpyObj('strategy', ['process']);
      strategy.process.and.returnValue(proceedRecord);

      const table = new Table();
      table.insert(record, strategy);
      expect(strategy.process).toHaveBeenCalledWith(record);
      expect(table.size()).toEqual(1);
      expect(table.getRecord(record)).toEqual(proceedRecord);
    });

    it('should do nothing if record already exists', () => {
      const record = records[0];
      const table = new Table();
      table.insert(record);
      table.insert(record);
      expect(table.size()).toEqual(1);
      expect(table.getRecord(record)).toEqual(record);
      expect(table.records).toEqual([record]);
      expect(table.newCollections.length).toEqual(1);
      expect(table.newCollections[0].records).toEqual([record]);
    });
  });

  describe('update', () => {
    it('should update single record', () => {
      const record = records[0];
      let updatedRecord = {...record, measureValue: 22};
      const table = new Table();
      table.insert(record);
      table.update(updatedRecord);
      expect(table.size()).toEqual(1);
      expect(table.getRecord(record)).toEqual(updatedRecord);
      expect(table.records).toEqual([updatedRecord]);
      expect(table.updatedCollections.length).toEqual(1);
      expect(table.updatedCollections[0].records).toEqual([updatedRecord]);

      updatedRecord = {...record, measureValue: 12};
      table.update(updatedRecord);
      expect(table.updatedCollections.length).toEqual(1);
      expect(table.updatedCollections[0].records).toEqual([updatedRecord]);
    });

    it('should do nothing if record does not exist', () => {
      const record = records[0];
      const table = new Table();
      table.update(record);
      expect(table.size()).toEqual(0);
      expect(table.getRecord(record)).toBeNull();
      expect(table.records).toEqual([]);
      expect(table.updatedCollections.length).toEqual(0);
    });
  });

  describe('remove', () => {
    it('should remove record', () => {
      const record = records[1];
      const table = new Table();
      table.bulkInsert(records);
      table.remove(record);
      const expected: RealtimeData[] = [
        {dataType: 'queue', instance: 'instance 1', measureName: 'measure 1', measureTimestamp: 1, measureValue: 1},
        {dataType: 'queue', instance: 'instance 2', measureName: 'measure 2', measureTimestamp: 3, measureValue: 3},
        {dataType: 'queue', instance: 'instance 3', measureName: 'measure 3', measureTimestamp: 5, measureValue: 6},
      ];
      expect(table.records).toEqual(expected);
    });
  });
});
