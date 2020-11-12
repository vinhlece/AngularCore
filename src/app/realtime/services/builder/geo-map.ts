import {GeoMapWidget} from '../../../widgets/models';
import {GeoMapColorEvaluator} from '../evaluator/color';
import {GeoMapDataLabelsEvaluator} from '../evaluator/data-labels';
import {GeoMapNameEvaluator} from '../evaluator/name';
import {GeoMapSeriesPointsEvaluator} from '../evaluator/points';
import {GeoMapTypeEvaluator} from '../evaluator/type';
import {HighchartsDataBuilder} from './builder';
import {ColorPalette, InstanceColor} from '../../../common/models/index';

export class GeoMapDataBuilder extends HighchartsDataBuilder {
  constructor(widget: GeoMapWidget, colorPalette: ColorPalette, instanceColors: InstanceColor[]) {
    super();
    this.typeEvaluator = new GeoMapTypeEvaluator();
    this.nameEvaluator = new GeoMapNameEvaluator();
    this.pointsEvaluator = new GeoMapSeriesPointsEvaluator(instanceColors);
    this.colorEvaluator = new GeoMapColorEvaluator(widget.stateColor);
    this.dataLabelsEvaluator = new GeoMapDataLabelsEvaluator();
  }
}
