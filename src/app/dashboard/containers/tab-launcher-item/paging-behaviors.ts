import {Store} from '@ngrx/store';
import * as widgetsActions from '../../../widgets/actions/widgets.actions';
import {Paging, TabularWidget, Widget} from '../../../widgets/models';
import * as fromDashboards from '../../reducers';

export interface PagingBehavior {
  page(paging: Paging);
}

export class DoNotPaging implements PagingBehavior {
  page(paging: Paging) {
    // no op
  }
}

export class DoPaging implements PagingBehavior {
  private _store: Store<fromDashboards.State>;
  private _widget: Widget;

  constructor(store: Store<fromDashboards.State>, widget: Widget) {
    this._store = store;
    this._widget = widget;
  }

  page(paging: Paging) {
    const tabular: TabularWidget = {...this._widget as TabularWidget, paging};
    this._store.dispatch(new widgetsActions.Update(tabular));
  }
}

