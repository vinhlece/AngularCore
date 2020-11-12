import {sandboxOf} from 'angular-playground';
import {RangeSelectorComponent} from './range-selector.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatAutocompleteModule, MatFormFieldModule, MatInputModule} from '@angular/material';

export default sandboxOf(RangeSelectorComponent, {
  imports: [
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule,
    MatInputModule,
    MatAutocompleteModule,
  ],
  declarations: [
    RangeSelectorComponent
  ]
})
  .add('RangeSelectorComponent', {
    template: `<app-range-selector style="width: 150px"
              [interval]="interval"></app-range-selector>`,
    context: {
      interval: {
        type: 'day',
        value: 1
      }
    }
  });
