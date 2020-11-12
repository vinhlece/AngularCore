import { Inject, Injectable } from '@angular/core';
import * as _ from 'lodash';
import { RealTimeDataProcessor } from '.';
import { TimeRange } from '../../dashboard/models';
import { FormulaMeasureFactory } from '../../measures/services';
import { FormulaMeasureImpl } from '../../measures/services/formula/formula-measure.service';
import { DataSet, RealtimeData } from '../models';
import { FORMULA_MEASURE_FACTORY } from '../../measures/services/tokens';
import {KpiThresholds, TimeInterval} from '../../widgets/models/index';
import { getMomentByTimestamp } from '../../common/services/timeUtils';
import { TimeRangeType } from '../../dashboard/models/enums';
import {AppDateTimeFormat} from '../../common/models/enums';
import {GreaterKpi, LessKpi} from '../models/constants';
import {isNullOrUndefined} from 'util';

@Injectable()
export class RealTimeDataProcessorImpl implements RealTimeDataProcessor {
  private _formulaMeasureFactory: FormulaMeasureFactory;

  constructor(@Inject(FORMULA_MEASURE_FACTORY) formulaMeasureFactory: FormulaMeasureFactory) {
    this._formulaMeasureFactory = formulaMeasureFactory;
  }

  filterDataByKeys(data: DataSet, keys: string[]): DataSet {
    return data.filter((item: RealtimeData) => keys.find((key: string) => item.instance === key));
  }

  filterDataByMeasures(data: DataSet, dataType: string, measures: string[], windows: string[]): DataSet {
    const filterFn = (item: RealtimeData) => {
      let isValid = measures.findIndex((measure: string) => item.measureName === measure) >= 0;
      if (!item.group) {
        isValid = isValid && item.dataType === dataType;
      }
      if (windows) {
        isValid = isValid && windows.findIndex((window: string) => item.window === window) >= 0;
      }
      return isValid;
    };
    return data.filter(filterFn);
  }

  filterDataByInstancesAndMeasures(data: DataSet, dataType: string, instances: any, measures: string[], windows: string[]): DataSet {
    const filterFn = (item: RealtimeData) => {
      if (item.group) {
        const existedInstance = _.values(instances).reduce((acc, newIns) => {
          return acc || newIns.indexOf(item.instance) >= 0;
        }, false);
        if (existedInstance && measures.find((measure: string) => item.measureName === measure)) {
          return item;
        }
      } else if (item.dataType === dataType && instances[item.dimension] &&
        instances[item.dimension].find((instance: string) => item.instance === instance) &&
        measures.find((measure: string) => item.measureName === measure) &&
        windows.find((window: string) => item.window === window)) {
        return item;
      }
    };
    return data.filter(filterFn);
  }

  filterDataByInstanceFormat(data: DataSet, dataType: string, instanceFormat: RegExp): DataSet {
    const filterFn = (item: RealtimeData) => (
      item.dataType === dataType && instanceFormat.exec(item.instance));
    const rs = data.filter(filterFn);
    return rs;
  }

  filterDataByIdentifyInstances(data: DataSet, dataType: string, instances: any, measures: string[]): DataSet {
    const filterFn = (item: RealtimeData) => (
      item.dataType === dataType &&
      instances[item.dimension] &&
      instances[item.dimension].find((instance: string) => item.instance.endsWith(instance)) &&
      measures.find((measure: string) => item.measureName === measure)
    );
    return data.filter(filterFn);
  }

  getLatestTimestamp(data: DataSet): number {
    const latestItem = _.maxBy(data, (item: RealtimeData) => item.measureTimestamp);
    return latestItem ? latestItem.measureTimestamp : Date.now();
  }

  getLatestTimestampHavingData(data: DataSet, maxTimestamp: number): number {
    const latestItem = _.maxBy(data, (item: RealtimeData) => {
      return item.measureTimestamp > maxTimestamp ? 0 : item.measureTimestamp;
    });

    if (latestItem && latestItem.measureTimestamp <= maxTimestamp) {
      return latestItem.measureTimestamp;
    }
    return 0;
  }

  getLatestRecord(data: DataSet): RealtimeData {
    return _.maxBy(data, (item: RealtimeData) => item.measureTimestamp);
  }

  getOldestRecord(data: DataSet): RealtimeData {
    return _.minBy(data, (item: RealtimeData) => item.measureTimestamp);
  }

  getAllLatestTimestampData(data: DataSet): DataSet {
    const latestTimestamp = this.getLatestTimestamp(data);
    return data.filter((item: RealtimeData) => item.measureTimestamp === latestTimestamp);
  }

  getDataInTimeRange(data: DataSet, range: TimeRange): DataSet {
    const filterFn = (item: RealtimeData) => item.measureTimestamp >= range.startTimestamp && item.measureTimestamp <= range.endTimestamp;
    return data.filter(filterFn);
  }

  getDataTrendDiffRange(data: DataSet, timestamps: number[]): DataSet {
    const filterFn = (item: RealtimeData) => {
      return timestamps.reduce((acc, timestamp) => {
        const {start, end} = this.getTimeRangefromTimeStamp(timestamp);
        return acc ? acc : item.measureTimestamp <= end && item.measureTimestamp >= start;
      }, false);
    };
    return data.filter(filterFn);
  }

  getDataAtTimestamps(data: DataSet, timestamps: number[]): DataSet {
    return data.filter((item: RealtimeData) => (timestamps.indexOf(item.measureTimestamp) >= 0));
  }

  getElementMeasures(measures: string[]): string[] {
    return measures.reduce((result: string[], measureName: string): string[] => {
      const measureCalculator = this._formulaMeasureFactory.create(measureName);
      try {
        measureCalculator.extract().forEach((elementMeasure) => {
          if (result.indexOf(elementMeasure) < 0) {
            result.splice(0, 0, elementMeasure);
          }
        });
      } catch (error) {
      }
      return result;
    }, measures.slice());
  }

  generateFormulaMeasureData(data: DataSet, dataType: string, measureNames: string[]): DataSet {
    const result = [...data];
    const groupFn = (item: RealtimeData) => ([item.instance, item.measureTimestamp]);

    const forEachFn = (group: DataSet) => {
      measureNames.forEach((measureName: string) => {
        const measureCalculator = this._formulaMeasureFactory.create(measureName);

        // try/catch is expensive, so use instanceof instead
        if (measureCalculator instanceof FormulaMeasureImpl) {
          const elementMeasureNames = measureCalculator.extract();
          const operands = elementMeasureNames.map((elementMeasureName: string) => {
            const elementRecord = group.find((record: RealtimeData) => record.measureName === elementMeasureName);
            return {
              measureName: elementMeasureName,
              measureValue: elementRecord ? +elementRecord.measureValue : 0
            };
          });

          const measureValue = measureCalculator.calculate(operands);
          const formulaMeasureRecord = {
            dataType,
            measureName,
            measureValue,
            measureTimestamp: group[0].measureTimestamp,
            instance: group[0].instance,
            metricCalcType: group[0].metricCalcType
          };
          result.push(formulaMeasureRecord);
        }
      });
    };
    _.chain(data).groupBy(groupFn).forEach(forEachFn).value();
    return result;
  }

  /**
   * Get data in specified input range (time range + interval value)
   */
  getDataInInputRange(data: DataSet, range: { startTimestamp: number, endTimestamp: number },
    interval: TimeInterval, historicalTimeStamp: number[]): DataSet {
    if (!range || !interval) {
      return data;
    }
    const { startTimestamp, endTimestamp } = range;
    const { value, unit } = interval;
    const intervals: number[] = [];
    const start = getMomentByTimestamp(startTimestamp);
    const end = getMomentByTimestamp(endTimestamp);
    const type = TimeRangeType[unit];
    while (start.isBefore(end)) {
      intervals.push(start.valueOf());
      start.add(value, type);
    }
    const historicalFn = (item: RealtimeData) => historicalTimeStamp &&
      historicalTimeStamp.find(time => time === item.measureTimestamp && time >= startTimestamp && time <= endTimestamp);
    const intervalFn = (item: RealtimeData) => intervals.find(time => time === item.measureTimestamp);
    const filterFn = (item: RealtimeData) => historicalFn(item) || intervalFn(item);
    return data.filter(filterFn);
  }

  getKpiData(data: DataSet, hideKpi: KpiThresholds): DataSet {
    if (isNullOrUndefined(hideKpi)) {
      return data;
    }
    const filterFn = (item: RealtimeData) => (!((hideKpi.upper && item.group === GreaterKpi)
      || (hideKpi.lower && item.group === LessKpi)));
    return data.filter(filterFn);
  }

  private getTimeRangefromTimeStamp(timestamp: number) {
    return {
      start: +getMomentByTimestamp(timestamp).startOf(TimeRangeType.Day),
      end: +getMomentByTimestamp(timestamp).endOf(TimeRangeType.Day)
    };
  }
}
