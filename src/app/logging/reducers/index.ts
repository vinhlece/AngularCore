import * as fromRoot from '../../reducers';

import {createFeatureSelector, createSelector} from '@ngrx/store';

export interface LoggingState {
}

export interface State extends fromRoot.State {
  logging: LoggingState;
}

export const reducers = {
};

export const getLoggingState = createFeatureSelector<LoggingState>('logging');
