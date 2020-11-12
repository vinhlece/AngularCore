import * as bintrees from 'bintrees';
import {ProcessStrategy, RealtimeData, Storage} from '.';
import {QueryItem} from '../../shared/collection';
import {TimeRange} from '../../dashboard/models/index';
import {Widget} from '../../widgets/models/index';
import {DisplayMode} from '../../dashboard/models/enums';
import {ConvertMode} from './enum';

export class Collection implements Storage {
  private _tree;
  private _order: string;
  private _path: string | number;

  constructor(order = 'asc', path: string | number = 0, tree = null) {
    this._order = order;
    this._path = path;
    this._tree = tree || this.createTree();
  }

  get records(): RealtimeData[] {
    const records: RealtimeData[] = [];
    this._tree.each((record: RealtimeData) => records.push(record));
    return records;
  }

  get path(): string | number {
    return this._path;
  }

  insert(record: RealtimeData, processStrategy?: ProcessStrategy): RealtimeData {
    const proceedRecord = this.processRecord(record, processStrategy);
    if (proceedRecord) {
      const inserted = this._tree.insert(proceedRecord);
      if (inserted) {
        return proceedRecord;
      }
    }
    return null;
  }

  update(record: RealtimeData, processStrategy?: ProcessStrategy): RealtimeData {
    const proceedRecord = this.processRecord(record, processStrategy);
    if (proceedRecord) {
      const rc = this.getRecord(proceedRecord);
      if (rc) {
        rc.measureValue = proceedRecord.measureValue;
        return rc;
      }
    }
    return null;
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
  }

  remove(record: RealtimeData): boolean {
    return this._tree.remove(record);
  }

  bulkRemove(records: RealtimeData[]) {
    records.forEach((record: RealtimeData) => {
      this.remove(record);
    });
  }

  getRecord(record: RealtimeData): RealtimeData {
    return this._tree.find(record);
  }

  findRecords(query: { [item: string]: QueryItem }): RealtimeData[] {
    const records: RealtimeData[] = [];
    this._tree.each((record: RealtimeData) => {
      const reducer = (isMatched: boolean, key: string) => (isMatched && this.check(query[key], record[key]));
      if (Object.keys(query).reduce(reducer, true)) {
        records.push(record);
      }
    });
    return records;
  }

  findWidgetRecords(widget: Widget, goBackTimestamp: TimeRange, displayMode?: DisplayMode | ConvertMode): RealtimeData[] {
    return this.records;
  }

  find(query: QueryItem): Storage[] {
    throw new Error('Not implemented.');
  }

  size(): number {
    return this._tree.size;
  }

  isEmpty(): boolean {
    return this.size() === 0;
  }

  clone(): Storage {
    return new Collection(this._order, this.path, this._tree);
  }

  protected getComparator() {
    const keys = ['instance', 'measureName', 'dataType'];
    return (a: RealtimeData, b: RealtimeData) => {
      return keys.reduce((acc, key) => {
        return acc || this.compare(a[key], b[key]);
      }, this.compare(a.measureTimestamp, b.measureTimestamp));
    };
  }

  protected compare(a, b): number {
    if (a > b) {
      return this._order === 'asc' ? 1 : -1;
    } else if (a < b) {
      return this._order === 'asc' ? -1 : 1;
    }
    return 0;
  }

  private createTree() {
    const Tree = bintrees.RBTree;
    return new Tree(this.getComparator());
  }

  private check(item: QueryItem, value: any): boolean {
    let isMatched = true;
    if (item.$eq) {
      isMatched = value === item.$eq;
    } else {
      if (item.$gt) {
        isMatched = isMatched && value > item.$gt;
      }
      if (item.$lt) {
        isMatched = isMatched && value < item.$lt;
      }
      if (item.$gte) {
        isMatched = isMatched && value >= item.$gte;
      }
      if (item.$lte) {
        isMatched = isMatched && value <= item.$lte;
      }
      if (item.$in) {
        isMatched = isMatched && item.$in.indexOf(value) >= 0;
      }
      if (item.$notIn) {
        isMatched = isMatched && item.$notIn.indexOf(value) < 0;
      }
    }
    return isMatched;
  }

  private processRecord(record: RealtimeData, processStrategy: ProcessStrategy): RealtimeData {
    return processStrategy ? processStrategy.process(record) : record;
  }
}
