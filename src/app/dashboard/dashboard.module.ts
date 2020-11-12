import {CdkTableModule} from '@angular/cdk/table';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {Injector, NgModule} from '@angular/core';
import {createCustomElement} from '@angular/elements';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
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
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {RouterModule} from '@angular/router';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';
import {ChartsModule} from '../charts/charts.module';
import {LayoutModule} from '../layout/layout.module';
import {AuthenticatedGuardService} from '../user/services/auth/authenticated-guard.service';
import {WidgetsModule} from '../widgets/widgets.module';
import {NewDialogWithTitleComponent} from './components/common/new-dialog-with-title.component';
import {SimpleNameFormComponent} from './components/common/simple-name-form/simple-name-form.component';
import {ContentOverlayComponent} from './components/content-overlay/content-overlay.component';
import {CopyButtonComponent} from './components/copy-button/copy-button.component';
import {DashboardListComponent} from './components/dashboard-list/dashboard-list.component';
import {DashboardNavComponent} from './components/dashboard-nav/dashboard-nav.component';
import {DashboardTabsComponent} from './components/dashboard-tabs/dashboard-tabs.component';
import {DeleteTabDialogComponent} from './components/delete-tab-dialog/delete-tab-dialog.component';
import {GridLinesComponent} from './components/grid-lines/grid-lines.component';
import {IntervalSelectorComponent} from './components/interval-selector/interval-selector.component';
import {ConfirmationDialogComponent} from './components/confirmation-dialog/confirmation-dialog.component';
import {PlaceholderHeaderComponent} from './components/placeholder-header/placeholder-header.component';
import {PlaceholderTitleComponent} from './components/placeholder-title/placeholder-title.component';
import {PlaceholderComponent} from './components/placeholder/placeholder.component';
import {TabGridComponent} from './components/tab-grid/tab-grid.component';
import {TimeExplorer} from './components/time-expolorer/time-explorer.component';
import {TimeRangeSettingsComponent} from './components/time-range-settings/time-range-settings.component';
import {TimeSlider} from './components/time-slider/time-slider.component';
import {DashboardManagementContainer} from './containers/dashboard-management/dashboard-management.container';
import {DashboardTabsContainer} from './containers/dashboard-tabs-container/dashboard-tabs.container';
import {DashboardViewerContainer} from './containers/dashboard-viewer/dashboard-viewer.container';
import {NewTabContainer} from './containers/new-tab/new-tab.container';
import {TabEditorContainer} from './containers/tab-editor/tab-editor.container';
import {TabLauncherItemContainer} from './containers/tab-launcher-item/tab-launcher-item.container';
import {TimeExplorerContainer} from './containers/time-explorer-container/time-explorer.container';
import {CreationOnPlotEffects} from './effects/creation-on-plot.effects';
import {DashboardsEffect} from './effects/dashboard.effects';
import {DndEffects} from './effects/dnd.effects';
import {EditOnPlotEffects} from './effects/edit-on-plot.effects';
import {PlaceholdersEffects} from './effects/placeholders.effects';
import {ReplayEffects} from './effects/replay.effects';
import {TabEditorEffects} from './effects/tab-editor.effects';
import {TabEffects} from './effects/tab.effects';
import {TimeExplorerEffects} from './effects/time-explorer.effects';
import {TimePreferencesEffect} from './effects/time-preferences.effect';
import {WorkerEffects} from './effects/worker.effects';
import {reducers} from './reducers';
import {GridService} from './services/grid/grid.service';
import {DashboardService} from './services/http/dashboard.service';
import {PlaceholdersServiceImpl} from './services/http/placeholders.service';
import {LocalPollingConfigService} from './services/http/polling-config.service';
import {TabService} from './services/http/tab.service';
import {DashboardNavigatorImpl} from './services/navigator/dashboard.navigator';
import {PlotEditorImpl} from './services/plot/editor';
import {
  DASHBOARD_NAVIGATOR,
  PLACEHOLDERS_SERVICE,
  PLOT_EDITOR,
  POLLING_CONFIG_SERVICE,
  REPLAY_INTERVAL,
  WORKER_SERVICE
} from './services/tokens';
import {WorkerServiceImpl} from './services/worker.service';
import {UrlsEffects} from './effects/urls.effects';
import {InvokeUrlOutputComponent} from './components/invoke-url-output/invoke-url-output.component';
import {InvokeUrlContainer} from './containers/invoke-url/invoke-url.container';
import {MatSidenavModule} from '@angular/material/sidenav';
import {AppConfigService} from '../app.config.service';
import {ConfirmationTitleDialogComponent} from './components/confirmation-title-dialog/confirmation-title-dialog.component';
import {TimeRangeDialogContainer} from './containers/time-range-dialog-container/time-range-dialog.container';
import {SelectOptionDialogComponent} from './components/select-option-dialog/select-option-dialog.component';
import {NewSideBarContainer} from '../widgets/containers/new-side-bar/new-side-bar.container';
import {TranslateModule} from '@ngx-translate/core';
import { InstanceColorComponent } from './components/instance-color/instance-color.component';
import {ColorPickerModule} from 'ngx-color-picker';
import {InstanceColorEffects} from './effects/instance-color.effects';
import {InstanceColorService} from './services/http/instance-color.service';
import {ThemeModule} from '../theme/theme.module';
import {DashboardDetailComponent} from './components/dashboard-list/dashboard-detail/dashboard-detail.component';

@NgModule({
  providers: [
    DashboardService,
    GridService,
    TabService,
    InstanceColorService,
    {
      provide: PLACEHOLDERS_SERVICE,
      useClass: PlaceholdersServiceImpl
    },
    {
      provide: POLLING_CONFIG_SERVICE,
      useClass: LocalPollingConfigService
    },
    {
      provide: DASHBOARD_NAVIGATOR,
      useClass: DashboardNavigatorImpl
    },
    {
      provide: WORKER_SERVICE,
      useClass: WorkerServiceImpl
    },
    {
      provide: PLOT_EDITOR,
      useClass: PlotEditorImpl
    },
    {
      provide: REPLAY_INTERVAL,
      useValue: 500
    },
    AppConfigService
  ],
  imports: [
    CommonModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatToolbarModule,
    MatTableModule,
    MatSortModule,
    MatExpansionModule,
    MatSliderModule,
    MatSelectModule,
    MatTooltipModule,
    MatMenuModule,
    MatDialogModule,
    MatCardModule,
    MatInputModule,
    CdkTableModule,
    FormsModule,
    MatChipsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    HttpClientModule,
    LayoutModule,
    WidgetsModule,
    ChartsModule,
    MatSnackBarModule,
    RouterModule.forChild([
      {path: 'dashboards/:id', component: DashboardViewerContainer, canActivate: [AuthenticatedGuardService]},
      {path: 'dashboards', component: DashboardManagementContainer, canActivate: [AuthenticatedGuardService]}
    ]),
    StoreModule.forFeature('dashboards', reducers),
    EffectsModule.forFeature([
      DashboardsEffect,
      TabEffects,
      PlaceholdersEffects,
      TabEditorEffects,
      WorkerEffects,
      TimePreferencesEffect,
      TimeExplorerEffects,
      ReplayEffects,
      EditOnPlotEffects,
      CreationOnPlotEffects,
      DndEffects,
      UrlsEffects,
      InstanceColorEffects
    ]),
    MatSidenavModule,
    MatDividerModule,
    TranslateModule,
    ColorPickerModule,
    ThemeModule
  ],
  entryComponents: [
    NewDialogWithTitleComponent,
    DeleteTabDialogComponent,
    TabLauncherItemContainer,
    ConfirmationDialogComponent,
    ConfirmationTitleDialogComponent,
    TimeRangeDialogContainer,
    InvokeUrlContainer,
    SelectOptionDialogComponent,
    NewSideBarContainer
  ],
  declarations: [
    DashboardListComponent,
    DashboardNavComponent,
    DashboardTabsComponent,
    TabGridComponent,
    NewDialogWithTitleComponent,
    DeleteTabDialogComponent,
    GridLinesComponent,
    PlaceholderHeaderComponent,
    PlaceholderComponent,
    PlaceholderTitleComponent,
    TimeRangeSettingsComponent,
    SimpleNameFormComponent,
    TimeSlider,
    TimeExplorer,
    NewTabContainer,
    ConfirmationDialogComponent,
    ConfirmationTitleDialogComponent,
    TimeRangeDialogContainer,
    DashboardViewerContainer,
    DashboardListComponent,
    DashboardManagementContainer,
    TabLauncherItemContainer,
    TabEditorContainer,
    DashboardTabsContainer,
    TimeExplorerContainer,
    CopyButtonComponent,
    ContentOverlayComponent,
    IntervalSelectorComponent,
    InvokeUrlOutputComponent,
    InvokeUrlContainer,
    SelectOptionDialogComponent,
    InstanceColorComponent,
    DashboardDetailComponent
  ],
  exports: [
    DashboardManagementContainer,
    DashboardViewerContainer,
    TabLauncherItemContainer,
    TimeExplorerContainer
  ]
})
export class DashboardModule {
  constructor(private injector: Injector) {
    const launcherItem = createCustomElement(TabLauncherItemContainer, {injector});
    customElements.define('launcher-item-container', launcherItem);
  }
}
