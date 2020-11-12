import {ChangeDetectionStrategy, Component, forwardRef, OnInit} from '@angular/core';
import {ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR} from '@angular/forms';
import {isNullOrUndefined} from 'util';
import {ThresholdLine} from '../../../models';

@Component({
  selector: 'app-threshold-line-input',
  templateUrl: './threshold-line-input.component.html',
  styleUrls: ['threshold-line-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ThresholdLineInputComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThresholdLineInputComponent implements OnInit, ControlValueAccessor {
  private _fb: FormBuilder;

  form: FormGroup;

  constructor(fb: FormBuilder) {
    this._fb = fb;
  }

  ngOnInit() {
    this.form = this._fb.group({
      enable: false,
      value: [{value: null, disabled: true}]
    });
    this.form.valueChanges.subscribe((value) => {
      this._propagateChange(value);
    });
  }

  writeValue(thresholdLine: ThresholdLine) {
    if (thresholdLine) {
      this.updateEnableControl(thresholdLine);
      this.updateValueControl(thresholdLine);
    }
  }

  registerOnChange(fn: any) {
    this._propagateChange = fn;
  }

  registerOnTouched(fn: any) {
    // no op
  }

  private updateEnableControl(thresholdLine: ThresholdLine) {
    this.form.get('enable').setValue(thresholdLine.enable, {emitEvent: false});
  }

  private updateValueControl(thresholdLine: ThresholdLine) {
    const control = this.form.get('value');
    if (!isNullOrUndefined(thresholdLine.value)) {
      control.setValue(thresholdLine.value, {emitEvent: false});
    }
    if (thresholdLine.enable) {
      control.enable({emitEvent: false});
    } else {
      control.disable({emitEvent: false});
    }
  }

  private _propagateChange = (_: any) => {
    // no op
  }
}
