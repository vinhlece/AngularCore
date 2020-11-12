import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {map} from 'rxjs/internal/operators';
import {AppConfigService} from '../../../app.config.service';

@Injectable()
export class UserRolesService {
  private _appConfigService: AppConfigService;
  private _httpClient;
  private get _baseUrl() {
    return `${this._appConfigService.config.apiEndPoint}/permissions/`;
  }

  constructor(httpClient: HttpClient, appConfigService: AppConfigService) {
    this._httpClient = httpClient;
    this._appConfigService = appConfigService;
  }

  getRolesForUser(userId: string): Observable<string[]> {
    const url = `${this._baseUrl}${userId}`;
    return of([]);
    // return this._httpClient.get(url).pipe(
    //   tap(permission => {
    //     console.log('permisssions', permission);
    //   }),
    //   map(((permission: any) => permission.roleIds)),
    //   catchError(() => of([]))
    // );
  }

  addRoleForUser(userId: string, roleIds: string[]): Observable<any> {
    const newRoles = {
      id: userId,
      roleIds: roleIds
    };
    return this._httpClient.post(this._baseUrl, newRoles);
  }

  dettachRoleFromUser(userId: string, roleIds: string[]): Observable<any> {
    const updateRoles = {
      id: userId,
      roleIds: roleIds
    };
    const url = `${this._baseUrl}${userId}`;
    return this._httpClient.put(url, updateRoles);
  }
}
