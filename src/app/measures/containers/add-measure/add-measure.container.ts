import {Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable, of} from 'rxjs/index';
import * as navigationActions from '../../../layout/actions/navigation.actions';
import {Package} from '../../models';
import * as fromMeasures from '../../reducers';

@Component({
  selector: 'app-add-measure-container',
  template: `
    <app-measure-form [packages]="packages$ | async"
                      (onCancel)="handleCancel()"
    ></app-measure-form>`,
  styleUrls: ['./app-add-measure-container.scss']
})
export class AddMeasureContainer implements OnInit {
  private _store: Store<fromMeasures.State>;

  packages$: Observable<Package[]>;

  constructor(store: Store<fromMeasures.State>) {
    this._store = store;
  }

  ngOnInit() {
    this.packages$ = of([]);
  }

  handleCancel() {
    this._store.dispatch(navigationActions.navigateToMeasures());
  }
}
