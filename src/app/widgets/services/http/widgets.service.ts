import {HttpClient} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Widget} from '../../models';
import {AppConfigService} from '../../../app.config.service';

@Injectable()
export class WidgetService {
  private static readonly PATH = 'widgets';

  private _http: HttpClient;
  private _configService: AppConfigService;
  private get _widgetsUrl() {
    return this.buildWidgetsUrl();
  }

  constructor(http: HttpClient, appConfigService: AppConfigService) {
    this._http = http;
    this._configService = appConfigService;
  }

  getAll(userId: string): Observable<Widget[]> {
    const path = `${this._widgetsUrl}?userId=${userId}`;
    return this._http.get<Widget[]>(path);
  }

  get(id: string): Observable<Widget> {
    const path = `${this._widgetsUrl}/${id}`;
    return this._http.get<Widget>(path);
  }

  findByName(userId: string, name: string): Observable<Widget[]> {
    return this.getAll(userId).pipe(
      map((widgets: Widget[]) => {
        return widgets.filter((widget: Widget) => {
          return widget.name.toLowerCase().includes(name.toLowerCase());
        });
      })
    );
  }

  add(widget: Widget): Observable<any> {
    return this._http.post(this._widgetsUrl, widget);
  }

  update(widget: Widget): Observable<Widget> {
    const path = `${this._widgetsUrl}/${widget.id}`;
    return this._http.put<Widget>(path, widget);
  }

  remove(id: string): Observable<string> {
    const path = `${this._widgetsUrl}/${id}`;
    return this._http.delete(path).pipe(map(() => id));
  }

  private buildWidgetsUrl() {
    return `${this._configService.config.apiEndPoint}/${WidgetService.PATH}`;
  }
}
