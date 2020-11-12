import {sandboxOf} from 'angular-playground';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatCheckboxModule, MatSelectModule} from '@angular/material';
import {MeasureInputComponent} from './measure-input.component';
import {DescriptionComponent} from '../description/description.component';
import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-test-component',
  template: `
    <div [formGroup]="form">
      <app-measure-input formControlName="measures"
                         [mode]="mode"
                         [options]="availableMeasures"></app-measure-input>
    </div>
  `
})
class TestComponent implements OnInit {
  form: FormGroup;
  selectedMeasures: string | string[];
  availableMeasures = ['measure 1', 'measure 2', 'measureName 3', 'measureName 4', 'measureName 5'];

  @Input() mode: 'single' | 'multiple';
  constructor(private _fb: FormBuilder) {
  }

  ngOnInit() {
    this.form = this._fb.group({
      measures: this._fb.control(this.selectedMeasures)
    });
  }
}


export default sandboxOf(MeasureInputComponent, {
  imports: [
    ReactiveFormsModule,
    MatSelectModule,
    MatCheckboxModule
  ],
  declarations: [
    DescriptionComponent,
    TestComponent
  ]
})
  .add('Package name input single choice', {
  template: `<app-test-component [mode]="'single'"></app-test-component>`
})
  .add('Package name input multiple choices', {
  template: `<app-measure-input [mode]="'multiple'"></app-measure-input>`
});
