import {User} from '../../../user/models/user';

export const createUser = (params: { id: string, displayName: string, password: string }): User => {
  return {
    id: params.id,
    displayName: params.displayName,
    password: params.password
  };
};
