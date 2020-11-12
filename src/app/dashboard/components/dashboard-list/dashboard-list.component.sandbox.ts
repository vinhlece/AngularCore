import {CdkTableModule} from '@angular/cdk/table';
import {MatButtonModule, MatIconModule, MatMenuModule, MatSortModule, MatTableModule} from '@angular/material';
import {RouterTestingModule} from '@angular/router/testing';
import {sandboxOf} from 'angular-playground';

import {DashboardListComponent} from './dashboard-list.component';
import {ContextMenuComponent} from '../../../layout/components/context-menu/context-menu.component';

export default sandboxOf(DashboardListComponent, {
  imports: [
    CdkTableModule,
    MatSortModule,
    MatTableModule,
    MatButtonModule,
    MatMenuModule,
    RouterTestingModule,
    MatIconModule,
  ],
  declarations: [
    ContextMenuComponent
  ]
})
  .add('Show list of dashboard at table display and add new dashboard button', {
  template: `<app-dashboard-list [dashboards]="[
    {id: 1, name: 'ABC', tabs: []},
    {id: 2, name: '345354345', tabs: []},
    {id: 3, name: 'EGRHTEJ', tabs: []}
  ]">
  </app-dashboard-list>`
});
