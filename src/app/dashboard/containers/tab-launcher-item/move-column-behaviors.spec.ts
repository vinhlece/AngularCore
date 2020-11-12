import {mockTabularWidget} from '../../../common/testing/mocks/widgets';
import * as widgetsActions from '../../../widgets/actions/widgets.actions';
import {Column} from '../../../widgets/models';
import {OrderColumn} from './move-column-behaviors';

describe('move column behavior', () => {
  let store;

  beforeEach(() => {
    store = jasmine.createSpyObj('store', ['pipe', 'dispatch']);
  });

  describe('order column', () => {
    const columns: Column[] = [
      {id: 'column 1', title: 'Column 1'},
      {id: 'column 2', title: 'Column 2'},
      {id: 'column 3', title: 'Column 3'},
      {id: 'column 4', title: 'Column 4'}
    ];
    const widget = {...mockTabularWidget(), columns};

    it('should move target column before sibling column', () => {
      const targetColumn = {id: 'column 1', title: 'Column 1'};
      const siblingColumn = {id: 'column 3', title: 'Column 3'};

      const orderBehavior = new OrderColumn(store, widget);
      orderBehavior.move({targetColumn, siblingColumn});

      const expectedColumns: Column[] = [
        {id: 'column 2', title: 'Column 2'},
        {id: 'column 1', title: 'Column 1'},
        {id: 'column 3', title: 'Column 3'},
        {id: 'column 4', title: 'Column 4'}
      ];
      const expectedWidget = {...widget, columns: expectedColumns};
      expect(store.dispatch).toHaveBeenCalledWith(new widgetsActions.Update(expectedWidget));
    });

    it('should move target column to the last', () => {
      const targetColumn = {id: 'column 1', title: 'Column 1'};

      const orderBehavior = new OrderColumn(store, widget);
      orderBehavior.move({targetColumn, siblingColumn: null});

      const expectedColumns: Column[] = [
        {id: 'column 2', title: 'Column 2'},
        {id: 'column 3', title: 'Column 3'},
        {id: 'column 4', title: 'Column 4'},
        {id: 'column 1', title: 'Column 1'},
      ];
      const expectedWidget = {...widget, columns: expectedColumns};
      expect(store.dispatch).toHaveBeenCalledWith(new widgetsActions.Update(expectedWidget));
    });
  });
});
