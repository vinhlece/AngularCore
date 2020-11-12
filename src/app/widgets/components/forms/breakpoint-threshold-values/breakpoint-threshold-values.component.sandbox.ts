import {Component, OnInit} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material';
import {sandboxOf} from 'angular-playground';
import {BreakpointThresholdValuesComponent} from './breakpoint-threshold-values.component';

@Component({
  selector: 'app-gauge-threshold-breakpoints-sandbox',
  template: `
    <div [formGroup]="form">
      <app-breakpoint-threshold-values formControlName="breakpoints"></app-breakpoint-threshold-values>
    </div>
  `
})
class GaugeThresholdColorsSandboxComponent implements OnInit {
  form: FormGroup;

  constructor(private _fb: FormBuilder) {
  }

  ngOnInit() {
    this.form = this._fb.group({
      breakpoints: this._fb.control([null, null])
    });
  }
}

export default sandboxOf(GaugeThresholdColorsSandboxComponent, {
  imports: [
    MatInputModule,
    ReactiveFormsModule,
    FlexLayoutModule
  ],
  declarations: [BreakpointThresholdValuesComponent]
})
  .add('gauge threshold breakpoints', {
    template: `<app-gauge-threshold-breakpoints-sandbox></app-gauge-threshold-breakpoints-sandbox>`,
  });
