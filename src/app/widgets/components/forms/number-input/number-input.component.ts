import {ChangeDetectionStrategy, Component, forwardRef, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {isNullOrUndefined} from 'util';

@Component({
  selector: 'app-number-input',
  templateUrl: 'number-input.component.html',
  styleUrls: ['number-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumberInputComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NumberInputComponent implements OnInit, ControlValueAccessor {
  private _fb: FormBuilder;

  form: FormGroup;

  @Input() required: boolean;
  @Input() min: number;
  @Input() max: number;
  @Input() label: string;
  @Input() placeholder: string;

  constructor(fb: FormBuilder) {
    this._fb = fb;
  }

  ngOnInit() {
    const validatorFns = [];
    if (this.required) {
      validatorFns.push(Validators.required);
    }
    if (!isNullOrUndefined(this.min)) {
      validatorFns.push(Validators.min(this.min));
    }
    if (!isNullOrUndefined(this.max)) {
      validatorFns.push(Validators.max(this.max));
    }
    this.form = this._fb.group({
      number: this._fb.control(null, validatorFns)
    });
  }

  writeValue(value: number) {
    this.form.get('number').setValue(value, {emitEvent: false});
  }

  registerOnChange(fn: any) {
    this._propagateChange = fn;
  }

  registerOnTouched(fn: any) {
    // no op
  }

  handleBlur() {
    this._propagateChange(this.form.value.number);
  }

  private _propagateChange = (_: any) => {
    // no op
  };
}
