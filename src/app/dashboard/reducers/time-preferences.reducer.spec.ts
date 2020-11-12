import {ZoomEvent} from '../../charts/models';
import deepFreeze from '../../common/testing/deepFreeze';
import * as timePreferencesActions from '../actions/time-preferences.actions';
import {PollingConfig, TimeRange} from '../models';
import {TimeRangeType} from '../models/enums';
import * as fromTimePreferences from './time-preferences.reducer';

describe('time preferences reducer', () => {
  describe('currentTimestamp', () => {
    it('should set current timestamp with set current timestamp action', () => {
      const stateBefore: number = 0;
      const stateAfter: number = 10;
      const action = new timePreferencesActions.SetCurrentTimestamp(10);

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(fromTimePreferences.currentTimestamp(stateBefore, action)).toEqual(stateAfter);
    });
  });

  describe('goBackTimestamp', () => {
    it('should set go back timestamp with set go back timestamp action', () => {
      const stateBefore: number = 0;
      const stateAfter: number = 10;
      const action = new timePreferencesActions.SetGoBackTimestamp(10);

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(fromTimePreferences.goBackTimestamp(stateBefore, action)).toEqual(stateAfter);
    });
  });

  describe('timeRange', () => {
    it('should set time range with set time range action', () => {
      const stateBefore: TimeRange = {startTimestamp: 1, endTimestamp: 10};
      const stateAfter: TimeRange = {startTimestamp: 20, endTimestamp: 30};
      const action = new timePreferencesActions.SetTimeRange({startTimestamp: 20, endTimestamp: 30});

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(fromTimePreferences.timeRange(stateBefore, action)).toEqual(stateAfter);
    });
  });

  describe('zoom', () => {
    it('should set zoom state with zoom action', () => {
      const stateBefore: ZoomEvent = {
        trigger: 'zoom',
        timeRange: {startTimestamp: 1, endTimestamp: 10},
        rangeSelectorButton: null
      };
      const stateAfter: ZoomEvent = {
        trigger: 'rangeSelectorButton',
        timeRange: {startTimestamp: 1, endTimestamp: 10},
        rangeSelectorButton: '1d'
      };
      const action = new timePreferencesActions.Zoom({
        trigger: 'rangeSelectorButton',
        timeRange: {startTimestamp: 1, endTimestamp: 10},
        rangeSelectorButton: '1d'
      });

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(fromTimePreferences.zoom(stateBefore, action)).toEqual(stateAfter);
    });

    it('should reset zoom state reset zoom action', () => {
      const stateBefore: ZoomEvent = {
        trigger: 'zoom',
        timeRange: {startTimestamp: 1, endTimestamp: 10},
        rangeSelectorButton: null
      };
      const stateAfter: ZoomEvent = {
        trigger: 'rangeSelectorButton',
        timeRange: null,
        rangeSelectorButton: 'All'
      };
      const action = new timePreferencesActions.ResetZoom();

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(fromTimePreferences.zoom(stateBefore, action)).toEqual(stateAfter);
    });
  });

  describe('config', () => {
    it('should set polling config with load polling config success action', () => {
      const config: PollingConfig = {
        timeRangeSettings: {
          interval: {
            type: TimeRangeType.Day,
            value: 1,
          },
          range: {
            startTimestamp: 1513728000000,
            endTimestamp: 1513728000001,
          }
        },
        pollingInterval: {
          initialDelay: 0,
          timerInterval: 5000,
          debounce: 100,
          convertDelay: 100
        },
      };
      const stateBefore: PollingConfig = {
        timeRangeSettings: {},
        pollingInterval: {
          initialDelay: 0,
          timerInterval: 5000,
          debounce: 100,
          convertDelay: 100
        },
      };
      const stateAfter: PollingConfig = config;
      const action = new timePreferencesActions.LoadSuccess(config);

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(fromTimePreferences.config(stateBefore, action)).toEqual(stateAfter);
    });

    it('should update time range settings with update time range settings action', () => {
      const stateBefore: PollingConfig = {
        timeRangeSettings: {},
        pollingInterval: {
          initialDelay: 0,
          timerInterval: 5000,
          debounce: 100,
          convertDelay: 100
        },
      };
      const stateAfter: PollingConfig = {
        timeRangeSettings: {
          interval: {
            type: TimeRangeType.Day,
            value: 1,
          },
          range: {
            startTimestamp: 1513728000000,
            endTimestamp: 1513728000001,
          }
        },
        pollingInterval: {
          initialDelay: 0,
          timerInterval: 5000,
          debounce: 100,
          convertDelay: 100
        },
      };
      const action = new timePreferencesActions.UpdateTimeRangeSettings({
        interval: {
          type: TimeRangeType.Day,
          value: 1,
        },
        range: {
          startTimestamp: 1513728000000,
          endTimestamp: 1513728000001,
        }
      });

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(fromTimePreferences.config(stateBefore, action)).toEqual(stateAfter);
    });

    it('should update time range with update time range action', () => {
      const stateBefore: PollingConfig = {
        timeRangeSettings: {
          interval: {
            type: TimeRangeType.Day,
            value: 1,
          },
          range: {
            startTimestamp: 0,
            endTimestamp: 1,
          }
        },
        pollingInterval: {
          initialDelay: 0,
          timerInterval: 5000,
          debounce: 100,
          convertDelay: 100
        },
      };
      const stateAfter: PollingConfig = {
        timeRangeSettings: {
          interval: {
            type: TimeRangeType.Day,
            value: 1,
          },
          range: {
            startTimestamp: 1513728000000,
            endTimestamp: 1513728000001,
          }
        },
        pollingInterval: {
          initialDelay: 0,
          timerInterval: 5000,
          debounce: 100,
          convertDelay: 100
        },
      };
      const action = new timePreferencesActions.UpdateTimeRange({
        startTimestamp: 1513728000000,
        endTimestamp: 1513728000001,
      });

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(fromTimePreferences.config(stateBefore, action)).toEqual(stateAfter);
    });
  });
});
