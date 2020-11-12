import * as _ from 'lodash';
import {DataGroup, DataSet, RealtimeData} from '../../models';
import {Grouper, propertiesGrouperFn} from './grouper';

export class MeasureTimestampGrouper extends Grouper {
  groupData(data: DataSet): DataGroup {
    const groupFn = (record: RealtimeData) => propertiesGrouperFn({
      measureName: record.measureName,
      measureTimestamp: record.measureTimestamp,
      window: record.window,
      group: record.group
    });
    return _.groupBy(data, groupFn);
  }
}

export class InstanceTimestampGrouper extends Grouper {
  groupData(data: DataSet): DataGroup {
    const groupFn = (record: RealtimeData) => propertiesGrouperFn({
      instance: record.instance,
      measureTimestamp: record.measureTimestamp,
      group: record.group,
      window: record.window,
    });
    return _.groupBy(data, groupFn);
  }
}

export class InstanceMeasureGrouper extends Grouper {
  groupData(data: DataSet): DataGroup {
    const groupFn = (record: RealtimeData) => propertiesGrouperFn(
      {
        instance: record.instance,
        measureName: record.measureName,
        group: record.group
      });
    return _.groupBy(data, groupFn);
  }
}

export class WindowInstanceMeasureGrouper extends Grouper {
  groupData(data: DataSet): DataGroup {
    const groupFn = (record: RealtimeData) => propertiesGrouperFn(
      {
        window: record.window,
        instance: record.instance,
        measureName: record.measureName,
        group: record.group
      });
    return _.groupBy(data, groupFn);
  }
}

export class WindowMeasureGrouper extends Grouper {
  groupData(data: DataSet): DataGroup {
    const groupFn = (record: RealtimeData) => propertiesGrouperFn(
      {
        window: record.window,
        measureName: record.measureName,
        group: record.group
      });
    return _.groupBy(data, groupFn);
  }
}

export class WindowInstanceGrouper extends Grouper {
  groupData(data: DataSet): DataGroup {
    const groupFn = (record: RealtimeData) => propertiesGrouperFn(
      {
        window: record.window,
        instance: record.instance,
        group: record.group
      });
    return _.groupBy(data, groupFn);
  }
}
