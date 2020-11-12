import {DataSourceOptions} from '.';
import {CommonDataSource} from './common';

export class TabularDataSource extends CommonDataSource {
  getData(options: DataSourceOptions): any {
    const converter = this.converterFactory.createTabularConverter(this.widget, this.options);
    return converter.convert(options.mainStorage.records);
  }
}
