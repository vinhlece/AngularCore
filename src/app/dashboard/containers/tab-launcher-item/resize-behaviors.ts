import {Store} from '@ngrx/store';
import * as placeholdersActions from '../../actions/placeholders.actions';
import * as fromDashboards from '../../reducers';

export interface ResizeBehavior {
  minimize(): void;

  maximize(): void;
}

export class DoNotResize implements ResizeBehavior {
  minimize(): void {
    // no op
  }

  maximize(): void {
    // no op
  }
}

export class ResizeBehaviorImpl implements ResizeBehavior {
  private _store: Store<fromDashboards.State>;
  private _placeholderId: string;

  constructor(store: Store<fromDashboards.State>, placeholderId: string) {
    this._store = store;
    this._placeholderId = placeholderId;
  }

  minimize(): void {
    this._store.dispatch(new placeholdersActions.Minimize(this._placeholderId));
  }

  maximize(): void {
    this._store.dispatch(new placeholdersActions.Maximize(this._placeholderId));
  }
}
