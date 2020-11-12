import {ChangeDetectionStrategy, Component, forwardRef, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR} from '@angular/forms';
import {isNullOrUndefined} from 'util';

@Component({
  selector: 'app-checkbox',
  templateUrl: 'checkbox.component.html',
  styleUrls: ['checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckboxComponent implements OnInit, ControlValueAccessor {
  private _fb: FormBuilder;

  @Input() label: string;

  form: FormGroup;

  constructor(fb: FormBuilder) {
    this._fb = fb;
  }

  ngOnInit() {
    this.form = this._fb.group({
      isChecked: this._fb.control({value: false, disabled: false})
    });
    this.form.valueChanges.subscribe((value) => {
      this._propagateChange(value.isChecked);
    });
  }

  writeValue(value: boolean) {
    if (isNullOrUndefined(value)) {
      this.form.get('isChecked').setValue(false, {emitEvent: false});
    } else {
      this.form.get('isChecked').setValue(value, {emitEvent: false});
    }
  }

  setDisabledState(disabled: boolean) {
    const control = this.form.get('isChecked');
    if (disabled) {
      control.disable({emitEvent: false});
      control.setValue(false, {emitEvent: false});
    } else {
      control.enable({emitEvent: false});
    }
  }

  registerOnChange(fn: any) {
    this._propagateChange = fn;
  }

  registerOnTouched(fn: any) {
    // no op
  }

  private _propagateChange = (_: any) => {
    // no op
  }
}
