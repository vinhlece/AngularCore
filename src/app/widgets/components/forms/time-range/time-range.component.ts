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
import {TimeGroupBy} from '../../../models/enums';
import {TimeRangeAll} from '../../../constants/constants';
import {TimeGroupConst} from '../../../models/constants';

@Component({
  selector: 'app-time-range',
  templateUrl: './time-range.component.html',
  styleUrls: ['./time-range.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimeRangeComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TimeRangeComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeRangeComponent implements OnInit, ControlValueAccessor, Validator {
  private _fb: FormBuilder;
  form: FormGroup;
  isCustomRange = false;
  rangeOptions = TimeGroupConst;

  @Input() isInterval: boolean = true;
  @Input() inputValidators: Function[];
  @Input() typeRequired: boolean = true;

  constructor(fb: FormBuilder) {
    this._fb = fb;
  }

  ngOnInit() {
    if (!this.typeRequired) {
      this.rangeOptions = [TimeRangeAll, ...this.rangeOptions];
    }
    const config = {
      type: [null, this.typeRequired ? Validators.required : null],
      range: [null, Validators.required]
    };
    if (this.isInterval) {
      config['interval'] = [null, Validators.required];
    }
    this.form = this._fb.group(config);
    this.form.valueChanges.subscribe((value) => {
      this.propagateChange(value);
    });
  }

  writeValue(value) {
    if (value) {
      const data = {
        ...value,
      };
      this.handleSelect(data.type);
      if (!this.isCustomRange) {
          data.range = null;
      }
      this.form.setValue(data, {emitEvent: false});
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

    const typeControl = this.getControl('type');
    const rangeControl = this.getControl('range');
    const intervalControl = this.getControl('interval');

    if (this.inputValidators) {
      return this.validateWithValidators() ? null : err;
    }

    if (this.getControl('type').value !== TimeGroupBy.CustomRange) {
      if (!this.isInterval) {
        return typeControl.invalid ? err : null;
      }

      return typeControl.invalid || intervalControl.invalid ? err : null;
    } else {
      if (!this.isInterval) {
        return typeControl.invalid || rangeControl.invalid ? err : null ;
      }
    }
    return this.form.invalid  ? err : null;
  }

  handleSelect(selectedValue: string) {
    this.isCustomRange = selectedValue === TimeGroupBy.CustomRange;
  }

  private getControl(controlName: string): AbstractControl {
    return this.form.get(controlName);
  }

  private propagateChange = (_: any) => {
  };

  private validateWithValidators(): boolean {
    return this.inputValidators.reduce((isValid: boolean, validator) => {
      return isValid && validator(this.form.value);
    }, true);
  }
}
