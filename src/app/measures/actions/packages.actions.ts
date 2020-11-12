import {normalize} from 'normalizr';
import {ActionWithPayload} from '../../common/actions';
import {packageSchema} from '../../common/schemas';
import {Package} from '../models';

export interface ApiPackagesResponse {
  entities: {
    packages: { [dimensions: string]: Package }
  };
  result: number[];
}
export const LOAD_ALL = '[Packages] Load All';
export const LOAD_ALL_RESPONSE = '[Packages] Load All Response';

export class LoadAll implements ActionWithPayload<void> {
  type = LOAD_ALL;
}

export class LoadAllSuccess implements ActionWithPayload<ApiPackagesResponse> {
  type = LOAD_ALL_RESPONSE;
  payload: ApiPackagesResponse;

  constructor(packages: Package[]) {
    this.payload = normalize(packages, [packageSchema]);
  }
}

export class LoadAllFailure implements ActionWithPayload<string> {
  type = LOAD_ALL_RESPONSE;
  error = true;
  payload: string;

  constructor(error: Error) {
    this.payload = error.message;
  }
}
