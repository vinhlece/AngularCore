import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class UserNavigator {
  private static readonly LOGIN_PATH = '/login';
  private static readonly DASHBOARD_PATH = '/dashboards';
  private static readonly USER_PATH = '/user';
  private _router: Router;

  constructor(router: Router) {
    this._router = router;
  }

  navigateToDashboard() {
    this.navigateTo(UserNavigator.DASHBOARD_PATH);
  }

  navigateToLogin(previousUrl?) {
    this._router.navigate(['/login'], { queryParams: { previousUrl: previousUrl } });
  }

  navigateToUserDetails(id: string) {
    this.navigateTo(`${UserNavigator.USER_PATH}/${id}`);
  }

  navigateToUser() {
    this.navigateTo(`${UserNavigator.USER_PATH}`);
  }

  navigateTo(url: string) {
    this._router.navigateByUrl(url);
  }

  unSubAutoLogin() {
    // Auth.signOut().then(() => {
    //   this._router.navigate(['/login'], { queryParams: { reLogin: false } });
    // });
  }
}
