import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Dashboard} from '../../models';
import {AppConfigService} from '../../../app.config.service';
import {InstanceColor} from '../../../common/models/index';

@Injectable()
export class InstanceColorService {
  private _appConfigService: AppConfigService;
  private get _connectionString() {
    return this.getConnectionString();
  }
  private _jsonServer: HttpClient;

  constructor(server: HttpClient, appConfigService: AppConfigService) {
    this._jsonServer = server;
    this._appConfigService = appConfigService;
  }

  public get(id: string): Observable<any> {
    return this._jsonServer.get<any>(this._connectionString + id);
  }

  public add(db: any): Observable<any> {
    return this._jsonServer.post<any>(this._connectionString, db);
  }

  public update(id: string, data: InstanceColor[]) {
    const newData = {
      id: `${id}`,
      instances: data
    }
    return this._jsonServer.put<any>(this._connectionString + id, newData);
  }

  getConnectionString() {
    return `${this._appConfigService.config.apiEndPoint}/instanceColors/`;
  }
}
