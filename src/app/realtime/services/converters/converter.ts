import {DataSet, WidgetData} from '../../models';
import {ChartDataBuilder} from '../builder';
import {Grouper} from '../grouper/grouper';
import {Interceptor} from '../interceptor';
import {ChartDataConverterService} from './index';
import { group } from 'd3';

export class Converter implements ChartDataConverterService {
  private _interceptor: Interceptor;
  private _grouperService: Grouper;
  private _chartDataBuilder: ChartDataBuilder;

  constructor(filterService: Interceptor, grouperService: Grouper, chartDataBuilder: ChartDataBuilder) {
    this._interceptor = filterService;
    this._grouperService = grouperService;
    this._chartDataBuilder = chartDataBuilder;
  }

  convert(data: DataSet): WidgetData {
    const interceptedData = this._interceptor.intercept(data);
    const groupedData = this._grouperService.groupData(interceptedData);
    return this._chartDataBuilder.generate(groupedData, null);
  }
}
