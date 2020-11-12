import {Component, OnDestroy, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import * as fromUi from './../../reducers';

@Component({
  selector: 'app-loading-bar',
  template: `
    <mat-progress-bar *ngIf="loading$ | async" color="accent" mode="query"></mat-progress-bar>
  `
})
export class LoadingBarComponent implements OnInit, OnDestroy {
  public loading$: Observable<boolean>;
  private _store;

  public constructor(store: Store<fromUi.State>) {
    this._store = store;
  }

  ngOnInit() {
    this.loading$ = this._store.pipe(select(fromUi.getLoading));
  }

  ngOnDestroy() {
    this.loading$.subscribe();
  }
}
