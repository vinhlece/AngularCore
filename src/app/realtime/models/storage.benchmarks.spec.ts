import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {RealtimeData, Segment} from '.';
import {TIME_RANGE_SETTINGS} from '../../common/models/constants';
import {TimeManagerImpl} from '../../common/services/time-manager';
import {TimeUtilsImpl} from '../../common/services/timeUtils';
import {mockPackages} from '../../common/testing/mocks/widgets';
import {TimeRange} from '../../dashboard/models';
import {TimeRangeType} from '../../dashboard/models/enums';
import {FormulaMeasure, Measure, Package} from '../../measures/models';
import {QUEUE_PERFORMANCE} from '../../measures/models/constants';
import {PackagesService} from '../../measures/services';
import {SampleDataGenerator} from '../services/fake/sample-data-generator';
import {Collection} from './collection';
import {Indexed} from './indexed';
import {PrimitiveWrapper} from './key';
import {NormalizeStrategy} from './strategy';
import {Table} from './table';

class SamplePackagesServices implements PackagesService {
  getAllPackages(): Observable<Package[]> {
    return of(mockPackages());
  }

  getMeasuresOfPackage(packageName: string): Observable<Measure[]> {
    return this.getAllPackages().pipe(
      map((packages: Package[]) => (
        packages
          .filter((item: Package) => item.name === packageName)
          .reduce((measures: Measure[], item: Package) => {
            return [...measures, ...this.getMeasuresFromPackage(item)];
          }, [])
      ))
    );
  }

  getAllFormulaMeasures(userId: string): Observable<FormulaMeasure[]> {
    throw new Error('Not implemented');
  }

  getAllMeasures(userId: string): Observable<Measure[]> {
    throw new Error('Not implemented');
  }

  addFormulaMeasure(measure: FormulaMeasure): Observable<any> {
    throw new Error('Not implemented');
  }

  findMeasuresByName(userId: string, name: string): Observable<Measure[]> {
    throw new Error('Not implemented');
  }

  private getMeasuresFromPackage(packageItem: Package) {
    return packageItem.measures.map((measure: Measure) => ({...measure, dataType: packageItem.name}));
  }
}

xdescribe('Storage', () => {
  const timeUtils = new TimeUtilsImpl();

  let initialData: RealtimeData[] = [];
  let receivedData: RealtimeData[] = [];

  beforeEach(() => {
    const generator = new SampleDataGenerator(new SamplePackagesServices());
    const currentTimestamp = timeUtils.getCurrentTimestamp();
    const initialSegment: Segment = {
      timeRange: {startTimestamp: timeUtils.subtract(currentTimestamp, 1, 'days'), endTimestamp: currentTimestamp},
      dataPointInterval: {type: TimeRangeType.Minute, value: 1}
    };
    generator.getDataForPackage(QUEUE_PERFORMANCE, initialSegment).subscribe((data: RealtimeData[]) => initialData = data);
    const receivedSegment: Segment = {
      timeRange: {startTimestamp: timeUtils.subtract(currentTimestamp, 10, 'days'), endTimestamp: currentTimestamp},
      dataPointInterval: {type: TimeRangeType.Hour, value: 1}
    };
    generator.getDataForPackage(QUEUE_PERFORMANCE, receivedSegment).subscribe((data: RealtimeData[]) => receivedData = data);
  });

  describe('collection', () => {
    it('with timestamp normalization', (done) => {
      const collection = new Collection();
      // collection.bulkInsert(initialData);
      const start = performance.now();

      const currentTimestamp = timeUtils.getCurrentTimestamp();
      const mainTimeRange: TimeRange = {
        startTimestamp: timeUtils.subtract(currentTimestamp, 1, 'days'),
        endTimestamp: currentTimestamp
      };
      const timeManager = new TimeManagerImpl(new TimeUtilsImpl(), TIME_RANGE_SETTINGS);
      const strategy = new NormalizeStrategy(timeManager, mainTimeRange, null);
      collection.bulkInsert(initialData, strategy);

      console.log(initialData.length);
      console.log(performance.now() - start);
      console.log('normalize: ', collection.size());
      done();
    }, 10000);

    it('without timestamp normalization', (done) => {
      const collection = new Collection();
      // collection.bulkInsert(initialData);

      collection.bulkInsert(initialData);
      const start = performance.now();
      const a = collection.records;
      console.log(performance.now() - start);
      console.log('not normalize: ', collection.size());
      done();
    }, 10000);
  });

  it('indexed', (done) => {
    const indexed = new Indexed((record: RealtimeData) => new PrimitiveWrapper(record.measureTimestamp));
    const start = performance.now();
    const currentTimestamp = timeUtils.getCurrentTimestamp();
    const mainTimeRange: TimeRange = {
      startTimestamp: timeUtils.subtract(currentTimestamp, 1, 'days'),
      endTimestamp: currentTimestamp
    };
    const timeManager = new TimeManagerImpl(new TimeUtilsImpl(), TIME_RANGE_SETTINGS);
    const strategy = new NormalizeStrategy(timeManager, mainTimeRange, null);
    indexed.bulkUpsert(initialData);
    const a = indexed.records;
    console.log(initialData.length);
    console.log(performance.now() - start);
    done();
  }, 10000);

  it('table', (done) => {
    const table = new Table();
    const start = performance.now();
    console.log(initialData.length);

    table.bulkInsert(initialData);

    console.log(performance.now() - start);
    done();
  }, 10000);
});

//
// /**
//
//  REPORT
//  initial data size: 2000000
//
//  received data size    |    operation   |    tree    |    lodash    |
//  1             |      insert    |     0.1    |     5858     |
//  10000           |      insert    |     169    |     5708     |
//  50000           |      insert    |     169    |     5708     |
//  100000           |      insert    |     378    |
//  */
