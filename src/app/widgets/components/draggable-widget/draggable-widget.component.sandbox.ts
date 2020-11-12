import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ReactiveFormsModule} from '@angular/forms';
import {sandboxOf} from 'angular-playground';
import {mockBarWidget, mockTabularWidget} from '../../../common/testing/mocks/widgets';
import {DraggableWidgetComponent} from './draggable-widget.component';
import {MatIconModule} from '@angular/material';
import {GridService} from '../../../dashboard/services/grid/grid.service';

export default sandboxOf(DraggableWidgetComponent, {
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatIconModule
  ],
  declarations: [
    DraggableWidgetComponent,
  ],
  providers: [
    GridService
  ]
})
  .add('tabular widget item', {
  template: `
    <app-draggable-widget [widget]="widget"></app-draggable-widget>
  `,
  context: {
    widget: mockTabularWidget({name: 'Tabular'}),
  }
})
  .add('bar widget item', {
  template: `
    <app-draggable-widget [widget]="widget"></app-draggable-widget>
  `,
  context: {
    widget: mockBarWidget({name: 'Bar'}),
  }
});
