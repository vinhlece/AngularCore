import {ReactiveFormsModule} from '@angular/forms';
import {MatCheckboxModule, MatSelectModule} from '@angular/material';
import {sandboxOf} from 'angular-playground';
import {CheckboxComponent} from './checkbox.component';

export default sandboxOf(CheckboxComponent, {
  imports: [
    ReactiveFormsModule,
    MatSelectModule,
    MatCheckboxModule
  ]
})
  .add('checkbox', {
    template: `<app-checkbox></app-checkbox>`
  });
