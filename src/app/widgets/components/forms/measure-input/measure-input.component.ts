import {ChangeDetectionStrategy, Component, forwardRef, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
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
import {ChoiceMode} from '../flexible-choice-input';
import {FlexibleChoiceInput} from '../flexible-choice-input/flexible-choice-input';
import {MultipleChoiceMode, SingleChoiceMode} from './choice-mode';

@Component({
  selector: 'app-measure-input',
  templateUrl: './measure-input.component.html',
  styleUrls: ['./measure-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MeasureInputComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MeasureInputComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MeasureInputComponent extends FlexibleChoiceInput implements OnInit, OnChanges, ControlValueAccessor, Validator {
  private _fb: FormBuilder;
  private _choiceMode: ChoiceMode;

  form: FormGroup;

  @Input() required;
  @Input() placeholder = 'widgets.edit_widget_form.measure_select';
  @Input() label;

  constructor(fb: FormBuilder) {
    super();
    this._fb = fb;
  }

  private _propagateChange = (_) => {
  }

  ngOnInit() {
    if (FlexibleChoiceInput.isSingleChoiceMode(this.mode)) {
      this._choiceMode = new SingleChoiceMode();
    } else if (FlexibleChoiceInput.isMultipleChoicesMode(this.mode)) {
      this._choiceMode = new MultipleChoiceMode();
    }

    this.form = this._choiceMode.configureControl(this._fb, this.required);
    this._choiceMode.valueChanges((value: string[]) => {
      this.selectedOptions = value;
      this._propagateChange(this.selectedOptions);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.form && this.isOptionsChanged()) {
      this._choiceMode.update(this.selectedOptions, this.options, this.required);
    }
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
}
