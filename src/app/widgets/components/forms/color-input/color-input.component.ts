import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  Validators
} from '@angular/forms';
import {ThemeService} from '../../../../theme/theme.service';
import {Theme} from '../../../../theme/model/index';

@Component({
  selector: 'app-color-input-component',
  templateUrl: './color-input.component.html',
  styleUrls: ['./color-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ColorInputComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ColorInputComponent),
      multi: true
    }
  ],
})
export class ColorInputComponent implements ControlValueAccessor, OnInit, Validator {
  private _fb: FormBuilder;
  private _themeService: ThemeService;

  color: string;
  form: FormGroup;

  @Input() colors: any[] = null;
  @Input() label: string = 'widgets.edit_widget_form.color';
  @Input() isLabel: boolean = false;
  @Input() required: boolean = true;
  @Input() position: string = 'bottom';

  constructor(fb: FormBuilder, themeService: ThemeService) {
    this._fb = fb;
    this._themeService = themeService;
  }

  ngOnInit() {
    this.createForm();
    this.form.valueChanges.subscribe((value) => {
      this.propagateChange(value.color);
    });
  }

  writeValue(color: string): void {
    this.color = color || '';
    this.setControlValue();
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  validate(c: AbstractControl): ValidationErrors | any {
    const err = {
      required: true
    };
    return this.form.invalid ? err : null;
  }

  handlePickColor(color: string) {
    this.color = color;
    this.setControlValue();
    this.propagateChange(this.color);
  }

  isDarkTheme() {
    return this._themeService.getCurrentTheme() === Theme.Dark;
  }

  private propagateChange = (_: any) => {
  };

  private createForm() {
    this.form = this._fb.group({
      color: [null, this.required ? Validators.required : null]
    });
  }

  private setControlValue() {
    this.form.setValue({color: this.color}, {emitEvent: false});
  }
}
