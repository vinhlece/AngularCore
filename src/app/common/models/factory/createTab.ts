import {Tab} from '../../../dashboard/models';

/**
 * Create a tab associated with a dashboard,
 * if tab name is not given, default tab name 'New tab 1' is used
 */
export const createTab = (params: { dashboardId: string, name?: string}): Tab => {
  const tab: Tab = {
    dashboardId: params.dashboardId,
    name: params.name || 'New tab 1'
  };
  return tab;
};
