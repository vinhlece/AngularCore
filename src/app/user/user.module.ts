import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ReactiveFormsModule} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {RouterModule} from '@angular/router';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';
import {UserNavigator} from '../layout/navigator/user.navigator';
import {LoginFormComponent} from './components/login-form/login-form.component';
import {SignupComponent} from './components/signup/signup.component';
import {LoginFormContainerComponent} from './containers/login-form-container/login-form-container.component';
import {SignupContainerComponent} from './containers/signup-container/signup-container.component';
import {AuthenticationEffects} from './effects/authentication.effects';
import {reducers} from './reducers';
import {AuthenticationService} from './services/auth/authentication.service';
import {SESSION, APP_BOOTSTRAP} from './services/tokens';
import {AppBootstrapImpl} from './services/app-bootstrap.service';
import {SessionImpl} from './services/session.service';
import {PaletteFormContainerComponent} from './containers/palette-form-container/palette-form-container.component';
import {PaletteFormComponent} from './components/palette-form/palette-form.component';
import {PaletteNodeComponent} from './components/palette-form/palette-node/palette-node.component';
import {ColorPickerModule} from 'ngx-color-picker';
import {UserPaletteEffects} from './effects/user-palette.effects';
import {UserPaletteService} from './services/settings/user-palette.service';
import {HeaderFontComponent} from './components/palette-form/header-font/header-font.component';
import {EditPaletteFormContainerComponent} from './containers/edit-palette-form-container/edit-palette-form-container.component';
import {UserRolesService} from './services/settings/user-roles.service';
import {UserManageComponent} from './components/user-manage/user-manage.component';
import {UserManageContainerComponent} from './containers/user-manage-container/user-manage-container.component';
import {UsersService} from './services/settings/users.service';
import {LayoutModule} from '../layout/layout.module';
import {NewUserFormComponent } from './components/common/new-user-form/new-user-form.component';
import {NewDialogUserComponent} from './components/common/new-dialog-user.component';
import {UsersEffects} from './effects/user.effects';
import {RoleFormComponent} from './components/role-form/role-form.component';
import {RoleFormContainerComponent} from './containers/role-form-container/role-form-container.component';
import {RolesService} from './services/settings/roles.service';
import {RoleEffects} from './effects/role.effect';
import {EditUserContainerComponent} from './containers/edit-user-container/edit-user-container.component';
import {EditUserFormComponent} from './components/edit-user-form/edit-user-form.component';
import { TranslateModule} from '@ngx-translate/core';
import {ThemeModule} from '../theme/theme.module';

@NgModule({
  imports: [
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatBottomSheetModule,
    MatIconModule,
    MatMenuModule,
    MatSelectModule,
    MatSliderModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    ReactiveFormsModule,
    ColorPickerModule,
    FlexLayoutModule,
    MatDividerModule,
    HttpClientModule,
    MatCheckboxModule,
    TranslateModule,
    RouterModule,
    LayoutModule,
    StoreModule.forFeature('user', reducers),
    EffectsModule.forFeature([AuthenticationEffects, UserPaletteEffects, RoleEffects, UsersEffects]),
    ThemeModule
  ],
  entryComponents: [
    NewDialogUserComponent
  ],
  declarations: [
    LoginFormComponent,
    LoginFormContainerComponent,
    SignupComponent,
    SignupContainerComponent,
    PaletteFormComponent,
    PaletteFormContainerComponent,
    PaletteNodeComponent,
    HeaderFontComponent,
    EditPaletteFormContainerComponent,
    UserManageComponent,
    UserManageContainerComponent,
    NewUserFormComponent,
    NewDialogUserComponent,
    RoleFormComponent,
    RoleFormContainerComponent,
    EditUserContainerComponent,
    EditUserFormComponent,
  ],
  exports: [
    LoginFormComponent,
    LoginFormContainerComponent,
    SignupComponent,
    SignupContainerComponent,
    PaletteFormComponent,
    PaletteFormContainerComponent,
    HeaderFontComponent,
    EditPaletteFormContainerComponent,
    EditUserContainerComponent
  ],
  providers: [
    AuthenticationService,
    UserRolesService,
    UserNavigator,
    {
      provide: APP_BOOTSTRAP,
      useClass: AppBootstrapImpl
    },
    {
      provide: SESSION,
      useClass: SessionImpl
    },
    UserPaletteService,
    UsersService,
    RolesService
  ]
})
export class UserModule {
}
