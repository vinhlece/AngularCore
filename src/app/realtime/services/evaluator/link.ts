import { DataSet, GroupKey } from '../../models/index';
import { PropertyEvaluator } from '../converters/index';
import { KpiThreshold } from '../../models/constants';
import { getPropertiesFromGroupKey } from '../grouper/grouper';
import {ColorStyle} from '../../models/enum';

export class LinkEvaluator implements PropertyEvaluator<any> {

  constructor() {
  }

  evaluate(data: DataSet, key: GroupKey): any {
    const group = getPropertiesFromGroupKey(key).group;
    const instance = getPropertiesFromGroupKey(key).instance;
    const measure = getPropertiesFromGroupKey(key).measure;
    if (group === KpiThreshold.Greater.value || group === KpiThreshold.Lesser.value) {
      return `${measure}-${instance}`;
    }
    return null;
  }
}
