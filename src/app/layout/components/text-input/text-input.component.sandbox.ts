import {sandboxOf} from 'angular-playground';
import {ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material';
import {TextInputComponent} from './text-input.component';

export default sandboxOf(TextInputComponent, {
  imports: [
    ReactiveFormsModule,
    MatInputModule
  ]
})
  .add('text input', {
    template: `<app-text-input></app-text-input>`,
  });
