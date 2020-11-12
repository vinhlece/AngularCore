import {FlexLayoutModule} from '@angular/flex-layout';
import {ReactiveFormsModule} from '@angular/forms';
import {MatInputModule, MatSelectModule} from '@angular/material';
import {sandboxOf} from 'angular-playground';
import {BreakpointThresholdValuesComponent} from '../breakpoint-threshold-values/breakpoint-threshold-values.component';
import {BreakpointThresholdColorsComponent} from '../breakpoint-threshold-colors/breakpoint-threshold-colors.component';
import {GaugeThresholdComponent} from './breakpoint-threshold-input.component';
import {ColorPickerModule} from 'ngx-color-picker';
import {ColorInputComponent} from '../color-input/color-input.component';

export default sandboxOf(GaugeThresholdComponent, {
  imports: [
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    ColorPickerModule
  ],
  declarations: [
    BreakpointThresholdValuesComponent,
    BreakpointThresholdColorsComponent,
    ColorInputComponent
  ]
})
  .add('gauge threshold', {
    template: `<app-breakpoint-threshold-input></app-breakpoint-threshold-input>`,
  });
