import {FlexLayoutModule} from '@angular/flex-layout';
import {ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material';
import {sandboxOf} from 'angular-playground';
import {WidgetSizeInputComponent} from './widget-size-input.component';

export default sandboxOf(WidgetSizeInputComponent, {
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    FlexLayoutModule
  ]
})
  .add('widget size input', {
    template: `<app-widget-size [min]="1" [max]="12"></app-widget-size>`
  });
