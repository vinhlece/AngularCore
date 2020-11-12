import {ChangeDetectionStrategy, Component, forwardRef, Input, OnInit} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator
} from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import {KeyCodes} from '../../../../common/events/KeyCodes';
import {ChoiceMode} from '../flexible-choice-input';
import {FlexibleChoiceInput} from '../flexible-choice-input/flexible-choice-input';
import {MultipleChoiceMode, SingleChoiceMode} from './choice-mode';

@Component({
  selector: 'app-instance-input',
  templateUrl: './instance-input.component.html',
  styleUrls: ['./instance-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InstanceInputComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => InstanceInputComponent),
      multi: true
    }
  ]
})
export class InstanceInputComponent extends FlexibleChoiceInput implements OnInit, ControlValueAccessor, Validator {
  private _fb: FormBuilder;
  private _choiceMode: ChoiceMode;

  separatorKeyCodes = [KeyCodes.Enter];
  form: FormGroup;
  showError: boolean;

  @Input() required;
  @Input() inputValidators: Function[];
  @Input() description: string;
  @Input() placeholder: string = 'widgets.edit_widget_form.instance_placeholder';
  @Input() widget;
  constructor(fb: FormBuilder) {
    super();
    this._fb = fb;
  }

  private _propagateChange = (_) => {
  }

  ngOnInit() {
    this._choiceMode = FlexibleChoiceInput.isSingleChoiceMode(this.mode) ? new SingleChoiceMode() : new MultipleChoiceMode();
    this.form = this._choiceMode.configureControl(this._fb, this.required);
    this._choiceMode.valueChanges((value) => {
      this.selectedOptions = value;
      this._propagateChange(this.selectedOptions);
    });
  }

  writeValue(value: any) {
    this.selectedOptions = value;
    this._choiceMode.update(this.selectedOptions, this.options, this.required);
  }

  registerOnChange(fn: any) {
    this._propagateChange = fn;
  }

  registerOnTouched(fn: any) {
    // no op
  }

  validate(control: AbstractControl): ValidationErrors {
    return this.form.invalid ? {hasError: true} : null;
  }

  handleRemoveValue(value: string) {
    (this._choiceMode as MultipleChoiceMode).removeValue(value);
  }

  handleRemoveAll() {
    (this._choiceMode as MultipleChoiceMode).removeAll();
  }

  checkWidget() {
    return this.widget && this.widget.type === 'Sankey';
  }

  handleAddValue(event: MatChipInputEvent) {
    const value = event.value.trim();
    if (this.validateInput(value)) {
      (this._choiceMode as MultipleChoiceMode).addValue(value);
      this.showError = false;
    } else {
      this.showError = true;
    }
    event.input.value = '';
  }

  private validateInput(value: string): boolean {
    return this.inputValidators ? this.validateWithValidators(value) : true;
  }

  private validateWithValidators(value: string): boolean {
    return this.inputValidators.reduce((isValid: boolean, validator) => {
      return isValid && validator(this.form.value, value);
    }, true);
  }
}
