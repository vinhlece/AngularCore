import {CommonDataSource} from './common';
import {DataSourceOptions} from '.';
import {ConvertMode} from '../../models/enum';
import {BarWidget} from '../../../widgets/models/index';
import {WidgetMode} from '../../../widgets/constants/widget-types';

export class BarDataSource extends CommonDataSource {
  getData(options: DataSourceOptions): any {
    const converter = this.converterFactory.createBarConverter(this.widget, this.options);
    const displayMode = (this.widget as BarWidget).mode.value === WidgetMode.TimeRange ? ConvertMode.All : ConvertMode.Combine;
    return converter.convert(this.getMainStorage(options.mainStorage, displayMode));
  }
}
