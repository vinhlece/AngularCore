import {DataSourceOptions} from '.';
import {GeoMapWidget} from '../../../widgets/models';
import {CommonDataSource} from './common';

export class GeoMapDataSource extends CommonDataSource {
  getData(options: DataSourceOptions): any {
    const converter = this.converterFactory.createGeoMapConverter(this.widget as GeoMapWidget, this.options);
    return converter.convert(this.getMainStorage(options.mainStorage));
  }
}
