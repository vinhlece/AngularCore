import {Collection} from './collection';
import {RealtimeData} from './index';
import * as _ from 'lodash';

export class Event extends Collection {
  protected getComparator() {
    const temp = ['measureTimestamp', 'instance', 'measureName', 'dataType'];
    return (a: RealtimeData, b: RealtimeData) => {
      const keys = _.union(temp, Object.keys(a))
        .filter(key => key !== 'measureValue' && key !== 'measureTimestamp');
      return keys.reduce((acc, key) => {
        return acc || this.compare(a[key], b[key]);
      }, this.compare(a.measureTimestamp, b.measureTimestamp));
    };
  }
}
