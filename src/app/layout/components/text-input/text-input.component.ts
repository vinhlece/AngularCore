import {ChangeDetectionStrategy, Component, EventEmitter, forwardRef, Input, OnInit, Output} from '@angular/core';
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
import {ThemeService} from '../../../theme/theme.service';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextInputComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TextInputComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextInputComponent implements OnInit, ControlValueAccessor, Validator {
  private _fb: FormBuilder;

  form: FormGroup;

  @Input() placeholder: string;
  @Input() hint: string;
  @Input() required: boolean = true;
  @Input() isReadonly: boolean = false;
  @Input() isShowTitle: boolean = true;
  @Input() value: string;
  @Output() onEnter: EventEmitter<string> = new EventEmitter();

  constructor(fb: FormBuilder, themeService: ThemeService) {
    this._fb = fb;
  }

  ngOnInit() {
    const validatorFns = this.required && !this.isReadonly ? [Validators.required] : [];
    this.form = this._fb.group({
      value: [this.value ? this.value : null, validatorFns]
    });
  }

  writeValue(value: string) {
    if (value) {
      this.form.setValue({value}, {emitEvent: false});
    }
  }

  keyEnter(event: KeyboardEvent, value) {
    event.preventDefault();
    if (this.onEnter) {
      this.onEnter.emit(value);
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

  handleBlur() {
    this.propagateChange(this.form.value.value);
  }

  private propagateChange = (_: any) => {
    // no op
  };
}
