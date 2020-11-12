import {Component, OnDestroy, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Subject} from 'rxjs';
import {filter, takeUntil} from 'rxjs/operators';
import {isNullOrUndefined} from 'util';
import * as widgetDataActions from '../dashboard/actions/widgets-data.actions';
import * as instancesActions from '../widgets/actions/instances.actions';
import * as fromRealTime from './reducers';
import * as connectionStatusActions from '../dashboard/actions/connection-status.actions';

@Component({
  selector: 'app-real-time',
  template: `
  `
})
export class RealTimeComponent implements OnInit, OnDestroy {
  private _store: Store<fromRealTime.State>;
  private _destroySubject = new Subject<void>();

  constructor(store: Store<fromRealTime.State>) {
    this._store = store;
  }

  ngOnInit() {
    onmessage = (e: MessageEvent) => this._store.dispatch(e.data);
    this._store
      .pipe(
        select(fromRealTime.getWidgetData),
        takeUntil(this._destroySubject)
      )
      .subscribe(data => {
        postMessage(new widgetDataActions.ConvertSuccess(JSON.parse(JSON.stringify(data))), undefined);
      });

    this._store.select(fromRealTime.getInstancesState)
      .pipe(
        filter((instanceList: string[]) => !isNullOrUndefined(instanceList)),
        takeUntil(this._destroySubject)
      )
      .subscribe((instanceList: string[]) => {
        postMessage(new instancesActions.Update(instanceList), undefined);
      });

    this._store.select(fromRealTime.getConnectionStatus)
      .pipe(
        takeUntil(this._destroySubject)
      )
      .subscribe((connectionStatus: string) => {
        postMessage(new connectionStatusActions.GetConnectionStatus(connectionStatus), undefined);
      });
  }

  ngOnDestroy() {
    this._destroySubject.next();
    this._destroySubject.complete();
  }
}
