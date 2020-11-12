import deepFreeze from '../../common/testing/deepFreeze';
import * as replayActions from '../actions/replay.actions';
import * as fromReplay from './replay.reducer';
import {ReplayStatus} from '../models/enums';

describe('replay reducer', () => {
  describe('toggle replay', () => {
    it('should set status to pause if current is resume', () => {
      const stateBefore: fromReplay.State = {
        status: ReplayStatus.RESUME
      };
      const stateAfter: fromReplay.State = {
        status: ReplayStatus.PAUSE
      };
      const action = new replayActions.Toggle();

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(fromReplay.reducer(stateBefore, action)).toEqual(stateAfter);
    });

    it('should set status to resume if current is pause', () => {
      const stateBefore: fromReplay.State = {
        status: ReplayStatus.PAUSE
      };
      const stateAfter: fromReplay.State = {
        status: ReplayStatus.RESUME
      };
      const action = new replayActions.Toggle();

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(fromReplay.reducer(stateBefore, action)).toEqual(stateAfter);
    });
  });

  describe('stop replay', () => {
    it('should set status to stop', () => {
      const stateBefore: fromReplay.State = {
        status: ReplayStatus.RESUME
      };
      const stateAfter: fromReplay.State = {
        status: ReplayStatus.STOP
      };
      const action = new replayActions.Stop();

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(fromReplay.reducer(stateBefore, action)).toEqual(stateAfter);
    });
  });
});
