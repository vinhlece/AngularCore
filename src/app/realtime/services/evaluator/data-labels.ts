import {DataSet, GroupKey} from '../../models';
import {PropertyEvaluator} from '../converters';

export class GeoMapDataLabelsEvaluator implements PropertyEvaluator<string> {
  evaluate(data: DataSet, key: GroupKey): any {
    return {
      enabled: true,
      format: '{point.capital}',
      // color: '#333', // change label color
    };
  }
}
