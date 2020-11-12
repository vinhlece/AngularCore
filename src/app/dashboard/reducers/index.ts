import {createFeatureSelector, createSelector} from '@ngrx/store';
import * as _ from 'lodash';
import {LaunchingWidget} from '../../realtime/models';
import * as fromRoot from '../../reducers';
import {ChartWidget, Widget} from '../../widgets/models';
import {Dashboard, Placeholder, PollingConfig, PredictiveSetting, Tab, TimeRangeSetting} from '../models';
import {PlaceholderSize} from '../models/enums';
import * as fromCallTimeLine from './call-time-line.reducer';
import * as fromDashboard from './dashboards.reducer';
import * as fromPlaceholders from './placeholders.reducer';
import * as fromPlot from './plot.reducer';
import * as fromReplay from './replay.reducer';
import * as fromTabEditor from './tab-editor.reducer';
import * as fromTimeExplorer from './time-explorer.reducer';
import * as fromTimePreferences from './time-preferences.reducer';
import * as fromWidgetData from './widgets-data.reducer';
import * as fromUrls from './urls.reducer';
import * as fromGlobalFilter from './global-filter.reducer';
import * as fromConnectionStatus from './connection-status.reducer';
import * as fromInstanceColor from './instance-color.reducer';

export interface DashboardsState {
  dashboards: fromDashboard.State;
  placeholders: fromPlaceholders.State;
  tabEditor: fromTabEditor.State;
  widgetData: fromWidgetData.State;
  timePreferences: fromTimePreferences.State;
  timeExplorer: fromTimeExplorer.State;
  replay: fromReplay.State;
  plot: fromPlot.State;
  callTimeLine: fromCallTimeLine.State;
  urls: fromUrls.State;
  globalFilters: fromGlobalFilter.State;
  connectionStatus: fromConnectionStatus.State;
  instanceColors: fromInstanceColor.State;
}

export interface State extends fromRoot.State {
  dashboards: DashboardsState;
}

export const reducers = {
  dashboards: fromDashboard.reducer,
  placeholders: fromPlaceholders.reducer,
  tabEditor: fromTabEditor.reducer,
  widgetData: fromWidgetData.reducer,
  timePreferences: fromTimePreferences.reducer,
  timeExplorer: fromTimeExplorer.reducer,
  replay: fromReplay.reducer,
  plot: fromPlot.reducer,
  callTimeLine: fromCallTimeLine.reducer,
  urls: fromUrls.reducer,
  globalFilters: fromGlobalFilter.reducer,
  instanceColors: fromInstanceColor.reducer,
  connectionStatus: fromConnectionStatus.reducer
};

export const getDashboardsState = createFeatureSelector<DashboardsState>('dashboards');

export const getDashboards = createSelector(
  fromRoot.getNormalizedDashboards,
  getDashboardsState,
  (normalizedDashboards, state: DashboardsState) => (
    _
      .chain(normalizedDashboards)
      .pick(state.dashboards.ids)
      .values()
      .filter((dashboard: Dashboard) => dashboard.status !== 'deleted')
      .value()
  )
);

export const getTabs = createSelector(
  getDashboardsState,
  (state: DashboardsState) => state.dashboards.tabs
);

export const getDashboardById = (id: string) => createSelector(
  fromRoot.getNormalizedDashboards,
  normalizedDashboards => normalizedDashboards[id]
);

export const getLaunchMode = createSelector(
  getDashboardsState,
  (state: DashboardsState) => state.dashboards.launchMode
);

export const getConnectionStatus = createSelector(
  getDashboardsState,
  (state: DashboardsState) => {
    return state.connectionStatus.connectionStatus;
  }
);

export const getTabOfDashboard = (dashboardId: string) => createSelector(
  fromRoot.getNormalizedTabs,
  getDashboardById(dashboardId),
  (normalizedTabs, dashboard: Dashboard) => (
    _
      .chain(normalizedTabs)
      .pick(dashboard.tabs)
      .values()
      .filter((tab: Tab) => tab.status !== 'deleted')
      .value()
  )
);

export const getTabById = (id: string) => createSelector(
  fromRoot.getNormalizedTabs,
  (normalizedTabs) => normalizedTabs[id]
);

export const getPlaceholders = createSelector(
  fromRoot.getNormalizedPlaceholders,
  (normalizedPlaceholders) => (
    _
      .chain(normalizedPlaceholders)
      .values()
      .filter((placeholder: Placeholder) => placeholder.status !== 'deleted')
      .value()
  )
);

export const getPlaceholdersOfTab = (tabId: string) => createSelector(
  fromRoot.getNormalizedPlaceholders,
  getTabById(tabId),
  (normalizedPlaceholders, tab: Tab) => (
    _
      .chain(normalizedPlaceholders)
      .pick(tab.placeholders)
      .values()
      .filter((placeholder: Placeholder) => placeholder.status !== 'deleted')
      .value()
  )
);

export const getPlaceholderById = (id: string) => createSelector(
  fromRoot.getNormalizedPlaceholders,
  (normalizedPlaceholders) => normalizedPlaceholders[id]
);

export const getPlaceholderByWidgetId = (id: string) => createSelector(
  fromRoot.getNormalizedPlaceholders,
  (normalizedPlaceholders) => {
    return Object.values(normalizedPlaceholders).find(placeholder => placeholder.widgetId === id);
  }
);

// Tab editor state
export const getWidgetToCreate = createSelector(
  getDashboardsState,
  fromRoot.getNormalizedWidgets,
  (state: DashboardsState, normalizedWidgets) => normalizedWidgets ? normalizedWidgets[state.tabEditor.widgetToCreate] : null
);

export const getMetrics = createSelector(
  getDashboardsState,
  (state: DashboardsState) => state.tabEditor.metrics
);

export const getEditingPlaceholders = createSelector(
  getDashboardsState,
  (state: DashboardsState) => state.placeholders.placeholders
);

export const getEditingTab = (tabId: string) => (
  createSelector(
    getTabById(tabId),
    getEditingPlaceholders,
    (tab: Tab, placeholders: Placeholder[]) => {
      return {
        ...tab,
        placeholders
      };
    }
  )
);

export const getWidgetData = (placeholderId: string) => createSelector(
  getDashboardsState,
  (state: DashboardsState) => state.widgetData.data[placeholderId]
);

export const isShowGridLines = createSelector(
  getDashboardsState,
  (state: DashboardsState) => state.tabEditor.isShowGridLines
);

// Time preferences state
export const getPollingConfig = createSelector(
  getDashboardsState,
  (state: DashboardsState) => state.timePreferences.config
);

export const getCurrentTimestamp = createSelector(
  getDashboardsState,
  (state: DashboardsState) => state.timePreferences.currentTimestamp
);

export const getGoBackTimestamp = createSelector(
  getDashboardsState,
  (state: DashboardsState) => state.timePreferences.goBackTimestamp
);

export const getTimeRangeSettings = createSelector(
  getPollingConfig,
  (config: PollingConfig) => config ? config.timeRangeSettings : null
);

export const getPredictiveSettings = createSelector(
  getPollingConfig,
  (config: PollingConfig) => config ? config.predictiveSettings : null
);

export const getTimeRange = createSelector(
  getTimeRangeSettings,
  (timeRangeSettings: TimeRangeSetting) => timeRangeSettings ? timeRangeSettings.range : null
);

export const getStep = createSelector(
  getTimeRangeSettings,
  (timeRangeSettings: TimeRangeSetting) => timeRangeSettings ? timeRangeSettings.step : null
);

export const getTimeRangeInterval = createSelector(
  getTimeRangeSettings,
  (timeRangeSettings: TimeRangeSetting) => timeRangeSettings ? timeRangeSettings.interval : null
);

export const getPredictiveSetting = createSelector(
  getPredictiveSettings,
  (predictiveSetting: PredictiveSetting) => predictiveSetting ? predictiveSetting.value : null
);

export const getZoom = createSelector(
  getDashboardsState,
  (state: DashboardsState) => state.timePreferences.zoom
);

// Time explorer state
export const getTimeExplorerState = createSelector(
  getDashboardsState,
  (state: DashboardsState) => state.timeExplorer
);

export const isTimeExplorerOpened = createSelector(
  getTimeExplorerState,
  (state: fromTimeExplorer.State) => state.opened
);

// Replay state
export const getReplayState = createSelector(
  getDashboardsState,
  (state: DashboardsState) => state.replay
);

export const getReplayStatus = createSelector(
  getReplayState,
  (state: fromReplay.State) => state.status
);

// Placeholders state
export const getPlaceholdersState = createSelector(
  getDashboardsState,
  (state: DashboardsState) => state.placeholders
);

export const getPlaceholderSize = (placeholderId: string) => createSelector(
  getPlaceholdersState,
  (state: fromPlaceholders.State) => state.sizes[placeholderId] ? state.sizes[placeholderId] : PlaceholderSize.MINIMUM
);

export const getMaximizedPlaceholder = createSelector(
  fromRoot.getNormalizedPlaceholders,
  getPlaceholdersState,
  (normalizedPlaceholders, state: fromPlaceholders.State) => normalizedPlaceholders[state.maximumPlaceholderId]
);

export const getPlaceholderFocusState = (placeholderId: string) => createSelector(
  getPlaceholdersState,
  (state: fromPlaceholders.State) => state.focus[placeholderId]
);

export const getPlaceholderWidget = (placeholderId: string) => createSelector(
  getPlaceholderById(placeholderId),
  fromRoot.getNormalizedWidgets,
  (placeholder: Placeholder, normalizedWidgets) => placeholder ? normalizedWidgets[placeholder.widgetId] : null
);

export const getPlaceholderDisplayMode = (placeholderId: string) => createSelector(
  getPlaceholdersState,
  getPlaceholderWidget(placeholderId),
  (state: fromPlaceholders.State, widget: Widget) => {
    if (!widget) {
      return null;
    }
    const displayMode = state.displayModes[placeholderId];
    return displayMode ? displayMode : (widget as LaunchingWidget).displayMode;
  }
);

export const getPlaceholderDisplayModes = createSelector(
  getPlaceholdersState,
  fromRoot.getNormalizedWidgets,
  (state: fromPlaceholders.State, normalizedWidgets) => {
    return state.placeholders.reduce((acc, item) => {
      const placeHolderId = normalizedWidgets[item.widgetId] && normalizedWidgets[item.widgetId].displayMode ? item.id : null;
      if (placeHolderId) {
        acc.push(placeHolderId);
      }
      return acc;
    }, []);
  }
);

export const getPlaceholderChartType = (placeholderId: string) => createSelector(
  getPlaceholdersState,
  getPlaceholderWidget(placeholderId),
  (state: fromPlaceholders.State, widget: Widget) => {
    if (!widget) {
      return null;
    }
    const chartType = state.charts[placeholderId];
    return chartType ? chartType : (widget as ChartWidget).chartType;
  }
);

export const getShowLegend = (placeholderId: string) => createSelector(
  getPlaceholdersState,
  (state) => {
    return state.changeLegend[placeholderId];
  }
);

export const getStartPauseLineChart = (placeholderId: string) => createSelector(
  getPlaceholdersState,
  (state) => {
    return state.pauseLineChart[placeholderId];
  }
);

// Plot state
export const getPlotState = createSelector(
  getDashboardsState,
  (state: DashboardsState) => state.plot
);

export const getPlotPoint = createSelector(
  getPlotState,
  (state: fromPlot.State) => state.point
);

// Call time line state
export const getCallTimeLineState = createSelector(
  getDashboardsState,
  (state: DashboardsState) => state.callTimeLine
);

export const getCallTimeLineZoom = createSelector(
  getCallTimeLineState,
  (state: fromCallTimeLine.State) => state.zoom
);

// Urls invoke state
export const getUrlsState = createSelector(
  getDashboardsState,
  (state: DashboardsState) => state.urls
);

export const getInvokeUrl = createSelector(
  getUrlsState,
  (state: fromUrls.State) => state.url
);

export const getInvokeResponse = createSelector(
  getUrlsState,
  (state: fromUrls.State) => state.data
);

export const getInvokeError = createSelector(
  getUrlsState,
  (state: fromUrls.State) => state.error
);

export const getGlobalFilters = createSelector(
  getDashboardsState,
  (state: DashboardsState) => state.globalFilters.globalFilters
);

export const getRealTimeMode = createSelector(
  getPlaceholdersState,
  (state: fromPlaceholders.State) => state.realTimeMode
);

export const getInstanceColors = createSelector(
  getDashboardsState,
  (state: DashboardsState) => state.instanceColors.instanceColors
);
