import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as fromWidgets from '../../reducers';
import {select, Store} from '@ngrx/store';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Observable} from 'rxjs/index';
import * as fromMeasure from '../../../measures/reducers/index';
import * as fromWidget from '../../reducers/index';
import * as tabEditorActions from '../../../dashboard/actions/tab-editor.actions';

@Component({
  selector: 'app-new-side-bar-container',
  templateUrl: './new-side-bar.container.html',
  styleUrls: ['./new-side-bar.container.scss'],
  animations: [
    trigger('state', [
      state('in', style({
        display: 'block'
      })),
      state('out', style({
        display: 'none'
      })),
      transition('in => out', animate('200ms ease-in')),
      transition('out => in', animate('200ms ease-out'))
    ])
  ],
})
export class NewSideBarContainer implements OnInit {
  private _store: Store<fromWidgets.State>;

  @Input() state: string;
  @Output() onCancel = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<void>();

  widget$: Observable<any>;

  constructor(store: Store<fromWidgets.State>) {
    this._store = store;
  }

  ngOnInit() {
    this.widget$ = this._store.pipe(select(fromWidget.getEditingWidget));
  }

  handleCreateWidget(widget: any) {
    this._store.dispatch(new tabEditorActions.BulkCreateNew(widget));
  }

  handleUpdateWidget(widget: any) {
    this._store.dispatch(new tabEditorActions.BulkUpdate(widget));
  }

  handleCancel(event: any) {
    this.onCancel.emit();
  }

  handleSave(event: any) {
    this.onSave.emit();
  }
}
