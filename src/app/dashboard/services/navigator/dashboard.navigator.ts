import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {DashboardNavigator} from '../index';

@Injectable()
export class DashboardNavigatorImpl implements DashboardNavigator {
  private static readonly DASHBOARD_PATH = '/dashboards';
  private _router: Router;

  constructor(router: Router) {
    this._router = router;
  }

  navigateToDashboardList() {
    this.navigateTo(DashboardNavigatorImpl.DASHBOARD_PATH);
  }

  navigateToDashboardDetails(id: string) {
    this.navigateTo(`${DashboardNavigatorImpl.DASHBOARD_PATH}/${id}`);
  }

  private navigateTo(url: string) {
    this._router.navigateByUrl(url);
  }
}
