import {HttpClient} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {Observable, of, from, throwError} from 'rxjs';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {User} from '../../models/user';
import {AppConfigService} from '../../../app.config.service';
// import { AmplifyService } from 'aws-amplify-angular';
// import { Hub } from 'aws-amplify';
import { environment } from '../../../../environments/environment';

@Injectable()
export class AuthenticationService {
  private _appConfigService: AppConfigService;
  private _httpClient;
  // private _amplifyService: AmplifyService;
  private get baseUrl() {
    return this.getBaseUrl();
  }

  constructor(httpClient: HttpClient, appConfigService: AppConfigService) {
    // amplifyService: AmplifyService
    this._httpClient = httpClient;
    this._appConfigService = appConfigService;
    // this._amplifyService = amplifyService;
  }

  loginUser(userName: string, password: string): Observable<User> {
    // provide temporary means of bypassing auth
    // if (localStorage.getItem('noauth')) {
    // we need selectedPalette to get user color palette
      const user: User = {displayName: 'adminUser', username: userName, password, id: 'xyzw', Session: 'xxxx-bbbb-qwer-qwerqwer', selectedPalette: 'Default 2'};
      return of(user);
    // } else {
    //   return from(this._amplifyService.auth().signIn(userName, password));
    // }
  }

  getUserInfo(userName: string): Observable<any> {
    return this._httpClient.get(this.baseUrl + userName);
  }


  signupUser(userName: string, password: string): Observable<any> {
    const user = {
      id: userName,
      displayName: userName,
      password: password
    };
    return this._httpClient.post(this.baseUrl, user).pipe(catchError(() => of(null)));
  }

  updateUser(user: User): Observable<User> {
    const url = `${this.baseUrl}${user.id}`;
    return this._httpClient.patch(url, user).pipe(catchError(() => of(null)));
  }

  loginBySession(user: User): Observable<any> {
    return  of(user);
  }

  getBaseUrl() {
    return `${this._appConfigService.config.apiEndPoint}/users/`;
  }
}
