import {TestBed} from '@angular/core/testing';
import {provideMockActions} from '@ngrx/effects/testing';
import {Store} from '@ngrx/store';
import {cold, hot} from 'jasmine-marbles';
import {Observable} from 'rxjs';
import {TIME_RANGE_SETTINGS} from '../../../common/models/constants';
import {TimeManager, TimeUtils} from '../../../common/services';
import {TimeManagerImpl} from '../../../common/services/time-manager';
import {TimeUtilsImpl} from '../../../common/services/timeUtils';
import {TIME_MANAGER, TIME_RANGE_SETTINGS_TOKEN, TIME_UTILS} from '../../../common/services/tokens';
import {mockRealtimeData} from '../../../common/testing/mocks/realtime-data.mocks';
import * as timePreferencesActions from '../../../dashboard/actions/time-preferences.actions';
import {FormulaMeasureFactoryImpl} from '../../../measures/services/formula/formula-measure.service';
import {FORMULA_MEASURE_FACTORY} from '../../../measures/services/tokens';
import * as instanceActions from '../../../widgets/actions/instances.actions';
import * as pollingActions from '../../actions/rest-api/polling.actions';
import * as realTimeDataActions from '../../actions/rest-api/real-time-data.actions';
import {RealtimeData, Storage} from '../../models';
import {Collection} from '../../models/collection';
import {TimeRangeStep} from '../../../dashboard/models/enums';
import {TimeRangeType} from '../../../dashboard/models/enums';
import {Preprocessor} from '../../services';
import {RealTimeDataProcessorImpl} from '../../services/real-time-data-processor.service';
import {PREPROCESSOR, REAL_TIME_DATA_PROCESSOR} from '../../services/tokens';
import {RealTimeDataFilterEffects} from './real-time-data-filter.effects';
import {AppConfigService} from '../../../app.config.service';

describe('RealTimeDataFilterEffects', () => {
  let effects: RealTimeDataFilterEffects;
  let actions: Observable<any>;
  let store: any;
  let preprocessor: any;
  let timeManager: TimeManager;
  const appConfig = {config: {logging: null}};

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockActions(() => actions),
        RealTimeDataFilterEffects,
        {
          provide: FORMULA_MEASURE_FACTORY,
          useClass: FormulaMeasureFactoryImpl
        },
        {
          provide: REAL_TIME_DATA_PROCESSOR,
          useClass: RealTimeDataProcessorImpl
        },
        {
          provide: TIME_UTILS,
          useClass: TimeUtilsImpl
        },
        {
          provide: PREPROCESSOR,
          useValue: jasmine.createSpyObj('Preprocessor', ['timestampNormalizeStrategy'])
        },
        {
          provide: Store,
          useValue: jasmine.createSpyObj('store', ['dispatch', 'pipe'])
        },
        {
          provide: TIME_MANAGER,
          useClass: TimeManagerImpl
        },
        {
          provide: TIME_RANGE_SETTINGS_TOKEN,
          useValue: TIME_RANGE_SETTINGS
        },
        {provide: AppConfigService, useValue: appConfig}
      ]
    });
    store = TestBed.get(Store);
    preprocessor = TestBed.get(PREPROCESSOR);
    timeManager = TestBed.get(TIME_MANAGER);
  });

  describe('filter$', () => {
    xit('should union old data with new data and filter data in time range,' +
      'after that dispatch set new data action & update time range action', () => {
      const timeUtils: TimeUtils = TestBed.get(TIME_UTILS);
      const current = timeUtils.getCurrentTimestamp();
      const newData: RealtimeData[] = [
        {
          instance: 'New Sales',
          measureName: 'ContactsAnswered',
          measureTimestamp: timeUtils.subtract(current, 2, 'd'),
          measureValue: 1
        },
        {
          instance: 'New Sales',
          measureName: 'ContactsAnswered',
          measureTimestamp: timeUtils.subtract(current, 3, 'd'),
          measureValue: 2
        },
        {
          instance: 'New Sales',
          measureName: 'ContactsAnswered',
          measureTimestamp: timeUtils.subtract(current, 4, 'd'),
          measureValue: 3
        }
      ];
      const oldData: RealtimeData[] = [
        {
          instance: 'New Sales',
          measureName: 'ContactsAnswered',
          measureTimestamp: timeUtils.subtract(current, 1, 'd'),
          measureValue: 5
        },
        {
          instance: 'New Sales',
          measureName: 'ContactsAnswered',
          measureTimestamp: timeUtils.subtract(current, 9, 'd'),
          measureValue: 6
        }
      ];
      const expectedData: RealtimeData[] = [
        {
          instance: 'New Sales',
          measureName: 'ContactsAnswered',
          measureTimestamp: timeUtils.subtract(current, 4, 'd'),
          measureValue: 3
        },
        {
          instance: 'New Sales',
          measureName: 'ContactsAnswered',
          measureTimestamp: timeUtils.subtract(current, 3, 'd'),
          measureValue: 2
        },
        {
          instance: 'New Sales',
          measureName: 'ContactsAnswered',
          measureTimestamp: timeUtils.subtract(current, 2, 'd'),
          measureValue: 1
        },
        {
          instance: 'New Sales',
          measureName: 'ContactsAnswered',
          measureTimestamp: timeUtils.subtract(current, 1, 'd'),
          measureValue: 5
        }
      ];

      const timeRangeSettings = {
        interval: {type: TimeRangeType.Week, value: 1},
        step: TimeRangeStep.OneHour,
        dataPointInterval: {
          intervals: [
            {value: 1, type: TimeRangeType.Hour},
            {value: 6, type: TimeRangeType.Hour}
          ],
          value: {value: 1, type: TimeRangeType.Hour}
        },
        range: {
          startTimestamp: timeUtils.subtract(current, 1, 'w'),
          endTimestamp: current,
        }
      };
      const timePreferences = {
        config: {
          timeRangeSettings,
        },
        currentTimestamp: timeUtils.subtract(current, 2, 'd'),
        zoom: {
          timeRange: null
        }
      };
      const expectedTimeRange = timeManager.normalizeTimeRange({
        startTimestamp: timeUtils.subtract(current, 3, 'd'),
        endTimestamp: current,
      });
      const loadSuccessAction = new pollingActions.LoadSuccess(newData);
      const storage = new Collection();
      storage.bulkInsert(oldData);

      actions                      =  hot('-a', {a: loadSuccessAction});
      const storeMainStorage       = cold('a', {a: storage});
      const storePredictiveStorage = cold('a', {a: storage});
      const storeEventStorage      = cold('a', {a: new Collection()});
      const storeTimePreferences   = cold('a', {a: timePreferences});
      store.pipe.and.returnValues(storeMainStorage, storeEventStorage, storePredictiveStorage, storeTimePreferences);
      const spy = spyOn(timeUtils, 'getCurrentTimestamp').and.returnValue(current);

      effects = TestBed.get(RealTimeDataFilterEffects);
      effects.filter$.subscribe((action: any) => {
        if (action.type === realTimeDataActions.SET_MAIN_STORAGE) {
          expect((action.payload as Storage).records).toEqual(expectedData);
        }
        if (action.type === timePreferencesActions.UPDATE_TIME_RANGE) {
          expect(action.payload).toEqual(expectedTimeRange);
        }
      });
    });
  });

  describe('updateInstances$', () => {
    it('should', () => {
      const mockRecord = mockRealtimeData();
      const data: RealtimeData[] = [
        {...mockRecord, instance: 'instance 1', dimension: 'intent'},
        {...mockRecord, instance: 'instance 2', dimension: 'intent'},
        {...mockRecord, instance: 'instance 3', dimension: 'intent'}
      ];
      const action = new pollingActions.LoadSuccess(data);
      const updateInstancesAction = new instanceActions.Update({'intent': ['instance 1', 'instance 2', 'instance 3']});

      actions = hot('-a-', {a: action});
      const expected$ = cold('-a-', {a: updateInstancesAction});

      effects = TestBed.get(RealTimeDataFilterEffects);
      expect(effects.updateInstances$).toBeObservable(expected$);
    });
  });
});
