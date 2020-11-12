import {MatButtonModule, MatIcon, MatIconModule, MatTooltipModule} from '@angular/material';
import {RouterTestingModule} from '@angular/router/testing';
import {sandboxOf} from 'angular-playground';
import {SidebarComponent} from './sidebar.component';

export default sandboxOf(SidebarComponent, {
  imports: [
    RouterTestingModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
  ]
})
  .add('Sidebar navigation', {
  template: `<app-sidebar></app-sidebar>`
});
