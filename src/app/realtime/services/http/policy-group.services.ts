import {HttpClient, HttpParams} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {PolicyGroup, ActionPolicy, PolicyInfo} from '../../models/index';
import {KPIService} from '../index';
import {AppConfigService} from '../../../app.config.service';

@Injectable()
export class KPIServiceImpl implements KPIService {
  private _http: HttpClient;
  private _configService: AppConfigService;
  private get _baseUrl() {
    return this.getBaseUrl();
  }

  constructor(http: HttpClient, appConfigService: AppConfigService) {
    this._http = http;
    this._configService = appConfigService;
  }

  initialize(actionPolicy: ActionPolicy[], policyInfo: PolicyInfo): Observable<any> {
    const url = this.getKpisUrl(policyInfo);
    return this._http.post<PolicyGroup[]>(url, actionPolicy);
  }

  get(policyInfo: PolicyInfo): Observable<PolicyGroup> {
    const url = this.getKpisUrl(policyInfo);
    return this._http.get<any>(url);
  }

  getBaseUrl() {
    return `${this._configService.config.fqdn}jane-action-policy-admin/kpis`;
  }

  getKpisUrl(policyInfo: PolicyInfo) {
    return `${this._baseUrl}?instance=${policyInfo.instance}&measure=${policyInfo.measure}&window=${policyInfo.windowName}&windowType=${policyInfo.windowType}`;
  }
}
