import {createFeatureSelector, createSelector} from '@ngrx/store';
import * as _ from 'lodash';
import {Measure} from '../../measures/models';
import * as fromRoot from '../../reducers';
import {Widget} from '../models';
import * as fromEditingWidget from './editing-widget.reducer';
import * as fromSearch from './search.reducer';
import * as fromWidgets from './widgets.reducer';

export interface WidgetsState {
  widgets: fromWidgets.State;
  editingWidget: fromEditingWidget.State;
  search: fromSearch.State;
}

export interface State extends fromRoot.State {
  widgets: WidgetsState;
}

export const reducers = {
  widgets: fromWidgets.reducer,
  editingWidget: fromEditingWidget.reducer,
  search: fromSearch.reducer
};

export const getWidgetsState = createFeatureSelector<WidgetsState>('widgets');

export const getWidgets = createSelector(
  fromRoot.getNormalizedWidgets,
  getWidgetsState,
  (normalizedWidgets, state: WidgetsState) => (
    _
      .chain(normalizedWidgets)
      .pick(state.widgets.ids)
      .values()
      .filter((widget: Widget) => widget.status !== 'deleted')
      .value()
  )
);

export const getWidgetById = (id: string) => createSelector(
  fromRoot.getNormalizedWidgets,
  getWidgetsState,
  (normalizedWidgets, state: WidgetsState) => normalizedWidgets[id]
);

export const getEditingWidget = createSelector(
  getWidgetsState,
  (state: WidgetsState) => state.editingWidget.widget
);

export const getBootstrapLoadingStatus = createSelector(
  fromRoot.getNormalizedBootstrapLoadingStatus,
  (status) => {
    return status.valueOf();
  }
);

export const getWidgetsSearchResult = createSelector(
  fromRoot.getNormalizedWidgets,
  getWidgetsState,
  (normalizedWidgets, state: WidgetsState) => (
    _
      .chain(normalizedWidgets)
      .pick(state.search.widgets)
      .values()
      .filter((widget: Widget) => widget.status !== 'deleted')
      .value()
  )
);

export const getMeasuresSearchResult = createSelector(
  fromRoot.getNormalizedMeasures,
  getWidgetsState,
  (normalizedMeasures, state: WidgetsState) => (
    _
      .chain(normalizedMeasures)
      .pick(state.search.measures)
      .values()
      .value()
  )
);

export const getInstancesSearchResult = createSelector(
  getWidgetsState,
  (state: WidgetsState) => (state.search.instances)
);

export const getSearchType = createSelector(
  getWidgetsState,
  (state: WidgetsState) => state.search.searchType
);

export const getSearchResults = createSelector(
  getWidgetsSearchResult,
  getMeasuresSearchResult,
  getInstancesSearchResult,
  getSearchType,
  (widgets: Widget[], measures: Measure[], instances: string[], searchType: string) => {
    if (searchType === 'all') {
      return {widgets, instances, measures};
    }
    const itemsBySearchType = {
      widgets: [...widgets],
      instances: [...instances],
      measures: [...measures]
    };
    return {[searchType]: itemsBySearchType[searchType]};
  }
);
