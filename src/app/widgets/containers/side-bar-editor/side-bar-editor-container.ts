import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Widget} from '../../models/index';
import {Observable, Subject} from 'rxjs/index';
import {select, Store} from '@ngrx/store';
import * as fromWidgets from '../../reducers/index';
import {WidgetType} from '../../constants/widget-types';
import * as editWidgetActions from '../../actions/editing-widget.actions';

@Component({
  selector: 'app-side-bar-editor-container',
  templateUrl: './side-bar-editor-container.html',
  styleUrls: ['./side-bar-editor-container.scss']
})
export class SideBarEditorContainer implements OnInit {
  private _store: Store<fromWidgets.State>;

  widget$: Observable<Widget>;
  @Input() isEditNewSideBar: boolean = false;
  @Output() onCancel = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<void>();
  @Output() onValidate = new EventEmitter<boolean>();
  readonly WIDGET_TYPES = WidgetType;

  constructor(store: Store<fromWidgets.State>) {
    this._store = store;
  }

  ngOnInit() {
    this.widget$ = this._store.pipe(select(fromWidgets.getEditingWidget));
  }

  handleSave() {
    this.onSave.emit();
  }

  handleCancel() {
    this.onCancel.emit();
  }

  handleValidate(event) {
    this.onValidate.emit(event);
  }

  handleChangeType(widget: Widget) {
    this._store.dispatch(new editWidgetActions.Update(widget));
  }

  getContainerStyle() {
    return {
      height: `89vh`,
      minWidth: `${this.isEditNewSideBar ? 25 : 40}vw`,
      width: '37vw'
    };
  }
}
