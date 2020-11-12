import {InjectionToken} from '@angular/core';
import {
  DataConverterFactory,
  IRealTimeFactoryService, ISubscriptionService, KPIService,
  Preprocessor,
  RealTimeDataProcessor,
  ReportingDataGeneratorService
} from '.';
import {PollingInterval} from '../models';
import {DataSourceFactory} from './datasource';

export const REPORTING_DATA_GENERATOR_SERVICE = new InjectionToken<ReportingDataGeneratorService>('ReportingDataGeneratorService');
export const REAL_TIME_FACTORY_SERVICE = new InjectionToken<IRealTimeFactoryService>('RealTimeFactoryService');
export const REAL_TIME_DATA_PROCESSOR = new InjectionToken<RealTimeDataProcessor>('RealTimeDataProcessor');
export const DATA_CONVERTER_FACTORY = new InjectionToken<DataConverterFactory>('DataConverterFactory');
export const DATA_SOURCE_FACTORY = new InjectionToken<DataSourceFactory>('DataSourceFactory');
export const POLLING_TIME_CONFIG = new InjectionToken<PollingInterval>('PollingTime');
export const PREPROCESSOR = new InjectionToken<Preprocessor>('Preprocessor');
export const RECONNECT_DELAY = new InjectionToken<Number>('ReconnectDelay');
export const SUBSCRIPTION_SERVICE = new InjectionToken<ISubscriptionService>('SubscriptionService');
export const KPI_SERVICE = new InjectionToken<KPIService>('KPIServiceImpl');
