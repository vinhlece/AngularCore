import {Inject, Injectable} from '@angular/core';
import {DataSource, DataSourceFactory} from '.';
import {ConverterOptions, DataConverterFactory} from '..';
import {WidgetType} from '../../../widgets/constants/widget-types';
import {Widget} from '../../../widgets/models';
import {DATA_CONVERTER_FACTORY} from '../tokens';
import {BarDataSource} from './bar';
import {BillboardDataSource} from './billboard';
import {LiquidFillGaugeDataSource} from './liquidfillgauge';
import {CallTimeLineDataSource} from './call-timeline';
import {GeoMapDataSource} from './geo-map';
import {LineDataSource} from './line';
import {SankeyDataSource} from './sankey';
import {SolidGaugeDataSource} from './solid-gauge';
import {SunburstDataSource} from './sunburst';
import {TableDataSource} from './table';
import {TabularDataSource} from './tabular';
import {TrendDiffDataSource} from './trenddiff';
import {BubbleDataSource} from './bubble';

@Injectable()
export class DataSourceFactoryImpl implements DataSourceFactory {
  private _converterFactory: DataConverterFactory;

  constructor(@Inject(DATA_CONVERTER_FACTORY) converterFactory: DataConverterFactory) {
    this._converterFactory = converterFactory;
  }

  create(widget: Widget, options: ConverterOptions): DataSource {
    switch (widget.type) {
      case WidgetType.Bar:
        return new BarDataSource(this._converterFactory, widget, options);
      case WidgetType.Billboard:
        return new BillboardDataSource(this._converterFactory, widget, options);
      case WidgetType.LiquidFillGauge:
        return new LiquidFillGaugeDataSource(this._converterFactory, widget, options);
      case WidgetType.Line:
        return new LineDataSource(this._converterFactory, widget, options);
      case WidgetType.TrendDiff:
        return new TrendDiffDataSource(this._converterFactory, widget, options);
      case WidgetType.Tabular:
        return new TableDataSource(this._converterFactory, widget, options);
      case WidgetType.Sankey:
        return new SankeyDataSource(this._converterFactory, widget, options);
      case WidgetType.SolidGauge:
        return new SolidGaugeDataSource(this._converterFactory, widget, options);
      case WidgetType.Sunburst:
        return new SunburstDataSource(this._converterFactory, widget, options);
      case WidgetType.GeoMap:
        return new GeoMapDataSource(this._converterFactory, widget, options);
      case WidgetType.CallTimeLine:
        return new CallTimeLineDataSource(this._converterFactory, widget, options);
      case WidgetType.Bubble:
        return new BubbleDataSource(this._converterFactory, widget, options)
    }
  }
}
