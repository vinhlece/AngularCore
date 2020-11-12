import {DataSet, GroupKey} from '../../models';
import {PropertyEvaluator} from '../converters';

export class GeoMapTypeEvaluator implements PropertyEvaluator<string> {
  evaluate(data: DataSet, key: GroupKey): string {
    return 'mapbubble';
  }
}
