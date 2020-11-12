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
import {ThemeService} from '../../../../theme/theme.service';
import {Theme} from '../../../../theme/model/index';

@Component({
  selector: 'app-chart-style',
  templateUrl: './chart-style.component.html',
  styleUrls: ['./chart-style.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ChartStyleComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ChartStyleComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartStyleComponent implements OnInit, ControlValueAccessor, Validator {
  private _fb: FormBuilder;
  private _chartStyle: string;
  private _themeService: ThemeService;

  form: FormGroup;

  @Input() chartStyles;

  constructor(fb: FormBuilder, private themeService: ThemeService) {
    this._fb = fb;
    this._themeService = themeService;
  }

  ngOnInit() {
    this.form = this._fb.group({
      chartStyle: [this._chartStyle, Validators.required]
    });
    this.form.valueChanges.subscribe((value) => {
      this._chartStyle = value.chartStyle;
      this.propagate();
    });
  }

  writeValue(value: string) {
    if (value) {
      this._chartStyle = value;
      this.form.setValue({chartStyle: this._chartStyle}, {emitEvent: false});
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

    return this.form.invalid ? err : null;
  }

  isDarkTheme() {
    return this._themeService.getCurrentTheme() === Theme.Dark;
  }

  private propagateChange = (_: any) => {};

  private propagate() {
    this.propagateChange(this._chartStyle);
  }
}
