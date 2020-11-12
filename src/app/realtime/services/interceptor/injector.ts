import {Interceptor} from './index';
import {RealTimeDataProcessor} from '../index';
import {DataSet} from '../../models';

export abstract class Injector implements Interceptor {
  private _processor: RealTimeDataProcessor;

  constructor(processor: RealTimeDataProcessor) {
    this._processor = processor;
  }

  get processor(): RealTimeDataProcessor {
    return this._processor;
  }

  intercept(data: DataSet): DataSet {
    throw new Error('Not implemented.');
  }
}

export class FormulaMeasureInjector extends Injector {
  private _measureNames: string[];
  private _dataType: string;

  constructor(processor: RealTimeDataProcessor, dataType: string, measureNames: string[]) {
    super(processor);
    this._dataType = dataType;
    this._measureNames = measureNames;
  }

  intercept(data: DataSet): DataSet {
    return this.processor.generateFormulaMeasureData(data, this._dataType, this._measureNames);
  }
}
