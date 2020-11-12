import {FlexLayoutModule} from '@angular/flex-layout';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule, MatCheckboxModule, MatInputModule, MatSelectModule} from '@angular/material';
import {sandboxOf} from 'angular-playground';
import {TextInputComponent} from '../../../../layout/components/text-input/text-input.component';
import {WidgetSizeInputComponent} from '../widget-size-input/widget-size-input.component';
import {WidgetTypeInputComponent} from '../widget-type-input/widget-type-input.component';
import {AddWidgetFormComponent} from './add-widget-form.component';

export default sandboxOf(AddWidgetFormComponent, {
  imports: [
    ReactiveFormsModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    FlexLayoutModule,
    MatCheckboxModule
  ],
  declarations: [
    TextInputComponent,
    WidgetTypeInputComponent,
    WidgetSizeInputComponent
  ]
})
  .add('add widget form', {
    template: `<app-add-widget-form [widgetTypes]="['Bar', 'Pie']" [dataTypes]="['Queue Performance']"></app-add-widget-form>`
  });
