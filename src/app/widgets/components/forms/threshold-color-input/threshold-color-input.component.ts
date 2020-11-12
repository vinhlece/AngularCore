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
import {WidgetThresholdColor} from '../../../models/enums';
import {WidgetThresholdColorConfig} from '../../../models';
import {WidgetThresholdColorConst} from '../../../models/constants';

@Component({
  selector: 'app-threshold-color-input',
  templateUrl: './threshold-color-input.component.html',
  styleUrls: ['./threshold-color-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ThresholdColorInputComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ThresholdColorInputComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThresholdColorInputComponent implements ControlValueAccessor, OnInit, Validator {
  private _fb: FormBuilder;

  form: FormGroup;
  green = WidgetThresholdColor.Green;
  red = WidgetThresholdColor.Red;

  colors = WidgetThresholdColorConst;

  @Input() thresholdColorConfig: WidgetThresholdColorConfig;
  @Input() isDarkTheme: boolean;

  constructor(fb: FormBuilder) {
    this._fb = fb;
  }

  ngOnInit() {
    this.createForm();
    this.form.valueChanges.subscribe((value) => {
      this.propagateChange(value);
    });
  }

  writeValue(value: any) {
    if (value) {
      this.thresholdColorConfig = value;
    } else {
      this.thresholdColorConfig = {greater: null, lesser: null};
    }
    // Update form control value
    this.setControlsValue();
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any) {
    // no op
  }

  validate(control: AbstractControl): { [key: string]: any } {
    const err = {
      thresholdError: {
        given: control.value,
      }
    };

    return this.form.invalid ? err : null;
  }

  private propagateChange = (_: any) => {
  };

  private createForm() {
    this.form = this._fb.group({
      greater: [null, [Validators.required]],
      lesser: [null, [Validators.required]]
    });
  }

  private setControlsValue() {
    if (this.form) {
      const greater = this.getGreaterControl();
      greater.setValue(this.thresholdColorConfig ? this.thresholdColorConfig.greater : null, {emitEvent: false});

      const lesser = this.getLesserControl();
      lesser.setValue(this.thresholdColorConfig ? this.thresholdColorConfig.lesser : null, {emitEvent: false});
    }
  }

  private getGreaterControl(): AbstractControl {
    return this.getControl('greater');
  }

  private getLesserControl(): AbstractControl {
    return this.getControl('lesser');
  }

  private getControl(controlName: string): AbstractControl {
    return this.form.get(controlName);
  }
}
