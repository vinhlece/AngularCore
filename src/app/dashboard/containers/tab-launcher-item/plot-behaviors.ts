import { Store } from '@ngrx/store';
import { WidgetMouseEvent } from '../../../charts/models';
import { HIGH_CHART_SERIES_NAME_REGEX } from '../../../realtime/models/constants';
import { buildUSInstance } from '../../../realtime/utils/us-instance';
import { WidgetMode } from '../../../widgets/constants/widget-types';
import { BarWidget, Widget } from '../../../widgets/models';
import * as plotActions from '../../actions/plot.actions';
import { PlotPoint } from '../../models';
import * as fromDashboards from '../../reducers';

export interface PlotBehavior {
  plot(event: WidgetMouseEvent);
}

export class DoNotPlot implements PlotBehavior {
  plot(event: WidgetMouseEvent) {
    // no op
  }
}

export abstract class CanPlot implements PlotBehavior {
  private _store: Store<fromDashboards.State>;
  private _widget: Widget;

  get store(): Store<fromDashboards.State> {
    return this._store;
  }

  get widget(): Widget {
    return this._widget;
  }

  constructor(store: Store<fromDashboards.State>, widget: Widget) {
    this._store = store;
    this._widget = widget;
  }

  abstract getPlotPoint(event): PlotPoint;

  plot(event: WidgetMouseEvent) {
    this.store.dispatch(new plotActions.Plot(this.getPlotPoint(event)));
  }

  getDimension(instance: string) {
    const dimension = this.widget.dimensions.find(d => (d.customInstances.findIndex(i => i === instance) >= 0 ||
      d.systemInstances.findIndex(i => i === instance) >= 0));
    return dimension ? dimension.dimension : null;
  }

  getSingleWindow() {
    return this.widget.windows.length > 0 ? this.widget.windows[0] : null;
  }
}

export class PlotOnBar extends CanPlot {
  constructor(store: Store<fromDashboards.State>, widget: Widget) {
    super(store, widget);
  }

  getPlotPoint(event): PlotPoint {
    const trigger = event.type;
    const widget = (event.widget) as BarWidget;
    const userOptions = event.target.point.series.userOptions;
    let instance: string;
    let window: string;
    let measure: string;

    if (userOptions) {
      instance = userOptions.instance;
      window = userOptions.window;

      const point = event.target.point;
      if (widget.mode.value === WidgetMode.Instances) {
        measure = userOptions.measureName;
      } else if (widget.mode.value === WidgetMode.Measures) {
        measure = point.name;
      }
    }


    return {
      trigger,
      widgetId: widget.id,
      dataType: this.widget.dataType,
      instance,
      measure,
      window,
      dimension: this.getDimension(instance),
      otherParams: event.otherParams
    };
  }
}

export class PlotOnLine extends CanPlot {
  constructor(store: Store<fromDashboards.State>, widget: Widget) {
    super(store, widget);
  }

  getPlotPoint(event): PlotPoint {
    const trigger = event.type;
    const widget = event.widget;
    const userOptions = event.point.series.userOptions;
    const instance = userOptions.instance;
    const measure = userOptions.measureName;
    return {
      trigger,
      widgetId: widget.id,
      dataType: this.widget.dataType,
      instance,
      measure,
      window: this.getSingleWindow(),
      dimension: this.getDimension(instance),
      otherParams: event.otherParams
    };
  }
}

export class PlotOnTabular extends CanPlot {
  constructor(store: Store<fromDashboards.State>, widget: Widget) {
    super(store, widget);
  }

  getPlotPoint(event): PlotPoint {
    const keyCol = event.cell ? event.cell.keyCol : null;
    const targetCol = event.column ? event.column : event.cell.targetCol;
    const widget = event.widget;
    if (event.groupParams && event.groupParams.instance) {
      return {
        trigger: event.type,
        widgetId: widget.id,
        dataType: this.widget.dataType,
        otherParams: event.otherParams,
        groupParams: event.groupParams
      };
    }
    return {
      trigger: event.type,
      widgetId: widget.id,
      dataType: this.widget.dataType,
      instance: keyCol,
      window: this.getSingleWindow(),
      dimension: this.getDimension(keyCol),
      measure: widget.measures.includes(targetCol) ? targetCol : null,
      otherParams: event.otherParams
    };
  }
}

export class PlotOnSingleInstanceMeasureWidget extends CanPlot {
  constructor(store: Store<fromDashboards.State>, widget: Widget) {
    super(store, widget);
  }

  getPlotPoint(event): PlotPoint {
    const trigger = event.type;
    const widget = event.widget;
    const { systemInstances, customInstances } = widget.dimensions[0];
    const instance = systemInstances.length > 0 ? systemInstances[0] : customInstances[0];
    const measure = widget.measures[0];

    return {
      trigger,
      widgetId: widget.id,
      dataType: this.widget.dataType,
      instance,
      measure,
      window: this.getSingleWindow(),
      dimension: this.getDimension(instance),
      otherParams: event.otherParams
    };
  }
}

export class PlotOnGeoMap extends CanPlot {
  constructor(store: Store<fromDashboards.State>, widget: Widget) {
    super(store, widget);
  }

  getPlotPoint(event): PlotPoint {
    const parentState = event.point.parentState;
    const capital = event.point.capital;
    const widget = event.widget;
    const measure = widget.measures[0];
    const instance = buildUSInstance({ parentState, capital });
    return {
      trigger: event.type,
      widgetId: widget.id,
      dataType: this.widget.dataType,
      instance,
      measure,
      window: this.getSingleWindow(),
      dimension: this.getDimension(instance),
      otherParams: event.otherParams
    };
  }
}

export class PlotOnSunburst extends CanPlot {
  constructor(store: Store<fromDashboards.State>, widget: Widget) {
    super(store, widget);
  }

  getPlotPoint(event): PlotPoint {
    const measure = this.widget.measures[0];
    const instance = this.getPlotInstance(event);
    const node = this.getPlotNode(event);
    return {
      trigger: event.type,
      widgetId: this.widget.id,
      dataType: this.widget.dataType,
      instance,
      dimension: this.getDimension(instance),
      measure,
      window: this.getSingleWindow(),
      node,
      otherParams: event.otherParams
    };
  }

  private getPlotInstance(event): string {
    return event.point.id.split('$')[0];
  }

  private getPlotNode(event): string {
    return event.point.name;
  }
}

export class PlotOnCallTimeLine extends CanPlot {
  constructor(store: Store<fromDashboards.State>, widget: Widget) {
    super(store, widget);
  }

  getPlotPoint(event): PlotPoint {
    const options = event.point.options;
    return {
      trigger: event.type,
      widgetId: this.widget.id,
      dataType: this.widget.dataType,
      measure: this.widget.measures[0],
      agent: options.agent,
      queue: options.queue,
      segmentType: options.segmentType
    };
  }
}

export class PlotOnSankey extends CanPlot {
  constructor(store: Store<fromDashboards.State>, widget: Widget) {
    super(store, widget);
  }

  getPlotPoint(event): PlotPoint {
    const options = event.point;
    const measure = options.series.name;
    const instance = options.from ? `${options.from},${options.to}` : null;
    return {
      trigger: event.type,
      widgetId: this.widget.id,
      dataType: this.widget.dataType,
      measure,
      instance,
      window: this.getSingleWindow(),
      dimension: this.getDimension(instance),
      node: options.options.id,
      otherParams: event.otherParams
    };
  }
}

export class PlotOnBubble extends CanPlot {
  constructor(store: Store<fromDashboards.State>, widget: Widget) {
    super(store, widget);
  }

  getPlotPoint(event): PlotPoint {
    const trigger = event.type;
    const widget = event.widget;
    const info = event.point.series.name.match(HIGH_CHART_SERIES_NAME_REGEX)[1].split(' - ');
    const instance = info[0];
    const measure = event.point.series.name.match(HIGH_CHART_SERIES_NAME_REGEX)[0];
    return {
      trigger,
      widgetId: widget.id,
      dataType: this.widget.dataType,
      instance,
      measure,
      window: this.getSingleWindow(),
      dimension: this.getDimension(instance),
      otherParams: event.otherParams
    };
  }
}
