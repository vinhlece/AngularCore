import {sandboxOf} from 'angular-playground';
import {FontConfigComponent} from './font-config.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatCheckboxModule, MatFormFieldModule, MatInputModule, MatSelectModule} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';

export default sandboxOf(FontConfigComponent, {
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    FlexLayoutModule,
    MatSelectModule
  ],
  declarations: [
    FontConfigComponent
  ]
})
  .add('FontConfigComponent', {
    template: `<app-font-config></app-font-config>`
  });
