import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatRadioModule} from '@angular/material';
import {sandboxOf} from 'angular-playground';
import {RadioButtonsComponent} from './radio-buttons.component';

@Component({
  selector: 'app-test-radio-buttons',
  template: `
    <div [formGroup]="form">
      <app-radio-buttons [values]="options" formControlName="value"></app-radio-buttons>
    </div>`
})
class TestRadioButtonsComponent implements OnInit {
  form: FormGroup;

  @Input() options: string[];
  @Input() value: string;

  constructor(private _fb: FormBuilder) {
  }

  ngOnInit() {
    this.form = this._fb.group({
      value: this.value
    });
  }
}

export default sandboxOf(TestRadioButtonsComponent, {
  imports: [
    ReactiveFormsModule,
    MatRadioModule
  ],
  declarations: [RadioButtonsComponent]
})
  .add('radio buttons', {
    template: `<app-test-radio-buttons [options]="options" [value]="value"></app-test-radio-buttons>`,
    context: {
      options: ['Status', 'Performance'],
      value: 'Status'
    }
  });
