import {CommonModule} from '@angular/common';
import {MatIconModule, MatRippleModule} from '@angular/material';
import {sandboxOf} from 'angular-playground';
import {ContextMenuItemDirective} from './context-menu-item.directive';
import {ContextMenuComponent} from './context-menu.component';

export default sandboxOf(ContextMenuComponent, {
  imports: [
    CommonModule,
    MatRippleModule,
    MatIconModule
  ],
  declarations: [ContextMenuItemDirective]
})
  .add('Context menu', {
  template: `
    <app-context-menu [event]="event">
      <div appContextMenuItem><mat-icon>launch</mat-icon><span>Launch</span></div>
      <div appContextMenuItem><mat-icon>mode_edit</mat-icon><span>Edit</span></div>
      <div appContextMenuItem><mat-icon>delete</mat-icon><span>Delete</span></div>
    </app-context-menu>
  `,
  context: {
    event: {type: 'contextmenu', clientX: 100, clientY: 100}
  }
});
