import {CommonModule} from '@angular/common';
import {MatButtonModule, MatIconModule, MatMenuModule, MatToolbarModule} from '@angular/material';
import {RouterTestingModule} from '@angular/router/testing';
import {sandboxOf} from 'angular-playground';
import {HeaderComponent} from './header.component';

export default sandboxOf(HeaderComponent, {
  imports: [
    CommonModule,
    MatMenuModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    RouterTestingModule
  ]
})
  .add('display title, login and signup button on header ' +
  'when user has not logged in ', {
  template: `<app-header userName="''">`
})
  .add('display menu icon, title and a dropdown button with account icon and username when user logged in, ', {
  template: `<app-header [userName]="'Ryan Roger'" [routerList]="routerList">`
})
  .add('display dashboard item in menu when location is at widget', {
  template: `<app-header [userName]="'Drink water'" [currentLocation]="'widget'" [routerList]="[
  {routerLink: 'dashboard', title: 'Manage Dashboards'},
  {routerLink: 'widget', title: 'Manage Widgets'}
]">`
})
  .add('display widget item in menu when location is at dashboard', {
  template: `<app-header [userName]="'Drink water'" [currentLocation]="'dashboard'" [routerList]="[
  {routerLink: 'dashboard', title: 'Manage Dashboards'},
  {routerLink: 'widget', title: 'Manage Widgets'}
]">`
});
