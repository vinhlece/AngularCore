import {DataSourceOptions} from '.';
import {CommonDataSource} from './common';
import {ConvertMode} from '../../models/enum';

export class SankeyDataSource extends CommonDataSource {
  getData(options: DataSourceOptions): any {
    const converter = this.converterFactory.createSankeyConverter(this.widget, this.options);
    return converter.convert(this.getMainStorage(options.mainStorage, ConvertMode.Combine));
  }
}
