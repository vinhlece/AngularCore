import {Store} from '@ngrx/store';
import {Widget} from '../../../widgets/models';
import * as fromDashboards from '../../reducers';
import * as widgetsActions from '../../../widgets/actions/widgets.actions';

export interface RenameBehavior {
  rename(name: string): void;
}

export class CanNotRename implements RenameBehavior {
  rename(name: string): void {
    // do nothing
  }
}

export class CanRename implements RenameBehavior {
  private _store: Store<fromDashboards.State>;
  private _widget: Widget;

  constructor(store: Store<fromDashboards.State>, widget: Widget) {
    this._store = store;
    this._widget = widget;
  }

  rename(name: string): void {
    if (name) {
      this._store.dispatch(new widgetsActions.Update({...this._widget, name}));
    }
  }
}
