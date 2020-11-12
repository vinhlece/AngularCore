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
import {WidgetSize} from '../../../models';

@Component({
  selector: 'app-widget-size',
  templateUrl: './widget-size-input.component.html',
  styleUrls: ['./widget-size-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WidgetSizeInputComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => WidgetSizeInputComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WidgetSizeInputComponent implements ControlValueAccessor, OnInit, Validator {
  // Default widget min/max values
  private static readonly MIN_SIZE = 1;
  private static readonly MAX_SIZE = 12;

  private _fb: FormBuilder;
  private _size: WidgetSize;


  form: FormGroup;

  @Input() min: number;
  @Input() max: number;


  private static validateWidgetSize(control: AbstractControl) {
    return {
      required: WidgetSizeInputComponent.hasRequiredError(control),
      invalidSize: !WidgetSizeInputComponent.hasRequiredError(control) && WidgetSizeInputComponent.hasRangeError(control)
    };
  }

  private static hasRangeError(control: AbstractControl) {
    return control.hasError('min') || control.hasError('max');
  }

  private static hasRequiredError(control: AbstractControl) {
    return control.hasError('required');
  }

  constructor(fb: FormBuilder) {
    this._fb = fb;
  }

  ngOnInit() {
    this.min = this.min || WidgetSizeInputComponent.MIN_SIZE;
    this.max = this.max || WidgetSizeInputComponent.MAX_SIZE;

    const sizeValidator = Validators.compose([
      Validators.required,
      Validators.min(this.min),
      Validators.max(this.max)
    ]);

    this.form = this._fb.group({
      rows: [null, sizeValidator],
      columns: [null, sizeValidator]
    });
    this.form.valueChanges.subscribe((size: WidgetSize) => {
      this._size = size;
      this._propagateChange(this._size);
    });
  }

  writeValue(value: WidgetSize) {
    if (value && Object.keys(value).length > 0) {
      this._size = value;
      this.setControlsValue();
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
      widgetSizeError: {
        given: control.value,
        hasError: true
      }
    };

    return this.form.invalid ? err : null;
  }


  get errors() {
    return {
      rows: this.validateRows(),
      columns: this.validateColumns()
    };
  }

  handleKeyPress(event) {
    return event.charCode >= 48 && event.charCode <= 57;
  }

  private _propagateChange = (_: any) => {
  };

  private setControlsValue() {
    this.form.setValue(this._size, {emitEvent: false});
  }

  private validateRows() {
    const rows = this.getRowsControl();
    return WidgetSizeInputComponent.validateWidgetSize(rows);
  }

  private validateColumns() {
    const columns = this.getColumnsControl();
    return WidgetSizeInputComponent.validateWidgetSize(columns);
  }

  private getRowsControl(): AbstractControl {
    return this.getControl('rows');
  }

  private getColumnsControl(): AbstractControl {
    return this.getControl('columns');
  }

  private getControl(controlName: string): AbstractControl {
    return this.form.get(controlName);
  }
}
