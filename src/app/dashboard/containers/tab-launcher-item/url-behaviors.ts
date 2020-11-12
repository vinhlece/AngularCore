import {Store} from '@ngrx/store';
import {Widget} from '../../../widgets/models';
import * as urlsActions from '../../actions/urls.actions';
import * as fromDashboards from '../../reducers';

export interface UrlBehavior {
  invoke();

  autoInvoke(event: any);
}

export class DoNotHaveUrl implements UrlBehavior {
  invoke() {
  }

  autoInvoke(event: any) {
  }
}

export class DefaultUrlBehavior {
  private _store: Store<fromDashboards.State>;
  private _widget: Widget;

  constructor(store: Store<fromDashboards.State>, widget: Widget) {
    this._store = store;
    this._widget = widget;
  }

  invoke() {
    this._store.dispatch(new urlsActions.ManualInvoke(this._widget));
  }

  autoInvoke(event: any) {
    if (event) {
      event.forEach(item => {
        this._store.dispatch(new urlsActions.AutoInvoke({
          widget: this._widget,
          event: item
        }));
      });
    }
  }
}
