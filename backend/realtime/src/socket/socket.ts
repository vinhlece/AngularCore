import {timer} from 'rxjs';
import {Subject} from 'rxjs/internal/Subject';
import {takeUntil} from 'rxjs/operators';
import {PollingInterval, RealtimeData} from '../../../../src/app/realtime/models';
import {SampleDataGenerator} from '../../../../src/app/realtime/services/fake/sample-data-generator';
import {DataCache} from '../models/global';
import {POLLING_TIME_CONFIG} from '../../../../src/app/realtime/services/tokens';
import {Inject} from '@angular/core';
import {uuid} from '../../../../src/app/common/utils/uuid';

export class Socket {
  private _context: DataCache;
  private _stop$ = new Subject<void>();
  private _pollingInterval: PollingInterval;
  private _subscriptions = {};
  private _lf = '\x0A';
  private _registrationChannel = '/user/queue/registration';
  private _historicalChannel = '/user/queue/historical';
  private _realTimeChannel = '/user/queue/realtime';
  private _errorChannel = '/user/queue/error';
  private _registerChannel = '/app/register';
  private _timer: any;
  private _maxMessageSize = 5000;
  private _index = -1;

  constructor(sampleRealTimeDataService: SampleDataGenerator,
              @Inject(POLLING_TIME_CONFIG) pollingInterval: PollingInterval) {
    this._context = DataCache.getInstance(sampleRealTimeDataService);
    this._pollingInterval = pollingInterval;
  }

  start() {
    const express = require('express');
    const sockjs = require('sockjs');
    const http = require('http');
    const self = this;

    // 1. Setup SockJS server
    const sockjs_opts = {sockjs_url: 'http://cdn.sockjs.org/sockjs-0.3.min.js'};
    const service = sockjs.createServer(sockjs_opts);
    service.on('connection', function (conn) {
      if (!conn) {
        return;
      }
      const connectionMsg = `CONNECTED${self._lf}version:1.1${self._lf}heart-beat:10000,10000${self._lf}${self._lf}${conn.id} has conntected`;
      console.log(connectionMsg);
      conn.write(connectionMsg);
      conn.on('data', function (message) {
        if (message === `${self._lf}`) {
          conn.write(`${self._lf}`);
          return;
        }
        const data = self.unmarshallData(message);
        if (!data || !data.headers) {
          return;
        }
        self.saveSubIdentify(conn.prefix, data);
        if (data.headers.destination === self._registerChannel && data.body) {
          const subscription = JSON.parse(data.body);
          let subId = self._subscriptions[conn.prefix][self._registrationChannel];
          const newSubscription = {...subscription, sessionId: uuid()};
          conn.write(self.buildMessage(self._registrationChannel, subId, newSubscription));
          if (!self._timer) {
            const {initialDelay, timerInterval} = self._pollingInterval;
            self._timer = timer(initialDelay, timerInterval)
              .pipe(takeUntil(self._stop$))
              .subscribe(() => {
                const topics = Object.keys(self._context.rangeByTopics);
                if (topics.length > 0) {
                  self.calculateNextTopic(topics);
                  const topic = topics[self._index];
                  const subRealTime = self._context.getDataOfTopic(topic).subscribe((realTimeData: RealtimeData[]) => {
                    const newData = realTimeData.map((item: RealtimeData) => {
                      const basicData = {
                        instance: item.instance,
                        measureName: item.measureName,
                        value: item.measureValue,
                        packageName: item.dataType,
                        messageSourceTimestamp: item.measureTimestamp,
                        metricCalcType: item.metricCalcType,
                        dimension: item.dimension,
                        userId: null,
                        window: item.window
                      };
                      if (item.callID) {
                        delete basicData.instance;
                        return {
                          ...basicData,
                          agent: item.agent,
                          queue: item.queue,
                          callID: item.callID,
                          // location: item.location,
                          segmentType: item.segmentType
                        };
                      }
                      return basicData;
                    });
                    if (!self._context.rangeByTopics[topic]) {
                      return;
                    }
                    const prefix = '/subscriptionpublisher/ws';
                    if (!self._subscriptions[prefix]) {
                      return;
                    }
                    subId = self._subscriptions[prefix][self._realTimeChannel];
                    conn.write(self.buildMessage(self._realTimeChannel, subId, newData));
                    if (subRealTime != null) {
                      subRealTime.unsubscribe();
                    }
                    // const maxSize = Math.ceil(realTimeData.length / self._maxMessageSize);
                    // for (let i = 0; i < maxSize; i++) {
                    //   const index = i * self._maxMessageSize;
                    //   const msg = realTimeData.slice(index, index + self._maxMessageSize);
                    //   conn.write(self.buildMessage(self._realTimeChannel, subId, msg));
                    // }
                  });
                }
              });
          }
        }
      });

      conn.on('close', function (data) {
        console.log(`disconnect with data: [${data}]`);
        self._stop$.next();
        self._context.deleteCacheData();
        self._subscriptions = {};
        self._timer = null;
      });
    });

    // 2. Express server
    const app = http.createServer(express());
    service.installHandlers(app, {prefix: '/subscriptionpublisher/ws'});

    console.log(' [*] Listening on localhost:3002');
    app.listen(3002);
  }

  calculateNextTopic(topics: String[]) {
    if (this._index >= topics.length - 1) {
      this._index = 0;
    } else if (this._index < 0) {
      this._index = 0;
    } else {
      this._index += 1;
    }
  }

  convertDataType(packageName: any): string {
    switch (packageName) {
      case 'Queue Status':
        return '/queuestatus/ws';
      case 'Queue Performance':
        return '/queueperformance/ws';
      case 'Agent Status':
        return '/agentstatus/ws';
      case 'Agent Performance':
        return '/agentperformance/ws';
      default:
        return null;
    }
  }

  buildMessage(channel: string, subId: string, body: any): string {
    const data = JSON.stringify(body);
    return `MESSAGE${this._lf}destination:${channel}${this._lf}content-type:application/json;charset=UTF-8${this._lf}subscription:${subId}${this._lf}content-length:${data.length}${this._lf}${this._lf}${data}`;
  }

  saveSubIdentify(prefix: string, data: any) {
    if (data.headers.destination === this._registrationChannel || data.headers.destination === this._realTimeChannel ||
      data.headers.destination === this._historicalChannel || data.headers.destination === this._errorChannel) {
      if (!this._subscriptions[prefix]) {
        this._subscriptions[prefix] = {};
      }
      this._subscriptions[prefix][data.headers.destination] = data.headers.id;
    }
  }

  unmarshallData(data): any {
    const self = this;
    let body, command, divider, headerLines, headers, idx, len, line, start, trim, _i, _len, _ref;
    divider = data.search(RegExp('' + self._lf + self._lf));
    headerLines = data.substring(0, divider).split(self._lf);
    command = headerLines.shift();
    headers = {};
    trim = function (str) {
      return str.replace(/^\s+|\s+$/g, '');
    };
    _ref = headerLines.reverse();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      line = _ref[_i];
      idx = line.indexOf(':');
      headers[trim(line.substring(0, idx))] = trim(line.substring(idx + 1));
    }
    body = '';
    start = divider + 2;
    if (headers['content-length']) {
      len = parseInt(headers['content-length'], 0);
      body = ('' + data).substring(start, start + len);
    }
    return {command, headers, body};
  }
}
