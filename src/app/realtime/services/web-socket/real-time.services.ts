import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {RealTimeService} from '..';
import {RealtimeData, Topic} from '../../models';
import {WebSocketSubscription} from '../../models/web-socket/widget-container';
import {AppConfigService} from '../../../app.config.service';
import {StompClient} from './stomp-client';
import {DataMapperService} from '../http/data-mapper.services';
import {Store} from '@ngrx/store';
import * as fromRealTime from '../../reducers/index';

@Injectable()
export class SocketRealTimeService implements RealTimeService {
  private _isSubscribed: boolean;
  private get _baseUrl() {
    return this.getBaseUrl();
  }
  private _dataSubject = new Subject<RealtimeData[]>();
  private _statusContSubject = new Subject<any>();
  private _registrationSubject = new Subject<WebSocketSubscription>();
  private _stompClients: StompClient[] = [];
  private _appConfigService: AppConfigService;
  private _dataMapper: DataMapperService;
  private _reConnectDelay: number;
  private _store: Store<fromRealTime.State>;

  constructor(appConfigService: AppConfigService,
              dataMapper: DataMapperService,
              reConnectDelay: number,
              store: Store<fromRealTime.State>) {
    this._appConfigService = appConfigService;
    this._dataMapper = dataMapper;
    this._reConnectDelay = reConnectDelay;
    this._store = store;
  }

  getData(topic: Topic): Observable<RealtimeData[]> {
    return this._dataSubject;
  }

  getStatusConnection(): Observable<string> {
    return this._statusContSubject;
  }

  destroyConsumer(): Observable<any> {
    const subject = new Subject<void>();

    this._stompClients.forEach(item => item.disconnect(subject));
    this._stompClients = [];
    return subject;
  }

  isSubscribed(): boolean {
    return true;
  }

  initConsumer() {
    this.addStompClient();
  }
  getConsumerRegistrationInfo() {
    return this._registrationSubject;
  }

  protected getBaseUrl() {
    return this._appConfigService.config.webSocket;
  }

  private addStompClient() {
    const stompClient = new StompClient(this._dataSubject, this._statusContSubject, this._registrationSubject, this._dataMapper, this._baseUrl, this._reConnectDelay, this._store);
    this._stompClients.push(stompClient);
  }
}

export interface Message {
  key: string;
  value: string;
  partition: number;
  offset: number;
}

const AUTO_OFFSET_RESET_SMALLEST = 'smallest';
const AUTO_OFFSET_RESET_LARGEST = 'largest';
