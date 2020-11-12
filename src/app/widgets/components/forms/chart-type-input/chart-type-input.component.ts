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
import {PairItem} from '../../../models/index';

@Component({
  selector: 'app-chart-type-input',
  templateUrl: './chart-type-input.component.html',
  styleUrls: ['./chart-type-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ChartTypeInputComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ChartTypeInputComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartTypeInputComponent implements OnInit, ControlValueAccessor, Validator {
  private _fb: FormBuilder;
  private _chartType: string;

  form: FormGroup;

  @Input() chartTypes: PairItem[];
  @Input() isDarkTheme: boolean;

  constructor(fb: FormBuilder) {
    this._fb = fb;
  }

  ngOnInit() {
    this.form = this._fb.group({
      chartType: [this._chartType, Validators.required]
    });
    this.form.valueChanges.subscribe((value) => {
      this._chartType = value.chartType;
      this.propagate();
    });
  }

  writeValue(value: string) {
    if (value) {
      this._chartType = value;
      this.setControlValue();
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

    return this.form.invalid ? err : null;
  }

  private propagateChange = (_: any) => {};

  private setControlValue() {
    this.form.setValue({chartType: this._chartType}, {emitEvent: false});
  }

  private propagate() {
    this.propagateChange(this._chartType);
  }
}
