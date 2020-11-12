import {createFeatureSelector, createSelector} from '@ngrx/store';
import * as fromRoot from '../../reducers';
import * as user from './user.reducer';
import * as colorPalette from './palette.reducer';
import * as fromRole from './role.reducer';
import {getNormalizedUsers, getNormalizedPalettes} from '../../reducers/index';
import {User} from '../models/user';

export interface UserState {
  user: user.State;
  colorPalette: colorPalette.State;
  role: fromRole.State;
}

export interface State extends fromRoot.State {
  user: UserState;
}

export const reducers = {
  user: user.reducer,
  colorPalette: colorPalette.reducer,
  role: fromRole.reducer
};

export const getUserState = createFeatureSelector('user');

export const getAllUsers = createSelector(
  getUserState,
  getNormalizedUsers,
  (state: UserState, users) => {
    return state.user.users.filter(item => item.id !== state.user.authenticatedUserId);
  });

export const getUserById = (id: string) => createSelector(
  getAllUsers,
  users => users.find(userObj => userObj.id === id)
);

export const getRolesByUserEditing = createSelector(
  getUserState,
  (state: UserState) => {
    return state.user.rolesEditing;
  });

export const getAuthenticatedUser = createSelector(
  getUserState, getNormalizedUsers,
  (state: UserState, users) => {
    return users[state.user.authenticatedUserId];
  });

export const getAuthenticationErrorMessage = createSelector(
  getUserState, getNormalizedUsers,
  (state: UserState, users) => {
    return state.user;
  });

export const getErrorMessage = createSelector(
  getUserState, getNormalizedUsers,
  (state: UserState, users) => {
    return users[state.user.errorMessage];
  });

export const getPaletteErrorMessage = createSelector(
  getUserState, getNormalizedUsers,
  (state: UserState, users) => users[state.colorPalette.errorMessage]);

export const getCurrentColorPalette = createSelector(
  getNormalizedUsers,
  getNormalizedPalettes,
  (users, palettes) => {
    const user: User = Object.values(users)[0];
    return palettes.find(item => item.id === user.selectedPalette);
  });

export const getAllRoles = createSelector(
  getUserState,
  (state: UserState) => {
    return state.role.roles;
  });

