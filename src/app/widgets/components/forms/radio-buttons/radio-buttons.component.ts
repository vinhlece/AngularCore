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
import {WidgetMode} from '../../../constants/widget-types';

@Component({
  selector: 'app-radio-buttons',
  templateUrl: './radio-buttons.component.html',
  styleUrls: ['./radio-buttons.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioButtonsComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => RadioButtonsComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RadioButtonsComponent implements OnInit, ControlValueAccessor, Validator {
  private _fb: FormBuilder;
  isTimeRange: boolean = false;
  form: FormGroup;

  @Input() values: any;

  constructor(fb: FormBuilder) {
    this._fb = fb;
  }

  ngOnInit() {
    this.form = this._fb.group({
      value: [null, Validators.required],
      timeGroup: [null]
    });
    this.form.valueChanges.subscribe((value) => {
      this.propagateChange(value);
    });
  }

  writeValue(value) {
    if (value) {
      if (value.value === WidgetMode.TimeRange) {
        this.isTimeRange = true;
      } else {
        this.isTimeRange = false;
        value.timeGroup = null;
      }

      const data = {
        ...value
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

  validate(control: AbstractControl): { [key: string]: any } {
    const err = {
      required: true
    };

    if (this.getControl('value').value !== WidgetMode.TimeRange) {
      return null;
    } else if (control.value.timeGroup === null) {
      return err;
    }

    return this.form.invalid ? err : null;
  }

  private getControl(controlName: string): AbstractControl {
    return this.form.get(controlName);
  }

  private propagateChange = (_: any) => {
  };
}
