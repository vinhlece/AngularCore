import {combineReducers} from '@ngrx/store';
import * as unionWith from 'lodash/unionWith';
import {ActionWithPayload} from '../../../common/actions';
import * as pollingActions from '../../actions/rest-api/polling.actions';
import * as streamsActions from '../../actions/rest-api/streams.actions';
import * as topicsActions from '../../actions/rest-api/topics.actions';
import {Stream, Topic} from '../../models';
import {Measure} from '../../../measures/models/index';

export interface State {
  isListening: boolean;
  isPausing: boolean;
  topics: Topic[];
  streams: Stream[];
  goBackStreams: Stream[];
}

export const initialState: State = {
  isListening: false,
  isPausing: false,
  topics: [],
  streams: [],
  goBackStreams: []
};

export function isListening(state = false, action: ActionWithPayload<any>): boolean {
  switch (action.type) {
    case pollingActions.START:
      return true;
    case pollingActions.STOP:
      return false;
    default:
      return state;
  }
}

export function isPausing(state = false, action: ActionWithPayload<any>): boolean {
  switch (action.type) {
    case pollingActions.PAUSE:
      return true;
    case pollingActions.RESUME:
      return false;
    default:
      return state;
  }
}

export function topics(state = [], action: ActionWithPayload<any>): Topic[] {
  switch (action.type) {
    case topicsActions.ADD:
      return unionTopic(state, action.payload, (action as topicsActions.Add).currentMeasures);
    case topicsActions.UPDATE:
      const topic = action.payload;
      const idx = state.findIndex((item: Topic) => item.name === topic.name);
      return idx >= 0
        ? [
          ...state.slice(0, idx),
          topic,
          ...state.slice(idx + 1, state.length)
        ]
        : state;
    case topicsActions.RESET:
      return state.map((item: Topic) => ({...item, isSubscribed: false}));
    case topicsActions.UPDATE_SESSION_ID:
      return state.map((item: Topic) => ({...item, isSubscribed: true, clientId: action.payload}));
    default:
      return state;
  }
}

export function streams(state = [], action: ActionWithPayload<any>): Stream[] {
  switch (action.type) {
    case streamsActions.SET_PUMP_UP_STREAM:
      return unionOptions(state, action.payload, (action as streamsActions.SetPumpUpStream).currentStream);
    case streamsActions.UPDATE_PUMP_UP_STREAMS:
      return unionOptions(action.payload, state);
    case streamsActions.RESET_PUMP_UP_STREAM:
      return state.map((item: Stream) => ({...item, dirty: false}));
    default:
      return state;
  }
}

export function goBackStreams(state = [], action: ActionWithPayload<any>): Stream[] {
  switch (action.type) {
    case streamsActions.SET_GO_BACK_PUMP_UP_STREAM:
      return unionOptions(state, action.payload);
    case streamsActions.RESET_GO_BACK_PUMP_UP_STREAM:
      return state.map((item: Stream) => ({...item, dirty: false}));
    default:
      return state;
  }
}

export function reducer(state = initialState, action: ActionWithPayload<any>): State {
  const actionReducer = combineReducers({
    isListening,
    isPausing,
    topics,
    streams,
    goBackStreams
  });

  return actionReducer(state, action);
}

function unionOptions(optionsA: Stream[], optionsB: Stream[], currentStreams?: Stream[]): Stream[] {
  const comparator = (a: Stream, b: Stream) => (
    a.dataType === b.dataType &&
    a.instance === b.instance
  );
  const newStreams = unionWith(optionsA, optionsB, comparator);
  if (currentStreams) {
    return newStreams.filter(stream => currentStreams.findIndex(i => i.dataType === stream.dataType &&
                                                                             i.instance === stream.instance) >= 0);
  }
  return newStreams;
}

function unionTopic(topicA: Topic[], topicB: Topic, currentMeasures: any): Topic[] {
  const isSubscribedTopic = topicA.find((item: Topic) => item.isSubscribed);
  const topicC: Topic = {...topicB};
  if (isSubscribedTopic) {
    topicC.isSubscribed = true;
    topicC.clientId = isSubscribedTopic.clientId;
  }
  const unionData = unionWith(topicA, [topicC], (a: Topic, b: Topic) => a.name === b.name);
  for (let u = 0; u < unionData.length; u++) {
    const item = unionData[u];
    if (currentMeasures && currentMeasures[item.dataType]) {
      item.measures = item.measures.filter(i => currentMeasures[item.dataType].indexOf(i.name) >= 0);
    }
    if (item.name === topicC.name) {
      const updatedMeasures = unionWith(item.measures, topicC.measures, (a: Measure, b: Measure) => a.name === b.name);
      unionData[u] = {...unionData[u], measures: updatedMeasures};
    }
  }
  return unionData;
}
