import {NgModule} from '@angular/core';
import {POLLING_TIME_CONFIG} from '../realtime/services/tokens';
import {TIME_RANGE_SETTINGS} from './models/constants';
import {TimeManagerImpl} from './services/time-manager';
import {TimeUtilsImpl} from './services/timeUtils';
import {TIME_MANAGER, TIME_RANGE_SETTINGS_TOKEN, TIME_UTILS} from './services/tokens';
import {pollingConfig} from '../config/polling.config';
import {TranslateModule} from '@ngx-translate/core';
import {ThemeModule} from '../theme/theme.module';

@NgModule({
  imports: [
    TranslateModule,
    ThemeModule
  ],
  declarations: [],
  exports: [],
  providers: [
    {provide: TIME_UTILS, useClass: TimeUtilsImpl},
    {provide: TIME_MANAGER, useClass: TimeManagerImpl},
    {provide: TIME_RANGE_SETTINGS_TOKEN, useValue: TIME_RANGE_SETTINGS},
    {
      provide: POLLING_TIME_CONFIG,
      useValue: pollingConfig.pollingInterval,
    }
  ]
})
export class CommonModule {
}
