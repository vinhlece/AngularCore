import {ProcessStrategy, RealtimeData, Storage} from '.';
import {QueryItem} from '../../shared/collection';
import {Tree} from '../../shared/collection/tree';
import {Collection} from './collection';
import {Indexed} from './indexed';
import {PrimitiveWrapper} from './key';
import {TimeRange} from '../../dashboard/models/index';
import {Widget} from '../../widgets/models/index';
import {DisplayMode} from '../../dashboard/models/enums';
import * as _ from 'lodash';
import {ConvertMode} from './enum';

export class Table implements Storage {
  private _tree: Tree<PrimitiveWrapper, Indexed>;

  constructor(tree = null) {
    this._tree = tree || this.createTree();
  }

  get records(): RealtimeData[] {
    return this.getRecords((indexed: Indexed) => indexed.records);
  }

  get collections(): Collection[] {
    return this.getCollections((indexed: Indexed) => indexed.collections);
  }

  get newCollections(): Collection[] {
    return this.getCollections((indexed: Indexed) => indexed.newCollections);
  }

  get updatedCollections(): Collection[] {
    return this.getCollections((indexed: Indexed) => indexed.updatedCollections);
  }

  get removedCollections(): Collection[] {
    return this.getCollections((indexed: Indexed) => indexed.removedCollections);
  }

  get path(): string | number {
    return '';
  }

  insert(record: RealtimeData, processStrategy?: ProcessStrategy): RealtimeData {
    const proceedRecord = this.processRecord(record, processStrategy);

    if (!proceedRecord) {
      return null;
    }

    let indexed = this.getIndexed(proceedRecord);
    if (!indexed) {
      const key = this.getKey(proceedRecord);
      const keyPrimitive = (item: RealtimeData) => new PrimitiveWrapper(item.group ? `${item.group}-${item.measureTimestamp}` : item.measureTimestamp);
      indexed = new Indexed(keyPrimitive, `${key.content}`);
      this._tree.insert(key, indexed);
    }
    return indexed.insert(proceedRecord);
  }

  update(record: RealtimeData, processStrategy?: ProcessStrategy): RealtimeData {
    const proceedRecord = this.processRecord(record, processStrategy);

    if (!proceedRecord) {
      return null;
    }

    const indexed = this.getIndexed(proceedRecord);
    if (indexed) {
      return indexed.update(proceedRecord);
    } else {
      return null;
    }
  }

  bulkInsert(records: RealtimeData[], processStrategy?: ProcessStrategy) {
    records.forEach((item: RealtimeData) => this.insert(item, processStrategy));
  }

  upsert(record: RealtimeData, processStrategy?: ProcessStrategy): RealtimeData {
    const rc = this.update(record, processStrategy);
    return rc ? rc : this.insert(record, processStrategy);
  }

  bulkUpsert(records: RealtimeData[], processStrategy?: ProcessStrategy) {
    records.forEach((item: RealtimeData) => this.upsert(item, processStrategy));
  }

  rebase(processStrategy?: ProcessStrategy) {
    const records = this.records;
    this._tree = this.createTree();
    this.bulkUpsert(records, processStrategy);
  }

  resetRecordsState() {
    this.values().forEach((indexed: Indexed) => indexed.resetRecordsState());
  }

  remove(record: RealtimeData): boolean {
    const indexed = this.getIndexed(record);
    if (indexed) {
      return indexed.remove(record);
    } else {
      return null;
    }
  }

  bulkRemove(records: RealtimeData[]) {
    records.forEach((record: RealtimeData) => {
      this.remove(record);
    });
  }

  getRecord(record: RealtimeData): RealtimeData {
    const indexed = this.getIndexed(record);
    return indexed ? indexed.getRecord(record) : null;
  }

  findRecords(query: { [item: string]: QueryItem }): RealtimeData[] {
    return this.values().reduce((acc: RealtimeData[], indexed: Indexed) => {
      return [...acc, ...indexed.findRecords(query)];
    }, []);
  }

  findWidgetRecords(widget: Widget, goBackTimestamp: TimeRange, displayMode?: DisplayMode | ConvertMode): RealtimeData[] {
    const instances = widget.dimensions.reduce((acc, item) => {
      const allInstances = _.union(item.systemInstances, item.customInstances);
      if (allInstances.length > 0) {
        acc.push(...allInstances.map(i => displayMode === ConvertMode.Kpi ? i : `${item.dimension}-${i}`));
      }
      return acc;
    }, []);
    if (widget.showAllData && instances.length === 0) {
      return this.values().reduce((acc: RealtimeData[], indexed: Indexed) => {
        acc.push(...indexed.findWidgetRecords(widget, goBackTimestamp, displayMode));
        return acc;
      }, []);
    }
    return instances.reduce((acc: RealtimeData[], instance: string) => {
      const indexed = this.getIndexedByKey(instance);
      if (indexed) {
        acc.push(...indexed.findWidgetRecords(widget, goBackTimestamp, displayMode));
      }
      return acc;
    }, []);
  }

  find(query: QueryItem): Indexed[] {
    return this._tree.find(query);
  }

  size(): number {
    return this.values().reduce((acc: number, indexed: Indexed) => {
      return acc + indexed.size();
    }, 0);
  }

  isEmpty(): boolean {
    return this.size() === 0;
  }

  clone(): Storage {
    return new Table(this._tree);
  }

  private getKey(record: RealtimeData): PrimitiveWrapper {
    return new PrimitiveWrapper(record.dimension ? `${record.dimension}-${record.instance}` : record.instance);
  }

  private getIndexed(record: RealtimeData): Indexed {
    const key = this.getKey(record);
    return this._tree.get(key);
  }

  private getIndexedByKey(key: string): Indexed {
    return this._tree.get(new PrimitiveWrapper(key));
  }

  private values(): Indexed[] {
    return this._tree.values;
  }

  private createTree() {
    return new Tree<PrimitiveWrapper, Indexed>();
  }

  private getRecords(recordsGetter: (indexed: Indexed) => RealtimeData[]): RealtimeData[] {
    return this.values().reduce((acc: RealtimeData[], indexed: Indexed) => {
      acc.push(...recordsGetter(indexed));
      return acc;
    }, []);
  }

  private getCollections(collectionsGetter: (indexed: Indexed) => Collection[]): Collection[] {
    return this.values().reduce((acc: Collection[], indexed: Indexed) => {
      acc.push(...collectionsGetter(indexed));
      return acc;
    }, []);
  }

  private processRecord(record: RealtimeData, processStrategy: ProcessStrategy): RealtimeData {
    return processStrategy ? processStrategy.process(record) : record;
  }
}
