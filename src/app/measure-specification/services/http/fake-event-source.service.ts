import {EventSourceService} from '../index';
import {AppConfigService} from '../../../app.config.service';
import {Observable} from 'rxjs/index';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {EventQualifier, EventMapping, MeasureSpecification} from '../../models/index';
import {getHostUrl} from '../../../common/utils/url';

@Injectable()
export class FakeEventSourceServiceImpl implements EventSourceService {
  private _http: HttpClient;
  private _appConfigService: AppConfigService;

  constructor(http: HttpClient, appConfigService: AppConfigService) {
    this._http = http;
    this._appConfigService = appConfigService;
  }

  getSourceByUrl(eventSourceUrl: string): Observable<any> {
    return this._http.get<any>(this.getEventSource(eventSourceUrl));
  }

  getAllStreams(eventSourceId: string, id: string): Observable<any> {
    return this._http.get<any>(this.getEventStreams(eventSourceId));
  }

  createEventTag(eventSourceUrl: string, body: EventQualifier): Observable<any> {
    return this._http.post<any>(this.getEventTag(eventSourceUrl), body);
  }

  deleteEventTag(eventSourceUrl: string, id: string): Observable<any> {
    return this._http.delete(`${this.getEventTag(eventSourceUrl)}/${id}`);
  }

  createEventMapping(eventSourceUrl: string, body: EventMapping): Observable<any> {
    return this._http.post<any>(this.getEventMapping(eventSourceUrl), body);
  }

  addMeasure(eventSourceUrl: string, body: MeasureSpecification): Observable<any> {
    return this._http.post<any>(this.getMeasureSpecification(eventSourceUrl), body);
  }

  getAllEventTags(eventSourceUrl: string): Observable<any> {
    return this._http.get<any>(this.getEventTag(eventSourceUrl));
  }

  private getEventStreams(eventSourceId: string) {
    return `${getHostUrl()}:3001/eventhub/discoverEventStreams?eventSourceId=${eventSourceId}`;
  }

  private getEventSource(eventSourceUrl: string) {
    return `${getHostUrl()}:3001/eventcollector/eventsources?source=${eventSourceUrl}`;
  }

  private getEventTag(eventSourceUrl: string) {
    return `${getHostUrl()}:3001/measurebuilder/eventqualifiers`;
  }

  private getEventMapping(eventSourceUrl: string) {
    return `${getHostUrl()}:3001/measurebuilder/eventmapping`;
  }

  private getMeasureSpecification(eventSourceUrl: string) {
    return `${getHostUrl()}:3001/eventtranslator/measurespecification`;
  }
}
