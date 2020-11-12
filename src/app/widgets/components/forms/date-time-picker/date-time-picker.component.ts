import {Component, forwardRef, Input, OnInit, ViewChild} from '@angular/core';
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
import {OwlDateTimeComponent} from 'ng-pick-datetime';
import {MultipleChoiceMode, SingleChoiceMode} from '../instance-input/choice-mode';
import {
  getFullMomentByString, getLocalMomentByTimestamp, getMomentByDateTime, getMomentByTimestamp
} from '../../../../common/services/timeUtils';
import {AppDateTimeFormat} from '../../../../common/models/enums';

@Component({
  selector: 'app-date-time-picker',
  templateUrl: './date-time-picker.component.html',
  styleUrls: ['./date-time-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateTimePickerComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DateTimePickerComponent),
      multi: true
    }
  ]
})
export class DateTimePickerComponent extends FlexibleChoiceInput implements OnInit, ControlValueAccessor, Validator {
  private _fb: FormBuilder;
  private _choiceMode: ChoiceMode;

  separatorKeyCodes = [KeyCodes.Enter];
  form: FormGroup;
  showError: boolean;
  isSingleMode: boolean;
  @ViewChild('dt') dateTimePicker: OwlDateTimeComponent<Date>;

  @Input() required;
  @Input() placeholder: string;
  @Input() widget;
  constructor(fb: FormBuilder) {
    super();
    this._fb = fb;
  }

  private _propagateChange = (_) => {
  }

  ngOnInit() {
    this.isSingleMode = FlexibleChoiceInput.isSingleChoiceMode(this.mode);
    this._choiceMode = this.isSingleMode ? new SingleChoiceMode() : new MultipleChoiceMode();
    this.form = this._choiceMode.configureControl(this._fb, this.required);
    this._choiceMode.valueChanges((value) => {
      this.selectedOptions = value[0] === null ? null : value.map(item => +item);
      this._propagateChange(this.selectedOptions);
    });
  }

  writeValue(value: any) {
    if (value) {
      this.selectedOptions = value.map(item => getMomentByTimestamp(item));
      this._choiceMode.update(this.selectedOptions, this.options, this.required);
    }
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

  displayData(): string[] {
    const data = this.selectedOptions.map(item => {
      return getMomentByTimestamp(+item).format(AppDateTimeFormat.dateTime);
    });
    return data;
  }

  handleRemoveValue(value: string) {
    (this._choiceMode as MultipleChoiceMode).removeValue(+getMomentByDateTime(value));
  }

  handleAddValue(event: MatChipInputEvent) {
    if (event.value === '') {
      return;
    }

    const value = getFullMomentByString(event.value, AppDateTimeFormat.dateTimePicker);
    if (value.isValid()) {
      (this._choiceMode as MultipleChoiceMode).addValue(+value);
      this.showError = false;
    } else {
      this.showError = true;
    }
    event.input.value = '';
  }
}
