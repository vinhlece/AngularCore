import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { createDashboard } from '../../../common/models/factory/createDashboard';
import { User } from '../../../user/models/user';
import * as fromUsers from '../../../user/reducers';
import * as dashboardActions from '../../actions/dashboards.action';
import { NewDialogWithTitleComponent } from '../../components/common/new-dialog-with-title.component';
import {Dashboard, Tab} from '../../models';
import * as fromDashboards from '../../reducers';
import {commonRouterList} from '../../../common/models/constants';
import {TranslateService} from '@ngx-translate/core';
import {isNullOrUndefined} from '../../../common/utils/function';
import {ThemeService} from '../../../theme/theme.service';
import {Theme} from '../../../theme/model/index';
import {Widget} from '../../../widgets/models/index';
import * as fromWidgets from '../../../widgets/reducers/index';
import * as widgetsActions from '../../../widgets/actions/widgets.actions';
import * as tabsActions from '../../actions/tabs.actions';
import * as fromUser from '../../../user/reducers/index';

@Component({
  selector: 'app-dashboard-management',
  templateUrl: './dashboard-management.container.html',
  styleUrls: ['./dashboard-management.container.scss']
})
export class DashboardManagementContainer implements OnInit, OnDestroy {
  private _dialogService: MatDialog;
  private _store: Store<fromDashboards.State>;
  private _userId: string;
  private _unsubscribe = new Subject<void>();
  private _themeService: ThemeService;

  routerList = commonRouterList('/dashboards');

  dashboards$: Observable<Dashboard[]>;
  tabs$: Observable<Tab[]>;
  widgets$: Observable<Widget[]>;
  user$: Observable<User>;

  constructor(store: Store<fromDashboards.State>, dialogService: MatDialog,
              public translate: TranslateService, themeService: ThemeService) {
    this._store = store;
    this._dialogService = dialogService;
    this._themeService = themeService;
  }

  ngOnInit() {
    this.dashboards$ = this._store.pipe(select(fromDashboards.getDashboards));
    this.tabs$ = this._store.pipe(select(fromDashboards.getTabs));
    this.widgets$ = this._store.pipe(select((fromWidgets.getWidgets)));
    this.user$ = this._store.pipe(select(fromUser.getAuthenticatedUser));
    this._store.dispatch(new widgetsActions.LoadAll());
    this._store.dispatch(new tabsActions.Load());

    this._store
      .pipe(
        select(fromUsers.getAuthenticatedUser),
        filter((user: User) => !isNullOrUndefined(user)),
        takeUntil(this._unsubscribe)
      )
      .subscribe((user: User) => {
        this._userId = user.id;
        this._store.dispatch(new dashboardActions.LoadAll(this._userId));
      });
  }

  ngOnDestroy() {
    this._unsubscribe.next();
    this._unsubscribe.unsubscribe();
  }

  addDashboard(info: { name: string, description?: string }) {
    if (isNullOrUndefined(info) || info.name === '') {
      return;
    }
    if (isNullOrUndefined(this._userId)) {
      throw new Error('Authentication required!');
    }

    this._store.dispatch(new dashboardActions.Add(createDashboard({ userId: this._userId, name: info.name, description: info.description})));
  }

  renameDashboard(dashboard) {
    if (isNullOrUndefined(dashboard) || dashboard.name === '') {
      return;
    }
    if (isNullOrUndefined(this._userId)) {
      throw new Error('Authentication required!');
    }

    this._store.dispatch(new dashboardActions.Update(dashboard));
  }

  openDashboardDialog(event: Dashboard) {
    let data = {
      name: null,
      description: null
    };
    let title = 'dashboard.simple_name_form.title_new_dashboard';
    if (event) {
      data = {
        name: event.name,
        description: event.description ? event.description : null
      };
      title = 'dashboard.simple_name_form.title_rename_dashboard';
    }
    const panelClass = this._themeService.getCurrentTheme() === Theme.Dark ? 'dark-theme-dialog' : '';

    const dialog = this._dialogService.open(NewDialogWithTitleComponent, {
      width: '600px',
      panelClass,
      data: {
        title,
        inputData: data
      }
    });
    dialog.afterClosed().subscribe((dashboard: Dashboard) => {
      if (isNullOrUndefined(dashboard)) {
        return false;
      }

      if (event) {
        const newDashboard = {
          ...event,
          name: dashboard.name,
          description: dashboard.description
        };
        this.renameDashboard(newDashboard);
      } else {
        this.addDashboard(dashboard);
      }
    });
  }

  deleteDashboard(dashboardId: string) {
    if (isNullOrUndefined(dashboardId)) {
      return;
    }
    this._store.dispatch(new dashboardActions.Delete(dashboardId));
  }

  copyDashboard(event: Dashboard) {
    if (isNullOrUndefined(event)) {
      return;
    }
    this._store.dispatch(new dashboardActions.Copy(event));
  }
}
