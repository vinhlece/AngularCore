import {Routes} from '@angular/router';
import {SignupContainerComponent} from '../user/containers/signup-container/signup-container.component';
import {LoginFormContainerComponent} from '../user/containers/login-form-container/login-form-container.component';
import {PaletteFormContainerComponent} from '../user/containers/palette-form-container/palette-form-container.component';
import {AuthenticatedGuardService} from '../user/services/auth/authenticated-guard.service';
import {EditPaletteFormContainerComponent} from '../user/containers/edit-palette-form-container/edit-palette-form-container.component';
import {UserManageContainerComponent} from '../user/containers/user-manage-container/user-manage-container.component';
import {RoleFormContainerComponent} from '../user/containers/role-form-container/role-form-container.component';
import {Resolver} from '../resolver';
import {EditUserContainerComponent} from '../user/containers/edit-user-container/edit-user-container.component';

export const mainRoute: Routes = [
  {path: 'login', component: LoginFormContainerComponent, resolve: {items: Resolver}},
  {path: 'signup', component: SignupContainerComponent},
  {path: 'role', component: RoleFormContainerComponent, canActivate: [AuthenticatedGuardService]},
  {path: 'palette', component: PaletteFormContainerComponent, canActivate: [AuthenticatedGuardService]},
  {path: 'palette/:id', component: EditPaletteFormContainerComponent, canActivate: [AuthenticatedGuardService]},
  {path: 'user', component: UserManageContainerComponent, canActivate: [AuthenticatedGuardService]},
  {path: 'user/:id', component: EditUserContainerComponent, canActivate: [AuthenticatedGuardService]}
];
