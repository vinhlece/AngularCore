import {HttpClient} from '@angular/common/http';
import {Inject, Injectable, Optional} from '@angular/core';
import {IRealTimeFactoryService, RealTimeService} from '.';
import {Logger} from '../../logging/services/index';
import {LOGGER} from '../../logging/services/tokens';
import {DefaultLogger} from '../../logging/services/logger';
import {SocketRealTimeService} from './web-socket/real-time.services';
import {AppConfigService} from '../../app.config.service';
import {DataMapperService} from './http/data-mapper.services';
import {RECONNECT_DELAY} from './tokens';
import {Store} from '@ngrx/store';
import * as fromRealTime from '../reducers/index';

@Injectable()
export class RealTimeFactoryService implements IRealTimeFactoryService {
  private _http: HttpClient;
  private _configService: AppConfigService;
  private _logger: Logger;
  private _dataMapper: DataMapperService;
  private _reConnectDelay: number;
  private _store: Store<fromRealTime.State>;

  constructor(http: HttpClient, appConfigService: AppConfigService,
              @Optional() @Inject(LOGGER) logger: Logger,
              dataMapper: DataMapperService,
              @Inject(RECONNECT_DELAY) reConnectDelay: number,
              store: Store<fromRealTime.State>) {
    this._http = http;
    this._configService = appConfigService;
    this._logger = logger || new DefaultLogger();
    this._dataMapper = dataMapper;
    this._reConnectDelay = reConnectDelay;
    this._store = store;
  }

  createRealTimeService(): RealTimeService {
    return new SocketRealTimeService(this._configService, this._dataMapper, this._reConnectDelay, this._store);
  }
}
