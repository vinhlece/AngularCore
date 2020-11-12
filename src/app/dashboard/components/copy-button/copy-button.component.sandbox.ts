import {CopyButtonComponent} from './copy-button.component';
import {sandboxOf} from 'angular-playground';
import {MatButtonModule, MatIconModule, MatTooltipModule} from '@angular/material';

export default sandboxOf(CopyButtonComponent, {
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ]
})
  .add('with description', {
    template: `<app-copy-button description="Click to copy!"></app-copy-button>`
  });
