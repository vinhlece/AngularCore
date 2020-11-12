import {Component, EventEmitter, forwardRef, Input, OnInit, Output} from '@angular/core';
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
  selector: 'app-display-data',
  templateUrl: './display-data.component.html',
  styleUrls: ['./display-data.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DisplayDataComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DisplayDataComponent),
      multi: true
    }
  ]
})
export class DisplayDataComponent implements OnInit, ControlValueAccessor, Validator {
  private _fb: FormBuilder;

  form: FormGroup;

  @Input() options: PairItem[];
  @Input() isDarkTheme: boolean;

  constructor(fb: FormBuilder) {
    this._fb = fb;
  }

  ngOnInit() {
    this.form = this._fb.group({
      displayData: [null, Validators.required]
    });
    this.form.valueChanges.subscribe((value) => this._propagateChange(value.displayData));
  }

  writeValue(value: string) {
    if (value && this.options) {
      if (this.options.find((item: PairItem) => item.key === value)) {
        this.form.setValue({displayData: value}, {emitEvent: false});
      }
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
      required: true
    };

    return this.form.invalid ? err : null;
  }

  private _propagateChange = (_: any) => {
  };
}
