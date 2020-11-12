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
import {WidgetType} from '../../../constants/widget-types';

@Component({
  selector: 'app-widget-type-input',
  templateUrl: './widget-type-input.component.html',
  styleUrls: ['./widget-type-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WidgetTypeInputComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => WidgetTypeInputComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WidgetTypeInputComponent implements OnInit, ControlValueAccessor, Validator {
  private _fb: FormBuilder;

  @Input() types: WidgetType[];

  form: FormGroup;

  constructor(fb: FormBuilder) {
    this._fb = fb;
  }

  ngOnInit() {
    this.form = this._fb.group({
      type: [null, Validators.required]
    });
    this.form.valueChanges.subscribe((value) => this._propagateChange(value.type));
  }

  writeValue(value: WidgetType) {
    if (value) {
      this.form.setValue({type: value}, {emitEvent: false});
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
      widgetTypeError: {
        given: control.value,
        hasError: true
      }
    };

    return this.form.invalid ? err : null;
  }

  private _propagateChange = (_) => {
    // no op
  }
}
