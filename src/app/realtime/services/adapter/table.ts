import {TabularWidget} from '../../../widgets/models';
import {DataSet, WidgetData} from '../../models';
import {ChartDataConverterService} from '../converters';

export class MatTableDataAdapter implements ChartDataConverterService {
  private _converter: ChartDataConverterService;
  private _widget: TabularWidget;

  constructor(converter: ChartDataConverterService, widget: TabularWidget) {
    this._converter = converter;
    this._widget = widget;
  }

  convert(data: DataSet): WidgetData {
    const result = this._converter.convert(data).map((item) => item.data);
    const autoInvokeUrls = this.convertAutoInvokeUrls(result.filter(item => item.AutoInvokeUrls.length > 0));
    return {
      data: result,
      autoInvokeUrls
    };
  }

  private convertAutoInvokeUrls(autoInvokeUrls: any) {
    const result = [];
    autoInvokeUrls.forEach(item => {
      item.AutoInvokeUrls.forEach(record => {
        const obj = {measureName: record.measureName};
        const otherParams = {
          instance: item.Key.primary.value,
          timestamp: item.MeasureTimestamp.primary.value
        };
        Object.keys(item)
          .filter(key => this.filterAllMeasureColumn(key))
          .forEach( key => {
            otherParams[key.toLowerCase()] = item[key].primary.value;
          });
        result.push({...obj, otherParams});
      });
    });
    return result;
  }

  private filterAllMeasureColumn(key) {
    return (
      key !== 'AutoInvokeUrls'
      && key !== 'Id'
      && key !== 'Key'
      && key !== 'MeasureTimestamp'
    );
  }
}
