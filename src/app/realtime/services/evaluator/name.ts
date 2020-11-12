import {AppDateTimeFormat} from '../../../common/models/enums';
import {getMomentByTimestamp} from '../../../common/services/timeUtils';
import {WidgetMode} from '../../../widgets/constants/widget-types';
import {CallTimeLineGroupBy} from '../../../widgets/models/enums';
import {BarWidget, CallTimeLineWidget, LegendOption, LineWidget} from '../../../widgets/models/index';
import {DataSet, GroupKey} from '../../models';
import {
  HIGH_CHART_SERIES_NAME_REGEX,
  HIGH_CHART_SERIES_NAME_TEMPLATE,
  INSTANCE, KpiThreshold,
  MEASURE_NAME, MEASURE_TIMESTAMP
} from '../../models/constants';
import {PropertyEvaluator} from '../converters';
import {getPropertiesFromGroupKey} from '../grouper/grouper';
import {isNotNullOrUndefined} from 'codelyzer/util/isNotNullOrUndefined';
import {isNullOrUndefined} from '../../../common/utils/function';

export class DayTrendDiffSeriesNameEvaluator implements PropertyEvaluator<String> {
  evaluate(dataSet: DataSet, key: GroupKey): string {
    return getMomentByTimestamp(+key).format(AppDateTimeFormat.date);
  }
}

export class ShiftTrendDiffSeriesNameEvaluator implements PropertyEvaluator<String> {
  evaluate(dataSet: DataSet, key: GroupKey): string {
    return getMomentByTimestamp(+key).format(AppDateTimeFormat.dateTime);
  }
}

export abstract class BarSeriesNameEvaluator implements PropertyEvaluator<any> {
  private _propertyName: string;
  private _widget: BarWidget;

  constructor(widget: BarWidget) {
    this._propertyName = widget.mode.value === WidgetMode.Instances ? MEASURE_NAME :
      widget.mode.value === WidgetMode.Measures ? INSTANCE : MEASURE_TIMESTAMP;
    this._widget = widget;
  }

  evaluate(dataSet: DataSet, key: GroupKey): any {
    throw new TypeError('Method not implemented.');
  }

  getChartKey(dataSet: DataSet): any {
    const firstRecord = dataSet[0];
    const {instance, measure, window, key, alias} = this.getLegendText(firstRecord);
    let name = '';
    if (this._propertyName === MEASURE_TIMESTAMP) {
      if (alias !== '') {
        name = alias;
      } else if (instance === '') {
        if (measure !== '') {
          name = measure;
        }
      } else if (measure === '') {
        name = instance;
      } else {
        name = measure + ' (' + instance + ')';
      }
      return {
        value: instance,
        display: name,
      };
    }
    const timestamp = firstRecord.measureTimestamp;
    const display = HIGH_CHART_SERIES_NAME_TEMPLATE.replace(HIGH_CHART_SERIES_NAME_REGEX, (item, index) => {
      if (index === 0) {
        if (alias !== '') {
          return alias;
        } else if (key === '') {
          return window;
        } else if (window === '') {
          return key;
        }
        return key + ' - ' + window;
      }
      return getMomentByTimestamp(timestamp).format(AppDateTimeFormat.dateTime);
    });
    return {
      value: key,
      display: display,
    };
  }

  getLegendText(record) {
    const legendOptions = this._widget.legendOptions;
    let instance = record.instance;
    let measure = record.measureName;
    let window = record.window;
    let alias = '';
    let key = record[this._propertyName]
    if (legendOptions) {
      const legend = this.checkHideOption(legendOptions, instance, measure);
      if (legend) {
        if (legend.hideInstance) {
          if (key === instance) {
            key = '';
          }
          instance = '';
        }
        if (legend.hideMeasure) {
          if (key === measure) {
            key = '';
          }
          measure = '';
        }
        if (!isNullOrUndefined(legend.alias)) {
          alias = legend.alias;
        }
        if (legend.hideWindow) {
          window = '';
        }
      }
    }
    return {
      key,
      measure,
      alias,
      window,
      instance
    };
  }

  checkHideOption(legendOptions, instance: string, measure: string) {
    if (legendOptions && legendOptions.length > 0) {
      return legendOptions.find(item => item.instance === instance && item.measure === measure);
    }
    return null;
  }
}

export class HighchartsBarSeriesNameEvaluator extends BarSeriesNameEvaluator {
  constructor(widget) {
    super(widget);
  }

  evaluate(dataSet: DataSet, key: GroupKey): any {
    return this.getChartKey(dataSet).display;
  }
}

export class TabularSeriesNameEvaluator implements PropertyEvaluator<any> {
  evaluate(dataSet: DataSet, key: GroupKey): any {
    return dataSet[0].instance;
  }
}

export class SankeyNameEvaluator implements PropertyEvaluator<string> {
  evaluate(data: DataSet, key: GroupKey): string {
    return getPropertiesFromGroupKey(key).measure;
  }
}

export abstract class LineSeriesNameEvaluator implements PropertyEvaluator<any> {
  private _widget: LineWidget;
  constructor(widget: LineWidget) {
    this._widget = widget;
  }

  evaluate(dataSet: DataSet, key: GroupKey): any {
    throw new TypeError('Method not implemented.');
  }

  getChartKey(dataSet: DataSet): any {
    const firstRecord = dataSet[0];
    const {key, measure, alias} = this.getLegendText(firstRecord);
    const group = firstRecord.group;
    const kpi = group === KpiThreshold.Greater.value ? KpiThreshold.Greater.display :
                group === KpiThreshold.Lesser.value ? KpiThreshold.Lesser.display : null;
    let display = '';
    if (alias) {
      display = alias;
    } else if (measure === '') {
      display = key === '' ? `${kpi ? `${kpi}` : ''}` : key;
    } else if (key === '') {
      display = `${measure} (${kpi ? `${kpi}` : ''})`;
    } else {
      display = `${measure} (${kpi ? `${key} - ${kpi}` : key})`;
    }

    return {
      value: firstRecord.instance,
      display
    };
  }

  getLegendText(record) {
    const legendOptions = this._widget.legendOptions;
    let key = record.instance;
    let measure = record.measureName;
    let alias = null;
    if (legendOptions) {
      const legend = this.checkHideOption(legendOptions, key, measure);
      if (legend) {
        if (legend.hideInstance) {
          key = '';
        }
        if (legend.hideMeasure) {
          measure = '';
        }
        if (legend.alias) {
          alias = legend.alias;
        }
      }
    }
    return {
      key,
      measure,
      alias
    };
  }

  checkHideOption(legendOptions, instance: string, measure: string) {
    if (legendOptions && legendOptions.length > 0) {
      return legendOptions.find(item => item.instance === instance && item.measure === measure);
    }
    return null;
  }
}

export class HighchartsLineSeriesNameEvaluator extends LineSeriesNameEvaluator {
  evaluate(dataSet: DataSet, key: GroupKey): any {
    return this.getChartKey(dataSet).display;
  }
}

export class GeoMapNameEvaluator implements PropertyEvaluator<string> {
  evaluate(dataSet: DataSet, key: GroupKey): string {
    return getPropertiesFromGroupKey(key).measure;
  }
}

export class BubbleNameEvaluator implements PropertyEvaluator<string> {
  evaluate(dataSet: DataSet, key: GroupKey): string {
    return `${getPropertiesFromGroupKey(key).measure} (${getPropertiesFromGroupKey(key).instance})`;
  }
}

export class CallTimeLineNameEvaluator implements PropertyEvaluator<string> {
  private _widget: CallTimeLineWidget;

  constructor(widget: CallTimeLineWidget) {
    this._widget = widget;
  }

  evaluate(dataSet: DataSet, key: GroupKey): string {
    switch (this._widget.groupBy) {
      case CallTimeLineGroupBy.Agent:
        return getPropertiesFromGroupKey(key).agent;
      case CallTimeLineGroupBy.Queue:
        return getPropertiesFromGroupKey(key).queue;
      case CallTimeLineGroupBy.SegmentType:
        return getPropertiesFromGroupKey(key).segmentType;
      case CallTimeLineGroupBy.CallId:
        return getPropertiesFromGroupKey(key).callId;
    }
  }
}
