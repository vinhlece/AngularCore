import {HttpClient, HttpParams} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AppConfig} from '../../../config/app.config';
import {Subscription} from '../../models/index';
import {ReportingDataSubscriptionService} from '../index';
import {AppConfigService} from '../../../app.config.service';

@Injectable()
export class ReportingDataSubscriptionServiceImpl implements ReportingDataSubscriptionService {
  private _http: HttpClient;
  private _configService: AppConfigService;
  private get _baseUrl() {
    return this.getBaseUrl();
  }

  constructor(http: HttpClient, appConfigService: AppConfigService) {
    this._http = http;
    this._configService = appConfigService;
  }

  addNewPackage(packageName: string, topicName: string): Observable<any> {
    const params = new HttpParams();
    const responseType: 'text' = 'text';
    const options = {responseType};
    return this._http.post(`${this._baseUrl}addNewPackage/?Package Name=${packageName}&Topic Name=${topicName}`, {params: params}, options);
  }

  makeSubscriptionToPackage(userName: string, packageName: string): Observable<Subscription> {
    const params = new HttpParams();
    const url = `${this._baseUrl}makeSubscriptionToPackage/?User Name=${userName}&Package=${packageName}`;
    return this._http.post<Subscription>(url, {params: params});
  }

  getBaseUrl() {
    return this._configService.config.reportingDataSubscriptionEndPoint;
  }
}
