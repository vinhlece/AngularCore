import deepFreeze from '../../common/testing/deepFreeze';
import * as widgetsDataActions from '../actions/widgets-data.actions';
import * as fromChartData from './widgets-data.reducer';

describe('widget data reducer', () => {
  it('should replace new widget data on convert success action', () => {
    const stateBefore: fromChartData.State = {
      data: {
        'placeholder_1': {key: 'New Sales', values: [{x: 1, y: 2}]},
        'placeholder_2': {key: 'New Sales', values: [{x: 3, y: 4}]}
      }
    };
    const stateAfter: fromChartData.State = {
      data: {
        'placeholder_2': {key: 'Upgrades', values: [{x: 7, y: 8}]},
        'placeholder_3': {key: 'New Sales', values: [{x: 5, y: 6}]}
      }
    };
    const action = new widgetsDataActions.ConvertSuccess({
      'placeholder_2': {key: 'Upgrades', values: [{x: 7, y: 8}]},
      'placeholder_3': {key: 'New Sales', values: [{x: 5, y: 6}]}
    });

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(fromChartData.reducer(stateBefore, action)).toEqual(stateAfter);
  });
});
