import {TestBed} from '@angular/core/testing';
import {provideMockActions} from '@ngrx/effects/testing';
import {Store} from '@ngrx/store';
import {cold, getTestScheduler} from 'jasmine-marbles';
import {Observable, Scheduler} from 'rxjs';
import {mockWidget} from '../../common/testing/mocks/widgets';
import * as widgetDataActions from '../../dashboard/actions/widgets-data.actions';
import {TimeRangeType} from '../../dashboard/models/enums';
import {Collection} from '../models/collection';
import {DATA_SOURCE_FACTORY, POLLING_TIME_CONFIG} from '../services/tokens';
import {WidgetDataEffects} from './widget-data.effects';
import {getDefaultColorPalettes} from '../../common/utils/color';

describe('WidgetDataEffects', () => {
  let effects: WidgetDataEffects;
  let actions: Observable<any>;
  let store: any;
  let dataSourceFactory: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        WidgetDataEffects,
        provideMockActions(() => actions),
        {provide: Store, useValue: jasmine.createSpyObj('store', ['dispatch', 'pipe'])},
        {provide: DATA_SOURCE_FACTORY, useValue: jasmine.createSpyObj('factory', ['create'])},
        {provide: POLLING_TIME_CONFIG, useValue: {initialDelay: 0, timerInterval: 80, convertDelay: 10}},
        {provide: Scheduler, useValue: getTestScheduler()}
      ]
    });
    store = TestBed.get(Store);
    dataSourceFactory = TestBed.get(DATA_SOURCE_FACTORY);
  });

  describe('convert$', () => {
    it('should call convert on converter for each placeholder and return convert success action', () => {
      const timePreferencesState = {
        config: {
          timeRangeSettings: {
            interval: {
              type: TimeRangeType.Day,
              value: 1,
            },
            range: {startTimestamp: 1, endTimestamp: 200},
            step: 5
          },
          serverIntervalTime: 5, // second
          pollingTime: 5 // second
        },
        currentTimestamp: 100,
        zoom: {
          timeRange: {startTimestamp: 1, endTimestamp: 10}
        }
      };
      const widgets = [
        {...mockWidget(), placeholder: {id: 1}, showAllData: true},
        {...mockWidget(), placeholder: {id: 2}, showAllData: true}
      ];
      const mainStorage = new Collection();
      const predictiveStorage = new Collection();
      const policyGroupStorage = new Collection();
      const eventStorage = new Collection();
      const successAction = new widgetDataActions.ConvertSuccess({'1': [], '2': []});

      const mainStorage$ = cold('-a-', {a: mainStorage});
      const eventStorage$ = cold('-a-', {a: eventStorage});
      const policyGroupStorage$ = cold('-a-', {a: policyGroupStorage});
      const predictiveStorage$ = cold('-a-', {a: predictiveStorage});
      const widgets$ = cold('-a-', {a: widgets});
      const timePreferences$ = cold('-a-', {a: timePreferencesState});
      const isTimeExplorerOpened$ = cold('-a-', {a: true});
      const expected = cold('-a-', {a: successAction});
      const colorPalette$ = cold('-a-', getDefaultColorPalettes()[0]);
      const globalFilters$ = cold('-a-', []);
      const realTimeMode$ = cold('-a-', true);
      const instanceColor$ = cold('-a-', []);

      store.pipe.and.returnValues(mainStorage$, eventStorage$, predictiveStorage$, policyGroupStorage$, widgets$, timePreferences$,
        isTimeExplorerOpened$, colorPalette$, globalFilters$, realTimeMode$, instanceColor$);

      const mockDataSourceA = jasmine.createSpyObj('converter', ['getData']);
      mockDataSourceA.getData.and.returnValue([]);
      const mockDataSourceB = jasmine.createSpyObj('converter', ['getData']);
      mockDataSourceB.getData.and.returnValue([]);

      dataSourceFactory.create.and.returnValues(mockDataSourceA, mockDataSourceB);

      effects = TestBed.get(WidgetDataEffects);

      expect(effects.convert$).toBeObservable(expected);
      expect(mockDataSourceA.getData).toHaveBeenCalledWith({mainStorage, eventStorage, predictiveStorage, policyGroupStorage});
    });
  });
});

