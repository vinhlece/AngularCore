import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, FormArray, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {distinctUntilChanged} from 'rxjs/operators';
import {Url} from '../../../models';

@Component({
  selector: 'app-urls-input',
  templateUrl: './urls-input.component.html',
  styleUrls: ['./urls-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UrlsInputComponent),
      multi: true
    }
  ],
})
export class UrlsInputComponent implements OnInit, ControlValueAccessor {
  private _fb: FormBuilder;

  form: FormGroup;
  expandingUrl: number;

  @Input() measures: string[];
  @Input() required: boolean;

  constructor(fb: FormBuilder) {
    this._fb = fb;
  }

  get urls(): FormArray {
    return this.form.get('urls') as FormArray;
  }

  ngOnInit() {
    const validatorFns = this.required ? [Validators.required] : [];
    this.form = this._fb.group({
      urls: this._fb.array([], validatorFns),
    });
    this.form.valueChanges
      .pipe(distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)))
      .subscribe((value) => this._propagateChange(value.urls));
  }

  writeValue(value: Url[]) {
    if (value) {
      this.form.setControl('urls', this._fb.array(value));
    }
  }

  registerOnChange(fn: any) {
    this._propagateChange = fn;
  }

  registerOnTouched(fn: any) {
    // no op
  }

  handleAddUrl() {
    this.urls.push(this._fb.control(this.createUrl()));
  }

  handleRemoveUrl(index: number) {
    this.urls.removeAt(index);
  }

  handleOpened(idx: number) {
    this.expandingUrl = idx;
  }

  handleClosed(idx: number) {
  }

  private _propagateChange = (_: any) => {
    // no op
  };

  private createUrl(): Url {
    return {name: 'New AppConfig', baseUrl: null, measure: null};
  }
}
