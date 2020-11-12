import {ActionWithPayload} from '../../common/actions';

export interface State {
  errorMessage: string;
}

export const initialState: State = {
  errorMessage: null
};

export function reducer(state = initialState, action: ActionWithPayload<any>) {
  switch (action.type) {
    default:
      return state;
  }
}
