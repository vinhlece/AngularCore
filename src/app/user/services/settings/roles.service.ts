import {HttpClient} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {Role} from '../../../common/models/index';
import {uuid} from '../../../common/utils/uuid';
import {AppConfigService} from '../../../app.config.service';

@Injectable()
export class RolesService {

  private _httpClient;
  private get _baseUrl() {
    return this.getBaseUrl();
  }
  private _appConfigService: AppConfigService;

  constructor(httpClient: HttpClient, appConfigService: AppConfigService) {
    this._httpClient = httpClient;
    this._appConfigService = appConfigService;
  }

  getBaseUrl() {
    return `${this._appConfigService.config.apiEndPoint}/roles/`;
  }

  getAllRoles(): Observable<Role[]> {
    return this._httpClient.get(`${this._baseUrl}`);
  }

  createRole(name: string): Observable<any> {
    const newRole = {
      id: uuid(),
      name: name
    };
    return this._httpClient.post(this._baseUrl, newRole);
  }

  updateRole(role: Role): Observable<any> {
    const url = `${this._baseUrl}${role.id}`;
    return this._httpClient.put(url, role);
  }

  getRole(id: string): Observable<Role> {
    return this._httpClient.get(`${this._baseUrl}${id}`);
  }

  deleteRole(id: string) {
    return this._httpClient
      .delete(this._baseUrl + id)
      .pipe(map(() => id));
  }
}
