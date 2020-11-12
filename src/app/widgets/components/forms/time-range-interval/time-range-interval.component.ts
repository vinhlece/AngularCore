import {ChangeDetectionStrategy, Component, forwardRef, Input, OnInit} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  Validator,
  Validators
} from '@angular/forms';
import {IntervalUnit} from '../../../../dashboard/models/enums';
import {IntervalUnitConst} from '../../../../dashboard/models/constants';

@Component({
  selector: 'app-time-range-interval',
  templateUrl: './time-range-interval.component.html',
  styleUrls: ['./time-range-interval.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimeRangeIntervalComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TimeRangeIntervalComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeRangeIntervalComponent implements OnInit, ControlValueAccessor, Validator {
  private _fb: FormBuilder;

  intervalUnit = IntervalUnitConst;
  form: FormGroup;
  error: string = '';

  constructor(fb: FormBuilder) {
    this._fb = fb;
  }

  ngOnInit() {
    this.form = this._fb.group({
      unit: [null, [Validators.required, Validators.min(1)]],
      value: [null, Validators.required]
    });
    this.form.valueChanges.subscribe((value) => {
      this.propagateChange(value);
    });
  }

  writeValue(value) {
    if (value) {
      const data = {
        ...value,
      };
      this.form.setValue(data, {emitEvent: false});
    }
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any) {
    // no op
  }

  clearInterval() {
    this.form.setValue({unit: null, value: null}, {emitEvent: true});
  }

  validate(control: AbstractControl): { [key: string]: any } {
    const err = {
      required: true
    };


    return this.form.invalid  ? err : null;
  }

  private getControl(controlName: string): AbstractControl {
    return this.form.get(controlName);
  }

  private propagateChange = (_: any) => {
  };
}
