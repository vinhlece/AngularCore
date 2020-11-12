import {ActionReducerMap, createFeatureSelector, createSelector, MetaReducer} from '@ngrx/store';
import {Placeholder, TimeRangeSetting} from '../../dashboard/models';
import * as fromPlaceholders from '../../dashboard/reducers/placeholders.reducer';
import * as fromTimeExplorer from '../../dashboard/reducers/time-explorer.reducer';
import * as fromTimePreferences from '../../dashboard/reducers/time-preferences.reducer';
import * as fromInstanceColors from '../../dashboard/reducers/instance-color.reducer';
import * as fromWidgetData from '../../dashboard/reducers/widgets-data.reducer';
import * as fromEntities from '../../reducers/entities.reducer';
import {LaunchingWidget} from '../models';
import * as fromPolling from './rest-api/polling.reducer';
import * as fromRealTime from './rest-api/real-time-data.reducer';
import * as fromPlatte from '../../user/reducers/palette.reducer';
import * as fromWidgetContainer from './web-socket/widget-container.reducer';
import * as fromWebSocket from './web-socket/subscription.reducer';
import * as fromGlobalFilters from '../../dashboard/reducers/global-filter.reducer';
import * as fromPumpUp from './web-socket/pump-up.reducer';
import * as fromPolicyGroup from './web-socket/policy-group.reducer';
import { isChartWidget } from '../../widgets/utils/functions';
import * as fromConnectionStatus from '../../dashboard/reducers/connection-status.reducer';

export interface State {
  entities: fromEntities.State;
  realTime: fromRealTime.State;
  widgetData: fromWidgetData.State;
  timePreferences: fromTimePreferences.State;
  timeExplorer: fromTimeExplorer.State;
  placeholders: fromPlaceholders.State;
  polling: fromPolling.State;
  palette: fromPlatte.State;
  widgetContainers: fromWidgetContainer.State;
  webSocketSubscriptions: fromWebSocket.State;
  globalFilters: fromGlobalFilters.State;
  pumpUpOptions: fromPumpUp.State;
  policyGroup: fromPolicyGroup.State;
  connectionStatus: fromConnectionStatus.State;
  instanceColors: fromInstanceColors.State;
}

export const reducers: ActionReducerMap<State> = {
  entities: fromEntities.reducer,
  realTime: fromRealTime.reducer,
  widgetData: fromWidgetData.reducer,
  timePreferences: fromTimePreferences.reducer,
  timeExplorer: fromTimeExplorer.reducer,
  placeholders: fromPlaceholders.reducer,
  polling: fromPolling.reducer,
  palette: fromPlatte.reducer,
  widgetContainers: fromWidgetContainer.reducer,
  webSocketSubscriptions: fromWebSocket.reducer,
  globalFilters: fromGlobalFilters.reducer,
  pumpUpOptions: fromPumpUp.reducer,
  connectionStatus: fromConnectionStatus.reducer,
  policyGroup: fromPolicyGroup.reducer,
  instanceColors: fromInstanceColors.reducer
};

export const metaReducers: MetaReducer<State>[] = [];

// Entity state
export const getEntities = createFeatureSelector('entities');

export const getNormalizedPackages = createSelector(
  getEntities,
  (state: fromEntities.State) => state.packages
);

export const getNormalizedMeasures = createSelector(
  getEntities,
  (state: fromEntities.State) => state.measures
);

export const getNormalizedWidgets = createSelector(
  getEntities,
  (state: fromEntities.State) => state.widgets
);

// RealTime state
export const getRealTimeState = createFeatureSelector('realTime');

export const getMainStorage = createSelector(getRealTimeState, (state: fromRealTime.State) => state.mainStorage);

export const getEventStorage = createSelector(getRealTimeState, (state: fromRealTime.State) => state.eventStorage);

export const getPredictiveStorage = createSelector(getRealTimeState, (state: fromRealTime.State) => state.predictiveStorage);

export const getPolicyGroupStorage = createSelector(getRealTimeState, (state: fromRealTime.State) => state.policyGroupStorage);

// Widget data state
export const getWidgetDataState = createFeatureSelector('widgetData');

export const getWidgetData = createSelector(getWidgetDataState, (state: fromWidgetData.State) => state.data);

// Time preferences state
export const getTimePreferencesState = createFeatureSelector<fromTimePreferences.State>('timePreferences');

export const getPollingConfig = createSelector(
  getTimePreferencesState,
  (state: fromTimePreferences.State) => state.config
);

export const getCurrentTimestamp = createSelector(
  getTimePreferencesState,
  (state: fromTimePreferences.State) => state.currentTimestamp
);

export const getTimeRangeSettings = createSelector(
  getTimePreferencesState,
  (state: fromTimePreferences.State) => state.config ? state.config.timeRangeSettings : null
);

export const getTimeRangePreference = createSelector(
  getTimeRangeSettings,
  (timeRangeSettings: TimeRangeSetting) => timeRangeSettings ? timeRangeSettings.range : null
);

export const getGoBackTimestamp = createSelector(
  getTimePreferencesState,
  (state: fromTimePreferences.State) => state.goBackTimestamp
);

export const getTimeRange = createSelector(
  getTimePreferencesState,
  (state: fromTimePreferences.State) => state.timeRange
);

export const getZoomTimeRange = createSelector(
  getTimePreferencesState,
  (state: fromTimePreferences.State) => state.zoom.timeRange
);

// Time explorer state
export const getTimeExplorerState = createFeatureSelector<fromTimeExplorer.State>('timeExplorer');

export const isTimeExplorerOpened = createSelector(
  getTimeExplorerState,
  (state: fromTimeExplorer.State) => state.opened
);

// Placeholders state
export const getPlaceholdersState = createFeatureSelector('placeholders');

export const getPlaceholders = createSelector(
  getPlaceholdersState,
  (state: fromPlaceholders.State) => state.placeholders
);

export const getDisplayMode = (placeholderId: string) => (
  createSelector(
    getPlaceholdersState,
    (state: fromPlaceholders.State) => state.displayModes[placeholderId]
  )
);

export const getDisplayModes = createSelector(
  getPlaceholdersState,
  (state: fromPlaceholders.State) => state.displayModes
);

export const getRealTimeMode = createSelector(
  getPlaceholdersState,
  (state: fromPlaceholders.State) => state.realTimeMode
);

export const getLaunchingWidgets = createSelector(
  getPlaceholders,
  getNormalizedWidgets,
  getDisplayModes,
  (placeholders: Placeholder[], widgets, displayModes) => {
    return placeholders.reduce((acc: LaunchingWidget[], placeholder: Placeholder) => {
      const widget = widgets[placeholder.widgetId];
      if (widget && isChartWidget(widget.type)) {
        const displayMode = displayModes[placeholder.id];
        const launchingWidget: LaunchingWidget = {
          ...widget,
          placeholder,
          displayMode: displayMode ? displayMode : widget.displayMode
        };
        acc.push(launchingWidget);
      }
      return acc;
    }, []);
  }
);

export const getPollingState = createFeatureSelector<fromPolling.State>('polling');

export const getIsListening = createSelector(
  getPollingState,
  (state: fromPolling.State) => state.isListening
);

export const getTopics = createSelector(
  getPollingState,
  (state: fromPolling.State) => state.topics
);

export const getStreams = createSelector(
  getPollingState,
  (state: fromPolling.State) => state.streams
);

export const getGoBackStreams = createSelector(
  getPollingState,
  (state: fromPolling.State) => state.goBackStreams
);

export const getInstancesState = createSelector(
  getEntities,
  (state: fromEntities.State) => state.instances
);

export const getWidgetContainerState = createFeatureSelector('widgetContainers');

export const getWidgetContainers = createSelector(
  getWidgetContainerState,
  (state: fromWidgetContainer.State) => {
    return state.widgetContainers;
  }
);

export const getWebSocketSubscriptionsState = createFeatureSelector('webSocketSubscriptions');

export const getWebSocketSubscriptions = createSelector(
  getWebSocketSubscriptionsState,
  (state: fromWebSocket.State) => state.subscriptions
);

export const getPumpUpOptionsState = createFeatureSelector('pumpUpOptions');

export const getPumpUpOptions = createSelector(
  getPumpUpOptionsState,
  (state: fromPumpUp.State) => state.options
);

export const getCurrentUser = createSelector(
  getEntities,
  (state: fromEntities.State) => {
    return Object.values(state.users)[0];
  }
);

export const getPalette = createSelector(
  getEntities,
  (state: fromEntities.State) => {
    const user = Object.values(state.users)[0];
    const palettes = Object.values(state.palettes);
    if (user && user.selectedPalette) {
      return palettes.find(item => item.id === user.selectedPalette);
    }
  }
);

export const getGlobalFiltersState = createFeatureSelector('globalFilters');
export const getGlobalFilters = createSelector(
  getGlobalFiltersState,
  (state: fromGlobalFilters.State) => {
    return state.globalFilters ? state.globalFilters : [];
  }
);

export const getPolicyGroupState = createFeatureSelector('policyGroup');
export const getPolicyGroup = createSelector(
  getPolicyGroupState,
  (state: fromPolicyGroup.State) => {
    return state.policyInfos;
  }
);

export const getIColorState = createFeatureSelector('instanceColors');
export const getIColors = createSelector(
  getIColorState,
  (state: fromInstanceColors.State) => state.instanceColors
);

export const getConnectionState = createFeatureSelector('connectionStatus');
export const getConnectionStatus = createSelector(
  getConnectionState,
  (state: fromConnectionStatus.State) => state.connectionStatus
);
