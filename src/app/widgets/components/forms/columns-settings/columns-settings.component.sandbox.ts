import {Component, OnInit} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatSelectModule
} from '@angular/material';
import {sandboxOf} from 'angular-playground';
import {Column} from '../../../models';
import {ColumnEditorComponent} from '../column-editor/column-editor.component';
import {SelectionPanelComponent} from '../selection-panel/selection-panel.component';
import {ColumnsSettingsComponent} from './columns-settings.component';
import {NumberInputComponent} from '../number-input/number-input.component';
import {GaugeThresholdComponent} from '../breakpoint-threshold-input/breakpoint-threshold-input.component';
import {BreakpointThresholdValuesComponent} from '../breakpoint-threshold-values/breakpoint-threshold-values.component';
import {BreakpointThresholdColorsComponent} from '../breakpoint-threshold-colors/breakpoint-threshold-colors.component';
import {ColorInputComponent} from '../color-input/color-input.component';
import {ColorPickerModule} from 'ngx-color-picker';

@Component({
  selector: 'app-test-columns-settings',
  template: `
    <div [formGroup]="form">
      <app-columns-settings [availableColumns]="availableColumns" formControlName="columns"></app-columns-settings>
    </div>`
})
class TestColumnsSettingsComponent implements OnInit {
  form: FormGroup;
  addedColumns: Column[] = [];
  availableColumns: Column[] = [
    {id: 'Key', type: 'string'},
    {id: 'Timestamp', type: 'datetime'},
    {id: 'ContactsAnswered', type: 'number'}
  ];

  constructor(private _fb: FormBuilder) {
  }

  ngOnInit() {
    this.form = this._fb.group({
      columns: this.addedColumns
    });
  }
}

export default sandboxOf(TestColumnsSettingsComponent, {
  imports: [
    ReactiveFormsModule,
    MatListModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatInputModule,
    MatCheckboxModule,
    FlexLayoutModule,
    ColorPickerModule
  ],
  declarations: [
    ColumnsSettingsComponent,
    SelectionPanelComponent,
    ColumnEditorComponent,
    NumberInputComponent,
    GaugeThresholdComponent,
    BreakpointThresholdValuesComponent,
    BreakpointThresholdColorsComponent,
    ColorInputComponent
  ]
})
  .add('columns settings', {
    template: `<app-test-columns-settings></app-test-columns-settings>`
  });
