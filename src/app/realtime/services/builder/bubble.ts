import {BubbleNameEvaluator} from '../evaluator/name';
import {BubbleSeriesPointsEvaluator} from '../evaluator/points';
import {HighchartsDataBuilder} from './builder';
import {ColorPalette} from '../../../common/models/index';
import {BubbleWidget} from '../../../widgets/models/index';
import {SeriesColorEvaluator} from '../evaluator/color';


export class HighchartsBuubleDataBuilder extends HighchartsDataBuilder {
  constructor(widget: BubbleWidget, colorPalette: ColorPalette) {
    super();
    this.nameEvaluator = new BubbleNameEvaluator();
    this.pointsEvaluator = new BubbleSeriesPointsEvaluator();
    this.colorEvaluator = new SeriesColorEvaluator(colorPalette);
  }
}
