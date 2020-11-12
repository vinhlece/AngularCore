import {Component, OnInit} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule, MatSelectModule} from '@angular/material';
import {sandboxOf} from 'angular-playground';
import {BreakpointThresholdColorsComponent} from './breakpoint-threshold-colors.component';
import {ColorInputComponent} from '../color-input/color-input.component';
import {ColorPickerModule} from 'ngx-color-picker';
import {AutoInvokeUrlColorComponent} from './auto-invoke-url-color/auto-invoke-url-color.component';
import {MatCheckboxModule} from '@angular/material/checkbox';

@Component({
  selector: 'app-gauge-threshold-colors-sandbox',
  template: `
    <div [formGroup]="form">
      <app-breakpoint-threshold-colors formControlName="colors"></app-breakpoint-threshold-colors>
    </div>
  `
})
class GaugeThresholdColorsComponentSandbox implements OnInit {
  form: FormGroup;
  colors = [{name: 'Red', value: '#F44336'}, {name: 'Green', value: '#388E3C'}, {name: 'Amber', value: '#FF6F00'}];

  constructor(private _fb: FormBuilder) {
  }

  ngOnInit() {
    this.form = this._fb.group({
      colors: this._fb.control([null, null, null])
    });
  }
}

export default sandboxOf(GaugeThresholdColorsComponentSandbox, {
  imports: [
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    FlexLayoutModule,
    ColorPickerModule,
    MatCheckboxModule
  ],
  declarations: [BreakpointThresholdColorsComponent, ColorInputComponent, AutoInvokeUrlColorComponent]
})
  .add('gauge threshold colors', {
    template: `<app-gauge-threshold-colors-sandbox></app-gauge-threshold-colors-sandbox>`,
  });
