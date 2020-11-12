import deepFreeze from '../../../common/testing/deepFreeze';
import * as fromWidgetContainer from './widget-container.reducer';
import {WebSocketSubscription, WidgetContainer} from '../../models/web-socket/widget-container';
import * as widgetContainerAction from '../../actions/web-socket/widget-container.actions';
import {mockWidget} from '../../../common/testing/mocks/widgets';

describe('Widget container Reducer', () => {
  describe('WidgetContainer$', () => {
    it('should modify widget container when getting data action', () => {
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
        subscription,
        widgetIds: [widget.id]
      }];

      const widgetContainer2: WidgetContainer[] = [{
        ...widgetContainer[0],
        id: 'widget-container-id2'
      }];

      const stateBefore: fromWidgetContainer.State = {
        widgetContainers: widgetContainer
      };
      const stateAfter: fromWidgetContainer.State = {
        widgetContainers: widgetContainer2
      };
      const action = new widgetContainerAction.ModifyWidgetContainerSuccess(widgetContainer2);

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(fromWidgetContainer.reducer(stateBefore, action)).toEqual(stateAfter);
    });
  });
});
