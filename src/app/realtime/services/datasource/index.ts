import {ConverterOptions} from '..';
import {Widget} from '../../../widgets/models';
import {Storage} from '../../models';

export interface DataSourceOptions {
  mainStorage?: any;
  eventStorage?: Storage;
  predictiveStorage?: any;
  policyGroupStorage?: any;
  previousData?: any;
}

export interface DataSource {
  getData(options: DataSourceOptions): any;
}

export interface DataSourceFactory {
  create(widget: Widget, options: ConverterOptions): DataSource;
}
