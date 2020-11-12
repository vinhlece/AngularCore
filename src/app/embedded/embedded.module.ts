import {Injector, NgModule} from '@angular/core';
import {createCustomElement} from '@angular/elements';
import {BrowserModule} from '@angular/platform-browser';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';
import {CommonModule} from '../common/common.module';
import {DashboardModule} from '../dashboard/dashboard.module';
import {LoggingModule} from '../logging/logging.module';
import {TimeExplorerWrapperContainer} from './containers/time-explorer-wrapper/time-explorer-wrapper.container';
import {WidgetLauncherWrapperContainer} from './containers/widget-launcher-wrapper/widget-launcher-wrapper.container';
import {EmbeddedEffects} from './effects/embedded.effects';
import {reducers} from './reducers';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    DashboardModule,
    LoggingModule,
    StoreModule.forFeature('embedded', reducers),
    EffectsModule.forFeature([EmbeddedEffects])
  ],
  declarations: [
    WidgetLauncherWrapperContainer,
    TimeExplorerWrapperContainer
  ],
  entryComponents: [
    WidgetLauncherWrapperContainer,
    TimeExplorerWrapperContainer
  ]
})
export class EmbeddedModule {
  constructor(private injector: Injector) {
    const widgetLauncherWrapper = createCustomElement(WidgetLauncherWrapperContainer, {injector});
    customElements.define('widget-launcher', widgetLauncherWrapper);

    const timeExplorerWrapper = createCustomElement(TimeExplorerWrapperContainer, {injector});
    customElements.define('time-explorer', timeExplorerWrapper);
  }
}
