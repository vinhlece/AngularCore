export interface AppConfig {
  apiEndPoint: string;
  kafkaEndPoint: string;
  kafkaApiKey: string;
  relayEndPoint?: string;
  relayApiKey?: string;
  reportingDataGeneratorEndPoint: string;
  reportingDataSubscriptionEndPoint: string;
  webSocket: string;
  chartLibrary?: string;
  assetsUrl?: string;
  logging?: Logging;
  version?: string;
  fqdn: string;
}

export const appConfig = {
  performanceLogging:  false
};

export interface Logging {
  log?: boolean;
  level?: LogLevel;
}

export enum LogLevel {
  info = 'info',
  debug = 'debug'
}
