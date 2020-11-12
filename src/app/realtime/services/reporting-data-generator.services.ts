import {HttpClient, HttpParams} from '@angular/common/http';
import {Inject, Injectable, Optional} from '@angular/core';
import {Observable} from 'rxjs';
import {ReportingDataGeneratorService} from './';
import {AGENT_PERFORMANCE, AGENT_STATUS, QUEUE_STATUS} from '../../measures/models/constants';
import {QUEUE_PERFORMANCE} from '../../measures/models/constants';
import {StartOptions} from '../models';
import {Logger} from '../../logging/services/index';
import {LOGGER} from '../../logging/services/tokens';
import {getCurrentMoment} from '../../common/services/timeUtils';
import {AppDateTimeFormat} from '../../common/models/enums';
import {tap} from 'rxjs/internal/operators';
import {DefaultLogger} from '../../logging/services/logger';
import {AppConfigService} from '../../app.config.service';
@Injectable()
export class ReportingDataGeneratorServiceImpl implements ReportingDataGeneratorService {
  private _http: HttpClient;
  private _configService: AppConfigService;
  private get _baseUrl() {
    return this.getBaseUrl();
  }
  private _logger: Logger;

  constructor(http: HttpClient, appConfigService: AppConfigService,
              @Optional() @Inject(LOGGER) logger: Logger) {
    this._http = http;
    this._configService = appConfigService;
    this._logger = logger || new DefaultLogger();
  }

  get(options: StartOptions): Observable<any> {
    const {startDate, endDate, clientId, dimensions, measure, windowType, windowName} = options;
    const url = `${this._baseUrl}/getMetrics?ClientId=${clientId}&StartDate=${startDate}&EndDate=${endDate}&Dimensions=${dimensions}&Measure=${measure}&WindowType=${windowType}&WindowName=${windowName}`;
    // this._logger.info('-------------------------------------------------------------');
    this._logger.info(`[PUMP-UP Request] [${measure}] Start at: ` + getCurrentMoment().format(AppDateTimeFormat.dateTime));
    const pStart = performance.now();
    return this._http.get(url).pipe(
      tap(() => {
        this._logger.info(`[PUMP-UP Request] [${measure}] End at: ${getCurrentMoment().format(AppDateTimeFormat.dateTime)}, Spend time: ${(performance.now() - pStart)}`);
      })
    );
  }

  getAgentPerformance(agentId: string, startDate: number, endDate: number, clientId: string): Observable<any> {
    const packageName = 'agent_performance';
    const url = `${this._baseUrl}/getQueueStatistics?QueueID=${agentId}&Package=${packageName}&StartDate=${startDate}&EndDate=${endDate}&ClientId=${clientId}`;
    this._logger.info('-------------------------------------------------------------');
    this._logger.info(`[PUMP-UP Request] [AGENT_PERFORMANCE] Start at: ` + getCurrentMoment().format(AppDateTimeFormat.dateTime));
    const pStart = performance.now();
    return this._http.get(url).pipe(
      tap(() => {
        this._logger.info(`[PUMP-UP Request] [AGENT_PERFORMANCE] End at: ` + getCurrentMoment().format(AppDateTimeFormat.dateTime));
        this._logger.info(`[PUMP-UP Request] [AGENT_PERFORMANCE] Spend time: ` + (performance.now() - pStart));
      })
    );
  }

  getAgentStatus(agentId: string, startDate: number, endDate: number, clientId: string): Observable<any> {
    const packageName = 'agent_status';
    const url = `${this._baseUrl}/getQueueStatistics?QueueID=${agentId}&Package=${packageName}&StartDate=${startDate}&EndDate=${endDate}&ClientId=${clientId}`;
    this._logger.info('-------------------------------------------------------------');
    this._logger.info(`[PUMP-UP Request] [AGENT_STATUS] Start at: ` + getCurrentMoment().format(AppDateTimeFormat.dateTime));
    const pStart = performance.now();
    return this._http.get(url).pipe(
      tap(() => {
        this._logger.info(`[PUMP-UP Request] [AGENT_STATUS] End at: ` + getCurrentMoment().format(AppDateTimeFormat.dateTime));
        this._logger.info(`[PUMP-UP Request] [AGENT_STATUS] Spend time: ` + (performance.now() - pStart));
      })
    );
  }

  getQueueStatus(queueId: string, startDate: number, endDate: number, clientId: string): Observable<any> {
    const packageName = 'queue_status';
    const url = `${this._baseUrl}/getQueueStatistics?QueueID=${queueId}&Package=${packageName}&StartDate=${startDate}&EndDate=${endDate}&ClientId=${clientId}`;
    this._logger.info('-------------------------------------------------------------');
    this._logger.info(`[PUMP-UP Request] [QUEUE_STATUS] Start at: ` + getCurrentMoment().format(AppDateTimeFormat.dateTime));
    const pStart = performance.now();
    return this._http.get(url).pipe(
      tap(() => {
        this._logger.info(`[PUMP-UP Request] [QUEUE_STATUS] End at: ` + getCurrentMoment().format(AppDateTimeFormat.dateTime));
        this._logger.info(`[PUMP-UP Request] [QUEUE_STATUS] Spend time: ` + (performance.now() - pStart));
      })
    );
  }

  getQueuePerformance(queueId: string, startDate: number, endDate: number, clientId: string): Observable<any> {
    const packageName = 'queue_performance';
    const url = `${this._baseUrl}/getQueueStatistics?QueueID=${queueId}&Package=${packageName}&StartDate=${startDate}&EndDate=${endDate}&ClientId=${clientId}`;
    this._logger.info('-------------------------------------------------------------');
    this._logger.info(`[PUMP-UP Request] [QUEUE_PERFORMANCE] Start at: ` + getCurrentMoment().format(AppDateTimeFormat.dateTime));
    const pStart = performance.now();
    return this._http.get(url).pipe(
      tap(() => {
        this._logger.info(`[PUMP-UP Request] [QUEUE_PERFORMANCE] End at: ` + getCurrentMoment().format(AppDateTimeFormat.dateTime));
        this._logger.info(`[PUMP-UP Request] [QUEUE_PERFORMANCE] Spend time: ` + (performance.now() - pStart));
      })
    );
  }

  getBaseUrl() {
    return this._configService.config.reportingDataGeneratorEndPoint;
  }
}
