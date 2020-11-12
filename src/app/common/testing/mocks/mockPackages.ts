import {Measure, Package} from '../../../measures/models';
import * as db from './db.json';
import {DbSchema} from './dbSchema';
import {mockMeasure} from './widgets';

export const getAll = () => (db as DbSchema).packages;

export const getByDataType = (dataType: string) => {
  return (db as DbSchema).packages.filter(item => item.name === dataType);
};

export const getOne = (options: any = {}): Package => {
  return {
    name: options.name || 'Queue Performance',
    kafkaQueue: options.kafkaQueue || 'queue_perf',
    measures: options.measures || [
      mockMeasure({
        name: 'ContactsOffered',
        relatedMeasures: [mockMeasure({name: 'ContactsAnswered'}),
          mockMeasure({name: 'ContactsAbandoned'})]
      })
    ]
  };
};

export const getOneMeasure = (options: any = {}): Measure => {
  return {
    name: options.name || 'ContactsOffered',
    relatedMeasures: options.relatedMeasures || [mockMeasure({name: 'ContactsAnswered'}),
      mockMeasure({name: 'ContactsAbandoned'})],
    dataType: options.dataType || 'Queue Performance'
  };
};

export const getAllMeasure = () => {
  const measures = [];
  (db as DbSchema).packages.map(item => {
    item.measures.map(measure => measures.push(
      {
        ...measure,
        dataType: item.dimensions
      },
      ...measure.relatedMeasures.map(relatedMesure => (
        {
          ...relatedMesure,
          dataType: item.dimensions
        }))));
  });
  return measures;
};

export const getAllMeasureByDataType = (dataType: string) => {
  const measures = [];
  (db as DbSchema).packages.filter(item => item.package === dataType).map(item => {
    item.measures.map(measure => measures.push(
      {
        ...measure,
        dataType: item.package
      },
      ...measure.relatedMeasures.map(relatedMesure => (
        {
          ...relatedMesure,
          dataType: item.package
        }))));
  });
  return measures;
};

export const getAllDataType = () => (db as DbSchema).packages.map(item => item.dimensions ? item.dimensions : item.package);

export const getDataType = (dataType: string) => getAllDataType()
  .filter(item => item.toLowerCase().includes(dataType.toLowerCase()));
