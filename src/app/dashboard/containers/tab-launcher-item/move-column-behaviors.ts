import {Store} from '@ngrx/store';
import {MoveColumnEvent} from '../../../charts/models';
import * as widgetsActions from '../../../widgets/actions/widgets.actions';
import {TabularWidget, Widget} from '../../../widgets/models';
import {moveColumn} from '../../../widgets/utils/columns-mover';
import * as fromDashboards from '../../reducers';

export interface MoveColumnBehavior {
  move(event: MoveColumnEvent);
}

export class CanNotMoveColumn implements MoveColumnBehavior {
  move(event: MoveColumnEvent) {
    // no op
  }
}

export class OrderColumn implements MoveColumnBehavior {
  private _store: Store<fromDashboards.State>;
  private _widget: Widget;

  constructor(store: Store<fromDashboards.State>, widget: Widget) {
    this._store = store;
    this._widget = widget;
  }

  move(event: MoveColumnEvent) {
    this._store.dispatch(new widgetsActions.Update(moveColumn(this._widget as TabularWidget, event)));
  }
}

export class OrderColumnNewTable implements MoveColumnBehavior {
  private _store: Store<fromDashboards.State>;
  private _widget: Widget;

  constructor(store: Store<fromDashboards.State>, widget: Widget) {
    this._store = store;
    this._widget = widget;
  }

  move(event: MoveColumnEvent) {
    const widget = {...this._widget, columns: event.columns};
    this._store.dispatch(new widgetsActions.Update(widget));
  }
}
