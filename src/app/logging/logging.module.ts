import {NgModule} from '@angular/core';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';
import {reducers} from './reducers';
import {ConsoleLogger, DefaultLogger} from './services/logger';
import {LOGGER} from './services/tokens';
import {AppConfigService} from '../app.config.service';

@NgModule({
  declarations: [],
  imports: [
    StoreModule.forFeature('logging', reducers),
    EffectsModule.forFeature([])
  ],
  providers: [
    {provide: LOGGER, useClass: ConsoleLogger}
  ]
})
export class LoggingModule {
}
