import {EventSourceService} from '../index';
import {AppConfigService} from '../../../app.config.service';
import {Observable} from 'rxjs/index';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {EventMapping, EventQualifier, MeasureSpecification} from '../../models/index';

@Injectable()
export class EventSourceServiceImpl implements EventSourceService {
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
    return this._http.get<any>(this.getEventStreams(eventSourceId, id));
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

  private getEventStreams(eventSourceId: string, id: string) {
    return `${this.normalizeUrl(eventSourceId)}eventhub/discoverEventStreams?eventSourceId=${id}`;
  }

  private getEventSource(eventSourceUrl: string) {
    return `${this.normalizeUrl(eventSourceUrl)}eventcollector/eventsources`;
  }

  private getEventTag(eventSourceUrl: string) {
    return `${this.normalizeUrl(eventSourceUrl)}measurebuilder/eventqualifiers`;
  }

  private getEventMapping(eventSourceUrl: string) {
    return `${this.normalizeUrl(eventSourceUrl)}measurebuilder/eventmapping`;
  }

  private getMeasureSpecification(eventSourceUrl: string) {
    return `${this.normalizeUrl(eventSourceUrl)}eventtranslator/measurespecification`;
  }

  private normalizeUrl(url: string): string {
    return url.endsWith('/') ? url : `${url}/`;
  }
}
