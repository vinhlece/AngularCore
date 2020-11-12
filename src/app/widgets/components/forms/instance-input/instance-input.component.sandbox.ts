import {ReactiveFormsModule} from '@angular/forms';
import {MatChipsModule, MatIconModule, MatInputModule} from '@angular/material';
import {sandboxOf} from 'angular-playground';
import {InstanceInputComponent} from './instance-input.component';
import {DescriptionComponent} from '../description/description.component';

export default sandboxOf(InstanceInputComponent, {
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatChipsModule
  ],
  declarations: [
    DescriptionComponent,
  ]
})
  .add('Instance input single choice with text box', {
  template: `<app-instance-input [mode]="mode" [options]="options"></app-instance-input>`,
  context: {
    options: ['Contacts Answered', 'Contacts Abandoned'],
    mode: 'single'
  }
})
  .add('Instance input multiple choices with chips', {
  template: `<app-instance-input [mode]="mode" [options]="options"></app-instance-input>`,
  context: {
    options: ['Contacts Answered', 'Contacts Abandoned'],
    mode: 'multiple'
  }
});
