import {
  Component, ElementRef, EventEmitter, forwardRef, Input, OnChanges, OnInit, Output,
  ViewChild
} from '@angular/core';
import {
  AbstractControl, FormBuilder, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors,
  Validators
} from '@angular/forms';
import {ThemeService} from '../../../theme/theme.service';
import {Theme} from '../../../theme/model/index';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchBoxComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SearchBoxComponent),
      multi: true
    }
  ],
})
export class SearchBoxComponent implements OnInit {
  private _fb: FormBuilder;
  private _autoCompleteOptions: string[] = [];
  private _themeService: ThemeService;

  @Input() placeHolder: string;
  @Input() required: boolean = true;
  @Input() resetInComplete: boolean = false;
  @Input() validateAutoComplete: boolean = false;
  @Input()
  get autoCompleteOptions(): string[] {
    return this._autoCompleteOptions;
  }
  set autoCompleteOptions(value: string[]) {
    this._autoCompleteOptions = value;
    this.filteredOptions = value;
  }
  @Output() onEnter: EventEmitter<string> = new EventEmitter();
  @Output() onChange: EventEmitter<string> = new EventEmitter();
  @ViewChild('inputSearchBox') input: ElementRef;
  form: FormGroup;
  filteredOptions: string[];

  constructor(fb: FormBuilder, themeService: ThemeService) {
    this._fb = fb;
    this._themeService = themeService;
  }

  ngOnInit() {
    this.createForm();
    this.form.valueChanges.subscribe((value) => {
      if (this.onChange) {
        this.onChange.emit(value.value);
      }
      this._propagateChange(value.value);

    });

    this.filteredOptions = this.autoCompleteOptions;
  }

  handleTextChanged(value: string) {
    if (value) {
      const reg: RegExp = new RegExp(value, 'i');
      this.filteredOptions = this.autoCompleteOptions.filter(state => reg.test(state));
    } else {
      this.filteredOptions = this.autoCompleteOptions;
    }
  }

  keyEnter(event: KeyboardEvent, value) {
    event.preventDefault();
    this.handleEmitValue(value);
  }

  writeValue(value): void {
    if (value) {
      this.form.get('value').setValue(value, {emitEvent: false});
    }
  }

  registerOnChange(fn: any): void {
    this._propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  validate(c: AbstractControl): ValidationErrors | any {
    const err = {
      required: true
    };
    return this.form.invalid ? err : null;
  }

  handleSelected(event) {
    this.handleEmitValue(event.option.value);
  }

  isDarkTheme() {
    if (this._themeService.getCurrentTheme() === Theme.Dark) {
      return 'dark-theme-box';
    }
    return '';
  }

  private handleEmitValue(value: string) {
    if (this.onEnter) {
      if (this.input && this.resetInComplete) {
        if (!this.autoCompleteOptions.find(item => item === value)) { return; }
        this.form.get('value').setValue(null, {emitEvent: false});
        this.input.nativeElement.blur();
      }
      this.onEnter.emit(value);
    }
  }

  private _propagateChange = (_: any) => {
  };

  private createForm() {
    const autoComplete = this.validateAutoComplete ? [(c) => this.validateOptions(c)] : [];
    const validatorFns = this.required ? [...autoComplete, Validators.required] : autoComplete;
    this.form = this._fb.group({
      value: [null, validatorFns]
    });
  }

  private validateOptions(c: AbstractControl) {
    const notExisted = c.value && this.autoCompleteOptions.findIndex(item => item === c.value) < 0;
    return notExisted ? {notExisted: true} : null;
  }
}
