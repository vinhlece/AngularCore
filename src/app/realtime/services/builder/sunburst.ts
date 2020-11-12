import {SunburstSeriesPointsEvaluator} from '../evaluator/points';
import {HighchartsDataBuilder} from './builder';
import {ColorPalette, InstanceColor} from '../../../common/models/index';

export class SunburstDataBuilder extends HighchartsDataBuilder {
  constructor(colorPalette: ColorPalette, instanceColors: InstanceColor[]) {
    super();
    this.pointsEvaluator = new SunburstSeriesPointsEvaluator(colorPalette, instanceColors);
  }
}
