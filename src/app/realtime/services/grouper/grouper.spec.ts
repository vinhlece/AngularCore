import {isNullOrUndefined} from 'util';
import {GROUPER_SEPARATOR, PropertiesGrouperConfig} from './grouper';

export const getGroupKey = (config: PropertiesGrouperConfig = {}) => {
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
