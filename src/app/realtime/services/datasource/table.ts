import {DataSourceOptions} from '.';
import {TabularWidget} from '../../../widgets/models';
import {DataDisplayType} from '../../../widgets/models/enums';
import {CommonDataSource} from './common';
import {ConvertMode} from '../../models/enum';

export class TableDataSource extends CommonDataSource {
  getData(options: DataSourceOptions): any {
    if (this.getTabularWidget().displayData === DataDisplayType.ShowInterval) {
      return this.getHistoricalData(options.mainStorage, options.previousData);
    } else {
      return this.getLatestData(options.mainStorage, options.previousData);
    }
  }

  private getLatestData(storage: any, previousData) {
    const converter = this.converterFactory.createTabularConverter(this.widget, this.options);
    return converter.convert(this.getMainStorage(storage, ConvertMode.Combine));
  }

  private getHistoricalData(storage: any, previousData) {
    const converter = this.converterFactory.createTabularConverter(this.widget, this.options);
    return converter.convert(this.getMainStorage(storage));
  }

  private getTabularWidget(): TabularWidget {
    return this.widget as TabularWidget;
  }
}
