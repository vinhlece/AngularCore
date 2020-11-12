import {Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import * as fromDashboards from '../../reducers';
import {Observable} from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import {Url} from '../../../widgets/models';

@Component({
  selector: 'app-invoke-url-container',
  templateUrl: './invoke-url.container.html',
  styleUrls: ['./invoke-url.container.scss']
})
export class InvokeUrlContainer implements OnInit {
  private _store: Store<fromDashboards.State>;
  private _dialogRef: MatDialogRef<InvokeUrlContainer>;

  url$: Observable<Url>;
  data$: Observable<any>;
  hasError$: Observable<boolean>;

  constructor(store: Store<fromDashboards.State>, dialogRef: MatDialogRef<InvokeUrlContainer>) {
    this._store = store;
    this._dialogRef = dialogRef;
  }

  ngOnInit() {
    this.url$ = this._store.pipe(select(fromDashboards.getInvokeUrl));
    this.data$ = this._store.pipe(select(fromDashboards.getInvokeResponse));
    this.hasError$ = this._store.pipe(select(fromDashboards.getInvokeError));
  }

  handleClose() {
    this._dialogRef.close();
  }
}
