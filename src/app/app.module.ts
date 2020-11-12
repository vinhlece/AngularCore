import {APP_INITIALIZER, NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule, Routes} from '@angular/router';
import {EffectsModule} from '@ngrx/effects';
import {RouterStateSerializer, StoreRouterConnectingModule} from '@ngrx/router-store';
import {StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {environment} from '../environments/environment';
import {AppComponent} from './app.component';
import {CommonModule} from './common/common.module';
import {ErrorDialogFormComponent} from './common/components/error-dialog-form/error-dialog-form.component';
import {CustomRouterStateSerializer} from './common/route/RouterStateUrl';
import {DashboardModule} from './dashboard/dashboard.module';
import {LayoutModule} from './layout/layout.module';
import {LoggingModule} from './logging/logging.module';
import {MeasuresModule} from './measures/measure.module';
import {metaReducers, reducers} from './reducers';
import {UserModule} from './user/user.module';
import {WidgetsModule} from './widgets/widgets.module';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import {AppConfigService} from './app.config.service';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {MeasuresSpecificationModule} from './measure-specification/measure-specification.module';
import {MessageDialogFormComponent} from './common/components/message-dialog-form/message-dialog-form.component';
import {ThemeModule} from './theme/theme.module';

const appRoutes: Routes = [
  {
    path: '**',
    redirectTo: '/dashboards',
    pathMatch: 'full'
  }
];

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/');
}

@NgModule({
  declarations: [
    AppComponent,
    ErrorDialogFormComponent,
    MessageDialogFormComponent,
  ],
  entryComponents: [
    ErrorDialogFormComponent,
    MessageDialogFormComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    CommonModule,
    WidgetsModule,
    UserModule,
    DashboardModule,
    MeasuresModule,
    LayoutModule,
    LoggingModule,
    MeasuresSpecificationModule,
    RouterModule.forRoot(appRoutes, { useHash: true }),
    /**
     * StoreModule.forRoot is imported once in the root module, accepting a reducer
     * function or object map of reducer functions. If passed an object of
     * reducers, combineReducers will be run creating your application
     * meta-reducer. This returns all providers for an @ngrx/store
     * based application.
     */
    StoreModule.forRoot(reducers, {metaReducers}),

    /**
     * @ngrx/router-store keeps router state up-to-date in the store.
     */
    StoreRouterConnectingModule,
    /**
     * Store devtools instrument the store retaining past versions of state
     * and recalculating new states. This enables powerful time-travel
     * debugging.
     *
     * To use the debugger, install the Redux Devtools extension for either
     * Chrome or Firefox
     *
     * See: https://github.com/zalmoxisus/redux-devtools-extension
     */
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    /**
     * EffectsModule.forRoot() is imported once in the root module and
     * sets up the effects class to be initialized immediately when the
     * application starts.
     *
     * See: https://github.com/ngrx/platform/blob/master/docs/effects/api.md#forroot
     */
    EffectsModule.forRoot([]),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    }),
    ThemeModule
  ],
  providers: [
    /**
     * The `RouterStateSnapshot` provided by the `Router` is a large complex structure.
     * A custom RouterStateSerializer is used to parse the `RouterStateSnapshot` provided
     * by `@ngrx/router-store` to include only the desired pieces of the snapshot.
     */
    {provide: RouterStateSerializer, useClass: CustomRouterStateSerializer},
    AppConfigService,
    { provide: APP_INITIALIZER, useFactory: (config: AppConfigService) => () => config.getInitialData(),
      deps: [AppConfigService], multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
