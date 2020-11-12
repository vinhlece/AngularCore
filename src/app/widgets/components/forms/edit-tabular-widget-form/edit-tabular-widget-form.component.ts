import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {Column, PairItem, TabularWidget, Widget} from '../../../models';
import {EditWidgetFormOptions} from '../edit-widget-form/edit-widget-form.component';
import {Subject} from 'rxjs/index';
import {AbstractEditWidget} from '../../new-side-bar/edit-widget-strategy/abstract-edit-widget';

@Component({
  selector: 'app-edit-tabular-widget-form',
  templateUrl: './edit-tabular-widget-form.component.html',
  styleUrls: ['./edit-tabular-widget-form.component.scss']
})
export class EditTabularWidgetFormComponent extends AbstractEditWidget implements OnChanges {
  @Input() columns: Column[] = [];
  @Input() displayData: PairItem[] = [];
  @Input() saveSubject: Subject<TabularWidget>;
  @Input() editColumn: Subject<Column>;

  @Output() onSubmit = new EventEmitter<TabularWidget>();
  @Output() onCancel = new EventEmitter<void>();
  @Output() onColumnChange = new EventEmitter<Column>();

  options: EditWidgetFormOptions;

  ngOnChanges() {
    this.options = this.createFormOptions({
      columns: this.columns,
      displayData: this.displayData
    });
  }

  handleSubmit(input) {
    this.onSubmit.emit({
      ...this.widget,
      ...input
    });
  }

  handleChange(input) {
    super.handleChange(input);
  }

  handleCancel() {
    this.onCancel.emit();
  }

  handleColumnChange(column: Column) {
    this.onColumnChange.emit(column);
  }

  handleChangeType(widget: Widget) {
    super.handleChangeType(widget);
  }
}
