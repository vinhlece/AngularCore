import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material';
import {sandboxOf} from 'angular-playground';
import {DisplayDataComponent} from './display-data.component';

@Component({
  selector: 'app-test-display-data',
  template: `
    <div [formGroup]="form">
      <app-display-data formControlName="displayData" [options]="options"></app-display-data>
    </div>`
})
class TestDisplayDataComponent implements OnInit {
  form: FormGroup;

  @Input() options: string[];
  @Input() value: string;

  constructor(private _fb: FormBuilder) {
  }

  ngOnInit() {
    this.form = this._fb.group({
      displayData: this.value
    });
  }
}

export default sandboxOf(TestDisplayDataComponent, {
  imports: [
    ReactiveFormsModule,
    MatSelectModule
  ],
  declarations: [DisplayDataComponent]
})
  .add('has default value', {
    template: `<app-test-display-data [options]="options" [value]="value"></app-test-display-data>`,
    context: {
      options: ['Latest', 'Interval'],
      value: 'Latest'
    }
  })
  .add('do not has default value', {
    template: `<app-test-display-data [options]="options" [value]="value"></app-test-display-data>`,
    context: {
      options: ['Latest', 'Interval'],
      value: null
    }
  })
  .add('default value is not in options', {
    template: `<app-test-display-data [options]="options" [value]="value"></app-test-display-data>`,
    context: {
      options: ['Latest', 'Interval'],
      value: 'abc'
    }
  })
  .add('empty options', {
    template: `<app-test-display-data [options]="options" [value]="value"></app-test-display-data>`,
    context: {
      options: [],
      value: 'abc'
    }
  })
  .add('null options', {
    template: `<app-test-display-data [options]="options" [value]="value"></app-test-display-data>`,
    context: {
      options: null,
      value: 'abc'
    }
  });
