import {ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material';
import {sandboxOf} from 'angular-playground';
import {NumberInputComponent} from './number-input.component';

export default sandboxOf(NumberInputComponent, {
  imports: [
    ReactiveFormsModule,
    MatInputModule
  ]
})
  .add('number of lines', {
    template: `<app-number-input ></app-number-input>`,
  });
