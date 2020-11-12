import {ChangeDetectionStrategy, Component, forwardRef, Input, OnInit} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor, FormBuilder, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validator,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-palette-node',
  templateUrl: './palette-node.component.html',
  styleUrls: ['./palette-node.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PaletteNodeComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PaletteNodeComponent),
      multi: true
    }
  ]
})
export class PaletteNodeComponent implements OnInit, ControlValueAccessor, Validator {
  private _fb: FormBuilder;

  color: string;
  form: FormGroup;

  @Input() placeHolder: string;
  @Input() isDarkTheme: boolean;

  constructor(fb: FormBuilder) {
    this._fb = fb;
  }

  ngOnInit() {
    this.form = this._fb.group({
      color: [null, Validators.required]
    });
    this.form.valueChanges.subscribe((value) => {
      this._propagateChange(value);
    });
  }

  writeValue(value: string) {
    this.color = value || '';
    this.form.setValue({color: this.color}, {emitEvent: false});
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
    // no op
  }

  handlePickColor(color: string) {
    this.color = color;
    this.setControlValue();
    this._propagateChange(this.color);
  }

  private setControlValue() {
    this.form.setValue({color: this.color}, {emitEvent: false});
  }
}
