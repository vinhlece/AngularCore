import deepFreeze from '../../common/testing/deepFreeze';
import * as plotActions from '../actions/plot.actions';
import {PlotPoint} from '../models';
import * as fromPlot from './plot.reducer';

describe('plot reducer', () => {
  it('should set plot point with plot action', () => {
    const plotPoint: PlotPoint = {
      trigger: 'click',
      widgetId: '52',
      instance: 'New Sales',
      measure: 'measure'
    };
    const stateBefore: fromPlot.State = {
      point: null
    };
    const stateAfter: fromPlot.State = {
      point: plotPoint
    };
    const action = new plotActions.Plot(plotPoint);

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(fromPlot.reducer(stateBefore, action)).toEqual(stateAfter);
  });
});
