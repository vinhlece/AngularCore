import {InjectionToken} from '@angular/core';
import {EventSourceService} from './index';

export const EVENT_SOURCE_SERVICE = new InjectionToken<EventSourceService>('EventSourceServiceImpl');
