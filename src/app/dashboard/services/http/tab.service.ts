import {HttpClient} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Tab} from '../../models';
import {AppConfigService} from '../../../app.config.service';

@Injectable()
export class TabService {
  private static readonly PATH = 'tabs';
  private httpClient: HttpClient;
  private _appConfigService: AppConfigService;
  private get connectionString() {
    return this.getConnectionString();
  }

  constructor(httpClient: HttpClient, appConfigService: AppConfigService) {
    this.httpClient = httpClient;
    this._appConfigService = appConfigService;
  }

  add(tab: Tab): Observable<any> {
    return this.httpClient.post(this.connectionString, tab);
  }

  remove(id: string): Observable<string> {
    return this.httpClient
      .delete(this.connectionString + '/' + id)
      .pipe(map(() => id));
  }

  update(tab: Tab): Observable<any> {
    return this.httpClient.put(this.connectionString + '/' + tab.id, tab);
  }

  public getTabs(): Observable<Tab[]> {
    return this.httpClient.get<Tab[]>(this.connectionString);
  }

  public get ConnectionString() {
    return this.connectionString;
  }

  getConnectionString() {
    return `${this._appConfigService.config.apiEndPoint}/tabs`;
  }
}
