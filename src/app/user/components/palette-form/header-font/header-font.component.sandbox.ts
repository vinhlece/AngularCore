import {sandboxOf} from 'angular-playground';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatCheckboxModule, MatFormFieldModule, MatInputModule, MatSelectModule} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {HeaderFontComponent} from './header-font.component';

export default sandboxOf(HeaderFontComponent, {
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
    HeaderFontComponent
  ]
})
  .add('HeaderFontComponent', {
    template: `<app-header-font></app-header-font>`
  });
