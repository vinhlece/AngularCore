import {ChangeDetectionStrategy, Component, forwardRef, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatePickerComponent implements OnInit, ControlValueAccessor {
  private _fb: FormBuilder;

  @Input() placeholder: string;
  @Input() options: string[];

  form: FormGroup;

  constructor(fb: FormBuilder) {
    this._fb = fb;
  }

  ngOnInit() {
    this.form = this._fb.group({
      value: [null, Validators.required],
    });
    this.form.valueChanges.subscribe((value) => {
      this.propagateChange(value.value);
    });
  }

  writeValue(value) {
    if (value) {
      const data = {
        value
      }
      this.form.patchValue(data, {emitEvent: false});
    }
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any) {
    // no op
  }

  propagateChange = (_: any) => {
    // no op
  }
}
