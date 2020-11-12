import {DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {combineReducers, Store, StoreModule} from '@ngrx/store';
import * as fromRoot from '../../../reducers';
import {mockTimeRangeSettingsList} from '../../../common/testing/mocks/dashboards';
import {TIME_UTILS} from '../../../common/services/tokens';
import * as replayActions from '../../actions/replay.actions';
import * as tabEditorActions from '../../actions/tab-editor.actions';
import * as timeExplorerActions from '../../actions/time-explorer.actions';
import * as timePreferencesActions from '../../actions/time-preferences.actions';
import {TimeRangeSetting} from '../../models';
import * as fromDashboards from '../../reducers';
import {TimeExplorerContainer} from './time-explorer.container';
import {RouterTestingModule} from '@angular/router/testing';
import {User} from '../../../user/models/user';
import {LoginSuccess} from '../../../user/actions/user.actions';
import * as fromUser from '../../../user/reducers';
import {AppConfigService} from '../../../app.config.service';

describe('TimeExplorerContainer', () => {
  let component: TimeExplorerContainer;
  let fixture: ComponentFixture<TimeExplorerContainer>;
  let de: DebugElement;
  let store: any;
  let timeUtils: any;
  const appConfig = {config: {logging: null}};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRoot.reducers,
          'dashboards': combineReducers(fromDashboards.reducers),
          'user': combineReducers(fromUser.reducers)
        }),
        RouterTestingModule
      ],
      declarations: [TimeExplorerContainer],
      providers: [
        {provide: TIME_UTILS, useValue: jasmine.createSpyObj('timeUtils', ['getCurrentTimestamp', 'subtract'])},
        {provide: AppConfigService, useValue: appConfig}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TimeExplorerContainer);
    component = fixture.componentInstance;
    de = fixture.debugElement;

    store = TestBed.get(Store);
    const currentTimestamp = 1;
    const currentSettings: TimeRangeSetting = {
      range: {startTimestamp: 0, endTimestamp: 100},
      step: 5
    };
    const user: User = {id: 'admin', displayName: 'Admin', password: '12345678'};

    store.dispatch(new LoginSuccess(user))
    store.dispatch(new timePreferencesActions.UpdateTimeRangeSettings(currentSettings));
    store.dispatch(new replayActions.Toggle());
    store.dispatch(new timePreferencesActions.SetCurrentTimestamp(currentTimestamp));


    timeUtils = TestBed.get(TIME_UTILS);
    timeUtils.getCurrentTimestamp.and.returnValue(1521763200000);
  }));

  describe('on change time range settings', () => {
    it('should dispatch select time range settings action', () => {
      const settings = mockTimeRangeSettingsList()[0];
      const spy = spyOn(store, 'dispatch');
      fixture.detectChanges();
      const el = de.query(By.css('app-time-explorer'));
      el.triggerEventHandler('onChangeTimeRangeSetting', settings);
      expect(spy).toHaveBeenCalledWith(new timePreferencesActions.SelectTimeRangeSettings(settings));
    });
  });

  describe('on change current timestamp', () => {
    it('should dispatch go back action', () => {
      const spy = spyOn(store, 'dispatch');
      fixture.detectChanges();
      const el = de.query(By.css('app-time-explorer'));
      el.triggerEventHandler('onChangeCurrentTimestamp', 1);
      expect(spy).toHaveBeenCalledWith(new timePreferencesActions.GoBack(1));
    });
  });

  describe('open/close', () => {
    it('should dispatch open time explorer action on open', () => {
      const spy = spyOn(store, 'dispatch');
      fixture.detectChanges();
      const el = de.query(By.css('app-time-explorer'));
      el.triggerEventHandler('onOpen', {});
      expect(spy).toHaveBeenCalledWith(new timeExplorerActions.Open());
    });

    it('should dispatch close time explorer action on close', () => {
      const spy = spyOn(store, 'dispatch');
      fixture.detectChanges();
      const el = de.query(By.css('app-time-explorer'));
      el.triggerEventHandler('onClose', {});
      expect(spy).toHaveBeenCalledWith(new timeExplorerActions.Close());
    });
  });

  describe('on key press', () => {
    it('should dispatch toggle replay action if Space key is pressed', () => {
      const spy = spyOn(store, 'dispatch');
      fixture.detectChanges();
      document.dispatchEvent(new KeyboardEvent('keypress', {key: ' '}));
      expect(spy).toHaveBeenCalledWith(new replayActions.Toggle());
    });

    it('should not dispatch dispatch toggle replay action if another key is pressed', () => {
      const spy = spyOn(store, 'dispatch');
      fixture.detectChanges();
      document.dispatchEvent(new KeyboardEvent('keypress', {key: 'A'}));
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not dispatch dispatch toggle replay action if press space bar on input element', () => {
      const spy = spyOn(store, 'dispatch');
      const trigger = document.createElement('input');
      fixture.detectChanges();
      trigger.dispatchEvent(new KeyboardEvent('keypress', {key: ' '}));
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('on opened/closed', () => {
    it('should dispatch action to make tab editor responsive on opened', () => {
      const spy = spyOn(store, 'dispatch');
      fixture.detectChanges();
      const el = de.query(By.css('app-time-explorer'));
      el.triggerEventHandler('onOpened', {});
      expect(spy).toHaveBeenCalledWith(new tabEditorActions.AdjustSize());
    });

    it('should dispatch action to make tab editor responsive on closed', () => {
      const spy = spyOn(store, 'dispatch');
      fixture.detectChanges();
      const el = de.query(By.css('app-time-explorer'));
      el.triggerEventHandler('onClosed', {});
      expect(spy).toHaveBeenCalledWith(new tabEditorActions.AdjustSize());
    });
  });
});
