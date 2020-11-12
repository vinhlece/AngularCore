import {ProcessStrategy, RealtimeData, Storage} from '.';
import {QueryItem} from '../../shared/collection';
import {Tree} from '../../shared/collection/tree';
import {Collection} from './collection';
import {PrimitiveWrapper} from './key';
import {TimeRange} from '../../dashboard/models/index';
import {Widget} from '../../widgets/models/index';
import {DisplayMode} from '../../dashboard/models/enums';
import {ConvertMode, TreeExpression} from './enum';

interface CollectionsState {
  newCollections: Collection[];
  updatedCollections: Collection[];
}

export class Indexed implements Storage {
  private _tree: Tree<PrimitiveWrapper, Collection>;
  private _groupFn: (record: RealtimeData) => PrimitiveWrapper;
  private _keyOrder: string;
  private _recordOrder: string;
  private _state: CollectionsState;
  private _path: string | number;

  constructor(groupFn: (record: RealtimeData) => PrimitiveWrapper,
              path: string | number = '',
              keyOrder = 'asc',
              recordOrder = 'asc',
              state = null,
              tree = null) {
    this._groupFn = groupFn;
    this._keyOrder = keyOrder;
    this._recordOrder = recordOrder;
    this._path = path;
    this._state = state || this.createInitialState();
    this._tree = tree || this.createTree();
  }

  get records(): RealtimeData[] {
    return this.getRecords((collection: Collection) => collection.records);
  }

  get collections(): Collection[] {
    return this.values();
  }

  get newCollections(): Collection[] {
    return this._state.newCollections;
  }

  get updatedCollections(): Collection[] {
    return this._state.updatedCollections.filter((collection: Collection) => collection.size() > 0);
  }

  get removedCollections(): Collection[] {
    return this._state.updatedCollections.filter((collection: Collection) => collection.size() === 0);
  }

  get path(): string | number {
    return this._path;
  }

  insert(record: RealtimeData, processStrategy?: ProcessStrategy): RealtimeData {
    const proceedRecord = this.processRecord(record, processStrategy);

    if (!proceedRecord) {
      return null;
    }

    const collection = this.getCollection(proceedRecord);
    if (collection) {
      return collection.insert(proceedRecord);
    } else {
      return this.createCollection(proceedRecord);
    }
  }

  update(record: RealtimeData, processStrategy?: ProcessStrategy): RealtimeData {
    const proceedRecord = this.processRecord(record, processStrategy);

    if (!proceedRecord) {
      return null;
    }

    const collection = this.getCollection(proceedRecord);
    if (collection) {
      return this.updateCollection(collection, proceedRecord);
    } else {
      return null;
    }
  }

  bulkInsert(records: RealtimeData[], processStrategy?: ProcessStrategy) {
    records.forEach((record: RealtimeData) => this.insert(record, processStrategy));
  }

  upsert(record: RealtimeData, processStrategy?: ProcessStrategy) {
    const rc = this.update(record, processStrategy);
    return rc ? rc : this.insert(record, processStrategy);
  }

  bulkUpsert(records: RealtimeData[], processStrategy?: ProcessStrategy) {
    records.forEach((record: RealtimeData) => this.upsert(record, processStrategy));
  }

  remove(record: RealtimeData): boolean {
    const collection = this.getCollection(record);
    if (collection) {
      const result = collection.remove(record);
      if (result) {
        this.addUpdatedCollections(collection);
        if (collection.size() === 0) {
          this._tree.remove(this.getKey(record));
        }
      }
      return result;
    }
    return false;
  }

  bulkRemove(records: RealtimeData[]) {
    records.forEach((record: RealtimeData) => this.remove(record));
  }

  rebase(processStrategy?: ProcessStrategy) {
    const records = this.records;
    this._tree = this.createTree();
    this.bulkUpsert(records, processStrategy);
  }

  resetRecordsState() {
    this.collections.forEach((collection: Collection) => collection.resetRecordsState());
    this._state = this.createInitialState();
  }

  getRecord(record: RealtimeData): RealtimeData {
    const collection = this.getCollection(record);
    if (collection) {
      return collection.getRecord(record);
    }
    return null;
  }

  findRecords(query: { [item: string]: QueryItem }): RealtimeData[] {
    return this.values().reduce((result: RealtimeData[], collection: Collection) => {
      return [
        ...result,
        ...collection.findRecords(query)
      ];
    }, []);
  }

  findWidgetRecords(widget: Widget, goBackTimestamp: TimeRange, displayMode?: DisplayMode | ConvertMode): RealtimeData[] {
    const mode = displayMode ? displayMode : widget['displayMode'];
    switch (mode) {
      case (DisplayMode.Historical): {
        const goback = this.getGobackData(goBackTimestamp);
        return goback ? goback : this.getLatest();
      }
      case (DisplayMode.Timestamp): {
        const historical = this.getHistoricalData(widget.timestamps);
        return historical ? historical : this.getLatest();
      }
      case (DisplayMode.Latest): {
        return this.getLatest();
      }
      case (ConvertMode.Combine): {
        const data = this.getLatest();
        const goback = this.getGobackData(goBackTimestamp);
        if (goback) {
          data.push(...goback);
        }
        const historical = this.getHistoricalData(widget.timestamps);
        if (historical) {
          data.push(...historical);
        }
        return data;
      }
      default: {
        return this.records;
      }
    }
  }

  find(query: QueryItem): Collection[] {
    return this._tree.find(query);
  }

  size() {
    return this.values().reduce((size: number, collection: Collection) => (size + collection.size()), 0);
  }

  isEmpty() {
    return this.size() === 0;
  }

  clone(): Storage {
    return new Indexed(this._groupFn, this._path, this._keyOrder, this._recordOrder, this._state, this._tree);
  }

  private getGobackData(goBackTimestamp: TimeRange): RealtimeData[] {
    if (goBackTimestamp && goBackTimestamp.endTimestamp) {
      return this.getByQuery(TreeExpression.$lte, goBackTimestamp.endTimestamp);
    }
    return null;
  }

  private getHistoricalData(timestamps: number[]): RealtimeData[] {
    if (timestamps && timestamps.length > 0) {
      return this.getByQuery(TreeExpression.$eq, timestamps);
    }
    return null;
  }

  private getLatest(): RealtimeData[] {
    const max = this._tree.end;
    return max && max.value ? max.value.records : [];
  }

  private getByQuery(expression: TreeExpression, value: any): RealtimeData[] {
    return this._tree[expression](value);
  }

  private createTree(): Tree<PrimitiveWrapper, Collection> {
    return new Tree<PrimitiveWrapper, Collection>(this._keyOrder);
  }

  private createInitialState(): CollectionsState {
    return {
      newCollections: [],
      updatedCollections: [],
    };
  }

  private values(): Collection[] {
    return this._tree.values;
  }

  private getCollection(record: RealtimeData): Collection {
    return this._tree.get(this.getKey(record));
  }

  private getKey(record: RealtimeData): PrimitiveWrapper {
    return this._groupFn(record);
  }

  private updateCollection(collection: Collection, record: RealtimeData): RealtimeData {
    const result = collection.update(record);
    if (!result) {
      return null;
    }
    this.addUpdatedCollections(collection);
    return result;
  }

  private createCollection(record: RealtimeData): RealtimeData {
    const key = this.getKey(record);
    const collection = new Collection(this._recordOrder, key.content);
    const result = collection.insert(record);
    if (!result) {
      return null;
    }
    this._tree.insert(key, collection);
    this._state.newCollections.push(collection);
    return result;
  }

  private getRecords(recordsGetter: (collection: Collection) => RealtimeData[]): RealtimeData[] {
    return this.collections.reduce((acc: RealtimeData[], collection: Collection) => {
      acc.push(...recordsGetter(collection));
      return acc;
    }, []);
  }

  private processRecord(record: RealtimeData, processStrategy: ProcessStrategy): RealtimeData {
    return processStrategy ? processStrategy.process(record) : record;
  }

  private addUpdatedCollections(collection) {
    if (!this._state.updatedCollections.find((item: Collection) => item.path === collection.path)) {
      this._state.updatedCollections.push(collection);
    }
  }
}
