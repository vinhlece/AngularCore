import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Widget} from '../../../models';

@Component({
  selector: 'app-add-widget-form',
  templateUrl: './add-widget-form.component.html',
  styleUrls: ['./add-widget-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddWidgetFormComponent implements OnInit {
  private _fb: FormBuilder;

  form: FormGroup;

  @Input() widgetTypes: string[];
  @Input() dataTypes: string[];
  @Input() errorMessage: string;

  @Output() onSubmit = new EventEmitter<Widget>();
  @Output() onCancel = new EventEmitter<void>();

  constructor(fb: FormBuilder) {
    this._fb = fb;
  }

  ngOnInit() {
    this.form = this._fb.group({
      name: null,
      type: null,
      dataType: null,
      defaultSize: {},
      isTemplate: false
    });
  }

  handleSubmit() {
    this.onSubmit.emit(this.form.value);
  }

  handleCancel() {
    this.onCancel.emit();
  }
}
