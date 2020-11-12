import deepFreeze from '../../../common/testing/deepFreeze';
import {mockRealtimeData} from '../../../common/testing/mocks/realtime-data.mocks';
import * as realTimeDataActions from '../../actions/rest-api/real-time-data.actions';
import {Collection} from '../../models/collection';
import * as fromRealTimeData from './real-time-data.reducer';

describe('real time data reducer', () => {
  describe('mainStorage', () => {
    it('should set new data storage with set action', () => {
      const item = mockRealtimeData();
      const storage = new Collection();
      storage.bulkInsert([
        {...item, measureName: 'ContactsAnswered'},
        {...item, measureName: 'ContactsAbandoned'}
      ]);
      const stateBefore = new Collection();
      const stateAfter = {last_30_m: storage};
      const action = new realTimeDataActions.SetMainStorage({last_30_m: storage});

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(fromRealTimeData.mainStorage({last_30_m: stateBefore}, action)).toEqual(stateAfter);
    });

    it('should set storage to empty with clear data action', () => {
      const item = mockRealtimeData();
      const storage = new Collection();
      storage.bulkInsert([
        {...item, measureName: 'ContactsAnswered'},
        {...item, measureName: 'ContactsAbandoned'}
      ]);
      const stateBefore = storage;
      const action = new realTimeDataActions.ClearData();

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(Object.keys(fromRealTimeData.mainStorage({last_30_m: stateBefore}, action)).length).toEqual(0);
    });
  });

  describe('eventStorage', () => {
    it('should set new data storage with set action', () => {
      const item = mockRealtimeData();
      const storage = new Collection();
      storage.bulkInsert([
        {...item, measureName: 'ContactsAnswered'},
        {...item, measureName: 'ContactsAbandoned'}
      ]);
      const stateBefore = new Collection();
      const stateAfter = storage;
      const action = new realTimeDataActions.SetEventStorage(storage);

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(fromRealTimeData.eventStorage(stateBefore, action)).toEqual(stateAfter);
    });

    it('should set storage to empty with clear data action', () => {
      const item = mockRealtimeData();
      const storage = new Collection();
      storage.bulkInsert([
        {...item, measureName: 'ContactsAnswered'},
        {...item, measureName: 'ContactsAbandoned'}
      ]);
      const stateBefore = storage;
      const action = new realTimeDataActions.ClearData();

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(fromRealTimeData.eventStorage(stateBefore, action).size()).toEqual(0);
    });
  });
});
