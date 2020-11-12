import { Injectable } from "@angular/core";

import { AppConfigService } from '../../../app.config.service'
import * as SockJS from 'sockjs-client';
import * as stomp from 'stompjs/lib/stomp';
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";

@Injectable()
export class EventViewerService {

  private monitorPath = 'eventreceiver/events/receiverIn/monitor'
  private events: Subject<any> = new Subject();
  private _appConfigService: AppConfigService;

  constructor(private http: HttpClient, private configService: AppConfigService) {
    this._appConfigService = configService;
  }

  private getBaseUrl() {
    return this._appConfigService.config.webSocket;
  }

  getEvents() {
    return this.events.asObservable();
  }

  connect() {
    
    const socket = new SockJS(this.getBaseUrl() + 'eventreceiver/live-events');
    const stompClient = stomp.Stomp.over(socket);

    this.http.get(this.getBaseUrl() + this.monitorPath).subscribe(resp => {
        console.log('init service');
    });


    stompClient.connect({}, (frame) => {
        stompClient.subscribe('/topic/events', (event) => {
          let body = decodeURIComponent(event.body);
          body = body.replace(/\+\+/g,'').replace(/\+\"/g,'\"').replace(/\:\+/g,'\:').replace(/\+\:/g,'\:');
          body = body.replace(/\n/g,'').replace(/\=/g,'');
          body = decodeURIComponent(body);
          console.log('LiveDataService', body);
          this.events.next(body);
        });
    });
  }

}