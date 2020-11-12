import {ChangeDetectionStrategy, Component, forwardRef, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR} from '@angular/forms';
import {ThresholdColor} from '../../../../models/index';

@Component({
  selector: 'app-auto-invoke-url-color',
  templateUrl: './auto-invoke-url-color.component.html',
  styleUrls: ['./auto-invoke-url-color.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutoInvokeUrlColorComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutoInvokeUrlColorComponent implements OnInit, ControlValueAccessor {
  private _fb: FormBuilder;

  form: FormGroup;

  @Input() placeholder: string = '';
  @Input() required: boolean = false;
  @Input() auto: boolean = false;

  constructor(fb: FormBuilder) {
    this._fb = fb;
  }

  ngOnInit() {
    const defaultValue: any = {
      value: null,
    };
    if (this.auto) {
      defaultValue.autoInvokeUrl = false;
    }
    this.form = this._fb.group(defaultValue);
    this.form.valueChanges.subscribe((value) => {
      this._propagateChange(value);
    });
  }

  writeValue(value: ThresholdColor) {
    if (value) {
      this.form.setValue(value, {emitEvent: false});
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
  };
}
