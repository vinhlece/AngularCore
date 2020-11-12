import {ProcessStrategy, RealtimeData, Segment} from '.';
import {TimeManager} from '../../common/services';
import {TimeRange} from '../../dashboard/models';
import {isNumber} from 'util';

export class NormalizeStrategy implements ProcessStrategy {
  private _timeManager: TimeManager;
  private _mainSegment: Segment;
  private _zoomSegment: Segment;

  constructor(timeManager: TimeManager, mainTimeRange: TimeRange, zoomTimeRange: TimeRange) {
    this._timeManager = timeManager;
    this._mainSegment = this.getSegment(mainTimeRange);
    this._zoomSegment = this.getSegment(zoomTimeRange);
  }

  process(record: RealtimeData): RealtimeData {
    if (this.inRange(record, this._zoomSegment)) {
      return this.normalize(record, this._zoomSegment);
    }
    if (this.inRange(record, this._mainSegment)) {
      return this.normalize(record, this._mainSegment);
    }
    return null;
  }

  updateMainTimeRange(mainTimeRange: TimeRange): void {
    this._mainSegment.timeRange = mainTimeRange;
  }

  private normalize(record: RealtimeData, segment: Segment): RealtimeData {
    return {
      ...record,
      measureTimestamp: this._timeManager.normalizeTimestamp(record.measureTimestamp, segment),
      measureValue: isNumber(record.measureValue) ? Math.ceil(+record.measureValue) : record.measureValue
    };
  }

  private inRange(record: RealtimeData, segment: Segment): boolean {
    return segment !== null && segment !== undefined;
  }

  private getSegment(timeRange: TimeRange): Segment {
    if (!timeRange) {
      return null;
    }
    const dataPointInterval = this._timeManager.getDataPointInterval(timeRange.endTimestamp - timeRange.startTimestamp);
    return {timeRange, dataPointInterval};
  }
}
