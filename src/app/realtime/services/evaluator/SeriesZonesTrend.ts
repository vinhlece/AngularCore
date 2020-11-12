
import {SeriesZonesEvaluator} from './seriesZones';
import {DataSet} from '../../models/index';

export class SeriesZonesTrendEvaluator extends SeriesZonesEvaluator {
  protected getValue(data: DataSet, index: number) {
    return (index < 0 || index >= this.seriesData.length) ? null : this.seriesData[index].x;
  }
}
