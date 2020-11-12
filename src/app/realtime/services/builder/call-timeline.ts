import {CallTimeLineWidget} from '../../../widgets/models';
import {HighchartsDataBuilder} from './builder';
import {CallTimeLinePointsEvaluator} from '../evaluator/points';
import {CallTimeLineNameEvaluator} from '../evaluator/name';
import {ColorPalette} from '../../../common/models/index';

export class CallTimelineBuilder extends HighchartsDataBuilder {
  constructor(widget: CallTimeLineWidget, colorPalette: ColorPalette) {
    super();
    this.nameEvaluator = new CallTimeLineNameEvaluator(widget);
    this.pointsEvaluator = new CallTimeLinePointsEvaluator(widget, colorPalette);
  }
}
