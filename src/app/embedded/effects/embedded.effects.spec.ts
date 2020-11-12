import {TestBed} from '@angular/core/testing';
import {provideMockActions} from '@ngrx/effects/testing';
import {combineReducers, Store, StoreModule} from '@ngrx/store';
import {cold, hot} from 'jasmine-marbles';
import {Observable} from 'rxjs';
import * as dashboardsActions from '../../dashboard/actions/dashboards.action';
import * as placeholdersActions from '../../dashboard/actions/placeholders.actions';
import * as timePreferencesActions from '../../dashboard/actions/time-preferences.actions';
import * as pollingActions from '../../realtime/actions/rest-api/polling.actions';
import {Placeholder, Tab} from '../../dashboard/models';
import * as fromRoot from '../../reducers';
import {mockDashboard} from '../../common/testing/mocks/dashboards';
import * as usersActions from '../../user/actions/user.actions';
import * as fromUsers from '../../user/reducers';
import * as widgetsActions from '../../widgets/actions/widgets.actions';
import * as embeddedActions from '../actions/embedded.actions';
import * as fromEmbedded from '../reducers';
import {EmbeddedEffects} from './embedded.effects';

describe('EmbeddedEffects', () => {
  let effects: EmbeddedEffects;
  let actions: Observable<any>;
  let store: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRoot.reducers,
          'user': combineReducers(fromUsers.reducers),
          'embedded': combineReducers(fromEmbedded.reducers)
        })
      ],
      providers: [
        EmbeddedEffects,
        provideMockActions(() => actions),
      ]
    });
    store = TestBed.get(Store);
  });

  describe('startSession$', () => {
    it('should return required actions if session was not started', () => {
      const action = new embeddedActions.StartSession();
      const loginAction = new usersActions.Login({userName: 'adminUser', password: '12345678'}, {doNavigation: false});
      const launchAction = new dashboardsActions.LaunchStandalone();
      const startAction = new pollingActions.Start();

      actions        =  hot('--a-----', {a: action});
      const expected = cold('--(bcd)-', {b: loginAction, c: launchAction, d: startAction});

      effects = TestBed.get(EmbeddedEffects);

      expect(effects.startSession$).toBeObservable(expected);
    });

    it('should do nothing if session has already started', () => {
      const action = new embeddedActions.StartSession();
      const loginAction = new usersActions.Login({userName: 'adminUser', password: '12345678'}, {doNavigation: false});
      const launchAction = new dashboardsActions.LaunchStandalone();
      const startAction = new pollingActions.Start();

      actions        =  hot('a--------a-', {a: action});
      const expected = cold('(bcd)------', {b: loginAction, c: launchAction, d: startAction});

      effects = TestBed.get(EmbeddedEffects);

      expect(effects.startSession$).toBeObservable(expected);
    });
  });

  describe('onSessionStarted$', () => {
    it('should return load all widgets & load polling config action if user already logged in', () => {
      const loadAllWidgetsAction = new widgetsActions.LoadAll();
      const loadPollingConfigAction = new timePreferencesActions.Load();

      const expected = cold('(ab)', {a: loadAllWidgetsAction, b: loadPollingConfigAction});

      store.dispatch(new usersActions.LoginSuccess({id: 'adminUser', displayName: 'Admin', password: '12345678'}));
      effects = TestBed.get(EmbeddedEffects);

      expect(effects.onSessionStarted$).toBeObservable(expected);
    });

    it('should not return anything if user is empty', () => {
      const expected = cold('--------');

      effects = TestBed.get(EmbeddedEffects);

      expect(effects.onSessionStarted$).toBeObservable(expected);
    });
  });

  describe('setPlaceholders', () => {
    it('should return set editing placeholders action', () => {
      const dashboard = mockDashboard();

      const placeholders = dashboard.tabs.reduce((acc: Placeholder[], currentTab: Tab) => ([...acc, ...currentTab.placeholders]), []);
      const setPlaceholdersActions = new placeholdersActions.Set(placeholders);

      const expected = cold('a', {a: setPlaceholdersActions});

      store.dispatch(new dashboardsActions.LoadSuccess(dashboard));
      effects = TestBed.get(EmbeddedEffects);

      expect(effects.setPlaceholders$).toBeObservable(expected);
    });
  });
});

