import {DataSourceOptions} from '.';
import {CommonDataSource} from './common';

export class LineDataSource extends CommonDataSource {
  getData(options: DataSourceOptions): any {
    const converter = this.converterFactory.createLineConverter(this.widget, this.options);
    return converter.convert(this.concatPredictiveKpiData(options));
  }
}
