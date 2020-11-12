import * as fromRouter from '@ngrx/router-store';
import {ActionReducer, ActionReducerMap, createFeatureSelector, createSelector, MetaReducer} from '@ngrx/store';
import {environment} from '../../environments/environment';
import {RouterStateUrl} from '../common/route/RouterStateUrl';
import * as fromEntities from './entities.reducer';
import {isNullOrUndefined} from 'util';
import {Widget} from '../widgets/models/index';
import * as _ from 'lodash';

export interface State {
  entities: fromEntities.State;
  routerReducer: fromRouter.RouterReducerState<RouterStateUrl>;
}

export const reducers: ActionReducerMap<State> = {
  entities: fromEntities.reducer,
  routerReducer: fromRouter.routerReducer
};

// console.log all actions
export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
  return function (state: State, action: any): State {
    console.log('state', state);
    console.log('action', action);

    return reducer(state, action);
  };
}

export const getRouter = createFeatureSelector<fromRouter.RouterReducerState<RouterStateUrl>>('routerReducer');

/**
 * By default, @ngrx/store uses combineReducers with the reducer map to compose
 * the root meta-reducer. To add more meta-reducers, provide an array of meta-reducers
 * that will be composed to form the root meta-reducer.
 */
export const metaReducers: MetaReducer<State>[] = !environment.production
  ? []
  : [];

export const getEntities = createFeatureSelector('entities');

export const getNormalizedWidgets = createSelector(
  getEntities,
  (state: fromEntities.State) => state.widgets
);

export const getNormalizedDashboards = createSelector(
  getEntities,
  (state: fromEntities.State) => state.dashboards
);

export const getNormalizedTabs = createSelector(
  getEntities,
  (state: fromEntities.State) => state.tabs
);

export const getNormalizedPlaceholders = createSelector(
  getEntities,
  (state: fromEntities.State) => {
    return state.placeholders;
  }
);

export const getNormalizedPackages = createSelector(
  getEntities,
  (state: fromEntities.State) => state.packages
);

export const getNormalizedMeasures = createSelector(
  getEntities,
  (state: fromEntities.State) => state.measures
);

export const getNormalizedInstances = createSelector(
  getEntities,
  (state: fromEntities.State) => state.instances
);

export const getAllInstances = createSelector(
  getEntities,
  (state: fromEntities.State) => {
    return Object.values(state.instances).reduce((allInst, instance) => {
      return _.union(allInst, instance);
    }, []);
  }
);

export const getNormalizedBootstrapLoadingStatus = createSelector(
  getEntities,
  (state: fromEntities.State) => state.isBootstrapLoaded
);

export const getNormalizedPalettes = createSelector(
  getEntities,
  (state: fromEntities.State) => {
    const palettes = [];
    if (state && state.palettes) {
      Object.keys(state.palettes).forEach(key => {
        if (isNullOrUndefined(state.palettes[key].status)) {
          palettes.push(state.palettes[key]);
        }
      });
    }
    return palettes;
  }
);

export const getNormalizedUsers = createSelector(
  getEntities,
  (state: fromEntities.State) => {
    return state.users;
  }
);
