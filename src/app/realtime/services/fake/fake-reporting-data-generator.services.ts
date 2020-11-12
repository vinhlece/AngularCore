import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ReportingDataGeneratorService} from '..';
import {getHostUrl} from '../../../common/utils/url';
import {StartOptions} from '../../models';

@Injectable()
export class FakeReportingDataGeneratorService implements ReportingDataGeneratorService {
  private _http: HttpClient;

  constructor(http: HttpClient) {
    this._http = http;
  }

  get(options: StartOptions): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const requestOptions = {headers: headers};
    return this._http.post(`${getHostUrl()}:3001/generate`, options, requestOptions);
  }
}
