import * as createTree from 'functional-red-black-tree';
import {isNullOrUndefined} from 'util';
import {Comparable, QueryItem} from '.';
import {PrimitiveWrapper} from '../../realtime/models/key';

export class Tree<K extends Comparable<K>, V> {
  private _tree;

  constructor(order: string = 'asc') {
    this._tree = this.createTree(order);
  }

  get values(): V[] {
    return this._tree.values;
  }

  get end() {
    return this._tree.end;
  }

  insert(key: K, value: V): boolean {
    this.checkKey(key);
    if (!this.get(key)) {
      this._tree = this._tree.insert(key, value);
      return true;
    }
    return false;
  }

  update(key: K, value: V): boolean {
    this.checkKey(key);
    const it = this._tree.find(key);
    if (it.node) {
      this._tree = it.update(value);
      return true;
    }
    return false;
  }

  remove(key: K) {
    this.checkKey(key);
    const value = this.get(key);
    if (value) {
      this._tree = this._tree.remove(key);
    }
    return value;
  }

  get(key: K): V {
    this.checkKey(key);
    return this._tree.get(key);
  }

  find(query: QueryItem): V[] {
    const result = [];
    this._tree.forEach((key: K, value: V) => {
      if (this.check(query, key)) {
        result.push(value);
      }
    });
    return result;
  }

  $lte(key: any) {
    const data = this._tree.le(new PrimitiveWrapper(key));
    return data && data.value ? data.value.records : [];
  }

  $eq(keys: any) {
    return keys.reduce((acc, key) => {
      const data = this._tree.find(new PrimitiveWrapper(key));
      if (data && data.value) {
        acc.push(...data.value.records);
      }
      return acc;
    }, []);
  }

  size(): number {
    return this._tree.length;
  }

  private createTree(order: string) {
    const cmp = (a: K, b: K) => {
      return order === 'asc' ? a.compareWith(b) : -1 * a.compareWith(b);
    };
    return createTree(cmp);
  }

  private checkKey(key: K) {
    if (!key) {
      throw new Error('Key is null or undefined.');
    }
  }

  private check(item: QueryItem, key: K): boolean {
    if (!item || Object.keys(item).length === 0) {
      return false;
    }
    let isMatched = true;
    if (item.$eq) {
      isMatched = key.compareWith(item.$eq) === 0;
    }
    if (item.$gt) {
      isMatched = isMatched && key.compareWith(item.$gt) > 0;
    }
    if (item.$lt) {
      isMatched = isMatched && key.compareWith(item.$lt) < 0;
    }
    if (item.$gte) {
      isMatched = isMatched && key.compareWith(item.$gte) >= 0;
    }
    if (item.$lte) {
      isMatched = isMatched && key.compareWith(item.$lte) <= 0;
    }
    if (item.$in) {
      isMatched = isMatched && !isNullOrUndefined(item.$in.find((el: K) => key.compareWith(el) === 0));
    }
    return isMatched;
  }
}
