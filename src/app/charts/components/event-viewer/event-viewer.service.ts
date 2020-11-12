import { Injectable } from "@angular/core";

import { AppConfigService } from '../../../app.config.service'
import * as SockJS from 'sockjs-client';
import * as stomp from 'stompjs/lib/stomp';
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { sampleTime } from "rxjs/operators";

@Injectable()
export class EventViewerService {

  static count = 0;

  static events: Subject<any> = new Subject();
  static eventCount: Subject<number> = new Subject();
  static connection: Subject<string> = new Subject();

  // private monitorPath = 'eventreceiver/events/reportingIn/monitor'
  private monitorPath = 'eventreceiver/events/receiverIn/monitor'
  private _appConfigService: AppConfigService;
  private stompClient;

  constructor(private http: HttpClient, private configService: AppConfigService) {
    this._appConfigService = configService;
  }

  private getBaseUrl() {
    return this._appConfigService.config.webSocket;
  }

  disconnect() {
    this.stompClient.disconnect((msg) => {
      EventViewerService.connection.next('DISCONNECTED');
    });
  }

  getConnectionEvents() {
    return EventViewerService.connection;
  }

  getEventCount() {
    return EventViewerService.eventCount;
  }

  resetEventCount() {
    EventViewerService.count = 0;
  }


  getEvents() {
    return EventViewerService.events.pipe(sampleTime(50));
  }

  connect() {
    const socket = new SockJS(this.getBaseUrl() + 'eventreceiver/live-events');
    this.stompClient = stomp.Stomp.over(socket);
    EventViewerService.count = 0;

    this.http.get(this.getBaseUrl() + this.monitorPath).subscribe(resp => {
        console.log('init service');
    });

    this.stompClient.connect({}, (frame) => {
        this.stompClient.subscribe('/topic/events', onRecieved); 
    }, (error) => {
      console.log('CONNECTOIN LOST');
      EventViewerService.connection.next('DISCONNECTED');
    });
  }
}

  function onRecieved(event) {
    let body = decodeURIComponent(event.body);
    body = body.replace(/\+\+/g,'').replace(/\+\"/g,'\"').replace(/\:\+/g,'\:').replace(/\+\:/g,'\:');
    body = body.replace(/\n/g,'').replace(/\=/g,'');
    body = decodeURIComponent(body);
    console.log('LiveDataService', body);
    EventViewerService.eventCount.next(EventViewerService.count++);
    EventViewerService.events.next(body);
  }
