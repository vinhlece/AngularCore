import * as requestActions from '../actions/request.actions';

export interface State {
  loading: boolean;
  errorMessage: string;
}

export const initialState: State = {
  loading: false,
  errorMessage: ''
};


export function reducer(state = initialState, action: requestActions.Actions) {
  switch (action.subType) {
    case requestActions.START:
      return {
        ...state,
        loading: true
      };

    case requestActions.SUCCESS:
      return {
        ...initialState
      };

    case requestActions.FAIL:
      return {
        loading: false,
        errorMessage: (action as requestActions.FailAction).errorMessage
      };

    default:
      return state;
  }
}
