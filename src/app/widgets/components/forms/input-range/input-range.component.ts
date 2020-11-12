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
import {
  getMomentByTimestamp,
  getDateByLocalMoment, getDateByMoment, getLocalMomentByTimestamp,
  getMomentByDate
} from '../../../../common/services/timeUtils';
import {AppDateTimeFormat} from '../../../../common/models/enums';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

@Component({
  selector: 'app-input-range',
  templateUrl: './input-range.component.html',
  styleUrls: ['./input-range.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputRangeComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => InputRangeComponent),
      multi: true
    },
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    {provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true }}
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputRangeComponent implements OnInit, ControlValueAccessor, Validator {
  private _fb: FormBuilder;
  form: FormGroup;

  constructor(fb: FormBuilder) {
    this._fb = fb;
  }

  ngOnInit() {
    this.form = this._fb.group({
      startDay: [null, Validators.required],
      endDay: [null, Validators.required]
    });
    this.form.valueChanges.subscribe((value) => {
      const parseDate = (date) =>
        +getMomentByDate(getDateByLocalMoment(date, AppDateTimeFormat.yyyyMMddDate), AppDateTimeFormat.yyyyMMddDate);
      const data = {
        startDay: value.startDay ? parseDate(value.startDay) : null,
        endDay: value.endDay ? parseDate(value.endDay) : null
      };
      this.propagateChange(data);
    });
  }

  writeValue(value) {
    if (value) {
      const parseDate = (date) =>
        getLocalMomentByTimestamp(getDateByMoment(date, AppDateTimeFormat.yyyyMMddDate));
      const data = {
        startDay: value.startDay ? parseDate(value.startDay) : null,
        endDay: value.endDay ? parseDate(value.endDay) : null
      };
      this.form.patchValue(data, {emitEvent: false});
    }
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any) {
    // no op
  }

  validate(control: AbstractControl): { [key: string]: any } {
    const err = {
      required: true
    };
    let isValidDate = false;
    if (control.value) {
      isValidDate = (this.isValidDate(control.value.startDay) && this.isValidDate(control.value.endDay));
    }
    return isValidDate ? null : err;
  }

  private isValidDate(date: any): boolean {
    return date && getMomentByTimestamp(date).isValid();
  }

  private getControl(controlName: string): AbstractControl {
    return this.form.get(controlName);
  }

  private propagateChange = (_: any) => {
  };
}
