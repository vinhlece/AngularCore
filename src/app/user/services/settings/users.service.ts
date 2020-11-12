import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {User} from '../../models/user';
import {catchError, map} from 'rxjs/internal/operators';
import {AppConfigService} from '../../../app.config.service';

@Injectable()
export class UsersService {
  private _appConfigService: AppConfigService;
  private _httpClient;
  private _configService: AppConfigService;
  private get baseUrl() {
    return `${this._configService.config.apiEndPoint}/users`;
  }

  constructor(httpClient: HttpClient, appConfigService: AppConfigService) {
    this._httpClient = httpClient;
    this._configService = appConfigService;
  }

  getAllUsers(): Observable<User[]> {
    return this._httpClient.get(`${this.baseUrl}`);
  }

  createUser(user: User): Observable<any> {
    return this._httpClient.post(this.baseUrl, user).pipe(catchError(() => of(null)));
  }

  lockRole(user: User): Observable<any> {
    const newUser = {...user, isActive: false};
    return this.updateUser(newUser);
  }

  unlockRole(user: User): Observable<any> {
    const newUser = {...user, isActive: true};
    return this.updateUser(newUser);
  }

  getUser(id: string): Observable<User> {
    return this._httpClient.get(`${this.baseUrl}${id}`);
  }

  deleteUser(id: string) {
    return this._httpClient
      .delete(`${this.baseUrl}/${id}`)
      .pipe(map(() => id));
  }

  getRolesForUser(userId: string) {

  }

  updateUser(user: User): Observable<any> {
    const url = `${this.baseUrl}/${user.id}`;
    return this._httpClient.put(url, user).pipe(catchError(() => of(null)));
  }
}
