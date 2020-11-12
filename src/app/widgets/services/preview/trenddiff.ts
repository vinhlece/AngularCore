import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs/internal/Observable';
import {map} from 'rxjs/operators';
import {isNullOrUndefined} from 'util';
import {PreviewDataGenerator} from '..';
import {getCurrentMoment} from '../../../common/services/timeUtils';
import {RealtimeData} from '../../../realtime/models';
import {Collection} from '../../../realtime/models/collection';
import {RealTimeDataProcessor} from '../../../realtime/services';
import {DataSourceFactory} from '../../../realtime/services/datasource';
import {SampleRealTimeDataService} from '../../../realtime/services/fake/sample-real-time-data.service';
import {DATA_SOURCE_FACTORY, REAL_TIME_DATA_PROCESSOR} from '../../../realtime/services/tokens';
import {TrendDiffWidget, Widget} from '../../models';
import {TrendType} from '../../models/enums';
import {DayPeriodGenerator, ShiftHoursGenerator, TrendDiffSampleDataGenerator} from './sampleDataGenerators';
import * as fromUsers from '../../../user/reducers';
import {select, Store} from '@ngrx/store';
import {withLatestFrom} from 'rxjs/internal/operators';
import {getWindow} from '../../../common/utils/function';

@Injectable()
export class TrendDiffPreviewDataGenerator implements PreviewDataGenerator {
  private _factory: DataSourceFactory;
  private _processor: RealTimeDataProcessor;
  private _sampleRealTimeDataService: SampleRealTimeDataService;
  private _store: Store<fromUsers.State>;

  constructor(store: Store<fromUsers.State>,
              @Inject(DATA_SOURCE_FACTORY) factory: DataSourceFactory,
              @Inject(REAL_TIME_DATA_PROCESSOR) processor: RealTimeDataProcessor,
              sampleRealTimeDataService: SampleRealTimeDataService) {
    this._store = store;
    this._factory = factory;
    this._processor = processor;
    this._sampleRealTimeDataService = sampleRealTimeDataService;
  }

  generate(widget: Widget) {
    const period = (widget as TrendDiffWidget).period;
    if (isNullOrUndefined(period) || period <= 0) {
      return;
    }

    const numberOfLines = 3;
    const start = +getCurrentMoment().subtract(period * numberOfLines, 'day').startOf('date');
    const end = +getCurrentMoment().endOf('date');
    const option = {
      goBackTimeRange: {
        startTimestamp: start,
        endTimestamp: end
      }
    };

    const data$ = this.generatePreviewRawData(widget as TrendDiffWidget, numberOfLines);
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
        const mainStorage = widget.windows.reduce((acc, window) => {
          const storage = new Collection();
          storage.bulkInsert(data);
          acc[window] = storage;
          return acc;
        }, {});
        return dataSource.getData({mainStorage});
      })
    );
  }

  private generatePreviewRawData(widget: TrendDiffWidget, numberOfLines = 3): Observable<RealtimeData[]> {
    let generator: TrendDiffSampleDataGenerator;
    if (widget.trendType === TrendType.Day) {
      generator = new DayPeriodGenerator(this._sampleRealTimeDataService, numberOfLines, this._processor);
    } else if (widget.trendType === TrendType.Shift) {
      generator = new ShiftHoursGenerator(this._sampleRealTimeDataService, this._processor);
    }
    return generator.generate(widget);
  }
}
