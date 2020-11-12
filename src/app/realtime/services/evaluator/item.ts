import {DataSet, GroupKey} from '../../models/index';
import {PropertyEvaluator} from '../converters/index';

export class ItemEvaluator implements PropertyEvaluator<number> {

  constructor() {
  }

  evaluate(data: DataSet, key: GroupKey): any {
    const { measureName, instance, window } = data[0];
    return { measureName, instance, window };
  }
}
