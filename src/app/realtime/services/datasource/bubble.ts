import {DataSourceOptions} from '.';
import {CommonDataSource} from './common';
import {BubbleWidget} from '../../../widgets/models/index';

export class BubbleDataSource extends CommonDataSource {
  getData(options: DataSourceOptions): any {
    const converter = this.converterFactory.createBubbleConverter(this.widget as BubbleWidget, this.options);
    return converter.convert(this.getMainStorage(options.mainStorage));
  }
}
