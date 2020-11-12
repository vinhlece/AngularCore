import {Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import * as navigationActions from '../../../layout/actions/navigation.actions';
import * as widgetsActions from '../../actions/widgets.actions';
import {Widget} from '../../models';
import * as fromWidgets from '../../reducers';
import {commonRouterList} from '../../../common/models/constants';
import {isNullOrUndefined} from 'util';

@Component({
  selector: 'app-filterable-widget-list',
  templateUrl: './filterable-widget-list.container.html'
})
export class FilterableWidgetListContainer implements OnInit {
  private _store: Store<fromWidgets.State>;
  widgets$: Observable<Widget[]>;
  errorMessage$: Observable<string>;

  routerList = commonRouterList('/widgets');

  constructor(store: Store<fromWidgets.State>) {
    this._store = store;
  }

  ngOnInit() {
    this.widgets$ = this._store.pipe(select(fromWidgets.getWidgets));
  }

  launch(widget: Widget) {
  }

  edit(widget: Widget) {
    this._store.dispatch(navigationActions.navigateToEditWidget(widget));
  }

  remove(id: string) {
    this._store.dispatch(new widgetsActions.Delete(id));
  }
}
