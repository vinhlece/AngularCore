import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs/internal/Observable';
import {map} from 'rxjs/operators';
import {PreviewDataGenerator} from '..';
import {getCurrentMoment} from '../../../common/services/timeUtils';
import {TimeRange, TimeRangeInterval} from '../../../dashboard/models';
import {TimeRangeType} from '../../../dashboard/models/enums';
import {RealtimeData, Segment, WidgetData} from '../../../realtime/models';
import {Table} from '../../../realtime/models/table';
import {RealTimeDataProcessor} from '../../../realtime/services';
import {DataSourceFactory} from '../../../realtime/services/datasource';
import {SampleRealTimeDataService} from '../../../realtime/services/fake/sample-real-time-data.service';
import {DATA_SOURCE_FACTORY, REAL_TIME_DATA_PROCESSOR} from '../../../realtime/services/tokens';
import {Widget} from '../../models';
import {Collection} from '../../../realtime/models/collection';
import {isNullOrUndefined} from 'util';
import {withLatestFrom} from 'rxjs/internal/operators';
import * as fromUsers from '../../../user/reducers';
import {select, Store} from '@ngrx/store';
import {MeasureFilter} from '../../../realtime/models/web-socket/widget-container';
import {getWindow} from '../../../common/utils/function';

@Injectable()
export class CommonPreviewDataGenerator implements PreviewDataGenerator {
  private _generator: SampleRealTimeDataService;
  private _processor: RealTimeDataProcessor;
  private _factory: DataSourceFactory;
  private _store: Store<fromUsers.State>;

  constructor(store: Store<fromUsers.State>,
              @Inject(DATA_SOURCE_FACTORY) factory: DataSourceFactory,
              @Inject(REAL_TIME_DATA_PROCESSOR) processor: RealTimeDataProcessor,
              sampleRealTimeDataService: SampleRealTimeDataService) {
    this._store = store;
    this._factory = factory;
    this._processor = processor;
    this._generator = sampleRealTimeDataService;
  }

  generate(widget: Widget): Observable<WidgetData> {
    const data$ = this.generatePreviewRawData(widget);
    const option = {
      goBackTimeRange: {
        startTimestamp: Number.NEGATIVE_INFINITY,
        endTimestamp: +getCurrentMoment()
      }
    };

    return data$.pipe(
      withLatestFrom(this._store.pipe(select(fromUsers.getCurrentColorPalette))),
      map(([realTimeData, pallete]) => {
        const data = realTimeData.reduce((acc, item) => {
          const window = getWindow(item);
          acc.push({...item, window});
          return acc;
        }, []) as RealtimeData[];
        option['colorPalette'] = pallete;
        const dataSource = this._factory.create(widget, option);
        const eventStorage = new Collection();
        eventStorage.bulkInsert(this.getEventData(data));
        const mainStorage = widget.windows.reduce((acc, window) => {
          const storage = new Table();
          storage.bulkUpsert(this.getMainData(data, window));
          acc[window] = storage;
          return acc;
        }, {});
        return dataSource.getData({mainStorage, eventStorage});
      })
    );
  }

  private generatePreviewRawData(widget: Widget): Observable<RealtimeData[]> {
    const timeRange: TimeRange = {
      startTimestamp: +getCurrentMoment().startOf('day'),
      endTimestamp: +getCurrentMoment().endOf('day')
    };
    const dataPointInterval: TimeRangeInterval = {type: TimeRangeType.Hour, value: 1};
    const segment: Segment = {timeRange, dataPointInterval};
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
    return this._generator.getDataForPackage(widget.dataType, segment, null,  measureFilters);
  }

  private getMainData(data: RealtimeData[], window: string): RealtimeData[] {
    return data.filter((record: RealtimeData) => !isNullOrUndefined(record.instance) && record.window === window);
  }

  private getEventData(data: RealtimeData[]): RealtimeData[] {
    return data.filter((record: RealtimeData) => isNullOrUndefined(record.instance));
  }
}
