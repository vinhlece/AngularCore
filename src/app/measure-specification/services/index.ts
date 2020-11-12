import {Observable} from 'rxjs/index';
import {EventMapping, MeasureSpecification, EventQualifier} from '../models/index';

export interface EventSourceService {
  getAllStreams(eventSourceId: string, id: string): Observable<any>;
  getSourceByUrl(eventSourceUrl: string): Observable<any>;
  createEventTag(eventSourceUrl: string, body: EventQualifier): Observable<any>;
  deleteEventTag(eventSourceUrl: string, id: string): Observable<any>;
  createEventMapping(eventSourceUrl: string, body: EventMapping): Observable<any>;
  addMeasure(eventSourceUrl: string, body: MeasureSpecification): Observable<any>;
  getAllEventTags(eventSourceUrl: string): Observable<any>;
}
