import {Inject, Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {WebSocketSubscription} from '../../models/web-socket/widget-container';
import {ISubscriptionService} from '../index';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {getHostUrl} from '../../../common/utils/url';

@Injectable()
export class FakeSubscriptionServices implements ISubscriptionService {
  private _http: HttpClient;

  constructor(http: HttpClient) {
    this._http = http;
  }

  add(subscription: WebSocketSubscription): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const requestOptions = {headers: headers};
    return this._http.post(`${getHostUrl()}:3001/subscription`, subscription, requestOptions);
  }

  remove(subscription: WebSocketSubscription): Observable<string> {
    return of(subscription.id);
  }

  update(websocketSubscription: WebSocketSubscription): Observable<any> {
    return of(websocketSubscription);
  }

  pumpup(subscription: WebSocketSubscription): Observable<any> {
    return of(subscription);
  }
}
