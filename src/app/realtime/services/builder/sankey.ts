import {HighchartsDataBuilder} from './builder';
import {RealTimeDataProcessor} from '../index';
import {SankeyPointEvaluator} from '../evaluator/points';
import {SankeyNameEvaluator} from '../evaluator/name';
import {SankeyNodesEvaluator} from '../evaluator/nodes';
import {SankeyWidget} from '../../../widgets/models/index';
import {ColorPalette, InstanceColor} from '../../../common/models/index';

export class HighchartsSankeyDataBuilder extends HighchartsDataBuilder {
  constructor(processor: RealTimeDataProcessor, widget: SankeyWidget, colorPalette: ColorPalette, instanceColors: InstanceColor[]) {
    super();
    this.nameEvaluator = new SankeyNameEvaluator();
    this.pointsEvaluator = new SankeyPointEvaluator(processor);
    this.nodesEvaluator = new SankeyNodesEvaluator(widget, colorPalette, instanceColors);
  }
}
