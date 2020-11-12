import {isNullOrUndefined} from 'util';
import {DataGroup, DataSet} from '../../models';
import {RealTimeDataProcessor} from '../index';

export abstract class Grouper {
  private _realTimeDataProcessor: RealTimeDataProcessor;

  constructor(realTimeDataProcessor: RealTimeDataProcessor) {
    this._realTimeDataProcessor = realTimeDataProcessor;
  }

  get processor(): RealTimeDataProcessor {
    return this._realTimeDataProcessor;
  }

  abstract groupData(data: DataSet): DataGroup;
}

export interface PropertiesGrouperConfig {
  instance?: string;
  measureName?: string;
  measureTimestamp?: number;
  measureValue?: number;
  agent?: string;
  queue?: string;
  segmentType?: string;
  callId?: string;
  group?: number;
  window?: string;
}

export const GROUPER_SEPARATOR = ';';

export const propertiesGrouperFn = (config: PropertiesGrouperConfig = {}) => {
  const instance = !isNullOrUndefined(config.instance) ? config.instance : '';
  const measure = !isNullOrUndefined(config.measureName) ? config.measureName : '';
  const timestamp = !isNullOrUndefined(config.measureTimestamp) ? config.measureTimestamp : -1;
  const value = !isNullOrUndefined(config.measureValue) ? config.measureValue : -1;
  const agent = !isNullOrUndefined(config.agent) ? config.agent : '';
  const queue = !isNullOrUndefined(config.queue) ? config.queue : '';
  const segmentType = !isNullOrUndefined(config.segmentType) ? config.segmentType : '';
  const callId = !isNullOrUndefined(config.callId) ? config.callId : '';
  const group = !isNullOrUndefined(config.group) ? config.group : '';
  const window = !isNullOrUndefined(config.window) ? config.window : '';
  const separator = GROUPER_SEPARATOR;

  return `${instance}${separator}${measure}${separator}${agent}${separator}${queue}${separator}${segmentType}${separator}${callId}${separator}${timestamp}${separator}${value}${separator}${group}${separator}${window}`;
};

export const getPropertiesFromGroupKey = (key: string) => {
  const tokens = key.split(GROUPER_SEPARATOR);
  const length = tokens.length;
  const window = tokens[length - 1];
  const group = +tokens[length - 2];
  const value = +tokens[length - 3];
  const timestamp = +tokens[length - 4];
  const callId = tokens[length - 5];
  const segmentType = tokens[length - 6];
  const queue = tokens[length - 7];
  const agent = tokens[length - 8];
  const measure = tokens[length - 9];
  const instance = tokens[length - 10];

  return {instance, measure, timestamp, value, agent, queue, segmentType, callId, group, window};
};

