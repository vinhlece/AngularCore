import {TimeRangeInterval} from '../models/index';
import {PREDICTIVE_RANGE_SETTINGS} from '../../common/models/constants';
import {getCurrentMoment, getMomentByTimestamp} from '../../common/services/timeUtils';

export function getAvailablePredictiveRange(timeRange: TimeRangeInterval): TimeRangeInterval[] {
  const current = +getCurrentMoment();
  const currentTimeRange = +getMomentByTimestamp(current).add(timeRange.value, timeRange.type);
  return PREDICTIVE_RANGE_SETTINGS.intervals.reduce((acc, item) => {
    const predictiveTimeRange = +getMomentByTimestamp(current).add(item.value, item.type);
    if (predictiveTimeRange <= currentTimeRange) {
      acc.push(item);
    }
    return acc;
  }, []);
}
