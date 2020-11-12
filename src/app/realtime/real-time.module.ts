import {HttpClientModule} from '@angular/common/http';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {WorkerAppModule} from '@angular/platform-webworker';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';
import {environment} from '../../environments/environment';
import {CommonModule} from '../common/common.module';
import {LoggingModule} from '../logging/logging.module';
import {FormulaMeasureFactoryImpl} from '../measures/services/formula/formula-measure.service';
import {FORMULA_MEASURE_FACTORY} from '../measures/services/tokens';
import {PumpUpEffects} from './effects/rest-api/pump-up.effects';
import {RealTimeDataFilterEffects} from './effects/rest-api/real-time-data-filter.effects';
import {WidgetDataEffects} from './effects/widget-data.effects';
import {RealTimeComponent} from './real-time.component';
import {metaReducers, reducers} from './reducers';
import {HighchartsDataConverterFactory} from './services/converters/factory';
import {DataSourceFactoryImpl} from './services/datasource/factory';
import {FakeRealTimeFactoryService} from './services/fake/fake-real-time-factory.services';
import {SampleRealTimeDataService} from './services/fake/sample-real-time-data.service';
import {DataMapperService} from './services/http/data-mapper.services';
import {ReportingDataGeneratorServiceImpl} from './services/reporting-data-generator.services';
import {PreprocessorImpl} from './services/preprocessor/preprocessor';
import {RealTimeDataProcessorImpl} from './services/real-time-data-processor.service';
import {RealTimeFactoryService} from './services/real-time-factory.services';
import {
  DATA_CONVERTER_FACTORY,
  DATA_SOURCE_FACTORY, KPI_SERVICE,
  POLLING_TIME_CONFIG,
  PREPROCESSOR,
  REAL_TIME_DATA_PROCESSOR,
  REAL_TIME_FACTORY_SERVICE, RECONNECT_DELAY,
  REPORTING_DATA_GENERATOR_SERVICE, SUBSCRIPTION_SERVICE
} from './services/tokens';
import {TopicMapper} from './services/TopicMapper';
import {WidgetContainerEffects} from './effects/web-socket/widget-container.effects';
import {SubscriptionEffect} from './effects/web-socket/subscription.effects';
import {SubscriptionService} from './services/web-socket/subscription.services';
import {WebSocketRealTimeEffects} from './effects/web-socket/web-socket-real-time.effects';
import {AppConfigService} from '../app.config.service';
import {FakeReportingDataGeneratorService} from './services/fake/fake-reporting-data-generator.services';
import {ReconnectDelayTime} from './config/index';
import {FakeSubscriptionServices} from './services/fake/fake-subscription.services';
import {KPIServiceImpl} from './services/http/policy-group.services';
import {PolicyGroupEffects} from './effects/web-socket/policy-group.effects';
import {PollingEffects} from './effects/rest-api/polling.effects';

// use EFFECTS.push() will cause the app to not polling when running production build
const EFFECTS = [WebSocketRealTimeEffects, PumpUpEffects, RealTimeDataFilterEffects,
  WidgetDataEffects, WidgetContainerEffects, SubscriptionEffect, PolicyGroupEffects, PollingEffects];

@NgModule({
  declarations: [RealTimeComponent],
  imports: [
    WorkerAppModule,
    HttpClientModule,
    LoggingModule,
    StoreModule.forRoot(reducers, {metaReducers}),
    EffectsModule.forRoot(EFFECTS),
    CommonModule
  ],
  providers: [
    ReportingDataGeneratorServiceImpl,
    TopicMapper,
    DataMapperService,
    SampleRealTimeDataService,
    environment.useFakeData
      ? {
        provide: REPORTING_DATA_GENERATOR_SERVICE,
        useClass: FakeReportingDataGeneratorService
      }
      : {provide: REPORTING_DATA_GENERATOR_SERVICE, useClass: ReportingDataGeneratorServiceImpl},
    environment.useFakeData
      ? {
        provide: REAL_TIME_FACTORY_SERVICE,
        useClass: FakeRealTimeFactoryService
      }
      : {provide: REAL_TIME_FACTORY_SERVICE, useClass: RealTimeFactoryService},
    environment.useFakeData
      ? {
        provide: RECONNECT_DELAY,
        useValue: ReconnectDelayTime
      }
      : {provide: RECONNECT_DELAY, useValue: 0},
    {
      provide: DATA_CONVERTER_FACTORY,
      useClass: HighchartsDataConverterFactory
    },
    {
      provide: DATA_SOURCE_FACTORY,
      useClass: DataSourceFactoryImpl
    },
    {
      provide: REAL_TIME_DATA_PROCESSOR,
      useClass: RealTimeDataProcessorImpl
    },
    {
      provide: FORMULA_MEASURE_FACTORY,
      useClass: FormulaMeasureFactoryImpl
    },
    {
      provide: PREPROCESSOR,
      useClass: PreprocessorImpl
    },
    {
      provide: KPI_SERVICE,
      useClass: KPIServiceImpl
    },
    environment.useFakeData
      ? {
        provide: SUBSCRIPTION_SERVICE,
        useClass: FakeSubscriptionServices
      } : {
        provide: SUBSCRIPTION_SERVICE,
        useClass: SubscriptionService
      },
    AppConfigService
  ],
  bootstrap: [RealTimeComponent]
})
export class RealTimeModule {
}
