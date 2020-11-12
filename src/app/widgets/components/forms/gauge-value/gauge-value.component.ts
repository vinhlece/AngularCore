import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  Validators
} from '@angular/forms';
import {isNullOrUndefined} from 'util';

@Component({
  selector: 'app-gauge-value',
  templateUrl: './gauge-value.component.html',
  styleUrls: ['./gauge-value.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GaugeValueComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => GaugeValueComponent),
      multi: true
    }
  ],
})
export class GaugeValueComponent implements ControlValueAccessor, OnInit, Validator {
  private _fb: FormBuilder;

  color: string;
  form: FormGroup;

  @Input() label: string = 'color';
  @Input() required: boolean = false;

  constructor(fb: FormBuilder) {
    this._fb = fb;
  }

  ngOnInit() {
    this.createForm();
    this.form.valueChanges.subscribe((value) => {
      this.propagateChange(value);
    });
  }

  writeValue(value): void {
    if (value) {
      const data = {
        ...value,
      };
      if (isNullOrUndefined(data.color)) {
        data['color'] = null;
      }
      this.form.setValue(data, {emitEvent: false});
    }
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

  handlePickColor(color: string) {
    this.color = color;
    this.setControlValue();
    this.propagateChange(this.color);
  }

  private propagateChange = (_: any) => {
  };

  private createForm() {
    this.form = this._fb.group({
      color: [null],
      min: [null],
      max: [null]
    });
  }

  private setControlValue() {
    this.form.setValue({color: this.color}, {emitEvent: false});
  }
}
