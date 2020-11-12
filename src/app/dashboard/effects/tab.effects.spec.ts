import {TestBed} from '@angular/core/testing';
import {provideMockActions} from '@ngrx/effects/testing';
import {Store} from '@ngrx/store';
import {cold, hot} from 'jasmine-marbles';
import {Observable} from 'rxjs';
import {mockTab} from '../../common/testing/mocks/dashboards';
import * as pollingActions from '../../realtime/actions/rest-api/polling.actions';
import * as realTimeDataActions from '../../realtime/actions/rest-api/real-time-data.actions';
import * as callTimeLineActions from '../actions/call-time-line.actions';
import * as placeholdersActions from '../actions/placeholders.actions';
import * as replayActions from '../actions/replay.actions';
import * as tabActions from '../actions/tabs.actions';
import * as timePreferencesActions from '../actions/time-preferences.actions';
import {TabService} from '../services/http/tab.service';
import {TabEffects} from './tab.effects';

describe('TabEffects', () => {
  let effects: TabEffects;
  let actions: Observable<any>;
  let tabService: any;
  let store: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TabEffects,
        provideMockActions(() => actions),
        {provide: TabService, useValue: jasmine.createSpyObj('TabService', ['add', 'update', 'remove'])},
        {provide: Store, useValue: jasmine.createSpyObj('store', ['dispatch', 'select'])}
      ]
    });
    tabService = TestBed.get(TabService);
    store = TestBed.get(Store);
  });

  describe('add$', () => {
    it('should return add success action if add tab success', () => {
      const tab = mockTab();
      const addAction = new tabActions.Add(tab);
      const successAction = new tabActions.AddSuccess(tab);

      actions        =  hot('--a-', {a: addAction});
      const response = cold('-a', {a: tab});
      const expected = cold('---b', {b: successAction});

      tabService.add.and.returnValue(response);
      effects = TestBed.get(TabEffects);

      expect(effects.add$).toBeObservable(expected);
    });

    it('should return add fail action when service is failed.', () => {
      const tab = mockTab();
      const error = new Error('Error message');
      const addAction = new tabActions.Add(tab);
      const failAction = new tabActions.AddFailure(error);

      actions        =  hot('--a-', {a: addAction});
      const response = cold('-#', {}, error);
      const expected = cold('---b', {b: failAction});

      tabService.add.and.returnValue(response);
      effects = TestBed.get(TabEffects);

      expect(effects.add$).toBeObservable(expected);
    });
  });

  describe('update$', () => {
    it('should return update success action if success', () => {
      const tab = mockTab({id: 1});
      const updateAction = new tabActions.Update(tab);
      const successAction = new tabActions.UpdateSuccess(tab);

      actions        =  hot('--a-', {a: updateAction});
      const response = cold('-a', {a: tab});
      const expected = cold('---b', {b: successAction});

      tabService.update.and.returnValue(response);
      effects = TestBed.get(TabEffects);

      expect(effects.update$).toBeObservable(expected);
    });

    it('should return update fail action when service is failed.', () => {
      const tab = mockTab();
      const error = new Error('Error message');
      const updateAction = new tabActions.Update(tab);
      const failAction = new tabActions.UpdateFailure(error);

      actions        =  hot('--a-', {a: updateAction});
      const response = cold('-#', {}, error);
      const expected = cold('---b', {b: failAction});

      tabService.update.and.returnValue(response);
      effects = TestBed.get(TabEffects);

      expect(effects.update$).toBeObservable(expected);
    });
  });

  describe('delete$', () => {
    it('should return delete success action if success', () => {
      const tab = mockTab();
      const deleteAction = new tabActions.Delete(tab);
      const successAction = new tabActions.DeleteSuccess(tab.id);

      actions        =  hot('--a-', {a: deleteAction});
      const response = cold('-a', {a: tab.id});
      const expected = cold('---b', {b: successAction});

      tabService.remove.and.returnValue(response);
      effects = TestBed.get(TabEffects);

      expect(effects.delete$).toBeObservable(expected);
    });

    it('should return update fail action when service is failed.', () => {
      const tab = mockTab();
      const error = new Error('Error message');
      const deleteAction = new tabActions.Delete(tab);
      const failAction = new tabActions.DeleteFailure(error);

      actions        =  hot('--a-', {a: deleteAction});
      const response = cold('-#', {}, error);
      const expected = cold('---b', {b: failAction});

      tabService.remove.and.returnValue(response);
      effects = TestBed.get(TabEffects);

      expect(effects.delete$).toBeObservable(expected);
    });
  });

  describe('select$', () => {
    it('should return required actions when selecting a tab', () => {
      const selectAction = new tabActions.Select(mockTab());
      const startAction = new pollingActions.Start();
      const releasePlaceholdersAction = new placeholdersActions.ReleasePlaceholders();

      actions         =  hot('-a----', {a: selectAction});
      const expected$ = cold('-(ab)-', {a: startAction, b: releasePlaceholdersAction});

      effects = TestBed.get(TabEffects);
      expect(effects.select$).toBeObservable(expected$);
    });
  });

  describe('exit$', () => {
    it('should return required actions when exiting a tab', () => {
      const exitAction = new tabActions.Exit();
      const releasePlaceholdersAction = new placeholdersActions.ReleasePlaceholders();
      const stopPollingAction = new pollingActions.Stop();
      const clearDataAction = new realTimeDataActions.ClearData();
      const stopReplayAction = new replayActions.Stop();
      const resetCurrentTimestampAction = new timePreferencesActions.SetCurrentTimestamp(null);
      const resetGoBackTimestampAction = new timePreferencesActions.SetGoBackTimestamp(null);
      const resetTimeRangeAction = new timePreferencesActions.SetTimeRange(null);
      const resetZoomAction = new timePreferencesActions.ResetZoom(true);
      const resetCallTimeLineZoomAction = new callTimeLineActions.ResetZoom();

      actions         =  hot('-a-', {a: exitAction});
      const expected$ = cold('-(abcdefghi)-', {
        a: releasePlaceholdersAction,
        b: stopPollingAction,
        c: clearDataAction,
        d: stopReplayAction,
        e: resetCurrentTimestampAction,
        f: resetGoBackTimestampAction,
        g: resetTimeRangeAction,
        h: resetZoomAction,
        i: resetCallTimeLineZoomAction,
      });

      effects = TestBed.get(TabEffects);

      expect(effects.exit$).toBeObservable(expected$);
    });
  });
});

