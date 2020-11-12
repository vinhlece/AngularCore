import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule, MatSelectModule} from '@angular/material';
import {sandboxOf} from 'angular-playground';
import {ColorInputComponent} from './color-input.component';
import {ColorPickerModule} from 'ngx-color-picker';

@Component({
  selector: 'app-test-color-input',
  template: `
    <div [formGroup]="form">
      <app-color-input-component formControlName="color"
                                 [label]="label"
                                 [colors]="colorList"
      ></app-color-input-component>
    </div>
  `
})
class TestColorInputComponent implements OnInit {
  form: FormGroup;

  label = 'Color';

  @Input() color: string;
  @Input() colors = null;

  constructor(private _fb: FormBuilder) {
  }

  ngOnInit() {
    this.form = this._fb.group({
      color: this._fb.control(this.color)
    });
  }
}

export default sandboxOf(TestColorInputComponent, {
  imports: [
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    ColorPickerModule
  ],
  declarations: [
    ColorInputComponent
  ]
})
  .add('Select color', {
    template: `<app-test-color-input [colors]="colors" [color]="color"></app-test-color-input>`,
    context: {
      colors: ['#ff00ff', '#ffffff'],
      color: '#ff00ff'
    }
  })
  .add('Pick color', {
    template: `<app-test-color-input [color]="color"></app-test-color-input>`,
    context: {
      color: '#ff00ff'
    }
  });
