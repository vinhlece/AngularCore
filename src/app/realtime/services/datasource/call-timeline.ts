import {DataSourceOptions} from '.';
import {CallTimeLineWidget} from '../../../widgets/models';
import {CommonDataSource} from './common';

export class CallTimeLineDataSource extends CommonDataSource {
  getData(options: DataSourceOptions): any {
    const converter = this.converterFactory.createCallTimeLineConverter(this.widget as CallTimeLineWidget, this.options);
    return converter.convert(options.eventStorage.records);
  }
}
