import {TimeRangeSetting} from '../../dashboard/models';
import {TimeManager, TimeUtils} from './index';
import {InjectionToken} from '@angular/core';

export const TIME_UTILS = new InjectionToken<TimeUtils>('TimeUtils');
export const TIME_MANAGER = new InjectionToken<TimeManager>('TimeManager');
export const TIME_RANGE_SETTINGS_TOKEN = new InjectionToken<TimeRangeSetting[]>('TIME_RANGE_SETTINGS');
