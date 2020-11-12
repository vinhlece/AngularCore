import { DataSet, GroupKey } from '../../models/index';
import { PropertyEvaluator } from '../converters/index';
import { KpiThreshold } from '../../models/constants';
import { getPropertiesFromGroupKey } from '../grouper/grouper';

export class StepEvaluator implements PropertyEvaluator<any> {
  evaluate(data: DataSet, key: GroupKey): any {
    const group = getPropertiesFromGroupKey(key).group;
    if (group === KpiThreshold.Greater.value || group === KpiThreshold.Lesser.value) {
      return 'left';
    }
  }
}
