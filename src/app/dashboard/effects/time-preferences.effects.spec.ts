import {TestBed} from '@angular/core/testing';
import {provideMockActions} from '@ngrx/effects/testing';
import {Store} from '@ngrx/store';
import {cold, getTestScheduler, hot} from 'jasmine-marbles';
import {Observable, Scheduler} from 'rxjs';
import {TimeUtils} from '../../common/services';
import {TIME_MANAGER, TIME_UTILS} from '../../common/services/tokens';
import {mockTimeRangeSettingsList} from '../../common/testing/mocks/dashboards';
import * as streamsActions from '../../realtime/actions/rest-api/streams.actions';
import {POLLING_TIME_CONFIG} from '../../realtime/services/tokens';
import * as replayActions from '../actions/replay.actions';
import * as timePreferencesActions from '../actions/time-preferences.actions';
import {PollingConfig, TimeRange} from '../models';
import {TimeRangeStep, TimeRangeType} from '../models/enums';
import {POLLING_CONFIG_SERVICE} from '../services/tokens';
import {TimePreferencesEffect} from './time-preferences.effect';
import * as RealTimeAction from '../../realtime/actions/rest-api/real-time-data.actions';
import * as pollingActions from '../../realtime/actions/rest-api/polling.actions';
import * as placeholdersActions from '../actions/placeholders.actions';

describe('TimePreferencesEffect', () => {
  let store: any
  let effect: TimePreferencesEffect;
  let actions: Observable<any>;
  let timeManager: any;
  const pollingConfigService = jasmine.createSpyObj('PollingConfigService', ['load']);
  const timeUtils = jasmine.createSpyObj('TimeUtils', ['getCurrentTimestamp', 'getTimestampOfDay', 'subtract', 'normalizeTimeRange', 'add']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TimePreferencesEffect,
        provideMockActions(() => actions),
        {provide: Store, useValue: jasmine.createSpyObj('Store', ['pipe', 'dispatch'])},
        {provide: POLLING_CONFIG_SERVICE, useValue: pollingConfigService},
        {provide: TIME_UTILS, useValue: timeUtils},
        {provide: TIME_MANAGER, useValue: jasmine.createSpyObj('TimeManager', ['normalizeTimeRange'])},
        {
          provide: POLLING_TIME_CONFIG,
          useValue: {initialDelay: 0, timerInterval: 80, debounce: 30}
        },
        {
          provide: Scheduler,
          useValue: getTestScheduler()
        }
      ]
    });
    store = TestBed.get(Store);
    timeManager = TestBed.get(TIME_MANAGER);
  });

  describe('load$', () => {
    const config: PollingConfig = {
      timeRangeSettings: {
        interval: {type: TimeRangeType.Day, value: 1},
        step: TimeRangeStep.ThirtyMinutes,
        dataPointInterval: {
          intervals: [
            {value: 15, type: TimeRangeType.Minute},
            {value: 30, type: TimeRangeType.Minute},
            {value: 1, type: TimeRangeType.Hour}
          ],
          value: {value: 15, type: TimeRangeType.Minute}
        }
      },
      predictiveSettings: {
        intervals: [
          {value: 15, type: TimeRangeType.Minute},
          {value: 30, type: TimeRangeType.Minute},
          {value: 1, type: TimeRangeType.Hour}
        ],
        value: {value: 15, type: TimeRangeType.Minute}
      },
      pollingInterval: {
        initialDelay: 0,
        timerInterval: 5000,
        debounce: 100,
        convertDelay: 100
      },
    };

    it('should return polling config setting with calculated time range action & start update in real time action', () => {
      const expectedConfig: PollingConfig = {
        timeRangeSettings: {
          interval: {type: TimeRangeType.Day, value: 1},
          range: {startTimestamp: 1521676800000, endTimestamp: 1521764100000},
          step: TimeRangeStep.ThirtyMinutes,
          dataPointInterval: {
            intervals: [
              {value: 15, type: TimeRangeType.Minute},
              {value: 30, type: TimeRangeType.Minute},
              {value: 1, type: TimeRangeType.Hour}
            ],
            value: {value: 15, type: TimeRangeType.Minute}
          }
        },
        predictiveSettings: {
          intervals: [
            {value: 15, type: TimeRangeType.Minute},
            {value: 30, type: TimeRangeType.Minute},
            {value: 1, type: TimeRangeType.Hour}
          ],
          value: {value: 15, type: TimeRangeType.Minute}
        },
        pollingInterval: {
          initialDelay: 0,
          timerInterval: 5000,
          debounce: 100,
          convertDelay: 100
        },
      };
      const successAction = new timePreferencesActions.LoadSuccess(expectedConfig);
      const startUpdateInRealTimeAction = new timePreferencesActions.StartUpdateInRealTime();
      const load = new timePreferencesActions.Load();

      actions        =  hot('-a----', {a: load});
      const response = cold('-a----', {a: config});
      const expected = cold('--(cd)', {c: successAction, d: startUpdateInRealTimeAction});
      pollingConfigService.load.and.returnValue(response);
      timeUtils.getCurrentTimestamp.and.returnValue(1521763200000);
      timeUtils.subtract.and.returnValue(1521676800000);
      timeUtils.add.and.returnValue(1521764100000);
      timeManager.normalizeTimeRange.and.returnValue({startTimestamp: 1521676800000, endTimestamp: 1521763200000});

      effect = TestBed.get(TimePreferencesEffect);

      expect(effect.load$).toBeObservable(expected);
      expect(timeUtils.subtract).toHaveBeenCalledWith(1521763200000, 1, TimeRangeType.Day);
    });

    it('should return error', () => {
      const error = new Error('Error!');
      const load = new timePreferencesActions.Load();
      const failAction = new timePreferencesActions.LoadFailure(error);

      actions        =  hot('-a', {a: load});
      const response = cold('-#', {}, error);
      const expected = cold('--c', {c: failAction});
      pollingConfigService.load.and.returnValue(response);

      effect = TestBed.get(TimePreferencesEffect);

      expect(effect.load$).toBeObservable(expected);
    });
  });

  describe('selectTimeRangeSettings$', () => {
    it('should return correct actions', () => {
      const settings = mockTimeRangeSettingsList()[0];
      const range: TimeRange = {startTimestamp: 1521676800000, endTimestamp: 1521763200000};
      const updatedSettings = {...settings, range};
      const predictiveSettings = {
        intervals: [
          {value: 0, type: null, label: null},
          {value: 1, type: TimeRangeType.Minute, label: 'dashboard.time_range_settings.minute'}
        ],
        available: [
          {value: 0, type: null, label: null},
          {value: 1, type: TimeRangeType.Minute, label: 'dashboard.time_range_settings.minute'}
        ],
        value: {value: 1, type: TimeRangeType.Minute, label: 'dashboard.time_range_settings.minute'}
      };
      const selectTimeRangeSettingsAction = new timePreferencesActions.SelectTimeRangeSettings(settings);
      const resetPumpUpOptionsAction = new streamsActions.ResetPumpUpStream();
      const updateTimeRangeSettingsAction = new timePreferencesActions.UpdateTimeRangeSettings(updatedSettings);
      const updatePredictiveSettingsAction = new timePreferencesActions.UpdatePredictiveSettings(predictiveSettings);
      const resetCurrentTimestampAction = new timePreferencesActions.SetCurrentTimestamp(null);
      const resetGoBackTimestampAction = new timePreferencesActions.SetGoBackTimestamp(null);
      const resetTimeRangeAction = new timePreferencesActions.SetTimeRange(null);
      const resetZoomAction = new timePreferencesActions.ResetZoom(true);
      const pumpUpAction = new pollingActions.PumpUp(null);

      actions                  =  hot('--a-------', {a: selectTimeRangeSettingsAction});
      const predictiveSetting$ = cold('-a--------', {a: predictiveSettings});
      const expected$          = cold('--(abcdefgh)-', {
        a: resetPumpUpOptionsAction,
        b: updateTimeRangeSettingsAction,
        c: updatePredictiveSettingsAction,
        d: resetCurrentTimestampAction,
        e: resetGoBackTimestampAction,
        f: resetTimeRangeAction,
        g: resetZoomAction,
        h: pumpUpAction
      });

      store.pipe.and.returnValue(predictiveSetting$);
      timeUtils.getCurrentTimestamp.and.returnValue(1521763200000);
      timeUtils.subtract.and.returnValue(1521676800000);
      timeUtils.add.and.returnValue(1521764100000);
      timeManager.normalizeTimeRange.and.returnValue(range);
      effect = TestBed.get(TimePreferencesEffect);

      expect(effect.selectTimeRangeSettings$).toBeObservable(expected$);
    });
  });

  describe('goBack$', () => {
    it('should return all actions if go to older time', () => {
      const goBackAction = new timePreferencesActions.GoBack(2);
      const setCurrentTimestampAction = new timePreferencesActions.SetCurrentTimestamp(2);
      const setGoBackTimestamp = new timePreferencesActions.SetGoBackTimestamp(2);
      const resetGoBackPumpUpOptionsAction = new streamsActions.ResetGoBackPumpUpStream();
      const stopReplayAction = new replayActions.Stop();
      const pumpUpAction = new pollingActions.GoBack();
      const showHistoies = new placeholdersActions.ShowHistoricals(['a', 'b']);

      actions                 =  hot('--a-----', {a: goBackAction});
      const currentTimestamp$ = cold('-a------', {a: 3});
      const placeholder$ = cold('-a------', {a: ['a', 'b']});
      const expected$         = cold('--(abcdef)-', {
        a: setCurrentTimestampAction,
        b: resetGoBackPumpUpOptionsAction,
        c: stopReplayAction,
        d: setGoBackTimestamp,
        e: pumpUpAction,
        f: showHistoies
      });

      store.pipe.and.returnValues(null, null, null, null, placeholder$, currentTimestamp$);
      effect = TestBed.get(TimePreferencesEffect);

      expect(effect.goBack$).toBeObservable(expected$);
    });

    it('should return all actions if go to non-null new current timestamp and previous current timestamp is null', () => {
      const goBackAction = new timePreferencesActions.GoBack(2);
      const setCurrentTimestampAction = new timePreferencesActions.SetCurrentTimestamp(2);
      const resetGoBackPumpUpOptionsAction = new streamsActions.ResetGoBackPumpUpStream();
      const setGoBackTimestamp = new timePreferencesActions.SetGoBackTimestamp(2);
      const stopReplayAction = new replayActions.Stop();
      const pumpUpAction = new pollingActions.GoBack();
      const showHistoies = new placeholdersActions.ShowHistoricals(['a', 'b']);


      actions                 =  hot('--a-----', {a: goBackAction});
      const currentTimestamp$ = cold('-a------', {a: null});
      const placeholder$ = cold('-a------', {a: ['a', 'b']});
      const expected$         = cold('--(abcdef)-', {
        a: setCurrentTimestampAction,
        b: resetGoBackPumpUpOptionsAction,
        c: stopReplayAction,
        d: setGoBackTimestamp,
        e: pumpUpAction,
        f: showHistoies
      });

      store.pipe.and.returnValues(null, null, null, null, placeholder$, currentTimestamp$);
      effect = TestBed.get(TimePreferencesEffect);

      expect(effect.goBack$).toBeObservable(expected$);
    });

    it('should only return set current timestamp & stop replay action if new current timestamp is null', () => {
      const goBackAction = new timePreferencesActions.GoBack(null);
      const setCurrentTimestampAction = new timePreferencesActions.SetCurrentTimestamp(null);
      const stopReplayAction = new replayActions.Stop();

      actions                 =  hot('--a----', {a: goBackAction});
      const currentTimestamp$ = cold('-a-----', {a: 1});
      const placeholder$ = cold('-a------', {a: ['a', 'b']});
      const expected$         = cold('--(ab)-', {a: setCurrentTimestampAction, b: stopReplayAction});

      store.pipe.and.returnValues(null, null, null, null, placeholder$, currentTimestamp$);
      effect = TestBed.get(TimePreferencesEffect);

      expect(effect.goBack$).toBeObservable(expected$);
    });

    it('should only return set current timestamp & stop replay action if go to newer time', () => {
      const goBackAction = new timePreferencesActions.GoBack(2);
      const setCurrentTimestampAction = new timePreferencesActions.SetCurrentTimestamp(2);
      const stopReplayAction = new replayActions.Stop();

      actions                 =  hot('--a----', {a: goBackAction});
      const currentTimestamp$ = cold('-a-----', {a: 1});
      const placeholder$ = cold('-a------', {a: ['a', 'b']});
      const expected$         = cold('--(ab)-', {a: setCurrentTimestampAction, b: stopReplayAction});

      store.pipe.and.returnValues(null, null, null, null, placeholder$, currentTimestamp$);
      effect = TestBed.get(TimePreferencesEffect);

      expect(effect.goBack$).toBeObservable(expected$);
    });
  });

  describe('triggerZoom$', () => {
    it('should emit zoom event after specified debounce time is passed', () => {
      const otherParams = {dataType: 'a', instances: ['b']};
      const triggerZoomAction = new timePreferencesActions.TriggerZoom({trigger: 'abc', otherParams});
      const zoomAction = new timePreferencesActions.Zoom({trigger: 'abc', otherParams});
      const clearDataAction = new RealTimeAction.ClearInstanceStorage(otherParams);

      actions         =  hot('--a-a-------', {a: triggerZoomAction});
      const expected$ = cold('-------(ab)-', {a: clearDataAction, b: zoomAction});
      effect = TestBed.get(TimePreferencesEffect);

      expect(effect.triggerZoom$).toBeObservable(expected$);
    });
  });

  describe('resetZoom$', () => {
    it('should emit reset zoom event when click All zoom button ', () => {
      const resetZoomAction = new timePreferencesActions.ResetZoom();
      const zoomAction = new timePreferencesActions.Zoom(
        {
          timeRange: {
            startTimestamp: 1,
            endTimestamp: 5
          }
        });
      const clearDataAction = new RealTimeAction.ClearData();

      actions         =  hot('--a-------', {a: resetZoomAction});
      const timeRangeSetting$ = cold('-a-----', {a: {
        range: {
          startTimestamp: 1,
          endTimestamp: 5
        }
      }});
      const expected$ = cold('-----(ab)---', {a: clearDataAction, b: zoomAction});
      store.pipe.and.returnValue(timeRangeSetting$);
      effect = TestBed.get(TimePreferencesEffect);
      expect(effect.resetZoom$).toBeObservable(expected$);
    });
  });
});
