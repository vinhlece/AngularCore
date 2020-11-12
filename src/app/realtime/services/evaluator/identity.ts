import {PropertyEvaluator} from '../converters/index';
import {DataSet, GroupKey} from '../../models/index';

export class IdentityEvaluator implements PropertyEvaluator<any> {
  evaluate(dataSet: DataSet, key: GroupKey): any {
    const firstRecord = dataSet[0];
    return `${firstRecord.measureName}-${firstRecord.instance}`;
  }
}
