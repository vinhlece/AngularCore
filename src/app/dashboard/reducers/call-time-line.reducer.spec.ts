import deepFreeze from '../../common/testing/deepFreeze';
import * as callTimeLineActions from '../actions/call-time-line.actions';
import * as fromCallTimeLine from './call-time-line.reducer';

describe('call time line reducer', () => {
  it('should set zoom state with zoom action', () => {
    const stateBefore: fromCallTimeLine.State = {
      zoom: {}
    };
    const stateAfter: fromCallTimeLine.State = {
      zoom: {
        trigger: 'rangeSelectorButton',
        timeRange: {startTimestamp: 1, endTimestamp: 10},
        rangeSelectorButton: '1d'
      }
    };
    const action = new callTimeLineActions.Zoom({
      trigger: 'rangeSelectorButton',
      timeRange: {startTimestamp: 1, endTimestamp: 10},
      rangeSelectorButton: '1d'
    });

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(fromCallTimeLine.reducer(stateBefore, action)).toEqual(stateAfter);
  });

  it('should reset zoom state reset zoom action', () => {
    const stateBefore: fromCallTimeLine.State = {
      zoom: {
        trigger: 'rangeSelectorButton',
        timeRange: {startTimestamp: 1, endTimestamp: 10},
        rangeSelectorButton: '1d'
      }
    };
    const stateAfter: fromCallTimeLine.State = {
      zoom: {}
    };
    const action = new callTimeLineActions.ResetZoom();

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(fromCallTimeLine.reducer(stateBefore, action)).toEqual(stateAfter);
  });
});
