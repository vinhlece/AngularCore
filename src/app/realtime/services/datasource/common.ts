import { DataSource, DataSourceOptions } from '.';
import { ConverterOptions, DataConverterFactory } from '..';
import { Widget } from '../../../widgets/models';
import { RealtimeData } from '../../models/index';
import { ChartDataConverterService } from '../converters/index';
import { DisplayMode } from '../../../dashboard/models/enums';
import { ConvertMode } from '../../models/enum';

export abstract class CommonDataSource implements DataSource {
  private _converterFactory: DataConverterFactory;
  private _widget: Widget;
  private _options: ConverterOptions;

  constructor(converterFactory: DataConverterFactory, widget: Widget, options: ConverterOptions) {
    this._converterFactory = converterFactory;
    this._widget = widget;
    this._options = options;
  }

  get converterFactory(): DataConverterFactory {
    return this._converterFactory;
  }

  get widget(): Widget {
    return this._widget;
  }

  get options(): ConverterOptions {
    return this._options;
  }

  protected concatPredictiveKpiData(storage: DataSourceOptions): RealtimeData[] {
    if (!storage.policyGroupStorage || !storage.policyGroupStorage.hourly) {
      return this.concatPredictiveData(storage);
    }
    const kpiData = storage.policyGroupStorage.hourly.findWidgetRecords(this.widget, null, ConvertMode.Kpi);
    return this.concatPredictiveData(storage).concat(kpiData);
  }

  protected concatPredictiveData(storage: DataSourceOptions): RealtimeData[] {
    return storage.predictiveStorage ? this.getMainStorage(storage.mainStorage).concat(this.getMainStorage(storage.predictiveStorage)) :
      this.getMainStorage(storage.mainStorage);
  }

  protected getMainStorage(storage: { [window: string]: Storage }, displayMode?: DisplayMode | ConvertMode) {
    if (!this.widget.windows) {
      this.widget.windows = [];
    }

    return this.widget.windows.reduce((acc, item) => {
      if (storage[item]) {
        acc.push(...storage[item].findWidgetRecords(this.widget, this.options.goBackTimeRange, displayMode));
      }
      return acc;
    }, []);
  }

  getData(options: DataSourceOptions): any {
    throw new Error('Not implemented.');
  }
}
