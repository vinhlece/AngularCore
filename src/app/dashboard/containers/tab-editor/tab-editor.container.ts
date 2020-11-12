import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {DragEvent} from '../../../widgets/models';
import * as dndActions from '../../actions/dnd.actions';
import * as placeholdersActions from '../../actions/placeholders.actions';
import * as tabEditorActions from '../../actions/tab-editor.actions';
import {GridMetrics, Placeholder} from '../../models';
import * as fromDashboards from '../../reducers';

@Component({
  selector: 'app-tab-editor',
  templateUrl: './tab-editor.container.html',
  styleUrls: ['./tab-editor.container.scss']
})
export class TabEditorContainer implements OnInit {
  private _store: Store<fromDashboards.State>;

  metrics$: Observable<GridMetrics>;
  placeholders$: Observable<Placeholder[]>;
  maximizedPlaceholder$: Observable<Placeholder>;
  isShowGridLines$: Observable<boolean>;

  @Input() tabId: string;
  constructor(store: Store<fromDashboards.State>) {
    this._store = store;
  }

  ngOnInit() {
    this.placeholders$ = this._store.pipe(select(fromDashboards.getEditingPlaceholders));
    this.maximizedPlaceholder$ = this._store.pipe(select(fromDashboards.getMaximizedPlaceholder));
    this.metrics$ = this._store.pipe(select(fromDashboards.getMetrics));
    this.isShowGridLines$ = this._store.pipe(select(fromDashboards.isShowGridLines));
  }

  handleReady() {
    this._store.dispatch(new tabEditorActions.Initialize(this.tabId));
  }

  handlePlaceholderChange(placeholders: Placeholder[]) {
    this._store.dispatch(new placeholdersActions.Set(placeholders.map((placeholder: Placeholder) => {
      return {...placeholder, tabId: this.tabId};
    })));
    this.updateEditingTab();
  }

  handleRequestMetrics(metrics: GridMetrics) {
    this._store.dispatch(new tabEditorActions.UpdateMetrics(metrics));
  }

  handleDragStart(event: DragEvent) {
    this._store.dispatch(new dndActions.DragStart(event));
    this._store.dispatch(new tabEditorActions.ToggleGridLines());
  }

  handleDrag(event: DragEvent) {
    this._store.dispatch(new dndActions.Drag(event));
  }

  handleDragStop(event: DragEvent) {
    this._store.dispatch(new dndActions.DragStop(event));
    this._store.dispatch(new tabEditorActions.ToggleGridLines());
  }

  handleResizeStart() {
    this._store.dispatch(new tabEditorActions.ToggleGridLines());
  }

  handleResizeStop() {
    this._store.dispatch(new tabEditorActions.ToggleGridLines());
  }

  private updateEditingTab() {
    this._store.dispatch(new tabEditorActions.UpdateEditingTab(this.tabId));
  }
}
