import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {EditWidgetFormOptions} from '../../edit-widget-form/edit-widget-form.component';
import {Subject} from 'rxjs/Rx';
import {Column, Widget} from '../../../../models/index';
import {WidgetSection} from '../../../../models/enums';

@Component({
  selector: 'app-edit-widget-expand-content',
  templateUrl: './edit-widget-expand-content.component.html',
  styleUrls: ['./edit-widget-expand-content.component.scss']
})
export class EditWidgetExpandContentComponent {
  @Input() options: EditWidgetFormOptions;
  @Input() editColumn: Subject<Column>;
  @Input() widget: Widget;
  @Input() packages: any;
  @Input() packageDetails: any;
  @Input() allDimensions: any;
  @Input() allInstance: any;
  @Input() section: string;
  @Input() title: string;
  @Input() expanded: string;
  @Input() saveSubject: Subject<any>;

  @Output() onSubmit = new EventEmitter<Widget>();
  @Output() onCancel = new EventEmitter<void>();
  @Output() onChange = new EventEmitter<Widget>();
  @Output() onColumnChange = new EventEmitter<Column>();
  @Output() onValidate = new EventEmitter<any>();
  @Output() onChangeType = new EventEmitter<Widget>();
  valid: boolean = false;

  handleSubmit(event) {
    this.onSubmit.emit(event);
  }

  handleChange(event) {
    this.onChange.emit(event)
  }

  handleCancel() {
    this.onCancel.emit();
  }

  handleValidate(event) {
    this.valid = event;
    this.onValidate.emit({
      [this.section]: event
    });
  }

  handleChangeType(event) {
    this.onChangeType.emit(event);
  }
}
