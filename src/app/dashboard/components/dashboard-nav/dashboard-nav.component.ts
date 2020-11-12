import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Dashboard, Tab} from '../../models';

@Component({
  selector: 'app-dashboard-nav',
  templateUrl: './dashboard-nav.component.html',
  styleUrls: ['./dashboard-nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardNavComponent {
  @Input() dashboard: Dashboard;
  @Output() onAddTab = new EventEmitter<any>();

  handleAddTab(tab: Tab) {
    this.onAddTab.emit(tab);
  }
}
