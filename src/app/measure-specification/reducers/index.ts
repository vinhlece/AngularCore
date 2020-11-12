import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as _ from 'lodash';
import * as fromRoot from '../../reducers';
import * as fromEvent from './measure-specification.reducer';

export interface EventState {
  source: fromEvent.State;
}

export interface State extends fromRoot.State {
  source: State;
}

export const reducers = {
  source: fromEvent.reducer
};

export const getEventState = createFeatureSelector<EventState>('source');

export const getEvent = createSelector(
  getEventState,
  (state: fromEvent.State) => state.source
);

export const getStream = createSelector(
  getEvent,
  (state: fromEvent.State) => state.source
);

export const getCustomEventTags = createSelector(
  getEvent,
  (state: fromEvent.State) => state.customEventTags
);

export const getEventTags = createSelector(
  getEvent,
  (state: fromEvent.State) => state.eventTags
);
