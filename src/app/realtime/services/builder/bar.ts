import {PatternFillColorEvaluator} from '../evaluator/color';
import {HighchartsBarSeriesNameEvaluator} from '../evaluator/name';
import {HighchartsBarSeriesPointsEvaluator} from '../evaluator/points';
import {HighchartsDataBuilder} from './builder';
import {ColorPalette, InstanceColor} from '../../../common/models/index';
import {WidgetMode} from '../../../widgets/constants/widget-types';
import {DataGroup, GroupKey, WidgetData} from '../../models/index';
import {ChartStyleEvaluator} from '../evaluator/chartStyle';
import {BarWidget} from '../../../widgets/models/index';
import {ItemEvaluator} from '../evaluator/item';

export class HighchartsBarDataBuilder extends HighchartsDataBuilder {
  constructor(widget: BarWidget, colorPalette: ColorPalette, instanceColors: InstanceColor[]) {
    super();
    this.nameEvaluator = new HighchartsBarSeriesNameEvaluator(widget);
    this.pointsEvaluator = new HighchartsBarSeriesPointsEvaluator(widget);
    this.colorEvaluator = new PatternFillColorEvaluator(colorPalette, instanceColors, widget.mode.value === WidgetMode.TimeRange);
    this.chartStyleEvaluator = new ChartStyleEvaluator();
    this.itemEvaluator = new ItemEvaluator();
  }

  generate(dataGroup: DataGroup, currentTimestamp: number): WidgetData {
    let current = 0;
    Object.keys(dataGroup).forEach((key: GroupKey) => {
      const data = dataGroup[key];
      data.forEach(realTimeData => {
        if (realTimeData.measureTimestamp > current) {
          current = realTimeData.measureTimestamp;
        }
      });
    });
    return super.generate(dataGroup, current);
  }
}
