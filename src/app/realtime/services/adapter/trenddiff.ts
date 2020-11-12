import {TrendDiffWidget} from '../../../widgets/models';
import {DataSet, WidgetData} from '../../models';
import {ChartDataConverterService} from '../converters';

export class TrendDiffAdapter implements ChartDataConverterService {
  private _converter: ChartDataConverterService;
  private _widget: TrendDiffWidget;

  constructor(converter: ChartDataConverterService, widget: TrendDiffWidget) {
    this._converter = converter;
    this._widget = widget;
  }

  convert(data: DataSet): WidgetData {
    const series = this._converter.convert(data);
    if (series && series.length > 0) {
      series[series.length - 1].lineWidth = 5;
    }
    return series;
  }
}
