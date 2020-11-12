import {SolidGaugeSeriesPointsEvaluator} from '../evaluator/points';
import {HighchartsDataBuilder} from './builder';
import {ColorPalette} from '../../../common/models/index';

export class SolidGaugeDataBuilder extends HighchartsDataBuilder {
  constructor(colorPalette: ColorPalette) {
    super();
    this.pointsEvaluator = new SolidGaugeSeriesPointsEvaluator();
  }
}
