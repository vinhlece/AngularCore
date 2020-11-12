import {ReactiveFormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material';
import {sandboxOf} from 'angular-playground';
import {WidgetType} from '../../../constants/widget-types';
import {WidgetTypeInputComponent} from './widget-type-input.component';

export default sandboxOf(WidgetTypeInputComponent, {
  imports: [
    ReactiveFormsModule,
    MatSelectModule
  ]
})
  .add('widget type input', {
    template: `<app-widget-type-input [types]="types"></app-widget-type-input>`,
    context: {
      types: [WidgetType.Line, WidgetType.Bar, WidgetType.Billboard]
    }
  });
