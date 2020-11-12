import {Store} from '@ngrx/store';
import * as tabEditorActions from '../../actions/tab-editor.actions';
import * as fromDashboards from '../../reducers';

export interface TemplateBehavior {
  createWidgetFromTemplate();
}

export class TemplateBehaviorImpl implements TemplateBehavior {
  private _store: Store<fromDashboards.State>;
  private _placeholderId: string;

  constructor(store: Store<fromDashboards.State>, placeholderId: string) {
    this._store = store;
    this._placeholderId = placeholderId;
  }

  createWidgetFromTemplate() {
    this._store.dispatch(new tabEditorActions.CreateWidgetFromTemplate(this._placeholderId));
  }
}
