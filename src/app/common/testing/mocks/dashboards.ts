import {Dashboard, Placeholder, Tab, TimeRangeSetting} from '../../../dashboard/models';
import {TIME_RANGE_SETTINGS} from '../../models/constants';
import {TimeUtilsImpl} from '../../services/timeUtils';
import * as db from './db.json';
import {DbSchema} from './dbSchema';

export function mockDashboard(options: any = {}): Dashboard {
  const dashboard = mockDashboards()[0];
  const tabs = mockTabs();
  const tabsOfDashboard = tabs.filter((tab: Tab) => tab.dashboardId === dashboard.id);
  return {
    ...dashboard,
    tabs: tabsOfDashboard
  };
}

export function mockTab(options: any = {}): Tab {
  return {
    id: options.id || 1,
    dashboardId: options.id || 1,
    name: options.name || 'Answered calls',
    placeholders: options.placeholders || [
      mockPlaceholder({id: '0'}),
      mockPlaceholder({id: '1'})
    ]
  };
}

export function mockPlaceholder(options: any = {}): Placeholder {
  return {
    id: options.id || 'd2a8b711-aaf7-41a0-a299-6fad280ab385',
    widgetId: options.widgetId || 1,
    size: options.size || {
      rows: 4,
      columns: 2
    },
    position: options.position || {
      x: 4,
      y: 0
    }
  };
}

export function mockDashboards(): Dashboard[] {
  return (db as DbSchema).dashboards;
}

export const mockTabs = () => (db as DbSchema).tabs;

export const mockPlaceholders = (): Placeholder[] => mockTabs()[0].placeholders;

export const mockTimeRangeSettingsList = () => {
  const timeUtils = new TimeUtilsImpl();
  const now = new TimeUtilsImpl().getCurrentTimestamp();
  return TIME_RANGE_SETTINGS.map((settings: TimeRangeSetting) => ({
    ...settings,
    range: {startTimestamp: timeUtils.subtract(now, settings.interval.value, settings.interval.type), endTimestamp: now}
  }));
};
