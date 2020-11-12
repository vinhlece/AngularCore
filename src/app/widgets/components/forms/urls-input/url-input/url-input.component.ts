import {Url} from '../../../../models';
import {ChangeDetectionStrategy, Component, forwardRef, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-url-input',
  templateUrl: './url-input.component.html',
  styleUrls: ['./url-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UrlInputComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UrlInputComponent implements OnInit, ControlValueAccessor {
  private _fb: FormBuilder;

  form: FormGroup;

  @Input() measures: string[];

  constructor(fb: FormBuilder) {
    this._fb = fb;
  }

  ngOnInit() {
    this.form = this._fb.group({
      name: null,
      baseUrl: null,
      measure: null
    });
    this.form.valueChanges.subscribe((value) => {
      this._propagateChange(value);
    });
  }

  writeValue(url: Url) {
    if (url) {
      this.form.setValue(url, {emitEvent: false});
    }
  }

  registerOnChange(fn: any) {
    this._propagateChange = fn;
  }

  registerOnTouched(fn: any) {
    // no op
  }

  private _propagateChange = (_: any) => {
    // no op
  };
}
