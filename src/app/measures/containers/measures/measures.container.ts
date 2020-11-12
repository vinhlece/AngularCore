import {Component, OnInit} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Measure} from '../../models';
import * as measuresActions from '../../actions/measures.actions';
import {select, Store} from '@ngrx/store';
import * as fromMeasures from '../../reducers';
import {commonRouterList} from '../../../common/models/constants';
import {isNullOrUndefined} from 'util';

@Component({
  selector: 'app-measures-container',
  templateUrl: './measures.container.html'
})
export class MeasuresContainer implements OnInit {
  private _store: Store<fromMeasures.State>;

  measures$: Observable<Measure[]>;

  routerList = commonRouterList('/measures');

  constructor(store: Store<fromMeasures.State>) {
    this._store = store;
  }

  ngOnInit() {
    this._store.dispatch(new measuresActions.LoadAll());
    this.measures$ = this._store.pipe(select(fromMeasures.getMeasures));
  }
}
