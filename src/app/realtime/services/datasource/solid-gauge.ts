import {DataSourceOptions} from '.';
import {CommonDataSource} from './common';

export class SolidGaugeDataSource extends CommonDataSource {
  getData(options: DataSourceOptions): any {
    const converter = this.converterFactory.createSolidGaugeConverter(this.widget, this.options);
    return converter.convert(this.getMainStorage(options.mainStorage));
  }
}
