import {DataSet, GroupKey} from '../../models';
import {PropertyEvaluator} from '../converters';

export class BarSeriesTimestampEvaluator implements PropertyEvaluator<any> {
  evaluate(dataSet: DataSet, key: GroupKey): any {
    return dataSet[0].measureTimestamp;
  }
}
