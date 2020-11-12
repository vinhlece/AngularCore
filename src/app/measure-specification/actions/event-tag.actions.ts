import {ActionWithPayload} from '../../common/actions/index';
import {EventMapping, EventQualifier, EventTag} from '../models/index';
import {EditingEventTag} from '../models/enums';

export const CREATE_CUSTOM_EVENT = '[Event Tag] Create a custom event tag';
export const CREATE_CUSTOM_EVENT_RESPONSE = '[Event Tag] Create a custom event tag response';
export const LOAD_ALL_EVENT_TAGS = '[Event Tag] Load all event tags';
export const LOAD_ALL_EVENT_TAGS_SUCCESS = '[Event Tag] Load all event tags success';
export const UPDATE_CUSTOM_EVENT = '[Event Tag] Update a custom event tag';
export const UPDATE_CUSTOM_EVENT_RESPONSE = '[Event Tag] Update a custom event tag response';
export const DELETE_CUSTOM_EVENT = '[Event Tag] delete a custom event tag';
export const DELETE_CUSTOM_EVENT_RESPONSE = '[Event Tag] delete a custom event tag response';
export const CREATE_EVENT_MAPPINGS = '[Event Mapping] Create event mappings';
export const CREATE_EVENT_MAPPING = '[Event Mapping] Create a event mapping';
export const CREATE_EVENT_MAPPING_RESPONSE = '[Event Mapping] Create a event mapping response';
export const ERROR = '[Event Tag] Error';

export class CreateCustomEvent implements ActionWithPayload<string> {
  readonly type = CREATE_CUSTOM_EVENT;

  constructor(public payload: string, public body: EventQualifier, public query: string) {
  }
}

export class CreateCustomEventSuccess implements ActionWithPayload<EventTag> {
  readonly type = CREATE_CUSTOM_EVENT_RESPONSE;

  constructor(public payload: EventTag) {
  }
}

export class UpdateCustomEvent implements ActionWithPayload<any> {
  readonly type = UPDATE_CUSTOM_EVENT;

  constructor(public payload: any) {
  }
}

export class UpdateCustomEventSuccess implements ActionWithPayload<EventTag> {
  readonly type = UPDATE_CUSTOM_EVENT_RESPONSE;

  constructor(public payload: EventTag, public oldId: string, public editingEvent: EditingEventTag) {
  }
}

export class ActionFailure implements ActionWithPayload<string> {
  readonly type = ERROR;
  error = true;
  payload: string;

  constructor(error: Error) {
    this.payload = error.message;
  }
}

export class LoadAllEventTags implements ActionWithPayload<string> {
  readonly type = LOAD_ALL_EVENT_TAGS;
  payload: string;

  constructor(payload: string) {
    this.payload = payload;
  }
}

export class DeleteCustomEvent implements ActionWithPayload<any> {
  readonly type = DELETE_CUSTOM_EVENT;

  constructor(public payload: string, public id: string, public editingEvent: EditingEventTag) {
  }
}

export class CreateEventMappings implements ActionWithPayload<{[source: string]: EventMapping[]}> {
  readonly type = CREATE_EVENT_MAPPINGS;

  constructor(public payload: {[source: string]: EventMapping[]}) {
  }
}

export class CreateEventMapping implements ActionWithPayload<string> {
  readonly type = CREATE_EVENT_MAPPING;

  constructor(public payload: string, public body: EventMapping) {
  }
}

export class CreateEventMappingSuccess implements ActionWithPayload<EventMapping> {
  readonly type = CREATE_EVENT_MAPPING_RESPONSE;

  constructor(public payload: EventMapping) {
  }
}

export class DeleteCustomEventSuccess implements ActionWithPayload<string> {
  readonly type = DELETE_CUSTOM_EVENT_RESPONSE;

  constructor(public payload: string, public editingEvent: EditingEventTag) {
  }
}

export class LoadAllEventTagsSuccess implements ActionWithPayload<any> {
  readonly type = LOAD_ALL_EVENT_TAGS_SUCCESS;
  payload: any;

  constructor(streams: any) {
    this.payload = streams;
  }
}
