import {InjectionToken} from '@angular/core';
import {Session, AppBootstrap} from './index';

export const APP_BOOTSTRAP = new InjectionToken<AppBootstrap>('AppBootstrap');
export const SESSION = new InjectionToken<Session>('Session');
