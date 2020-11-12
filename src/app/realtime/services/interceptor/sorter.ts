import * as _ from 'lodash';
import {isNullOrUndefined} from 'util';
import {Interceptor} from '.';
import {DataSet, RealtimeData} from '../../models';
import {INSTANCE, MEASURE_TIMESTAMP} from '../../models/constants';
import {Indexed} from '../../models/indexed';
import {PrimitiveWrapper} from '../../models/key';
import {formatMeasureValue} from '../../utils/formatter';

function checkOrder(order: string): string {
  if (order !== 'asc' && order !== 'desc') {
    throw new Error('Sorting order is invalid.');
  }
  return order;
}

export abstract class SinglePropertySorter implements Interceptor {
  private _order: string;

  constructor(order: string) {
    this._order = checkOrder(order);
  }

  abstract getSortProperty(): string;

  intercept(data: DataSet): DataSet {
    if (isNullOrUndefined(data)) {
      throw new TypeError('A null object is not valid for sorting.');
    }

    return _.orderBy(data, [this.getSortProperty()], [this._order]);
  }
}

export class TimestampSorter extends SinglePropertySorter {
  constructor(order: string = 'asc') {
    super(order);
  }

  getSortProperty(): string {
    return MEASURE_TIMESTAMP;
  }
}

export class InstanceSorter extends SinglePropertySorter {
  constructor(order: string = 'asc') {
    super(order);
  }

  getSortProperty(): string {
    return INSTANCE;
  }
}

export class InstanceTimestampSorter implements Interceptor {
  private _instanceOrder: string;
  private _timestampOrder: string;

  constructor(instanceOrder: string = 'asc', timestampOrder: string = 'asc') {
    this._instanceOrder = checkOrder(instanceOrder);
    this._timestampOrder = checkOrder(timestampOrder);
  }

  intercept(data: DataSet): DataSet {
    if (isNullOrUndefined(data)) {
      throw new TypeError('A null object is not valid for sorting.');
    }

    const groupFn = (record: RealtimeData) => new PrimitiveWrapper(record.instance);
    const indexed = new Indexed(groupFn, '', this._instanceOrder, this._timestampOrder);
    indexed.bulkInsert(data);
    return indexed.records;
  }
}

export class MeasureValueSorter {
  private _order: string;

  constructor(order: string = 'asc') {
    this._order = order;
  }

  intercept(data: DataSet): DataSet {
    if (isNullOrUndefined(data)) {
      throw new TypeError('A null object is not valid for sorting.');
    }

    data.sort((a: RealtimeData, b: RealtimeData) => {
      const factor = this._order === 'asc' ? 1 : -1;
      return factor * (formatMeasureValue(a.measureValue) - formatMeasureValue(b.measureValue));
    });
    return data;
  }
}
