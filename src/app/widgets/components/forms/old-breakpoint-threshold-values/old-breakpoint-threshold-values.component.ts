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
import {distinctUntilChanged} from 'rxjs/operators';

@Component({
  selector: 'app-old-breakpoint-threshold-values',
  templateUrl: './old-breakpoint-threshold-values.component.html',
  styleUrls: ['./old-breakpoint-threshold-values.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OldBreakpointThresholdValuesComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => OldBreakpointThresholdValuesComponent),
      multi: true
    }
  ]
})
export class OldBreakpointThresholdValuesComponent implements OnInit, ControlValueAccessor, Validator {
  private _fb: FormBuilder;
  private _defaultBreakpoints: number[] = Array.from(Array(4));

  form: FormGroup;
  breakpoints: number[];

  @Input() required: boolean = true;

  constructor(fb: FormBuilder) {
    this._fb = fb;
  }

  ngOnInit() {
    this.form = this._fb.group({
      breakpoints: this._fb.array(this._defaultBreakpoints)
    });
    this.form.valueChanges
      .pipe(distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)))
      .subscribe((value) => this.propagateChange(value.breakpoints));
  }

  writeValue(value: number[]) {
    if (value) {
      this.breakpoints = value.length > 0 ? value : this._defaultBreakpoints;
      this.form.setControl('breakpoints', this._fb.array(this.breakpoints));
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
      gaugeThresholdBreakpoints: {
        hasError: true,
        given: control.value,
        message: 'invalid.'
      }
    };

    return this.form.invalid && this.required ? err : null;
  }

  hasError(index: number) {
    return this.form.get('breakpoints').get(index.toString()).hasError('required');
  }

  private propagateChange = (_: any) => {
  };
}
