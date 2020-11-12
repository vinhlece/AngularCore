import {Subject} from 'rxjs/index';
import {RealtimeData} from '../../models/index';
import * as SockJS from 'sockjs-client';
import * as stomp from 'stompjs/lib/stomp';
import {DataMapperService} from '../http/data-mapper.services';
import {WebSocketSubscription} from '../../models/web-socket/widget-container';
import {ReconnectDelayTime} from '../../config/index';
import {uuid} from '../../../common/utils/uuid';
import {Store} from '@ngrx/store';
import * as fromRealTime from '../../reducers';
import {ResetData} from '../../actions/web-socket/real-time-client.action';
import {WindowNames} from '../../../common/models/constants';

export class StompClient {
  private _dataSubject: Subject<RealtimeData[]>;
  private _statusContSubject: Subject<string>;
  private _registrationSubject: Subject<WebSocketSubscription>;
  private _dataMapper: DataMapperService;
  private _baseUrl: string;
  private _stompClient: any;
  private _reConnectTime: number = 0;
  private _delayTime = ReconnectDelayTime;
  private _reConnectDelay: number = 0;
  private _store: Store<fromRealTime.State>;
  private _sessionId: any = null;

  constructor (dataSubject: Subject<RealtimeData[]>,
               statusContSubject: Subject<string>,
               registrationSubject: Subject<WebSocketSubscription>,
               dataMapper: DataMapperService,
               baseUrl: string,
               reConnectDelay: number,
               store: Store<fromRealTime.State>) {
    this._dataSubject = dataSubject;
    this._statusContSubject = statusContSubject;
    this._registrationSubject = registrationSubject;
    this._dataMapper = dataMapper;
    this._baseUrl = baseUrl;
    this._reConnectDelay = reConnectDelay;
    this._store = store;
    this.init();
  }

  init() {
    const onOpen = () => this.onOpen();
    const onClose = (error) => this.onClose(error);
    const protocols = {transports: ['websocket']};
    const opt = {debug: false, devel: false};
    const socket = new SockJS(`${this._baseUrl}subscriptionpublisher/ws`, opt, protocols);
    this._stompClient = stomp.Stomp.over(socket);
    this._stompClient.debug = null;
    this._stompClient.connect({}, onOpen, onClose);
  }

  onOpen() {
    const onReceived = (event) => this.onReceived(event);
    const onRegister = (event) => this.onRegister(event);
    const onError = (error) => this.onError(error);
    this._stompClient.subscribe(`/user/queue/realtime`, onReceived);
    this._stompClient.subscribe(`/user/queue/historical`, onReceived);
    this._stompClient.subscribe('/user/queue/error', onError);
    this._stompClient.subscribe('/user/queue/registration', onRegister);
    this._stompClient.send('/app/register', {},
      JSON.stringify({token: 'I--am&&kdfA-gToken', subscriptionId: `subscriptionpublisher-${uuid()}`}));
    this._dataSubject.next([]);
  }

  onClose(event) {
    this._store.dispatch(new ResetData());
    if (this._reConnectTime > 9) {
      return;
    }
    this._delayTime *= 2;
    this._reConnectTime ++;
    setTimeout(() => {
      this.init();
    }, this._delayTime - this._reConnectDelay);
    this._statusContSubject.next(this._sessionId ? 'dashboard.placeholder.has_lost' : 'dashboard.placeholder.no_connection');
  }

  onError(error) {
    console.log(error);
  }

  onRegister(event) {
    console.log(event);
    const registeredSubscription = JSON.parse(event.body);
    this._sessionId = registeredSubscription['sessionId'];
    this._registrationSubject.next({
      sessionId: this._sessionId,
    });
  }

  onReceived(event) {
    this._reConnectTime = 0;
    this._delayTime = ReconnectDelayTime;
    const newData = JSON.parse(event.body);
    const data = this.convertReceivedData(newData);
    // log the moment user get data from websocket
    // console.log('Receive data at: ', getCurrentMoment().format(AppDateTimeFormat.dateTime));
    this._dataSubject.next(data);
  }

  disconnect(subject: Subject<void>) {
    this._stompClient.disconnect(() => {
      subject.next();
    });
  }

  private convertReceivedData(data) {
    return data.map(item => {
      return item.callID ? this.getEventData(item) : this.getBasicData(item);
    });
  }

  private getBasicData(item) {
    return {
      instance: item.instance,
      ...this.getCommonData(item)
    };
  }

  private getEventData(item) {
    return {
      ...this.getCommonData(item),
      agent: item.agent,
      queue: item.queue,
      callID: item.callID,
      location: item.location,
      segmentType: item.segmentType
    };
  }

  private getCommonData(item) {
    const window = item.window ? WindowNames.indexOf(item.window.windowType) >= 0 ? item.window.window : item.window.windowType : '';
    return {
      measureName: item.measureName,
      measureTimestamp: item.messageSourceTimestamp,
      measureValue: item.value,
      dataType: item.packageName,
      metricCalcType: item.metricCalcType,
      dimension: item.dimension,
      window
    };
  }

}
