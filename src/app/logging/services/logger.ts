import {Logger} from '.';
import {DataSet} from '../../realtime/models';
import {Widget} from '../../widgets/models';
import {AppConfigService} from '../../app.config.service';
import {Injectable} from '@angular/core';
import {LogLevel} from '../../config/app.config';
import * as _ from 'lodash';

export interface DataLog {
  receivedDataSize?: number;
  newDataSize?: number;
  unionRuntime?: Runtime;
}

export interface WidgetLog {
  widget?: Widget;
  convertRuntime?: Runtime;
  setDataRuntime?: Runtime;
}

export class Runtime {
  private _startTimeMs: number;
  private _endTimeMs: number;
  private _runtimeMs: number;

  get runtime(): number {
    return this._runtimeMs;
  }

  start() {
    this._startTimeMs = performance.now();
  }

  stop() {
    this._endTimeMs = performance.now();
    this._runtimeMs = this._endTimeMs - this._startTimeMs;
  }
}

export class PerfLog {
  dataLogs: DataLog[] = [];
  widgetLogs: WidgetLog[] = [];

  startDataBenchmark(): DataLog {
    const timer = new Runtime();
    timer.start();
    const dataLog: DataLog = {unionRuntime: timer};
    this.dataLogs.push(dataLog);
    return dataLog;
  }

  endDataBenchmark(receivedDataSize: number, newDataSize: number) {
    const currentLog = this.dataLogs[this.dataLogs.length - 1];
    currentLog.receivedDataSize = receivedDataSize;
    currentLog.newDataSize = newDataSize;
    currentLog.unionRuntime.stop();
    return currentLog.unionRuntime.runtime;
  }

  startConvertBenchmark(widget: Widget) {
    this.getWidgetLog(widget).convertRuntime.start();
  }

  endConvertBenchmark(widget: Widget): number {
    const log = this.getWidgetLog(widget);
    log.convertRuntime.stop();
    return log.convertRuntime.runtime;
  }

  startSetDataBenchmark(widget: Widget) {
    this.getWidgetLog(widget).setDataRuntime.start();
  }

  endSetDataBenchmark(widget: Widget): number {
    const log = this.getWidgetLog(widget);
    log.setDataRuntime.stop();
    return log.setDataRuntime.runtime;
  }

  private getWidgetLog(widget: Widget): WidgetLog {
    let widgetLog = this.widgetLogs.find((log: WidgetLog) => log.widget.id === widget.id);
    if (!widgetLog) {
      widgetLog = {widget, convertRuntime: new Runtime(), setDataRuntime: new Runtime()};
      this.widgetLogs.push(widgetLog);
    }
    return widgetLog;
  }
}

export abstract class AbstractLogger implements Logger {
  info(message: string) {
  }

  startFilterBenchmark() {
  }

  endFilterBenchmark(storageType: string, receivedData: DataSet, newData: DataSet) {
  }

  endFilterStorageBenchmark(storageType: string, receivedData: DataSet, newData: any) {
  }

  startConvertBenchmark(widget: Widget) {
  }

  endConvertBenchmark(widget: Widget) {
  }

  startSetDataBenchmark(widget: Widget) {
  }

  endSetDataBenchmark(widget: Widget) {
  }
}

@Injectable()
export class ConsoleLogger extends AbstractLogger {
  benchmark: PerfLog = new PerfLog();
  private _appConfigService: AppConfigService;

  constructor(appConfigService: AppConfigService) {
    super();
    this._appConfigService = appConfigService;
  }

  checkLoggingConfig() {
    if (this._appConfigService && this._appConfigService.config && this._appConfigService.config.logging) {
      return this._appConfigService.config.logging.log;
    }
  }

  info(message: string) {
    if (this.checkLoggingConfig()) {
      this.log(message);
    }
  }

  startFilterBenchmark() {
    if (this.checkLoggingConfig()) {
      this.benchmark.startDataBenchmark();
    }
  }

  endFilterBenchmark(storageType: string, receivedData: DataSet, newData: DataSet) {
    if (this.checkLoggingConfig()) {
      const elapsed = this.benchmark.endDataBenchmark(receivedData ? receivedData.length : 0, newData ? newData.length : 0);
      const isDebug = this.isDebug();
      const getData = (data: DataSet) => isDebug ? data : `${data.length} records`;
      this.logInWorker(`[${storageType} STORAGE] Received data:`, getData(receivedData));
      this.logInWorker(`[${storageType} STORAGE] Data currently in storage:`, getData(newData));
      this.logInWorker(`[${storageType} STORAGE] Union & sort: ${elapsed}`);
    }
  }

  endFilterStorageBenchmark(storageType: string, receivedData: any, newData: any) {
    if (this.checkLoggingConfig()) {
      const allRecords = (storage, isArray: boolean) => _.values(storage).reduce((acc, item) => {
        return acc + isArray ? item.length : item.size();
      }, 0);
      const elapsed = this.benchmark.endDataBenchmark(receivedData.length, newData.length);
      const isDebug = this.isDebug();
      const getData = (data, isArray: boolean) => isDebug ? data : `${allRecords(data, isArray)} records`;
      this.logInWorker(`[${storageType} STORAGE] Received data:`, getData(receivedData, true));
      this.logInWorker(`[${storageType} STORAGE] Data currently in storage:`, getData(newData, false));
      this.logInWorker(`[${storageType} STORAGE] Union & sort: ${elapsed}`);
    }
  }

  startConvertBenchmark(widget: Widget) {
    if (this.checkLoggingConfig()) {
      this.benchmark.startConvertBenchmark(widget);
    }
  }

  endConvertBenchmark(widget: Widget) {
    if (this.checkLoggingConfig()) {
      const elapsed = this.benchmark.endConvertBenchmark(widget);
      this.logInWorker(`Convert ${widget.name}: ${elapsed}ms`);
    }
  }

  startSetDataBenchmark(widget: Widget) {
    if (this.checkLoggingConfig()) {
      this.benchmark.startSetDataBenchmark(widget);
    }
  }

  endSetDataBenchmark(widget: Widget) {
    if (this.checkLoggingConfig()) {
      const elapsed = this.benchmark.endSetDataBenchmark(widget);
      this.logInUI(`Set data for ${widget.name}: ${elapsed}ms`);
    }
  }

  private isDebug(): boolean {
    if (this._appConfigService && this._appConfigService.config && this._appConfigService.config.logging) {
      return this._appConfigService.config.logging.level === LogLevel.debug;
    }
    return false;
  }

  private logInUI(message: any, ...optionalParams: any[]) {
    if (this.checkLoggingConfig()) {
      this.log(`[UI] ${message}`, ...optionalParams);
    }
  }

  private logInWorker(message: any, ...optionalParams: any[]) {
    if (this.checkLoggingConfig()) {
      this.log(`[WORKER] ${message}`, ...optionalParams);
    }
  }

  private log(message: any, ...optionalParams: any[]) {
    if (this.checkLoggingConfig()) {
      console.log(message, ...optionalParams);
    }
  }
}

export class DefaultLogger extends AbstractLogger {
}
