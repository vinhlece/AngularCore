import {Inject, Injectable} from '@angular/core';
import {IRealTimeFactoryService, RealTimeService} from '../index';
import {FakeSocketRealTimeService} from './fake-real-time.services';
import {DataMapperService} from '../http/data-mapper.services';
import {AppConfigService} from '../../../app.config.service';
import {RECONNECT_DELAY} from '../tokens';
import {Store} from '@ngrx/store';
import * as fromRealTime from '../../reducers/index';

@Injectable()
export class FakeRealTimeFactoryService implements IRealTimeFactoryService {
  private _dataMapper: DataMapperService;
  private _configService: AppConfigService;
  private _reConnectDelay: number;
  private _store: Store<fromRealTime.State>;

  constructor(dataMapper: DataMapperService,
              appConfigService: AppConfigService,
              @Inject(RECONNECT_DELAY) reConnectDelay: number,
              store: Store<fromRealTime.State>) {
    this._configService = appConfigService;
    this._dataMapper = dataMapper;
    this._reConnectDelay = reConnectDelay;
    this._store = store;
  }

  createRealTimeService(): RealTimeService {
    return new FakeSocketRealTimeService(this._configService, this._dataMapper, this._reConnectDelay, this._store);
  }
}
