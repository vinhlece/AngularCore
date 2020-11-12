import {HttpClient} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {ColorPalette} from '../../../common/models/index';
import {uuid} from '../../../common/utils/uuid';
import {AppConfigService} from '../../../app.config.service';

@Injectable()
export class UserPaletteService {
  private _appConfigService: AppConfigService;
  private _httpClient;
  private get baseUrl() {
    return this.getBaseUrl();
  }

  constructor(httpClient: HttpClient, appConfigService: AppConfigService) {
    this._httpClient = httpClient;
    this._appConfigService = appConfigService;
  }

  getColorPalette(userId: string): Observable<ColorPalette[]> {
    return this._httpClient.get(`${this.baseUrl}?userid=${userId}`);
  }

  addColorPalette(colorPalette: ColorPalette): Observable<any> {
    colorPalette.id = uuid();
    return this._httpClient.post(this.baseUrl, colorPalette).pipe(catchError(() => of(null)));
  }

  updateColorPalette(colorPalette: ColorPalette): Observable<any> {
    const url = `${this.baseUrl}${colorPalette.id}`;
    return this._httpClient.put(url, colorPalette).pipe(catchError(() => of(null)));
  }

  getPaletteById(id: string): Observable<ColorPalette> {
    return this._httpClient.get(`${this.baseUrl}${id}`);
  }
  deletePaletteById(paletteId: string) {
    return this._httpClient
      .delete(this.baseUrl + paletteId)
      .pipe(map(() => paletteId));
  }

  getBaseUrl() {
    return `${this._appConfigService.config.apiEndPoint}/palettes/`;
  }
}
