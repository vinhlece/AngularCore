import {DataSourceOptions} from '.';
import {SunburstWidget} from '../../../widgets/models';
import {CommonDataSource} from './common';

export class SunburstDataSource extends CommonDataSource {
  getData(options: DataSourceOptions): any {
    const converter = this.converterFactory.createSunburstConverter(this.widget as SunburstWidget, this.options);
    return converter.convert(this.getMainStorage(options.mainStorage));
  }
}
