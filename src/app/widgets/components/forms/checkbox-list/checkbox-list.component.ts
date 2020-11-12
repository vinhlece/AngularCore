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
import {FlexibleChoiceInput} from '../flexible-choice-input/flexible-choice-input';
import {ChoiceMode} from '../flexible-choice-input/index';
import {MultipleChoiceMode} from '../measure-input/choice-mode';

@Component({
  selector: 'app-checkbox-list',
  templateUrl: './checkbox-list.component.html',
  styleUrls: ['./checkbox-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxListComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CheckboxListComponent),
      multi: true
    }
  ]
})
export class CheckboxListComponent extends FlexibleChoiceInput implements OnInit, OnChanges, ControlValueAccessor, Validator {
  private _fb: FormBuilder;
  private _choiceMode: ChoiceMode;

  @Input() required = true;
  form: FormGroup;

  constructor(fb: FormBuilder) {
    super();
    this._fb = fb;
  }

  private _propagateChange = (_) => {
  }

  ngOnInit() {
    this._choiceMode = new MultipleChoiceMode();
    this.form = this._choiceMode.configureControl(this._fb, true);
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
