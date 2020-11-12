import {createSelector} from '@ngrx/store';
import {State} from '../../reducers/index';
import {RouterStateUrl} from './RouterStateUrl';

export const getRouterState = (state: State) => {
  if (state) {
    return state.routerReducer;
  } else {
    return null;
  }
};

export const getRouteInformaton = createSelector(getRouterState,
  (state): RouterStateUrl => {
    if (state) {
      return state.state;
    } else {
      return {url: '', queryParams: {}};
    }
  });
