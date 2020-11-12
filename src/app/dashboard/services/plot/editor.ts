import {Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {first} from 'rxjs/operators';
import {isArray, isNullOrUndefined} from 'util';
import {PlotEditor} from '..';
import {Measure} from '../../../measures/models';
import {DataTypes} from '../../../measures/models/enums';
import * as fromMeasures from '../../../measures/reducers';
import * as _ from 'lodash';
import {WidgetType} from '../../../widgets/constants/widget-types';
import {Column, TabularWidget, Widget, WidgetDimension} from '../../../widgets/models';
import {
  MetricValueGetter,
  PlotPoint,
  UpdateMetricsOptions,
  UpdateMetricsPayload
} from '../../models';
import * as fromDashboards from '../../reducers';
import {Metric} from '../../models/enums';
import {WidgetItem} from '../../../widgets/models/enums';

export const timestamp = 'timestamp';
export const timestamps = 'timestamps';
@Injectable()
export class PlotEditorImpl implements PlotEditor {
  private _specialWidgets = [WidgetType.Sunburst, WidgetType.Sankey];
  private _store: Store<fromDashboards.State>;

  constructor(store: Store<fromDashboards.State>) {
    this._store = store;
  }

  updateMetrics(options: UpdateMetricsPayload): Widget {
    const {srcWidget, targetWidget, point} = options;

    const initialValue = {widget: targetWidget, isUpdated: false};

    const reducer = (acc: { widget: Widget, isUpdated: boolean }, metric: string) => {
      const widget = this.updateMetric(srcWidget, acc.widget, point, options, metric);
      const isUpdated = !isNullOrUndefined(widget) || acc.isUpdated;
      return {widget: widget ? widget : acc.widget, isUpdated};
    };
    const metrics = targetWidget.type === WidgetType.CallTimeLine
      ? Object.keys(options).filter(this.isMetric)
        : this.filterMetricByWidgetDataTypes(Object.keys(options).filter(this.isMetric), targetWidget.dataType);
    const result = metrics.reduce(reducer, initialValue);
    return result.isUpdated ? result.widget : null;
  }

  updateSideEffects(srcWidget: Widget, widget: Widget, point: PlotPoint, metricOptions: UpdateMetricsOptions,
                    metric?: string, confirmation?: string): Widget {
    const sideEffects = metricOptions.sideEffects;
    if (!sideEffects || !point) {
      return widget;
    }
    const newValue = this.getValue(srcWidget, widget, point[metric], metricOptions.valueGetter);
    return Object.keys(sideEffects).reduce((currentWidget: Widget, currentEffect: string) => {
      const effect = sideEffects[currentEffect];
      return effect ? this[currentEffect](currentWidget, point, effect, metric, newValue, confirmation) : currentWidget;
    }, widget);
  }

  private updateMetric(srcWidget: Widget, targetWidget: Widget, point: PlotPoint, options: UpdateMetricsPayload, metric: string): Widget {
    const metricOptions = options[metric];
    if (!metricOptions || !this.validate(targetWidget, point, metricOptions.validatorFn)) {
      return null;
    }
    let srcValue;
    if (point.groupParams) {
      srcValue = point.groupParams[metric];
    } else {
      srcValue = metric === timestamp ? point.otherParams[metric] : point[metric];
    }
    const updatedWidget = this.update(srcWidget, targetWidget, srcValue, metricOptions, options.confirmation);
    return updatedWidget ? this.updateSideEffects(srcWidget, updatedWidget, point, metricOptions, metric, options.confirmation) : null;
  }

  private update(srcWidget: Widget, targetWidget: Widget, srcValue: string | string[] | number[],
                 metricsOptions: UpdateMetricsOptions, confirmation?: string) {
    const value = this.getValue(srcWidget, targetWidget, srcValue, metricsOptions.valueGetter);
    const strategy = this.getOptionValue(srcWidget, targetWidget, value, metricsOptions.strategy, confirmation);
    const targetProp = this.getOptionValue(srcWidget, targetWidget, value, metricsOptions.targetProp, confirmation);
    if (!strategy || !targetProp || !value) {
      return null;
    }
    if (Array.isArray(targetProp)) {
      const initialValue = {widget: targetWidget, isUpdated: false};

      const reducer = (acc: { widget: Widget, isUpdated: boolean }, prop: string) => {
        const widget = this[strategy](acc.widget, value, prop, srcValue);
        const isUpdated = !isNullOrUndefined(widget) || acc.isUpdated;
        return {widget: widget ? widget : acc.widget, isUpdated};
      };

      const result = targetProp.reduce(reducer, initialValue);
      return result.isUpdated ? result.widget : null;
    } else {
      return this[strategy](targetWidget, value, targetProp, srcValue);
    }
  }

  private add(widget: Widget, value: string, targetProp: string, srcValue?: string): Widget {
    if (Array.isArray(value)) {
      return this.adds(widget, value, targetProp, srcValue);
    }
    let metricValues = widget[targetProp];
    if (targetProp === timestamps && !metricValues) {
      metricValues = [];
    }
    if (targetProp === Metric.INSTANCES) {
      const isValid = widget.dimensions.reduce((acc, item) => {
        return acc && (item.systemInstances.indexOf(value) < 0 && item.customInstances.indexOf(value) < 0);
      }, true);
      if (!isValid) { return null; }
      return {...widget, dimensions: widget.dimensions.map(i => {
        if (i.customInstances.indexOf(value) >= 0) {
          return {...i};
        }
        return {...i, systemInstances: _.union(i.systemInstances, [value])};
      })};
    } else if (targetProp === Metric.DIMENSIONS) {
      if (metricValues.findIndex(item => item.dimension === value) >= 0) {
        return null;
      }
      const dimension: WidgetDimension = {dimension: value, systemInstances: [], customInstances: []};
      return {...widget, [targetProp]: [...metricValues, dimension]};
    }
    if (metricValues.indexOf(value) >= 0) {
      return null;
    }
    return {...widget, [targetProp]: [...metricValues, value]};
  }

  private adds(widget: Widget, values: string[] | number[], targetProp: string, srcValue?: string): Widget {
    let metricValues = widget[targetProp];
    if (targetProp === timestamps && !metricValues) {
      metricValues = [];
    }
    if (targetProp === Metric.INSTANCES) {
      return {...widget, dimensions: widget.dimensions.map(i => {
        const diff = _.difference(values, i.customInstances);
        return {...i, systemInstances: _.union(i.systemInstances, diff)};
      })};
    } else if (targetProp === Metric.DIMENSIONS) {
      const diff = _.difference(values, metricValues.map(item => item.dimension));
      if (diff.length === 0) {
        return null;
      }
      return {...widget, dimensions: [...metricValues, ...diff.map(d => ({dimension: d, systemInstances: [], customInstances: []}))]};
    }
    return {...widget, [targetProp]: [...metricValues, ...values].filter((value, index, self) => self.indexOf(value) === index)};
  }

  private edit(widget: Widget, value: string, targetProp: string, srcValue?: string): Widget {
    const metricValues = widget[targetProp];
    const index = metricValues.findIndex(metric => metric === srcValue);
    if (metricValues.indexOf(value) >= 0 || index < 0) {
      return null;
    }
    metricValues.splice(index, 1, value);
    return {...widget, [targetProp]: metricValues};
  }

  private replace(widget: Widget, value: any, targetProp: string, srcValue?: string): Widget {
    let metricValues = widget[targetProp];
    if (targetProp === timestamps && !metricValues) {
      metricValues = [];
    }
    if (targetProp === Metric.INSTANCES) {
      if (widget.dimensions.length > 0 && widget.dimensions[0].systemInstances.length > 0 &&
          widget.dimensions[0].systemInstances[0] === value) {
        return null;
      }
      if (isArray(value) && value.length > 0) {
        return {...widget, dimensions: widget.dimensions.map(i => ({...i, systemInstances: value, customInstances: []}))};
      }

      return {...widget, dimensions: widget.dimensions.map(i => ({...i, systemInstances: [value], customInstances: []}))};
    } else if (targetProp === Metric.DIMENSIONS) {
      return {...widget, dimensions: [{dimension: value, systemInstances: [], customInstances: []}]};
    }
    if (metricValues[0] === value) {
      return null;
    }
    if (isArray(value) && value.length > 0) {
      return {...widget, [targetProp]: value};
    }
    return {...widget, [targetProp]: [value]};
  }

  private delete(widget: Widget, value: string, targetProp: string, srcValue?: string): Widget {
    const metricValues = widget[targetProp];
    let updatedValues = [];
    const updateDimensions = (filterFunc) => {
      return widget.dimensions.map(d => {
        return {...d, systemInstances: filterFunc(d.systemInstances), customInstances: filterFunc(d.customInstances)}
      });
    };
    if (this._specialWidgets.indexOf(widget.type) >= 0) {
      const filter = (sources: string[]) => sources.filter((currentValue: string) => currentValue.indexOf(value) === -1);
      if (targetProp === Metric.INSTANCES) {
        updatedValues = updateDimensions(filter);
        targetProp = WidgetItem.Dimension;
      } else {
        updatedValues = filter(metricValues);
      }
    } else {
      if (targetProp === Metric.INSTANCES) {
        const filter = (sources: string[]) => sources.filter((currentValue: string) => currentValue !== value);
        updatedValues = updateDimensions(filter);
        targetProp = WidgetItem.Dimension;
      } else {
        const removeValueIndex = metricValues.findIndex((currentValue: string) => value === currentValue);
        updatedValues = [...metricValues.slice(0, removeValueIndex), ...metricValues.slice(removeValueIndex + 1)];
      }
    }
    return {...widget, [targetProp]: updatedValues};
  }

  private updateSubTitle(widget: Widget, point: PlotPoint, canUpdateSubTitle: boolean,
                         metric: string, srcValue?: string, confirmation?: string) {
    if (!canUpdateSubTitle) {
      return widget;
    }
    if (metric === 'instance') {
      return this.updateSubTitleWithInstance(widget, point.instance);
    }
    if (metric === 'measure') {
      return this.updateSubTitleWithMeasure(widget, point.measure);
    }
  }

  private deleteColumn(widget: Widget, point: PlotPoint) {
    const measureName = point.measure;
    const oldColumns = (widget as TabularWidget).columns;
    const removeColumnIdx = oldColumns.findIndex((column) => column.id === measureName);

    if (removeColumnIdx < 0) {
      return widget;
    }

    const updatedColumns = [...oldColumns.slice(0, removeColumnIdx), ...oldColumns.slice(removeColumnIdx + 1)];
    return {...widget, columns: updatedColumns};
  }

  private addColumn(widget: Widget) {
    const oldColumns = (widget as TabularWidget).columns;
    const newColumns = widget.measures
      .filter((measureName: string) => {
        return isNullOrUndefined(oldColumns.find((item: Column) => item.id === measureName));
      })
      .map((measureName: string) => {
        const measure = this.getMeasure(widget.dataType, measureName);
        return {id: measure.name, type: measure.format, title: measure.name, visibility: true};
      });
    return {...widget, columns: [...oldColumns, ...newColumns]};
  }

  private editColumn(widget: Widget, point: PlotPoint, isEffect?: boolean, metric?: string, newValue?: string, confirmation?: string) {
    const oldColumns = (widget as TabularWidget).columns;
    const index = oldColumns.findIndex(column => column.id === point[metric]);
    if (index < 0) {
      return widget;
    }
    const measure = this.getMeasure(point.dataType, newValue);
    const newColumn = {id: measure.name, type: measure.format, title: confirmation, visibility: true};
    oldColumns.splice(index, 1, newColumn);
    return {...widget, columns: oldColumns};
  }

  private updateMeasureRelationship(widget: Widget, point: PlotPoint) {
    let measures = widget.measures;
    const updateMeasures = point.measure ? [point.measure] : point.groupParams.measure;
    updateMeasures.forEach(updateMeasure => {
      const measure = this.getMeasure(point.dataType, updateMeasure);
      if (measures.find((measureName: string) => measureName === measure.name)) {
        const measuresSet = new Set(measures);
        measure.relatedMeasures.forEach((relatedMeasureName: string) => measuresSet.add(relatedMeasureName));
        measures = [...Array.from(measuresSet)];
      }
    });
    return {...widget, measures};
  }

  private updateSubTitleWithInstance(widget: Widget, instance: string) {
    const regex = new RegExp(`Instance\\s[a-zA-Z0-9-\\s]+`);

    const subtitle = widget.subtitle && widget.subtitle.search(regex) >= 0
      ? widget.subtitle.replace(regex, `Instance ${instance}`)
      : `${widget.name} - Instance ${instance}`;

    return {...widget, subtitle};
  }

  private updateSubTitleWithMeasure(widget: Widget, measureName: string) {
    const regex = new RegExp(`Measure\\s[a-zA-Z0-9]+`);

    const subtitle = widget.subtitle && widget.subtitle.search(regex) >= 0
      ? widget.subtitle.replace(regex, `Measure ${measureName}`)
      : `${widget.name} - Measure ${measureName}`;
    return {...widget, subtitle};
  }

  private getOptionValue(srcWidget: Widget, targetWidget: Widget, value: string | string[] | number[],
                         option, confirmation?: string): string {
    return typeof option === 'function' ? option(srcWidget, targetWidget, value, confirmation) : option;
  }

  private getValue(srcWidget: Widget, targetWidget: Widget, srcValue: string | string[] | number[], valueGetter: MetricValueGetter) {
    return valueGetter ? valueGetter(srcWidget, targetWidget, srcValue) : srcValue;
  }

  private validate(widget: Widget, point: PlotPoint, validatorFn): boolean {
    return !validatorFn || validatorFn(widget, point);
  }

  private getMeasure(dataType: string, measureName: string): Measure {
    let result: Measure;
    this._store
      .pipe(
        select(fromMeasures.getMeasure(dataType, measureName)),
        first()
      )
      .subscribe((measure: Measure) => {
        result = measure;
      });
    return result;
  }

  private isMetric(name: string): boolean {
    return ['dimension', 'instance', 'instances', 'measure',  'measures', 'agent', 'queue', 'segmentType', 'node', timestamp, timestamps, 'window'].includes(name);
  }

  private filterMetricByWidgetDataTypes(metrics: string[], dataType: string) {
    const ignoreMetric = dataType === (DataTypes.QUEUE_PERFORMANCE || DataTypes.QUEUE_STATUS) ? 'queue' : 'agent';
    return metrics.filter(item => item !== ignoreMetric);
  }
}
