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
  selector: 'app-display-mode-selection',
  templateUrl: './display-mode-selection.component.html',
  styleUrls: ['./display-mode-selection.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DisplayModeSelectionComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DisplayModeSelectionComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DisplayModeSelectionComponent implements OnInit, ControlValueAccessor, Validator {
  private _fb: FormBuilder;
  private _themeService: ThemeService;

  @Input() displayModes: any[];
  @Input() label: string = 'widgets.edit_widget_form.display_mode';
  @Input() required: boolean = true;
  @Input() isDarkTheme: boolean = false;

  form: FormGroup;

  constructor(fb: FormBuilder, themeService: ThemeService) {
    this._fb = fb;
    this._themeService = themeService;
  }

  ngOnInit() {
    const validatorFns = this.required ? [Validators.required] : [];
    this.form = this._fb.group({
      displayMode: [null, validatorFns]
    });
    this.form.valueChanges.subscribe((value) => this.propagateChange(value.displayMode));
  }

  writeValue(value: string) {
    if (value && this.displayModes && this.displayModes.find((mode) => mode.key === value)) {
      this.form.setValue({displayMode: value}, {emitEvent: false});
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

  private propagateChange = (_: any) => {
  };
}
