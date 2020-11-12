import {Store} from '@ngrx/store';
import {DisplayModeEvent} from '../../../charts/models';
import {Widget} from '../../../widgets/models';
import * as placeholdersActions from '../../actions/placeholders.actions';
import {DisplayMode} from '../../models/enums';
import * as fromDashboards from '../../reducers';

export interface DisplayModeBehaviors {
  switchDisplayMode(event: DisplayModeEvent);
}

export class DoNotHaveDisplayMode implements DisplayModeBehaviors {
  switchDisplayMode(event: DisplayModeEvent) {
    // no op
  }
}

export class GaugeDisplayMode implements DisplayModeBehaviors {
  private _store: Store<fromDashboards.State>;
  private _placeholderId: string;
  private _widget: Widget;

  constructor(store: Store<fromDashboards.State>, placeholderId: string, widget: Widget) {
    this._store = store;
    this._placeholderId = placeholderId;
    this._widget = widget;
  }

  switchDisplayMode(event: DisplayModeEvent) {
    if (event.newMode === DisplayMode.Latest) {
      this._store.dispatch(new placeholdersActions.ShowLatest(this._placeholderId));
    } else if (event.newMode === DisplayMode.Historical) {
      this._store.dispatch(new placeholdersActions.ShowHistorical(this._placeholderId));
    } else if (event.newMode === DisplayMode.Timestamp) {
      this._store.dispatch(new placeholdersActions.ShowTimestamp(this._placeholderId));
    }
  }
}
