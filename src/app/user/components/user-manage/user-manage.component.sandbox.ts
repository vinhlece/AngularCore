import { sandboxOf } from 'angular-playground';
import { UserManageComponent } from './user-manage.component';
import {MatButtonModule, MatIconModule, MatMenuModule, MatSortModule, MatTableModule} from '@angular/material';
import {RouterTestingModule} from '@angular/router/testing';

export default sandboxOf(UserManageComponent, {
  imports: [
    MatSortModule,
    MatTableModule,
    MatButtonModule,
    MatMenuModule,
    RouterTestingModule,
    MatIconModule,
  ],
  declarations: [
  ]
})

  .add('Show list of user at table display', {
    template: `<app-user-manage [users]="[
    {id: 1, displayName: 'ABC', tabs: []},
    {id: 2, displayName: '345354345', tabs: []},
    {id: 3, displayName: 'EGRHTEJ', tabs: []}
  ]"></app-user-manage>`
  });
