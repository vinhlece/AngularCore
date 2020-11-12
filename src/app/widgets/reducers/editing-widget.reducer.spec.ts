import {mockWidget, mockWidgets} from '../../common/testing/mocks/widgets';
import deepFreeze from '../../common/testing/deepFreeze';
import * as editingWidgetActions from '../actions/editing-widget.actions';
import * as fromEditingWidget from './editing-widget.reducer';
import * as widgetsActions from '../actions/widgets.actions';

describe('EditingWidgetReducer', () => {
  it('should set widget with edit action', () => {
    const stateBefore: fromEditingWidget.State = {
      widget: null
    };
    const stateAfter: fromEditingWidget.State = {
      widget: mockWidgets()[0],
    };
    const action = new editingWidgetActions.Edit(mockWidgets()[0]);

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(fromEditingWidget.reducer(stateBefore, action)).toEqual(stateAfter);
  });

  it('should set editing widget when receive an load widget success action with edit metadata', () => {
    const widget = mockWidget();

    const stateBefore: fromEditingWidget.State = {
      widget: null
    };
    const stateAfter: fromEditingWidget.State = {
      widget,
    };
    const action = new widgetsActions.LoadSuccess(widget, {edit: true});

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(fromEditingWidget.reducer(stateBefore, action)).toEqual(stateAfter);
  });
});
