import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {select, Store} from '@ngrx/store';
import {Observable, of} from 'rxjs';
import {catchError, filter, flatMap, map, tap, withLatestFrom} from 'rxjs/operators';
import * as urlsActions from '../actions/urls.actions';
import * as fromDashboards from '../reducers';
import {HttpClient} from '@angular/common/http';
import {Url} from '../../widgets/models';
import {PlotPoint} from '../models';
import { MatDialog } from '@angular/material/dialog';
import {InvokeUrlContainer} from '../containers/invoke-url/invoke-url.container';
import {isNullOrUndefined} from 'util';

@Injectable()
export class UrlsEffects {
  private _actions$: Actions;
  private _store: Store<fromDashboards.State>;
  private _http: HttpClient;
  private _dialogService: MatDialog;
  private readonly REGEX = /\$.*?(&|$)/g;

  @Effect() invoke$: Observable<any>;
  @Effect() manualInvoke$: Observable<any>;
  @Effect() autoInvoke$: Observable<any>;

  constructor(action: Actions, store: Store<fromDashboards.State>, http: HttpClient, dialogService: MatDialog) {
    this._actions$ = action;
    this._store = store;
    this._http = http;
    this._dialogService = dialogService;

    this.invokeEffect();
    this.manualInvokeEffect();
    this.autoInvokeEffect();
  }

  invokeEffect() {
    this.invoke$ = this._actions$.pipe(
      ofType(urlsActions.INVOKE),
      flatMap((action: urlsActions.Invoke) => {
        const url = action.payload;
        return this._http.get(url.baseUrl).pipe(
          map((data) => new urlsActions.InvokeSuccess({url, data})),
          catchError((error: Error) => of(new urlsActions.InvokeFailure(url, error)))
        );
      })
    );
  }

  manualInvokeEffect() {
    this.manualInvoke$ = this._actions$.pipe(
      ofType(urlsActions.MANUAL_INVOKE),
      withLatestFrom(this._store.pipe(select(fromDashboards.getPlotPoint))),
      map(([action, point]) => this.getManualUrl((action as urlsActions.Invoke).payload, point)),
      filter((url: Url) => !isNullOrUndefined(url)),
      tap(() => {
        this._dialogService.open(InvokeUrlContainer, {width: '600px'});
        this._dialogService.afterAllClosed.subscribe(_ => {
          this._store.dispatch(new urlsActions.InvokeCompleted());
        });
      }),
      map((url: Url) => {
        return new urlsActions.Invoke(url);
      })
    );
  }

  autoInvokeEffect() {
    this.autoInvoke$ = this._actions$.pipe(
      ofType(urlsActions.AUTO_INVOKE),
      map((action) => this.getAutoUrl((action as urlsActions.AutoInvoke).payload)),
      filter((url: Url) => !isNullOrUndefined(url)),
      map((url: Url) => {
        console.log('send request to: ' + url.baseUrl);
        return new urlsActions.Invoke(url);
      })
    );
  }

  private getManualUrl(widget: any, point: PlotPoint): Url {
    if (!widget.urls || widget.id !== point.widgetId) {
      return null;
    }
    const result = widget.urls.find((url: Url) => url.measure === point.measure);
    if (result) {
      return {
        ...result,
        baseUrl: this.includeParamsToURL(result.baseUrl, {...point.otherParams, instance: point.instance})
      };
    }
    return result;
  }

  private getAutoUrl(data: any): Url {
    if (!data.widget.urls || !data.event) {
      return null;
    }
    const result = data.widget.urls.find((url: Url) => url.measure === data.event.measureName);
    if (result) {
      return {
        ...result,
        baseUrl: this.includeParamsToURL(result.baseUrl, data.event.otherParams)
      };
    }
    return result;
  }

  private includeParamsToURL(baseUrl: string, params: Object): string {
    let result = baseUrl;
    const parameters = baseUrl.match(this.REGEX);
    if (parameters) {
      parameters.forEach(item => {
        let param = item.replace('$', '');
        param = param.replace('&', '');
        result = result.replace('$' + param,
          params[param.toLowerCase()] ? params[param.toLowerCase()] : '');
      });
    }
    return result;
  }
}
