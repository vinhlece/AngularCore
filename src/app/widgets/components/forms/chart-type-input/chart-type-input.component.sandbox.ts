import {sandboxOf} from 'angular-playground';
import {ReactiveFormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material';
import {ChartTypeInputComponent} from './chart-type-input.component';

export default sandboxOf(ChartTypeInputComponent, {
  imports: [
    ReactiveFormsModule,
    MatSelectModule
  ]
})
  .add('chart type input', {
    template: `<app-chart-type-input [chartTypes]="chartTypes"></app-chart-type-input>`,
    context: {
      chartTypes: ['Vertical', 'Horizontal']
    }
  });
