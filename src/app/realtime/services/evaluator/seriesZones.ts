import {DataSet, GroupKey} from '../../models/index';
import {PropertyEvaluator} from '../converters/index';
import {KpiThreshold, Predicted} from '../../models/constants';
import {getPropertiesFromGroupKey} from '../grouper/grouper';

export class SeriesZonesEvaluator implements PropertyEvaluator<any> {

  public seriesData: any;

  constructor() {
  }

  evaluate(data: DataSet, key: GroupKey): any {
    const group = getPropertiesFromGroupKey(key).group;
    if (group === KpiThreshold.Greater.value || group === KpiThreshold.Lesser.value) {
      return null;
    }
    let index = data.findIndex(item => item.metricCalcType && item.metricCalcType.toLowerCase() === Predicted);
    if (index > 0) {
      index--;
    }
    const value = this.getValue(data, index);
    return [
      {
        value: value
      },
      {
        dashStyle: 'dash'
      }
    ];
  }

  protected getValue(data: DataSet, index: number) {
    return (index < 0 || index >= data.length) ? null : data[index].measureTimestamp;
  }
}
