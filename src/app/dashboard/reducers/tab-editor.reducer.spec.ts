import {mockWidget} from '../../common/testing/mocks/widgets';
import deepFreeze from '../../common/testing/deepFreeze';
import * as widgetsActions from '../../widgets/actions/widgets.actions';
import * as tabEditorActions from '../actions/tab-editor.actions';
import {GridMetrics} from '../models';
import * as fromTabEditor from './tab-editor.reducer';

describe('tab editor reducer', () => {
  describe('widgetToCreate state', () => {
    it('should update widget to be created when action has addToGrid meta is true and contain payload result', () => {
      const widget = mockWidget();
      const stateBefore: string = null;
      const stateAfter: string = widget.id;
      const action = new widgetsActions.AddSuccess(widget, {addToGrid: true});

      deepFreeze(action);

      expect(fromTabEditor.widgetToCreate(stateBefore, action)).toEqual(stateAfter);
    });

    it('should reset widget to be created on create widget success action', () => {
      const stateBefore = '1';
      const stateAfter = null;
      const action = new tabEditorActions.CreateWidgetSuccess();

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(fromTabEditor.widgetToCreate(stateBefore, action)).toEqual(stateAfter);
    });
  });

  describe('metrics state', () => {
    it('should set metrics with update metrics action', () => {
      const stateBefore: GridMetrics = {};
      const stateAfter: GridMetrics = {innerRowHeight: 10};
      const action = new tabEditorActions.UpdateMetrics({innerRowHeight: 10});

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(fromTabEditor.metrics(stateBefore, action)).toEqual(stateAfter);
    });
  });
});
