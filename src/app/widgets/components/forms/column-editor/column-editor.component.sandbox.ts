import {Component, OnInit} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatCheckboxModule, MatInputModule, MatSelectModule} from '@angular/material';
import {sandboxOf} from 'angular-playground';
import {ColorPickerModule} from 'ngx-color-picker';
import {Column} from '../../../models';
import {BreakpointThresholdColorsComponent} from '../breakpoint-threshold-colors/breakpoint-threshold-colors.component';
import {GaugeThresholdComponent} from '../breakpoint-threshold-input/breakpoint-threshold-input.component';
import {BreakpointThresholdValuesComponent} from '../breakpoint-threshold-values/breakpoint-threshold-values.component';
import {ColorInputComponent} from '../color-input/color-input.component';
import {NumberInputComponent} from '../number-input/number-input.component';
import {ColumnEditorComponent} from './column-editor.component';

@Component({
  selector: 'app-test-column-editor',
  template: `
    <div [formGroup]="form">
      <app-column-editor formControlName="column"></app-column-editor>
    </div>`
})
class TestColumnEditorComponent implements OnInit {
  form: FormGroup;
  column: Column = {id: 'Key', type: 'string'};

  constructor(private _fb: FormBuilder) {
  }

  ngOnInit() {
    this.form = this._fb.group({
      column: this.column
    });
  }
}

export default sandboxOf(TestColumnEditorComponent, {
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatCheckboxModule,
    FlexLayoutModule,
    MatSelectModule,
    ColorPickerModule,
  ],
  declarations: [
    ColumnEditorComponent,
    NumberInputComponent,
    GaugeThresholdComponent,
    BreakpointThresholdValuesComponent,
    BreakpointThresholdColorsComponent,
    ColorInputComponent,
  ]
})
  .add('column editor', {
    template: `<app-test-column-editor></app-test-column-editor>`
  });
