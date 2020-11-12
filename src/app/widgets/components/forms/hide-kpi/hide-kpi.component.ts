import {Component, forwardRef, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-hide-kpi',
  templateUrl: './hide-kpi.component.html',
  styleUrls: ['./hide-kpi.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => HideKpiComponent),
      multi: true
    }
  ]
})
export class HideKpiComponent implements OnInit {
  private _fb: FormBuilder;
  form: FormGroup;

  constructor(fb: FormBuilder) {
    this._fb = fb;
  }

  ngOnInit() {

    this.form = this._fb.group({
      upper: this._fb.control(null),
      lower: this._fb.control(null)
    });
    this.form.valueChanges.subscribe((value) => {
      this._propagateChange(value);
    });
  }

  writeValue(value) {
    if (value) {
      const data = {
        ...value
      };
      this.form.setValue(data, {emitEvent: false})
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
  }
}
