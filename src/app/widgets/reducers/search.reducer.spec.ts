import deepFreeze from '../../common/testing/deepFreeze';
import {mockMeasure, mockWidget} from '../../common/testing/mocks/widgets';
import {Measure} from '../../measures/models';
import * as instancesActions from '../actions/instances.actions';
import * as measuresActions from '../../measures/actions/measures.actions';
import * as searchActions from '../actions/search.actions';
import * as widgetsActions from '../actions/widgets.actions';
import * as fromSearch from './search.reducer';

describe('SearchReducer', () => {
  const widget = mockWidget();

  describe('widgets', () => {
    it('should set widget ids with search widgets success action', () => {
      const stateBefore: string[] = ['1', '2'];
      const stateAfter: string[] = ['1', '2', '3'];
      const action = new widgetsActions.SearchSuccess([{...widget, id: '1'}, {...widget, id: '2'}, {
        ...widget,
        id: '3'
      }]);

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(fromSearch.widgets(stateBefore, action)).toEqual(stateAfter);
    });
  });

  describe('measures', () => {
    it('should set measures names with find measures by name success action', () => {
      const stateBefore: string[] = [];
      const stateAfter: string[] = ['abc_measure 1', 'abc_measure 2'];
      const measure = mockMeasure();
      const measures: Measure[] = [
        {...measure, name: 'measure 1', dataType: 'abc'},
        {...measure, name: 'measure 2', dataType: 'abc'}
      ];
      const action = new measuresActions.FindByNameSuccess(measures);

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(fromSearch.measures(stateBefore, action)).toEqual(stateAfter);
    });
  });

  describe('instances', () => {
    it('should set instance names with find instance by name success action', () => {
      const stateBefore: string[] = [];
      const stateAfter: string[] = ['instance1', 'instance2'];
      const instances = ['instance1', 'instance2'];
      const action = new instancesActions.FindByNameSuccess(instances);

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(fromSearch.instances(stateBefore, action)).toEqual(stateAfter);
    });
  });

  describe('searchType', () => {
    it('should set search type with set search type action', () => {
      const stateBefore: string = 'all';
      const stateAfter: string = 'measures';
      const action = new searchActions.SetSearchType('measures');

      expect(fromSearch.searchType(stateBefore, action)).toEqual(stateAfter);
    });
  });
});
