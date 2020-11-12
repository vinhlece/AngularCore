import {USState} from '../models';

export function buildUSInstance(state: USState): string {
  return `${state.parentState}-${state.capital}`;
}
