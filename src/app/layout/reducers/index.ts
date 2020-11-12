import * as fromUi from './ui.reducer';
import * as fromRoot from '../../reducers';

import {createFeatureSelector, createSelector} from '@ngrx/store';

export interface LayoutState {
  ui: fromUi.State;
}

export interface State extends fromRoot.State {
  layout: LayoutState;
}

export const reducers = {
  ui: fromUi.reducer
};

export const getLayoutState = createFeatureSelector<LayoutState>('layout');
export const getErrorMessage = createSelector(
  getLayoutState,
  (state: LayoutState) => state.ui.errorMessage
);

export const getLoading = createSelector(
  getLayoutState,
  (state: LayoutState) => state.ui.loading
);
