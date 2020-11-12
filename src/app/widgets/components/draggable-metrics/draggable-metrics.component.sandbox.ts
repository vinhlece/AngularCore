import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ReactiveFormsModule} from '@angular/forms';
import {sandboxOf} from 'angular-playground';
import * as mockPackages from '../../../common/testing/mocks/mockPackages';
import {DraggableMetricsComponent} from './draggable-metrics.component';
import {MatIconModule} from '@angular/material';

export default sandboxOf(DraggableMetricsComponent, {
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatIconModule,
  ]
})
  .add('draggable metrics', {
  template: `
    <app-draggable-metrics [measure]="measure" [instance]="'New Sales'"></app-draggable-metrics>
  `,
  context: {
    measure: mockPackages.getOneMeasure()
  }
});
