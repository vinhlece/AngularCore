import {Observable} from 'rxjs/internal/Observable';
import {TimeRange, TimeRangeInterval} from '../../../dashboard/models';
import {TimeRangeType} from '../../../dashboard/models/enums';
import {RealtimeData, Segment} from '../../../realtime/models';
import {RealTimeDataProcessor} from '../../../realtime/services';
import {SampleRealTimeDataService} from '../../../realtime/services/fake/sample-real-time-data.service';
import {getCurrentMoment} from '../../../common/services/timeUtils';
import {TrendDiffWidget} from '../../models';
import {MeasureFilter} from '../../../realtime/models/web-socket/widget-container';

export interface TrendDiffSampleDataGenerator {
  generate(widget: TrendDiffWidget): Observable<RealtimeData[]>;
}

export class DayPeriodGenerator implements TrendDiffSampleDataGenerator {
  private _sampleRealTimeDataService: SampleRealTimeDataService;
  private _numberOfLines: number;
  private _realTimeDataProcessor: RealTimeDataProcessor;

  constructor(sampleRealTimeDataService: SampleRealTimeDataService, numberOfLines: number,
              realTimeDataProcessor: RealTimeDataProcessor) {
    this._sampleRealTimeDataService = sampleRealTimeDataService;
    this._numberOfLines = numberOfLines;
    this._realTimeDataProcessor = realTimeDataProcessor;
  }

  generate(widget: TrendDiffWidget): Observable<RealtimeData[]> {
    const timeRange: TimeRange = {
      startTimestamp: +getCurrentMoment().subtract(widget.period * (this._numberOfLines - 1) + this._numberOfLines, 'days').startOf('day'),
      endTimestamp: +getCurrentMoment().endOf('day')
    };
    const dataPointInterval: TimeRangeInterval = {type: TimeRangeType.Hour, value: 1};
    const segment: Segment = {timeRange, dataPointInterval};
    return this._sampleRealTimeDataService.getDataForPackage(widget.dataType, segment, null, getMeasureFilters(widget));
  }
}

export class ShiftHoursGenerator implements TrendDiffSampleDataGenerator {
  private _sampleRealTimeDataService: SampleRealTimeDataService;
  private _realTimeDataProcessor: RealTimeDataProcessor;

  constructor(sampleRealTimeDataService: SampleRealTimeDataService,
              realTimeDataProcessor: RealTimeDataProcessor) {
    this._sampleRealTimeDataService = sampleRealTimeDataService;
    this._realTimeDataProcessor = realTimeDataProcessor;
  }

  generate(widget: TrendDiffWidget): Observable<RealtimeData[]> {
    const timeRange: TimeRange = {
      startTimestamp: +getCurrentMoment().startOf('day'),
      endTimestamp: +getCurrentMoment().endOf('day')
    };
    const dataPointInterval: TimeRangeInterval = {type: TimeRangeType.Hour, value: 1};
    const segment: Segment = {timeRange, dataPointInterval};
    return this._sampleRealTimeDataService.getDataForPackage(widget.dataType, segment, null, getMeasureFilters(widget));
  }
}

function getMeasureFilters(widget: TrendDiffWidget) {
  let measureFilters: MeasureFilter[] = null;
  if (widget.measures.length > 0) {
    measureFilters = widget.measures.map(m => {
      return {
        measure: m,
        windows: widget.windows,
        dimensionFilters: widget.dimensions.map(d => {
          return {
            dimension: d.dimension,
            included: [...d.systemInstances, ...d.customInstances]
          };
        })
      };
    });
  }
  return measureFilters;
}
