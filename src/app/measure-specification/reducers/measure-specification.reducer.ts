import { ActionWithPayload } from '../../common/actions';
import * as eventSourceActions from '../actions/measure-specification.actions';
import * as eventTagActions from '../actions/event-tag.actions';
import {EventTag} from '../models/index';

export interface State {
  source: any;
  customEventTags: EventTag[];
  eventTags: EventTag[];
}

const initialState: State = {
  source: {},
  customEventTags: [],
  eventTags: []
};

export function reducer(state = initialState, action: ActionWithPayload<any>): State {
  switch (action.type) {
    case eventSourceActions.LOAD_ALL_RESPONSE:
      const eventSource = (action as eventSourceActions.LoadAllSuccess).eventSource;
      return {
        ...state,
        source: { ...state.source, [eventSource]: action.payload }
      };
    case eventSourceActions.UPDATE_STREAM:
      const { event, stream } = (action as eventSourceActions.Update).payload;
      const current = state.source[event.source].map(item => item.id === stream.id ? stream : item);
      return {
        ...state,
        source: { ...state.source, [event.source]: current }
      };
    case eventSourceActions.ERROR:
      const source = (action as eventSourceActions.ActionFailure).source;
      return {
        ...state,
        source: { ...state.source, [source]: null }
      };
    case eventTagActions.LOAD_ALL_EVENT_TAGS_SUCCESS:
      return {
        ...state,
        eventTags: action.payload
      };
    case eventTagActions.CREATE_CUSTOM_EVENT_RESPONSE:
      return {
        ...state,
        customEventTags: [
          ...state.customEventTags,
          action.payload
        ]
      };
    case eventTagActions.UPDATE_CUSTOM_EVENT_RESPONSE:
      const updateAction = (action as eventTagActions.UpdateCustomEventSuccess);
      const updateEvent = state[updateAction.editingEvent].filter(item => item.id !== updateAction.oldId);
      return {
        ...state,
        [updateAction.editingEvent]: [...updateEvent, action.payload]
      };
    case eventTagActions.DELETE_CUSTOM_EVENT_RESPONSE:
      const deleteAction = (action as eventTagActions.DeleteCustomEventSuccess);
      return {
        ...state,
        [deleteAction.editingEvent]: state[deleteAction.editingEvent].filter(item => item.id !== deleteAction.payload)
      };
    default:
      return state;
  }
}
