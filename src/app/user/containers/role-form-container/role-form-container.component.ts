import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/index';
import {Role} from '../../../common/models/index';
import * as fromUsers from '../../reducers/index';
import {select, Store} from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import * as RoleActions from '../../actions/role.action';
import {NewDialogWithTitleComponent} from '../../../dashboard/components/common/new-dialog-with-title.component';
import {isNullOrUndefined} from 'util';
import {ThemeService} from '../../../theme/theme.service';
import {Theme} from '../../../theme/model/index';

@Component({
  selector: 'app-role-form-container',
  templateUrl: './role-form-container.component.html',
  styleUrls: ['./role-form-container.component.scss']
})
export class RoleFormContainerComponent implements OnInit {
  roles$: Observable<Role[]>;
  private _dialogService: MatDialog;
  private _store: Store<fromUsers.State>;
  private _themeService: ThemeService;

  constructor(store: Store<fromUsers.State>, dialogService: MatDialog, themeService: ThemeService) {
    this._store = store;
    this._dialogService = dialogService;
    this._themeService = themeService;
  }

  ngOnInit() {
    this._store.dispatch(new RoleActions.LoadAll());
    this.roles$ = this._store.pipe(select(fromUsers.getAllRoles));
  }

  openCreateNewRoleDialog() {
    const panelClass = this._themeService.getCurrentTheme() === Theme.Dark ? 'dark-theme-dialog' : '';
    const dialog = this._dialogService.open(NewDialogWithTitleComponent, {
      width: '600px',
      panelClass,
      data: {
        title: 'New Role',
        inputData: {name: null}
      }
    });
    dialog.afterClosed().subscribe((role: Role) => {
      if (isNullOrUndefined(role.name)) {
        return false;
      }
      if (isNullOrUndefined(role.name) || role.name === '') {
        return;
      }
      this.addRole(role.name);
    });
  }

  addRole(name: string) {
    this._store.dispatch(new RoleActions.Add(name));
  }

  deleteRoleByID(roleId: string) {
    if (isNullOrUndefined(roleId)) {
      return;
    }
    this._store.dispatch(new RoleActions.Delete(roleId));
  }
}
