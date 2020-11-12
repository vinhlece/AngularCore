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
import {ThresholdColor} from '../../../models/index';

@Component({
  selector: 'app-breakpoint-threshold-colors',
  templateUrl: './breakpoint-threshold-colors.component.html',
  styleUrls: ['./breakpoint-threshold-colors.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BreakpointThresholdColorsComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => BreakpointThresholdColorsComponent),
      multi: true
    }
  ]
})
export class BreakpointThresholdColorsComponent implements OnInit, ControlValueAccessor, Validator {
  private _fb: FormBuilder;
  private _defaultColors: ThresholdColor[] = Array.from(Array(3));

  form: FormGroup;
  selectedColors: ThresholdColor[];


  @Input() required: boolean = true;

  constructor(fb: FormBuilder) {
    this._fb = fb;
  }

  ngOnInit() {
    this.form = this._fb.group({
      colors: this._fb.array(this._defaultColors)
    });
    this.form.valueChanges
      .pipe(distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)))
      .subscribe((value) => this._propagateChange(value.colors));
  }

  writeValue(value: ThresholdColor[]) {
    if (value) {
      this.selectedColors = value.length > 0 ? value : this._defaultColors;
      this.form.setControl('colors', this._fb.array(this.selectedColors));
    }
  }

  registerOnChange(fn: any) {
    this._propagateChange = fn;
  }

  registerOnTouched(fn: any) {
    // no op
  }

  validate(control: AbstractControl): { [key: string]: any } {
    const err = {
      gaugeThresholdColors: {
        hasError: true,
        given: control.value,
        message: 'invalid.'
      }
    };
    return this.form.invalid && this.required ? err : null;
  }

  private _propagateChange = (_: any) => {
  };
}
