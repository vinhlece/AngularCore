import {schema} from 'normalizr';
import {createMeasureId} from './utils';

export const placeholderSchema = new schema.Entity('placeholders');

export const tabSchema = new schema.Entity('tabs', {
  placeholders: [placeholderSchema]
});

export const dashboardSchema = new schema.Entity('dashboards', {
  tabs: [tabSchema]
});

export const widgetSchema = new schema.Entity('widgets');

export const measureSchema = new schema.Entity('measures', {}, {
    idAttribute: (value, parent, key) => {
      const dataType = parent.dimensions || value.dataType;
      return createMeasureId(dataType, value.name);
    },
    processStrategy: (value, parent, key) => {
      return parent.dimensions ? {...value, dataType: parent.dimensions} : value;
    }
  }
);

export const packageSchema = new schema.Entity(
  'packages',
  {measures: [measureSchema]},
  {idAttribute: 'dimensions'}
);

export const paletteSchema = new schema.Entity('palettes');

export const userSchema = new schema.Entity('users');
