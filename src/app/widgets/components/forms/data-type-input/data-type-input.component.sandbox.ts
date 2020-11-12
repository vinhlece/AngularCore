import {sandboxOf} from 'angular-playground';
import {ReactiveFormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material';
import {DataTypeInputComponent} from './data-type-input.component';

export default sandboxOf(DataTypeInputComponent, {
  imports: [
    ReactiveFormsModule,
    MatSelectModule
  ]
})
  .add('data type input', {
    template: `<app-data-type-input [dataTypes]="dataTypes"></app-data-type-input>`,
    context: {
      dataTypes: ['Status', 'Performance']
    }
  });
