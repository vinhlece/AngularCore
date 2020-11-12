import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs/index';
import {catchError, tap} from 'rxjs/internal/operators';
import {AppConfig, LogLevel} from './config/app.config';
import * as dashboardsAction from './dashboard/actions/dashboards.action';
import {Store} from '@ngrx/store';
import * as fromDashboards from './dashboard/reducers/index';

@Injectable()
export class AppConfigService {
  public config: AppConfig = null;
  public baseUrl = `${window.location.origin}${window.location.pathname}`;
  public protocol = window.location.protocol;

  constructor(private http: HttpClient, private store: Store<fromDashboards.State>) {}

  public getInitialData() {
    this.getJSON().pipe(
      tap((res: any) => {
        if (res && res.logging && res.logging.level) {
          res.logging.level = LogLevel[res.logging.level.toLowerCase()] || LogLevel.info;
        }
        this.config = {
          ...res,
          assetsUrl: `${this.baseUrl}assets`
        };
        console.log(`-------------------\n App version: ${res.version} \n-------------------`);
        this.store.dispatch(new dashboardsAction.SetAppConfig(this.config));
      }),
      catchError((error: Error) => of(console.log(error)))
    ).subscribe();
  }

  public getJSON(): Observable<any> {
    return this.http.get(`${this.baseUrl}assets/config/AppConfig.json`);
  }
}
