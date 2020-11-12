import {isNumber} from 'util';
import {InputRange, TimeInterval, Widget, WidgetDimension} from '../../widgets/models/index';
import {TimeGroupBy} from '../../widgets/models/enums';
import * as _ from 'lodash';
import {WindowNames} from '../models/constants';
import {RealtimeData} from '../../realtime/models/index';
import {Measure} from '../../measures/models/index';
import {InstanceColor} from '../models/index';

export function getDefaultValue(object: any, property: string, defaultValue: boolean = true) {
  const value = object && object[property];
  return isNullOrUndefined(value) ? defaultValue : value;
}

export const validateFunc = [checkInterval, checkTimeRange];

function checkInterval(widget: {interval: TimeInterval}) {
  if (widget.interval) {
    const {value, unit} = widget.interval;
    return (isNullOrUndefined(value) && isNullOrUndefined(unit)) || (!isNullOrUndefined(value) && !isNullOrUndefined(unit));
  }
  return true;
}

function checkTimeRange(widget: {type: TimeGroupBy, range: InputRange}) {
  if (widget.type === TimeGroupBy.CustomRange) {
    if (isNullOrUndefined(widget.range)) {
      return false;
    } else {
      return Object.values(widget.range).reduce((isValid: boolean, value) => {
        return isValid && !isNullOrUndefined(value);
      }, true);
    }
  }
  return true;
}

export function unionInstances(dimension: WidgetDimension) {
  return _.union(dimension.customInstances, dimension.systemInstances);
}

export function unionDimensions(widget: Widget): string[] {
  return widget.dimensions.reduce((acc, item) => {
    return _.union(acc, _.union(item.systemInstances, item.customInstances));
  }, []);
}

export function getWindow(realTimeData: RealtimeData) {
  return realTimeData.window ? WindowNames.indexOf(realTimeData.window['windowType']) >= 0 ? realTimeData.window['window'] : realTimeData.window['windowType'] : '';
}

export function getWindowInMeasure(measure: Measure) {
  return WindowNames.indexOf(measure.windowType) >= 0 ? measure.windowName : measure.windowType;
}

export function getInstanceColor(instance: string, instanceColors: InstanceColor[]): InstanceColor {
  return instanceColors && instanceColors.length > 0 ? instanceColors.find(item => item.name === instance) : null;
}

export function  addThousandSeparator(number: number | string): string {
  if (!isNumber(number)) {return number as string; }
  const numberParts = number.toString().split('.');
  numberParts[0] = numberParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return numberParts.join('.');
}

export function isNullOrUndefined<T>(obj: T | null | undefined): obj is null | undefined {
  return typeof obj === 'undefined' || obj === null;
}
