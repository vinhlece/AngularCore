import {TabularWidget} from '../../../widgets/models';
import {TabularSeriesNameEvaluator} from '../evaluator/name';
import {TabularSeriesPointsEvaluator} from '../evaluator/points';
import {BarSeriesTimestampEvaluator} from '../evaluator/timestamp';
import {HighchartsDataBuilder} from './builder';
import {ColorPalette} from '../../../common/models/index';

export class TabularDataBuilder extends HighchartsDataBuilder {
  constructor(widget: TabularWidget, colorPalette: ColorPalette) {
    super();
    this.nameEvaluator = new TabularSeriesNameEvaluator();
    this.pointsEvaluator = new TabularSeriesPointsEvaluator(widget);
    this.timestampEvaluator = new BarSeriesTimestampEvaluator();
  }
}
