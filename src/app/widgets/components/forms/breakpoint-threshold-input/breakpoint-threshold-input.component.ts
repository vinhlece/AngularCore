import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  Validator
} from '@angular/forms';
import {BreakpointThreshold, ThresholdColor} from '../../../models';
import {isNullOrUndefined} from 'util';

@Component({
  selector: 'app-breakpoint-threshold-input',
  templateUrl: './breakpoint-threshold-input.component.html',
  styleUrls: ['./breakpoint-threshold-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GaugeThresholdComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => GaugeThresholdComponent),
      multi: true
    }
  ]
})
export class GaugeThresholdComponent implements OnInit, ControlValueAccessor, Validator {
  private _fb: FormBuilder;
  private _threshold: BreakpointThreshold;
  private _defaultBreakpoints: number[] = Array.from(Array(2));
  private _defaultColors: ThresholdColor[] = Array.from(Array(2));

  @Input() newThreshold: boolean = false;
  @Input() required: boolean = true;

  get threshold(): BreakpointThreshold {
    if (!this._threshold) {
      return {
        breakpoints: [],
        colors: []
      };
    }
    return this._threshold;
  }

  set threshold(value: BreakpointThreshold) {
    this._threshold = value;
  }

  form: FormGroup;

  constructor(fb: FormBuilder) {
    this._fb = fb;
  }

  ngOnInit() {
    const {breakpoints, colors} = this.threshold;
    this.form = this._fb.group({
      breakpoints: this._fb.control(breakpoints.length > 0 ? breakpoints : this._defaultBreakpoints),
      colors: this._fb.control(colors.length > 0 ? colors : this._defaultColors)
    });
    this.form.valueChanges.subscribe((value) => this.propagateChange(value));
  }

  writeValue(value: BreakpointThreshold) {
    this.threshold = value || {breakpoints: this._defaultBreakpoints, colors: this._defaultColors};
    if (value && (value !== this.form.value)) {
      this.form.setValue(this.threshold, {emitEvent: false});
    } else if (isNullOrUndefined(value)) {
      this.form.setValue({breakpoints: this._defaultBreakpoints, colors: this._defaultColors}, {emitEvent: false});
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
      gaugeThreshold: {
        hasError: true,
        given: control.value,
        message: 'invalid.'
      }
    };

    return this.form.invalid && this.required ? err : null;
  }

  private propagateChange = (_: any) => {
  };
}
