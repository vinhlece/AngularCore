import {ReactiveFormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material';
import {sandboxOf} from 'angular-playground';
import {SelectionComponent} from './selection.component';

export default sandboxOf(SelectionComponent, {
  imports: [
    ReactiveFormsModule,
    MatSelectModule,
  ]
})
  .add('selection', {
    template: `<app-selection [options]="options"></app-selection>`,
    context: {
      options: [
        'name1',
        'name2',
        'name3'
      ]
    }
  });
