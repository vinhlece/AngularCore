import {SeriesColorEvaluator} from '../evaluator/color';
import {DayTrendDiffSeriesNameEvaluator, ShiftTrendDiffSeriesNameEvaluator} from '../evaluator/name';
import {DayTrendDiffSeriesPointsEvaluator, ShiftTrendDiffSeriesPointsEvaluator} from '../evaluator/points';
import {HighchartsDataBuilder} from './builder';
import {ColorPalette} from '../../../common/models/index';
import {SeriesZonesTrendEvaluator} from '../evaluator/SeriesZonesTrend';

export class HighchartsDayTrendDiffDataBuilder extends HighchartsDataBuilder {
  constructor(colorPalette: ColorPalette) {
    super();
    this.nameEvaluator = new DayTrendDiffSeriesNameEvaluator();
    this.pointsEvaluator = new DayTrendDiffSeriesPointsEvaluator();
    this.colorEvaluator = new SeriesColorEvaluator(colorPalette);
    this.seriesZonesEvaluator = new SeriesZonesTrendEvaluator();
  }
}

export class HighchartsShiftTrendDiffDataBuilder extends HighchartsDataBuilder {
  constructor(period: number, colorPalette: ColorPalette) {
    super();
    this.nameEvaluator = new ShiftTrendDiffSeriesNameEvaluator();
    this.pointsEvaluator = new ShiftTrendDiffSeriesPointsEvaluator(period);
    this.colorEvaluator = new SeriesColorEvaluator(colorPalette);
    this.seriesZonesEvaluator = new SeriesZonesTrendEvaluator();
  }
}
