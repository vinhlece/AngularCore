import deepFreeze from '../../../common/testing/deepFreeze';
import {
  mockQueuePerformancePackageOptions,
  mockQueueStatusPackageOptions
} from '../../../common/testing/mocks/realtime-data.mocks';
import * as pollingActions from '../../actions/rest-api/polling.actions';
import * as streamsActions from '../../actions/rest-api/streams.actions';
import * as topicsActions from '../../actions/rest-api/topics.actions';
import {Stream, Topic} from '../../models';
import * as fromPolling from './polling.reducer';

describe('Polling Reducer', () => {
  describe('isListening', () => {
    it('should set listening = true with start getting data action', () => {
      const stateBefore = false;
      const stateAfter = true;
      const action = new pollingActions.Start();

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(fromPolling.isListening(stateBefore, action)).toEqual(stateAfter);
    });

    it('should set listening = false with stop getting data action', () => {
      const stateBefore = true;
      const stateAfter = false;
      const action = new pollingActions.Stop();

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(fromPolling.isListening(stateBefore, action)).toEqual(stateAfter);
    });
  });

  describe('pause/resume', () => {
    it('should set pause to true with pause action', () => {
      const stateBefore: boolean = false;
      const stateAfter: boolean = true;
      const action = new pollingActions.Pause();

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(fromPolling.isPausing(stateBefore, action)).toEqual(stateAfter);
    });

    it('should set pause to false with resume action', () => {
      const stateBefore: boolean = true;
      const stateAfter: boolean = false;
      const action = new pollingActions.Resume();

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(fromPolling.isPausing(stateBefore, action)).toEqual(stateAfter);
    });
  });

  describe('topics', () => {
    it('should add new topic with add topic action', () => {
      const stateBefore: Topic[] = [
        {name: 'topic 1', isSubscribed: false, clientId: 'clientId', measures: []},
        {name: 'topic 2', isSubscribed: true, clientId: 'clientId', measures: []}
      ];
      const stateAfter: Topic[] = [
        {name: 'topic 1', isSubscribed: false, clientId: 'clientId', measures: []},
        {name: 'topic 2', isSubscribed: true, clientId: 'clientId', measures: []},
        {name: 'topic 3', isSubscribed: true, clientId: 'clientId', measures: []}
      ];
      const action = new topicsActions.Add({name: 'topic 3', isSubscribed: true});

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(fromPolling.topics(stateBefore, action)).toEqual(stateAfter);
    });

    it('should not add topic if it already exists (only compare topic by name) with add topic action', () => {
      const stateBefore: Topic[] = [
        {name: 'topic 1', isSubscribed: false, clientId: 'clientId', measures: []},
        {name: 'topic 2', isSubscribed: true, clientId: 'clientId', measures: []}
      ];
      const stateAfter: Topic[] = [
        {name: 'topic 1', isSubscribed: false, clientId: 'clientId', measures: []},
        {name: 'topic 2', isSubscribed: true, clientId: 'clientId', measures: []},
      ];
      const action = new topicsActions.Add({name: 'topic 2', isSubscribed: false, measures: []});

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(fromPolling.topics(stateBefore, action)).toEqual(stateAfter);
    });

    it('should update existing topic with update topic action', () => {
      const stateBefore: Topic[] = [
        {name: 'topic 1', isSubscribed: false},
        {name: 'topic 2', isSubscribed: false},
        {name: 'topic 3', isSubscribed: true}
      ];
      const stateAfter: Topic[] = [
        {name: 'topic 1', isSubscribed: false},
        {name: 'topic 2', isSubscribed: true},
        {name: 'topic 3', isSubscribed: true}
      ];
      const action = new topicsActions.Update({name: 'topic 2', isSubscribed: true});

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(fromPolling.topics(stateBefore, action)).toEqual(stateAfter);
    });

    it('should not change topics if topic does not exists with update topic action', () => {
      const stateBefore: Topic[] = [
        {name: 'topic 1', isSubscribed: false},
        {name: 'topic 2', isSubscribed: false},
        {name: 'topic 3', isSubscribed: true}
      ];
      const stateAfter: Topic[] = [
        {name: 'topic 1', isSubscribed: false},
        {name: 'topic 2', isSubscribed: false},
        {name: 'topic 3', isSubscribed: true}
      ];
      const action = new topicsActions.Update({name: 'topic 4', isSubscribed: true});

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(fromPolling.topics(stateBefore, action)).toEqual(stateAfter);
    });

    it('should mark all topics as unsubscribe with reset action', () => {
      const stateBefore: Topic[] = [
        {name: 'topic 1', isSubscribed: true},
        {name: 'topic 2', isSubscribed: true},
        {name: 'topic 3', isSubscribed: true}
      ];
      const stateAfter: Topic[] = [
        {name: 'topic 1', isSubscribed: false},
        {name: 'topic 2', isSubscribed: false},
        {name: 'topic 3', isSubscribed: false}
      ];
      const action = new topicsActions.Reset();

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(fromPolling.topics(stateBefore, action)).toEqual(stateAfter);
    });
  });

  describe('streams', () => {
    it('should add new stream with set pump up stream action', () => {
      const stateBefore: Stream[] = [
        {...mockQueuePerformancePackageOptions(), instance: 'instance 1'},
        {...mockQueueStatusPackageOptions(), instance: 'instance 2'}
      ];
      const stateAfter: Stream[] = [
        {...mockQueuePerformancePackageOptions(), instance: 'instance 1'},
        {...mockQueueStatusPackageOptions(), instance: 'instance 2'},
        {...mockQueueStatusPackageOptions(), instance: 'instance 3'}
      ];
      const action = new streamsActions.SetPumpUpStream([{...mockQueueStatusPackageOptions(), instance: 'instance 3'}]);

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(fromPolling.streams(stateBefore, action)).toEqual(stateAfter);
    });

    it('should not add already exists stream with set pump up stream action', () => {
      const stateBefore: Stream[] = [
        {...mockQueuePerformancePackageOptions(), instance: 'instance 1'},
        {...mockQueueStatusPackageOptions(), instance: 'instance 2'}
      ];
      const stateAfter: Stream[] = [
        {...mockQueuePerformancePackageOptions(), instance: 'instance 1'},
        {...mockQueueStatusPackageOptions(), instance: 'instance 2'},
      ];
      const action = new pollingActions.Generate([{...mockQueueStatusPackageOptions(), instance: 'instance 2'}]);

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(fromPolling.streams(stateBefore, action)).toEqual(stateAfter);
    });

    it('should mark all stream as untouched with reset action', () => {
      const stateBefore: Stream[] = [
        {...mockQueuePerformancePackageOptions(), instance: 'instance 1', dirty: true},
        {...mockQueueStatusPackageOptions(), instance: 'instance 2', dirty: true}
      ];
      const stateAfter: Stream[] = [
        {...mockQueuePerformancePackageOptions(), instance: 'instance 1', dirty: false},
        {...mockQueueStatusPackageOptions(), instance: 'instance 2', dirty: false},
      ];
      const action = new streamsActions.ResetPumpUpStream();

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(fromPolling.streams(stateBefore, action)).toEqual(stateAfter);
    });
  });

  describe('goBackStreams', () => {
    it('should add new streams with set go back pump up stream action', () => {
      const stateBefore: Stream[] = [
        {...mockQueuePerformancePackageOptions(), instance: 'instance 1'},
        {...mockQueueStatusPackageOptions(), instance: 'instance 2'}
      ];
      const stateAfter: Stream[] = [
        {...mockQueuePerformancePackageOptions(), instance: 'instance 1'},
        {...mockQueueStatusPackageOptions(), instance: 'instance 2'},
        {...mockQueueStatusPackageOptions(), instance: 'instance 3'}
      ];
      const action = new streamsActions.SetGoBackPumpUpStream([{
        ...mockQueueStatusPackageOptions(),
        instance: 'instance 3'
      }]);

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(fromPolling.goBackStreams(stateBefore, action)).toEqual(stateAfter);
    });

    it('should not add already exists stream with set go back pump up stream action', () => {
      const stateBefore: Stream[] = [
        {...mockQueuePerformancePackageOptions(), instance: 'instance 1'},
        {...mockQueueStatusPackageOptions(), instance: 'instance 2'}
      ];
      const stateAfter: Stream[] = [
        {...mockQueuePerformancePackageOptions(), instance: 'instance 1'},
        {...mockQueueStatusPackageOptions(), instance: 'instance 2'},
      ];
      const action = new streamsActions.SetGoBackPumpUpStream([{
        ...mockQueueStatusPackageOptions(),
        instance: 'instance 2'
      }]);

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(fromPolling.goBackStreams(stateBefore, action)).toEqual(stateAfter);
    });

    it('should mark all stream as untouched with reset action', () => {
      const stateBefore: Stream[] = [
        {...mockQueuePerformancePackageOptions(), instance: 'instance 1', dirty: true},
        {...mockQueueStatusPackageOptions(), instance: 'instance 2', dirty: true}
      ];
      const stateAfter: Stream[] = [
        {...mockQueuePerformancePackageOptions(), instance: 'instance 1', dirty: false},
        {...mockQueueStatusPackageOptions(), instance: 'instance 2', dirty: false},
      ];
      const action = new streamsActions.ResetGoBackPumpUpStream();

      deepFreeze(stateBefore);
      deepFreeze(action);

      expect(fromPolling.goBackStreams(stateBefore, action)).toEqual(stateAfter);
    });
  });
});
