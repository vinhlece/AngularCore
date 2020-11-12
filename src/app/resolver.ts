import {Injectable} from '@angular/core';
import { Resolve } from '@angular/router';
import {Observable, of} from 'rxjs';
import {AppConfigService} from './app.config.service';
import {HttpClient} from '@angular/common/http';
import {catchError, map} from 'rxjs/internal/operators';


@Injectable({
  providedIn: 'root'
})
export class Resolver implements Resolve<Observable<any>>{
  constructor(private appConfigService: AppConfigService) { }

  resolve() {
    return this.appConfigService.getJSON();
  }
}
