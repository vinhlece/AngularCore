import deepFreeze from '../../common/testing/deepFreeze';
import {mockPlaceholder, mockPlaceholders, mockTab} from '../../common/testing/mocks/dashboards';
import * as placeholdersActions from '../actions/placeholders.actions';
import {DisplayMode, PlaceholderSize} from '../models/enums';
import * as fromPlaceholders from './placeholders.reducer';

describe('placeholders reducer', () => {
  describe('overall', () => {
    it('should return initial state with placeholders release action', () => {
      const placeholder = mockPlaceholder();
      const stateBefore: fromPlaceholders.State = {
        placeholders: [
          {...placeholder, size: {rows: 2, columns: 3}, id: '1'},
          {...placeholder, size: {rows: 1, columns: 2}, id: '2'}
        ],
        sizes: {'1': PlaceholderSize.MAXIMUM},
        maximumPlaceholderId: '1',
        focus: {'1': false},
        displayModes: {'1': DisplayMode.Latest},
        charts: {'1': 'Line'},
        realTimeMode: {'a': true}
      };
      const stateAfter: fromPlaceholders.State = {
        placeholders: [],
        sizes: {},
        maximumPlaceholderId: null,
        focus: {},
        displayModes: {},
        charts: {},
        realTimeMode: {}
      };
      const tab = mockTab();
      const action = new placeholdersActions.ReleasePlaceholders();

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(fromPlaceholders.reducer(stateBefore, action)).toEqual(stateAfter);
    });
  });

  describe('placeholders', () => {
    it('should set placeholders with set placeholders action', () => {
      const placeholders = mockPlaceholders();
      const stateBefore = [];
      const stateAfter = placeholders;
      const action = new placeholdersActions.Set(placeholders);

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(fromPlaceholders.placeholders(stateBefore, action)).toEqual(stateAfter);
    });

    it('should replace old placeholder with new placeholder in the payload with set placeholders action', () => {
      const placeholder = mockPlaceholder();
      const oldPlaceholders = [
        {...placeholder, size: {rows: 2, columns: 3}, id: '1'},
        {...placeholder, size: {rows: 1, columns: 2}, id: '2'}
      ];
      const newPlaceholders = [
        {...placeholder, size: {rows: 6, columns: 9}, id: '1'},
        {...placeholder, size: {rows: 1, columns: 2}, id: '2'}
      ];
      const payloadPlaceholders = [
        {...placeholder, size: {rows: 6, columns: 9}, id: '1'}
      ];

      const stateBefore = oldPlaceholders;
      const stateAfter = newPlaceholders;
      const action = new placeholdersActions.Set(payloadPlaceholders);

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(fromPlaceholders.placeholders(stateBefore, action)).toEqual(stateAfter);
    });

    it('should remove placeholder with remove placeholder action', () => {
      let placeholder1 = mockPlaceholders()[0];
      placeholder1 = {...placeholder1, id: '1'};
      let placeholder2 = mockPlaceholders()[0];
      placeholder2 = {...placeholder2, id: '2'};

      const stateBefore = [placeholder1, placeholder2];
      const stateAfter = [placeholder2];
      const action = new placeholdersActions.Delete('1');

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(fromPlaceholders.placeholders(stateBefore, action)).toEqual(stateAfter);
    });
  });

  describe('sizes', () => {
    it('should update placeholder size with maximize action', () => {
      const stateBefore = {'2': PlaceholderSize.MINIMUM};
      const stateAfter = {'2': PlaceholderSize.MINIMUM, '1': PlaceholderSize.MAXIMUM};

      const action = new placeholdersActions.Maximize('1');

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(fromPlaceholders.sizes(stateBefore, action)).toEqual(stateAfter);
    });

    it('should update placeholder size with minimize action', () => {
      const stateBefore = {'2': PlaceholderSize.MINIMUM, '1': PlaceholderSize.MAXIMUM};
      const stateAfter = {'2': PlaceholderSize.MINIMUM, '1': PlaceholderSize.MINIMUM};
      const action = new placeholdersActions.Minimize('1');

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(fromPlaceholders.sizes(stateBefore, action)).toEqual(stateAfter);
    });
  });

  describe('maximumPlaceholderId', () => {
    it('should set maximumPlaceholderId with maximize action', () => {
      const stateBefore = null;
      const stateAfter = '1';

      const action = new placeholdersActions.Maximize('1');

      deepFreeze(action);

      expect(fromPlaceholders.maximumPlaceholderId(stateBefore, action)).toEqual(stateAfter);
    });

    it('should reset maximumPlaceholderId with minimize action', () => {
      const stateBefore = '1';
      const stateAfter = null;

      const action = new placeholdersActions.Minimize('1');

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(fromPlaceholders.maximumPlaceholderId(stateBefore, action)).toEqual(stateAfter);
    });
  });

  describe('focus', () => {
    it('should focus a placeholder with focus action', () => {
      const placeholder = mockPlaceholder();

      const stateBefore = {};
      const stateAfter = {[placeholder.id]: true};

      const action = new placeholdersActions.Focus(placeholder.id);

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(fromPlaceholders.focus(stateBefore, action)).toEqual(stateAfter);
    });

    it('should un-focus a placeholder with blur action', () => {
      const placeholder = mockPlaceholder();

      const stateBefore = {[placeholder.id]: true};
      const stateAfter = {[placeholder.id]: false};

      const action = new placeholdersActions.Blur(placeholder.id);

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(fromPlaceholders.focus(stateBefore, action)).toEqual(stateAfter);
    });
  });

  describe('displayModes', () => {
    it('should set latest display mode for a placeholder with show latest action', () => {
      const placeholder = mockPlaceholder();

      const stateBefore = {};
      const stateAfter = {[placeholder.id]: DisplayMode.Latest};

      const action = new placeholdersActions.ShowLatest(placeholder.id);

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(fromPlaceholders.displayModes(stateBefore, action)).toEqual(stateAfter);
    });

    it('should set historical display mode for a placeholder with show historical action', () => {
      const placeholder = mockPlaceholder();

      const stateBefore = {[placeholder.id]: DisplayMode.Latest};
      const stateAfter = {[placeholder.id]: DisplayMode.Historical};

      const action = new placeholdersActions.ShowHistorical(placeholder.id);

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(fromPlaceholders.displayModes(stateBefore, action)).toEqual(stateAfter);
    });
  });

  describe('charts', () => {
    it('should set chart type with change chart type action', () => {
      const placeholder = mockPlaceholder();

      const stateBefore = {};
      const stateAfter = {[placeholder.id]: 'Line'};

      const action = new placeholdersActions.ChangeChartType({placeholderId: placeholder.id, chartType: 'Line'});

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(fromPlaceholders.charts(stateBefore, action)).toEqual(stateAfter);
    });
  });
});
