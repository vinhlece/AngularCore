import {PollingConfig} from '../dashboard/models';
import {PREDICTIVE_RANGE_SETTINGS, TIME_RANGE_SETTINGS} from '../common/models/constants';

export const pollingConfig: PollingConfig = {
  timeRangeSettings: TIME_RANGE_SETTINGS[4],
  predictiveSettings: PREDICTIVE_RANGE_SETTINGS,
  pollingInterval: {
    initialDelay: 0,
    timerInterval: 3000,
    debounce: 100,
    convertDelay: 100
  },
  realTimeInterval: 1000,
};
