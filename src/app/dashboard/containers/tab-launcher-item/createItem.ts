import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {WidgetType} from '../../../widgets/constants/widget-types';
import {Widget} from '../../../widgets/models';
import * as fromDashboards from '../../reducers';
import {
  BarItem,
  BillboardItem, CallTimeLineItem,
  DummyItem,
  GeoMapItem,
  LauncherItem,
  LineItem,
  SankeyItem,
  SolidGaugeItem,
  SunburstItem,
  TableItem,
  TabularItem,
  LiquidFillGaugeItem,
  TrendDiffItem, LabelItem, BubbleItem,
  EventViewerItem
} from './items';

@Injectable()
export class LauncherItemFactory {
  private _store: Store<fromDashboards.State>;

  constructor(store: Store<fromDashboards.State>) {
    this._store = store;
  }

  create(placeholderId: string, widget: Widget): LauncherItem {
    if (!widget) {
      return new DummyItem(this._store, placeholderId, widget);
    }

    switch (widget.type) {
      case WidgetType.Bar:
        return new BarItem(this._store, placeholderId, widget);
      case WidgetType.Line:
        return new LineItem(this._store, placeholderId, widget);
      case WidgetType.TrendDiff:
        return new TrendDiffItem(this._store, placeholderId, widget);
      case WidgetType.Billboard:
        return new BillboardItem(this._store, placeholderId, widget);
        case WidgetType.LiquidFillGauge:
        return new LiquidFillGaugeItem(this._store, placeholderId, widget);
      case WidgetType.Sankey:
        return new SankeyItem(this._store, placeholderId, widget);
      case WidgetType.SolidGauge:
        return new SolidGaugeItem(this._store, placeholderId, widget);
      case WidgetType.Sunburst:
        return new SunburstItem(this._store, placeholderId, widget);
      case WidgetType.GeoMap:
        return new GeoMapItem(this._store, placeholderId, widget);
      case WidgetType.Tabular:
        return new TableItem(this._store, placeholderId, widget);
      case WidgetType.CallTimeLine:
        return new CallTimeLineItem(this._store, placeholderId, widget);
      case WidgetType.LabelWidget:
        return new LabelItem(this._store, placeholderId, widget);
      case WidgetType.Bubble:
        return new BubbleItem(this._store, placeholderId, widget)
      case WidgetType.EventViewer:
        return new EventViewerItem(this._store, placeholderId, widget);
      default:
        throw new TypeError('StreamWidget type is not valid.');
    }
  }
}
