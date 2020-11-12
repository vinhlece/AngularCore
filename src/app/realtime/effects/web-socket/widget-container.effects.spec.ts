import {TestBed} from '@angular/core/testing';
import {provideMockActions} from '@ngrx/effects/testing';
import {Action, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {WidgetContainerEffects} from './widget-container.effects';
import {WebSocketSubscription, WidgetContainer} from '../../models/web-socket/widget-container';
import {cold, hot} from 'jasmine-marbles';
import {mockWidget} from '../../../common/testing/mocks/widgets';
import {DisplayMode} from '../../../dashboard/models/enums';
import {mockPlaceholder} from '../../../common/testing/mocks/dashboards';
import {ModifyWidgetContainerSuccess} from '../../actions/web-socket/widget-container.actions';
import {Stop} from '../../actions/rest-api/polling.actions';
import {TopicMapper} from '../../services/TopicMapper';
import * as realTimeClientAction from '../../actions/web-socket/real-time-client.action';

describe('WidgetContainerEffect', () => {
  let mockStore;
  let actions: Observable<Action>;
  let effects: WidgetContainerEffects;

  beforeEach(() => {
    mockStore = jasmine.createSpyObj('store', ['pipe', 'dispatch']);
    TestBed.configureTestingModule({
      providers: [
        TopicMapper,
        WidgetContainerEffects,
        provideMockActions(() => actions),
        {
          provide: Store,
          useValue: mockStore
        }
      ]
    });
  });

  describe('trigger$', () => {
    it('should emit widget container succeed action when updated successfully', () => {
      const widget = mockWidget();
      const placeholder = mockPlaceholder();
      const launchingWidgets = [{
        ...widget,
        placeholder,
        displayMode: DisplayMode.Latest
      }];
      const subscription: WebSocketSubscription = {
        sessionId: 'sessionId',
        id: 'subscriptionID',
        user: 'adminUser',
        measureFilters: [],
        packageName: 'Queue Performance'
      };

      const widgetContainer: WidgetContainer[] = [];

      const user = {
        id: 'abc',
        displayName: 'abc',
        password: 'abc'
      };

      const successAction = new ModifyWidgetContainerSuccess(widgetContainer);
      const InitializeAction = new realTimeClientAction.Initialize();

      const launchingWidgets$               =  hot('--a', {a: launchingWidgets});
      const widgetContainer$               =  hot('-a', {a: widgetContainer});
      const currentUser$               =  hot('-a', {a: user});
      const expected        = cold('--(ab)', {a: successAction, b: InitializeAction});

      mockStore.pipe.and.returnValues(launchingWidgets$, widgetContainer$, currentUser$);

      effects = TestBed.get(WidgetContainerEffects);
      expect(effects.trigger$).toBeObservable(expected);
    });
  });

  describe('removeWidgetContainer$', () => {
    it('should remove widget container successfully', () => {
      const StopAction = new Stop();
      const successAction = new ModifyWidgetContainerSuccess(null);
      const resetAction = new realTimeClientAction.ResetData();
      const widget = mockWidget();

      const subscription: WebSocketSubscription = {
        id: `${widget.dataType}-${123}`,
        measureNames: [],
        user: '_Generated Websocket_User_',
        topic: {
          name: 'reporting-queue-performance',
          channel: 'queueperformance',
          dataType: 'Queue Performance'
        }
      };

      const widgetContainer: WidgetContainer[] = [{
        dataType: widget.dataType,
        id: 'widget-container-id',
        subscription: {
          ...subscription
        },
        widgetIds: ['widget-id']
      }];

      actions               =  hot('-a', {a: StopAction});
      const widgetContainer$ =  hot('a', {a: widgetContainer});
      const expected        = cold('-(ab)', {a: resetAction, b: successAction});

      mockStore.pipe.and.returnValue(widgetContainer$);

      effects = TestBed.get(WidgetContainerEffects);
      expect(effects.removeWidgetContainer$).toBeObservable(expected);
    });
  });
});
