import {ReactiveFormsModule} from '@angular/forms';
import {MatCheckboxModule, MatFormFieldModule, MatInputModule} from '@angular/material';
import {sandboxOf} from 'angular-playground';
import {ThresholdLineInputComponent} from './threshold-line-input.component';
import {FlexModule} from '@angular/flex-layout';

export default sandboxOf(ThresholdLineInputComponent, {
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatCheckboxModule,
    MatFormFieldModule,
    FlexModule
  ]
})
  .add('plotLine setting', {
    template: `<app-threshold-line-input ></app-threshold-line-input>`,
  });
