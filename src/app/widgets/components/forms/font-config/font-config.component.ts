import {ChangeDetectionStrategy, Component, forwardRef, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {WidgetFont} from '../../../models';
import {FontWeightLocale, FontFamily} from '../../../models/constants';

@Component({
  selector: 'app-font-config',
  templateUrl: './font-config.component.html',
  styleUrls: ['./font-config.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FontConfigComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FontConfigComponent implements OnInit, ControlValueAccessor {
  private _fb: FormBuilder;

  form: FormGroup;
  fontWeights = FontWeightLocale;
  fontSize: number[] = [];
  fontFamily = FontFamily.sort();
  @Input() required: boolean;
  @Input() isDarkTheme: boolean = false;

  constructor(fb: FormBuilder) {
    this._fb = fb;
  }

  ngOnInit() {
    this.fontSize = this.getValueForFontSize(8, 200);
    const validatorFns = [];
    if (this.required) {
      validatorFns.push(Validators.required);
    }
    this.form = this._fb.group({
      fontFamily: this._fb.control(null, validatorFns),
      fontSize: this._fb.control(null, validatorFns),
      fontWeight: this._fb.control(null, validatorFns),
    });
    this.form.valueChanges.subscribe((value) => {
      this._propagateChange(value);
    });
  }

  writeValue(value: WidgetFont) {
    if (value) {
      this.form.get('fontFamily').setValue(value.fontFamily, {emitEvent: false});
      this.form.get('fontSize').setValue(value.fontSize, {emitEvent: false});
      this.form.get('fontWeight').setValue(value.fontWeight, {emitEvent: false});
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

  getValueForFontSize = (from: number, to: number): number[] => {
    const result: number[] = [];
    for (let i = from; i <= to; i++) {
      result.push(i);
    }
    return result;
  }

  styleForFontName = (font) => {
    return {
      'font-family': font
    };
  }

  styleForFontWeights = (weight) => {
    return {
      'font-weight': weight
    };
  }
}
