import {combineLatest, Observable, Subject} from 'rxjs';
import {debounceTime, map, startWith} from 'rxjs/operators';
import {QueryItem} from '../../../shared/collection';
import {isNullOrUndefined} from 'util';

export class CallTimelineDatasource {
  private _query$ = new Subject<any>();
  private _data$ = new Subject<any>();

  set data(value) {
    this._data$.next(value);
  }

  set query(value) {
    this._query$.next(value);
  }

  getData(): Observable<any> {
    const query$ = this._query$.pipe(startWith(''));
    return combineLatest(this._data$, query$).pipe(
      debounceTime(500),
      map(([data, query]) => {
        const result = [];
        let idx = 0;
        data.forEach(item => {
          const itemData = [];
          item.data.forEach(record => {
            const reducer = (isMatched: boolean, key: string) => (isMatched && this.check(query[key],
              key === 'legends' ? record.segmentType : record[key]));
            const keys = [...Object.keys(query), 'legends'];
            if (Object.keys(query).reduce(reducer, true)) {
              itemData.push({
                ...record,
                y: idx
              });
            }
          });
          if (itemData.length > 0) {
            idx ++;
            result.push({
              ...item,
              data: itemData
            });
          }
        });
        return result;
      })
    );
  }

  private check(item: QueryItem, value: any): boolean {
    let isMatched = true;
    if (isNullOrUndefined(value)) {
      return false;
    }
    if (!item) {
      return isMatched;
    }
    value = value.toLowerCase();
    if (item.$eq) {
      if (Array.isArray(item.$eq)) {
        let result = item.$eq.length <= 0;
        item.$eq.forEach(record => result = result || value === record.toLowerCase());
        isMatched = isMatched && result;
      } else {
        isMatched = value === item.$eq.toLowerCase();
      }
    } else {
      if (item.$gt) {
        if (Array.isArray(item.$gt)) {
          let result = item.$gt.length <= 0;
          item.$gt.forEach(record => result = result || value > record.toLowerCase());
          isMatched = isMatched && result;
        } else {
          isMatched = isMatched && value > item.$gt.toLowerCase();
        }
      }
      if (item.$lt) {
        if (Array.isArray(item.$lt)) {
          let result = item.$lt.length <= 0;
          item.$lt.forEach(record => result = result || value < record.toLowerCase());
          isMatched = isMatched && result;
        } else {
          isMatched = isMatched && value < item.$lt.toLowerCase();
        }
      }
      if (item.$gte) {
        if (Array.isArray(item.$gte)) {
          let result = item.$gte.length <= 0;
          item.$gte.forEach(record => result = result || value >= record.toLowerCase());
          isMatched = isMatched && result;
        } else {
          isMatched = isMatched && value >= item.$gte.toLowerCase();
        }
      }
      if (item.$lte) {
        if (Array.isArray(item.$lte)) {
          let result = item.$lte.length <= 0;
          item.$lte.forEach(record => result = result || value <= record.toLowerCase());
          isMatched = isMatched && result;
        } else {
          isMatched = isMatched && value <= item.$lte.toLowerCase();
        }
      }
      if (item.$in) {
        if (Array.isArray(item.$in)) {
          let result = item.$in.length <= 0;
          item.$in.forEach(record => result = result || record.toLowerCase().indexOf(value) >= 0);
          isMatched = isMatched && result;
        } else {
          isMatched = isMatched && item.$in.toLowerCase().indexOf(value) >= 0;
        }
      }
      if (item.$contain) {
        if (Array.isArray(item.$contain)) {
          let result = item.$contain.length <= 0;
          item.$contain.forEach(record => result = result || value.includes(record.toLowerCase()));
          isMatched = isMatched && result;
        } else {
          isMatched = isMatched && value.includes(item.$contain.toLowerCase());
        }
      }
      if (item.$notIn) {
        isMatched = isMatched && !item.$notIn.find(a => a.toLowerCase() === value);
      }
    }
    return isMatched;
  }
}
