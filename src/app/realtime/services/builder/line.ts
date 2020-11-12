import {KpiSeriesColorEvaluator} from '../evaluator/color';
import {HighchartsLineSeriesNameEvaluator} from '../evaluator/name';
import {LineSeriesPointsEvaluator} from '../evaluator/points';
import {HighchartsDataBuilder} from './builder';
import {ColorPalette, InstanceColor} from '../../../common/models/index';
import {SeriesZonesEvaluator} from '../evaluator/seriesZones';
import {StepEvaluator} from '../evaluator/step';
import {LinkEvaluator} from '../evaluator/link';
import {IdentityEvaluator} from '../evaluator/identity';
import {ItemEvaluator} from '../evaluator/item';
import {LineWidget} from '../../../widgets/models/index';

export class HighchartsLineDataBuilder extends HighchartsDataBuilder {
  constructor(colorPalette: ColorPalette, instanceColors: InstanceColor[], widget: LineWidget) {
    super();
    this.nameEvaluator = new HighchartsLineSeriesNameEvaluator(widget);
    this.pointsEvaluator = new LineSeriesPointsEvaluator();
    this.colorEvaluator = new KpiSeriesColorEvaluator(colorPalette, instanceColors);
    this.seriesZonesEvaluator = new SeriesZonesEvaluator();
    this.stepEvaluator = new StepEvaluator();
    this.identityEvaluator = new IdentityEvaluator();
    this.linkEvaluator = new LinkEvaluator();
    this.itemEvaluator = new ItemEvaluator();
  }
}

