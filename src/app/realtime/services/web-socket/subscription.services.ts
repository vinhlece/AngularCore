import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {Observable, of, timer} from 'rxjs';
import {map} from 'rxjs/operators';
import {WebSocketSubscription} from '../../models/web-socket/widget-container';
import {AppConfigService} from '../../../app.config.service';
import {ISubscriptionService} from '../index';
import {tap} from 'rxjs/internal/operators';
import * as _ from 'lodash';
import {Widget} from '../../../widgets/models/index';

@Injectable()
export class SubscriptionService implements ISubscriptionService {
  private _httpClient: HttpClient;
  private _configService: AppConfigService;
  private get _baseURL() {
    return this.getBaseUrl();
  }
  private _httpOptions;

  constructor(httpClient: HttpClient, appConfigService: AppConfigService) {
    this._httpClient = httpClient;
    this._configService = appConfigService;
    this._httpOptions = {
      headers: new HttpHeaders({
        'Content-Type' : 'application/json',
        'reporting_token' : 'I--am&&kdfA-gToken'
      })
    };
  }

  add(subscription: WebSocketSubscription): Observable<any> {
    if (this._configService.config) {
      return this._httpClient.post(this.getURL(), subscription, this._httpOptions);
    }
    // Work-around for waiting app configuration is loaded in real time module
    return new Observable<any>((observer) => {
      const timer$ = timer(100, 100);
      const subscriber = timer$.subscribe(t => {
        if (this._configService.config) {
          this._httpClient.post(this.getURL(), subscription, this._httpOptions).pipe(
            tap(response => {
              observer.next(response);
              observer.complete();
            })
          ).subscribe();
          subscriber.unsubscribe();
        }
      });
    });
  }

  remove(subscription: WebSocketSubscription): Observable<string> {
    return this._httpClient
      .delete(this.getURL() + '/' + subscription.id)
      .pipe(map(() => subscription.id));
  }

  update(websocketSubscription: WebSocketSubscription): Observable<any> {
    return this._httpClient.put(this.getURL() + '/' + websocketSubscription.id, websocketSubscription);
  }

  pumpup(subscription: WebSocketSubscription): Observable<any> {
    const url = '';
    return this._httpClient.get(url);
  }

  getBaseUrl() {
    return this._configService.config.webSocket;
  }

  private getURL() {
    return `${this._baseURL}subscriptionfilter/subscriptions`;
  }
}
