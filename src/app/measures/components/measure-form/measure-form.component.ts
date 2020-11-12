import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Measure, Package} from '../../models';

@Component({
  selector: 'app-measure-form',
  templateUrl: './measure-form.component.html',
  styleUrls: ['./measure-form.component.scss']
})
export class MeasureFormComponent implements OnInit {
  private _fb: FormBuilder;

  form: FormGroup;
  @Input() measure: Measure;
  @Input() packages: Package[];

  @Output() onSubmit: EventEmitter<Measure> = new EventEmitter();
  @Output() onCancel: EventEmitter<Measure> = new EventEmitter();

  constructor(fb: FormBuilder) {
    this._fb = fb;
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.form = this._fb.group({
      name: this._fb.control(this.measure ? this.measure.name : null, Validators.required),
      dataType: this._fb.control(this.measure ? this.measure.dataType : null, Validators.required),
      disabled: this.measure && this.measure.disabled ? this.measure.disabled : false
    });
  }

  handleSubmit() {
    this.onSubmit.emit(this.form.value);
  }

  handleCancel() {
    this.onCancel.emit();
  }
}
