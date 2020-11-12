import {DataSet, GroupKey} from '../../models/index';
import {PropertyEvaluator} from '../converters/index';

export class ChartStyleEvaluator implements PropertyEvaluator<number> {

  constructor() {
  }

  evaluate(data: DataSet, key: GroupKey): number {
    return data[0].group ? data[0].group : 0;
  }
}
