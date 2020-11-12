import {InjectionToken} from '@angular/core';
import {DashboardNavigator, PlaceholdersService, PlotEditor, PollingConfigService, WorkerService} from './index';

export const WORKER_SERVICE = new InjectionToken<WorkerService>('WorkerService');
export const DASHBOARD_NAVIGATOR = new InjectionToken<DashboardNavigator>('DashboardNavigator');
export const POLLING_CONFIG_SERVICE = new InjectionToken<PollingConfigService>('PollingConfigService');
export const REPLAY_INTERVAL = new InjectionToken<Number>('ReplayInterval');
export const PLACEHOLDERS_SERVICE = new InjectionToken<PlaceholdersService>('PlaceholdersService');
export const PLOT_EDITOR = new InjectionToken<PlotEditor>('PlotEditor');
