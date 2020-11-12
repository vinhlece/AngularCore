import {QUEUE_PERFORMANCE} from '../../../measures/models/constants';
import {FormulaMeasure} from '../../../measures/models';
import * as db from './db.json';
import {DbSchema} from './dbSchema';

export function mockFormulaMeasure(options: any = {}): FormulaMeasure {
  return {
    id: options.id || null,
    userId: options.userId || null,
    name: options.name || 'Custom Measure',
    relatedMeasures: options.relatedMeasures || [],
    dataType: options.dataType || QUEUE_PERFORMANCE,
    expression: options.expression || ''
  };
}

export function mockFormulaMeasures() {
  return (db as DbSchema).formulaMeasures;
}
