import {ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material';
import {sandboxOf} from 'angular-playground';
import {PlaceholderTitleComponent} from './placeholder-title.component';

export default sandboxOf(PlaceholderTitleComponent, {
  imports: [
    MatInputModule,
    ReactiveFormsModule
  ]
})
  .add('placeholder title', {
    template: `<app-placeholder-title title="This is a placeholder title"></app-placeholder-title>`,
  });
