import {
  ChangeDetectionStrategy, Component, EventEmitter, forwardRef, Input, OnInit,
  Output
} from '@angular/core';
import {ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR} from '@angular/forms';
import {isNullOrUndefined} from 'util';
import {ThemeService} from '../../../../theme/theme.service';
import {Theme} from '../../../../theme/model/index';

@Component({
  selector: 'app-selection',
  templateUrl: 'selection.component.html',
  styleUrls: ['selection.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectionComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectionComponent implements OnInit, ControlValueAccessor {
  private _fb: FormBuilder;
  private _themeService: ThemeService;

  @Input() placeholder: string;
  @Input() options: any[];
  @Output() onSelected = new EventEmitter<string>();

  form: FormGroup;
  get isTranslation(): boolean {
    if (this.options.length === 0 || typeof this.options[0] === 'string') {
      return false;
    }
    return true;
  }

  constructor(fb: FormBuilder, themeService: ThemeService) {
    this._fb = fb;
    this._themeService = themeService;
  }

  ngOnInit() {
    this.form = this._fb.group({
      selected: this._fb.control({value: false, disabled: false})
    });
    this.form.valueChanges.subscribe((value) => {
      this._propagateChange(value.selected);
      this.onSelected.emit(value.selected);
    });
  }

  writeValue(value: string) {
    if (isNullOrUndefined(value)) {
      this.form.get('selected').setValue(null, {emitEvent: false});
    } else {
      this.form.get('selected').setValue(value, {emitEvent: false});
    }
  }

  setDisabledState(disabled: boolean) {
    const control = this.form.get('selected');
    if (disabled) {
      control.disable({emitEvent: false});
    } else {
      control.enable({emitEvent: false});
    }
  }

  registerOnChange(fn: any) {
    this._propagateChange = fn;
  }

  registerOnTouched(fn: any) {
    // no op
  }

  isDarkTheme() {
    return this._themeService.getCurrentTheme() === Theme.Dark;
  }

  private _propagateChange = (_: any) => {
    // no op
  }
}
