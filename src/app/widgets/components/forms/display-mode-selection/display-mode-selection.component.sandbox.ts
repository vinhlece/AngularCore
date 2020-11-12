import {Component, Input, OnInit} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule, MatSelectModule} from '@angular/material';
import {sandboxOf} from 'angular-playground';
import {DisplayMode} from '../../../../dashboard/models/enums';
import {DisplayModeSelectionComponent} from './display-mode-selection.component';

@Component({
  selector: 'app-test-display-mode-selection',
  template: `
    <div [formGroup]="form">
      <app-display-mode-selection [displayModes]="options" formControlName="displayMode"></app-display-mode-selection>
    </div>`
})
class TestDisplayModeSelectionComponent implements OnInit {
  form: FormGroup;

  @Input() options: DisplayMode[];
  @Input() value: DisplayMode;

  constructor(private _fb: FormBuilder) {
  }

  ngOnInit() {
    this.form = this._fb.group({
      displayMode: this.value
    });
  }
}

export default sandboxOf(TestDisplayModeSelectionComponent, {
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    FlexLayoutModule
  ],
  declarations: [
    DisplayModeSelectionComponent
  ]
})
  .add('provide one of options values', {
    template: `<app-test-display-mode-selection [options]="options" [value]="value"></app-test-display-mode-selection>`,
    context: {
      options: [DisplayMode.Latest, DisplayMode.Historical],
      value: DisplayMode.Latest
    }
  })
  .add('provide value not in options', {
    template: `<app-test-display-mode-selection [options]="options" [value]="value"></app-test-display-mode-selection>`,
    context: {
      options: [DisplayMode.Latest, DisplayMode.Historical],
      value: 'abc'
    }
  })
  .add('provide null value', {
    template: `<app-test-display-mode-selection [options]="options" [value]="value"></app-test-display-mode-selection>`,
    context: {
      options: [DisplayMode.Latest, DisplayMode.Historical],
      value: null
    }
  })
  .add('provide null options', {
    template: `<app-test-display-mode-selection [options]="options" [value]="value"></app-test-display-mode-selection>`,
    context: {
      options: null,
      value: 'abc'
    }
  });
