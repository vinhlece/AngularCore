import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as _ from 'lodash';
import { createMeasureId } from '../../common/schemas/utils';
import * as fromRoot from '../../reducers';
import { Measure } from '../models';
import * as fromMeasures from './measures.reducer';
import { WindowNames } from '../../common/models/constants';
import {packages} from '../../reducers/entities.reducer';

export interface MeasuresState {
  measures: fromMeasures.State;
}

export interface State extends fromRoot.State {
  measures: MeasuresState;
}

export const reducers = {
  measures: fromMeasures.reducer
};

export const getMeasuresState = createFeatureSelector<MeasuresState>('measures');

export const getMeasures = createSelector(
  fromRoot.getNormalizedMeasures,
  (normalizedMeasures) => _.values(normalizedMeasures)
);

export const getPackageDetails = createSelector(
  fromRoot.getNormalizedPackages,
  (packageDetails) => {
    return _.values(packageDetails);
  }
);

export const getAllDimentionWithMeasure = createSelector(
  fromRoot.getNormalizedMeasures,
  (normalizedMeasures) => {
    const data = _.chain(normalizedMeasures)
      .values()
      .map(measure => ({dimension: measure.dimension}))
      .value();
    const dimensions = _.uniqWith(data, _.isEqual);
    const measuresVal = _.values(normalizedMeasures);
    for (const de of dimensions) {
      de.measures = [];
      for (const me of measuresVal) {
        if (de.dimension === me.dimension) {
          de.measures.push(me.name);
        }
      }
    }
    return dimensions;
  }
);

export const getPackages = createSelector(
  fromRoot.getNormalizedPackages,
  (packages) => _.values(packages)
);

export const getDataType = createSelector(
  fromRoot.getNormalizedPackages,
  packages => _.values(packages).map(item => item.dimensions)
);

export const getMeasuresByDataType = (dataType: string, format?: string[]) => createSelector(
  fromRoot.getNormalizedPackages,
  fromRoot.getNormalizedMeasures,
  (normalizedPackages, normalizedMeasures) => (
    _
      .chain(normalizedMeasures)
      .pick(normalizedPackages[dataType].measures)
      .values()
      .filter((measure: Measure) => (format ? format.indexOf(measure.format) >= 0 : true))
      .value()
  )
);


export const getMeasure = (dataType: string, name: string) => createSelector(
  fromRoot.getNormalizedMeasures,
  (normalizedMeasures) => normalizedMeasures[createMeasureId(dataType, name)]
);

export const getWindows = createSelector(
  fromRoot.getNormalizedMeasures,
  (normalizedMeasures) => {
    const data = _.chain(normalizedMeasures)
      .values()
      .map(measure => ({windowType: measure.windowType, window: measure.windowName}))
      .value();
    return _.uniqWith(data, _.isEqual);
  }
);

export const getFormulaMeasureByName = (measureName: string) => createSelector(
  getMeasures,
  (measures: Measure[]) => {
    return measures.find((measure: Measure) => measure.name === measureName && 'expression' in measure);
  }
);

export const getOriginalMeasuresByDataType = (dataType: string, format?: string[]) => createSelector(
  getMeasuresByDataType(dataType, format),
  (measures: Measure[]) => measures.filter((measure: Measure) => !('expression' in measure))
);

