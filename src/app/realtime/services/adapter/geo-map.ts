import * as map from '../../../charts/components/geo-map/us-all';
import {GeoMapWidget} from '../../../widgets/models';
import {DataSet, WidgetData} from '../../models';
import {ChartDataConverterService} from '../converters';
import * as Color from '../../../common/utils/color';

export class GeoMapAdapter implements ChartDataConverterService {
  private _converter: ChartDataConverterService;
  private _widget: GeoMapWidget;

  constructor(converter: ChartDataConverterService, widget: GeoMapWidget) {
    this._converter = converter;
    this._widget = widget;
  }

  convert(data: DataSet): WidgetData {
    const series = this._converter.convert(data);
    return [
      {
        name: this._widget.measures.length > 0 ? this._widget.measures[0] : '',
        mapData: map,
        borderColor: '#606060',
        nullColor: (this._widget.stateColor && this._widget.stateColor.parentStateColor) ?
          this._widget.stateColor.parentStateColor : Color.getTransferenceColors()[0],  // change state color
        showInLegend: false
      },
      ...series,
    ];
  }
}
