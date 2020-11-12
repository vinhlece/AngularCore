import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {InstanceColor} from '../../../common/models/index';

@Component({
  selector: 'app-instance-color',
  templateUrl: './instance-color.component.html',
  styleUrls: ['./instance-color.component.scss']
})
export class InstanceColorComponent implements OnInit {
  private _fb: FormBuilder;
  color: string = null;
  form: FormGroup;
  @Output() onAddNewInstanceColor = new EventEmitter<InstanceColor>();

  constructor(fb: FormBuilder) {
    this._fb = fb;
  }

  ngOnInit() {
    this.createForm();
    this.form.valueChanges.subscribe((value) => {
      this.propagateChange(value);
    });
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  validate(c: AbstractControl): ValidationErrors | any {
    const err = {
      required: true
    };
    return this.form.invalid ? err : null;
  }

  private propagateChange = (_: any) => {
  };

  private createForm() {
    this.form = this._fb.group({
      name: [null, Validators.required],
      color: [null, Validators.required]
    });
  }

  addInstanceColor() {
    const {name, color} = this.form.getRawValue();
    this.clearInput();
    this.onAddNewInstanceColor.emit({name, color});
  }

  clearInput() {
    this.form.reset();
  }
}
