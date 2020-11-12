import {HttpClient} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Placeholder, Tab} from '../../models';
import {PlaceholdersService} from '../index';
import {AppConfigService} from '../../../app.config.service';

@Injectable()
export class PlaceholdersServiceImpl implements PlaceholdersService {
  private _http: HttpClient;
  private _appConfigService: AppConfigService;
  private get _path() {
    return this.getPath();
  }

  constructor(http: HttpClient, appConfigService: AppConfigService) {
    this._http = http;
    this._appConfigService = appConfigService;
  }

  findById(id: string): Observable<Placeholder> {
    const tabs$ = this._http.get(this._path);
    return tabs$.pipe(
      map((tabs: Tab[]) => {
        const reducer = (accumulator: Placeholder[], currentTab: Tab) => ([...accumulator, ...currentTab.placeholders]);
        const initialValue = [];
        const placeholders = tabs.reduce(reducer, initialValue);
        return placeholders.find((placeholder: Placeholder) => placeholder.id === id);
      })
    );
  }

  getPath() {
    return `${this._appConfigService.config.apiEndPoint}/tabs`;
  }
}
