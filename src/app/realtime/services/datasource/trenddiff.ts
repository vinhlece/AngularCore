import {DataSourceOptions} from '.';
import {CommonDataSource} from './common';

export class TrendDiffDataSource extends CommonDataSource {
  getData(options: DataSourceOptions): any {
    const converter = this.converterFactory.createTrendDiffConverter(this.widget, this.options);
    return converter.convert(this.concatPredictiveData(options));
  }
}
