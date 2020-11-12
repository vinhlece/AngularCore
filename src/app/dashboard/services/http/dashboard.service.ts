import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Dashboard} from '../../models';
import {AppConfigService} from '../../../app.config.service';

@Injectable()
export class DashboardService {
  private _appConfigService: AppConfigService;
  private get _connectionString() {
    return this.getConnectionString();
  }
  private _jsonServer: HttpClient;

  constructor(server: HttpClient, appConfigService: AppConfigService) {
    this._jsonServer = server;
    this._appConfigService = appConfigService;
  }

  public getDashboards(): Observable<Dashboard[]> {
    return this._jsonServer.get<Dashboard[]>(this._connectionString);
  }

  public getDashboardsByUser(userId: string): Observable<Dashboard[]> {
    return this._jsonServer.get<Dashboard[]>(this._connectionString + '?userId=' + userId);
  }

  public getDashboard(id: string): Observable<Dashboard> {
    return this._jsonServer.get<Dashboard>(this._connectionString + '/' + id);
  }

  public getDashboardWithTabs(id: string): Observable<Dashboard> {
    return this._jsonServer.get(this._connectionString + '/' + id + '?_embed=tabs').pipe(
      map((dashboard: Dashboard) => {
        const result: Dashboard = {
          ...dashboard,
          tabs: dashboard.tabs ? dashboard.tabs : []
        };
        result.tabs = result.tabs.map(tab => ({
          ...tab,
          placeholders: tab.placeholders ? tab.placeholders : []
        }));
        return result;
      })
    );
  }

  public addDashboard(db: Dashboard): Observable<Dashboard> {
    return this._jsonServer.post<Dashboard>(this._connectionString, db);
  }

  public deleteDashboard(dashboardId: string): Observable<{}> {
    return this._jsonServer
      .delete(this._connectionString + '/' + dashboardId)
      .pipe(map(() => dashboardId));
  }

  public updateDashboard(dashboard: Dashboard): Observable<{}> {
    return this._jsonServer.put(this._connectionString + '/' + dashboard.id, dashboard);
  }

  getConnectionString() {
    return `${this._appConfigService.config.apiEndPoint}/dashboards`;
  }
}
