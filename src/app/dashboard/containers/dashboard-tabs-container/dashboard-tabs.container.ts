import {AfterViewInit, Component, EventEmitter, Input, OnInit, Optional, Output} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Observable, Scheduler} from 'rxjs';
import * as placeholderActions from '../../actions/placeholders.actions';
import * as tabsActions from '../../actions/tabs.actions';
import {TabEvent} from '../../components/dashboard-tabs/dashboard-tabs.component';
import {Dashboard, Tab} from '../../models';
import * as fromDashboards from '../../reducers';
import * as _ from 'lodash';
import {async} from 'rxjs/internal/scheduler/async';
import * as tabEditorActions from '../../actions/tab-editor.actions';
import {User} from '../../../user/models/user';

@Component({
  selector: 'app-dashboard-tabs-container',
  templateUrl: './dashboard-tabs.container.html',
  styleUrls: ['./dashboard-tabs.container.scss']
})
export class DashboardTabsContainer implements OnInit, AfterViewInit {
  private _store: Store<fromDashboards.State>;

  tabs$: Observable<Tab[]>;
  private _scheduler: Scheduler;

  /** Get tabs from this dashboard */
  @Input() dashboard: Dashboard;
  @Input() globalFilter: boolean;
  @Input() user: User;

  @Output() onAddTab: EventEmitter<string> = new EventEmitter();

  constructor(store: Store<fromDashboards.State>, @Optional() scheduler: Scheduler) {
    this._store = store;
    this._scheduler = scheduler ? scheduler : async;
  }

  ngOnInit() {
    this.tabs$ = this._store.pipe(
      select(fromDashboards.getTabOfDashboard(this.dashboard.id))
    );
  }

  ngAfterViewInit() {
    if (this.user && this.dashboard) {
      const dashboards = localStorage.getItem('dashboards');
      if (dashboards) {
        const data = JSON.parse(dashboards);
        const existUserData = data[this.user.id] ? data[this.user.id] : [];
        const new_dashboards = {
          ...data,
          [this.user.id]: _.union(existUserData, [this.dashboard.id])
        };
        localStorage.setItem('dashboards', JSON.stringify(new_dashboards));
      } else {
        localStorage.setItem('dashboards', JSON.stringify({
          [this.user.id]: [this.dashboard.id]
        }));
      }
    }
  }


  handleSelectTab(event: TabEvent) {
    const {tab, isCurrentTab} = event;
    if (!isCurrentTab) {
      this._store.dispatch(new tabsActions.Exit());
      this._store.dispatch(new tabsActions.Select(tab));
      this.dispatchGlobalFilters(tab.globalFilters);
    }
  }

  handleAddTab() {
    this.onAddTab.emit(this.dashboard.userId);
  }

  handleDeleteTab(tabEvent: TabEvent) {
    const {tab, isCurrentTab} = tabEvent;
    this._store.dispatch(new tabsActions.Delete(tab));

    if (isCurrentTab) {
      this._store.dispatch(new placeholderActions.ReleasePlaceholders());
    }
  }

  dispatchGlobalFilters(event: string[]) {
    this._store.dispatch(new tabsActions.GlobalFilters(event));
  }

  handleAddInstance(tabId: string) {
    this._store.dispatch(new tabEditorActions.AddInstance(tabId));
  }

  handleRemoveInstance(data: any) {
    this._store.dispatch(new tabEditorActions.RemoveInstance(data));
  }

  handleMetricsSize() {
    this._store.dispatch(new tabEditorActions.AdjustSize());
  }
}
