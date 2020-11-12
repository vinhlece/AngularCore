import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {EditWidgetFormOptions} from '../edit-widget-form/edit-widget-form.component';
import {Subject} from 'rxjs/Rx';
import {Column, Widget} from '../../../models/index';
import {WidgetSection} from '../../../models/enums';

@Component({
  selector: 'app-edit-widget-form-expand',
  templateUrl: './edit-widget-form-expand.component.html',
  styleUrls: ['./edit-widget-form-expand.component.scss']
})
export class EditWidgetFormExpandComponent {
  @Input() options: EditWidgetFormOptions;
  @Input() editColumn: Subject<Column>;
  @Input() widget: Widget;
  @Input() packages: any;
  @Input() packageDetails: any;
  @Input() allDimensions: any;
  @Input() allInstance: any;
  readonly section = WidgetSection;
  saveSubject = new Subject();
  data: any = {};

  @Output() onSubmit = new EventEmitter<Widget>();
  @Output() onCancel = new EventEmitter<void>();
  @Output() onChange = new EventEmitter<Widget>();
  @Output() onColumnChange = new EventEmitter<Column>();
  @Output() onValidate = new EventEmitter<boolean>();
  @Output() onChangeType = new EventEmitter<Widget>();

  private _valid = {
    [WidgetSection.info]: false,
    [WidgetSection.appearance]: false,
    [WidgetSection.data]: false
  }

  checkFormValid() {
    return Object.keys(this._valid).reduce((acc, item) => {
      return !this._valid[item] ? false : acc;
    }, true);
  }

  handleSubmit(event) {
    this.data = {
      ...this.data,
      ...event
    };
    const keys = Object.keys(WidgetSection);
    if (this.data[keys[0]] && this.data[keys[1]] && this.data[keys[2]]) {
      this.onSubmit.emit(({
        ...this.data[keys[0]],
        ...this.data[keys[1]],
        ...this.data[keys[2]],
      }) as Widget);
      this.data = {};
    }

  }

  triggerSave() {
    if (this.checkFormValid()) {
      this.saveSubject.next();
    }
  }

  handleChange(event) {
    this.onChange.emit(event);
  }

  handleCancel() {
    this.onCancel.emit();
  }

  handleValidate(event) {
    this._valid = {
      ...this._valid,
      ...event
    };
  }

  handleChangeType(event) {
    this.onChangeType.emit(event);
  }
}
