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
  selector: 'app-data-type-input',
  templateUrl: './data-type-input.component.html',
  styleUrls: ['./data-type-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DataTypeInputComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DataTypeInputComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTypeInputComponent implements OnInit, ControlValueAccessor, Validator {
  private _fb: FormBuilder;
  private _dataType: string;
  private _sortedDataTypes: string[];
  private _isDisable: boolean;
  form: FormGroup;

  @Input()
  get dataTypes(): string[] {
    return this._sortedDataTypes;
  }
  set dataTypes(dataTypes: string[]) {
    this._sortedDataTypes = dataTypes.sort((a, b) => a.localeCompare(b));
  }

  @Input()
  get isDisabled(): boolean {
    return this._isDisable;
  }
  set isDisabled(val: boolean) {
    this._isDisable = val;
  }

  constructor(fb: FormBuilder, private themeService: ThemeService) {
    this._fb = fb;
  }

  ngOnInit() {
    this.form = this._fb.group({
      dataType: [this._dataType, Validators.required]
    });
    this.form.valueChanges.subscribe((value) => {
      this._dataType = value.dataType;
      this.propagateDataType();
    });
  }

  writeValue(value: string) {
    if (value) {
      this._dataType = value;
      this.setControlValue();
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
    return this.themeService.getCurrentTheme() === Theme.Dark;
  }

  private propagateChange = (_: any) => {};

  private setControlValue() {
    this.form.setValue({dataType: this._dataType}, {emitEvent: false});
  }

  private propagateDataType() {
    this.propagateChange(this._dataType);
  }
}
