import {createFeatureSelector, createSelector} from '@ngrx/store';
import * as fromRoot from '../../reducers';
import * as fromLaunchers from './launchers.reducer';

export interface EmbeddedState {
  launchers: fromLaunchers.State;
}

export interface State extends fromRoot.State {
  embedded: EmbeddedState;
}

export const reducers = {
  launchers: fromLaunchers.reducer
};

export const getEmbeddedState = createFeatureSelector<EmbeddedState>('embedded');

export const getLauncherSize = (id: string) => (
  createSelector(
    getEmbeddedState,
    (state: EmbeddedState) => state.launchers.sizes[id]
  )
);
