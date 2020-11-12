import {ChangeDetectionStrategy, Component, forwardRef, Input, OnInit} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor, FormBuilder, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validator,
  Validators
} from '@angular/forms';
import {HeaderFont} from '../../../../common/models/index';

@Component({
  selector: 'app-header-font',
  templateUrl: './header-font.component.html',
  styleUrls: ['./header-font.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => HeaderFontComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => HeaderFontComponent),
      multi: true
    }
  ]
})
export class HeaderFontComponent implements OnInit, ControlValueAccessor, Validator {
  private _fb: FormBuilder;

  form: FormGroup;
  @Input() required: boolean;

  constructor(fb: FormBuilder) {
    this._fb = fb;
  }

  ngOnInit() {
    const validatorFns = [];
    if (this.required) {
      validatorFns.push(Validators.required);
    }
    this.form = this._fb.group({
      fontFamily: this._fb.control(null, validatorFns),
      fontSize: this._fb.control(null, validatorFns)
    });
    this.form.valueChanges.subscribe((value) => {
      this._propagateChange(value);
    });
  }

  writeValue(value: HeaderFont) {
    if (value) {
      this.form.get('fontFamily').setValue(value.fontFamily, {emitEvent: false});
      this.form.get('fontSize').setValue(value.fontSize, {emitEvent: false});
    }
  }

  validate(control: AbstractControl): { [key: string]: any } {
    const err = {
      required: true
    };

    return this.form.invalid ? err : null;
  }

  registerOnChange(fn: any) {
    this._propagateChange = fn;
  }

  registerOnTouched(fn: any) {
    // no op
  }

  private _propagateChange = (_: any) => {
    // no op
  }
}
