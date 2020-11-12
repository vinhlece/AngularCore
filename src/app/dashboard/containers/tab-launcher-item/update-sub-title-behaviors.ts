import { Store } from '@ngrx/store';
import { Widget } from '../../../widgets/models';
import * as fromDashboards from '../../reducers';
import * as widgetsActions from '../../../widgets/actions/widgets.actions';

export interface UpdateSubTitleBehavior {
  updateSubTitle(subTitle: string): void;
}

export class CanNotUpdateSubTitle implements UpdateSubTitleBehavior {
  updateSubTitle(subTitle: string): void {
    // do nothing
  }
}

export class CanUpdateSubTitle implements UpdateSubTitleBehavior {
  private _store: Store<fromDashboards.State>;
  private _widget: Widget;

  constructor(store: Store<fromDashboards.State>, widget: Widget) {
    this._store = store;
    this._widget = widget;
  }

  updateSubTitle(subtitle: string): void {
    this._store.dispatch(new widgetsActions.Update({ ...this._widget, subtitle }));
  }
}
