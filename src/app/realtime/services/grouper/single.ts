import * as _ from 'lodash';
import {DataGroup, DataSet, RealtimeData} from '../../models';
import {Grouper, propertiesGrouperFn} from './grouper';

export class InstanceGrouper extends Grouper {
  groupData(data: DataSet): DataGroup {
    return _.groupBy(data, (record: RealtimeData) => propertiesGrouperFn({instance: record.instance}));
  }
}

export class MeasureGrouper extends Grouper {
  groupData(data: DataSet): DataGroup {
    return _.groupBy(data, (record: RealtimeData) => propertiesGrouperFn({measureName: record.measureName}));
  }
}

export class AgentGrouper extends Grouper {
  groupData(data: DataSet): DataGroup {
    return _.groupBy(data, (record: RealtimeData) => propertiesGrouperFn({agent: record.agent}));
  }
}

export class QueueGrouper extends Grouper {
  groupData(data: DataSet): DataGroup {
    return _.groupBy(data, (record: RealtimeData) => propertiesGrouperFn({queue: record.queue}));
  }
}

export class SegmentTypeGrouper extends Grouper {
  groupData(data: DataSet): DataGroup {
    return _.groupBy(data, (record: RealtimeData) => propertiesGrouperFn({segmentType: record.segmentType}));
  }
}

export class CallIdGrouper extends Grouper {
  groupData(data: DataSet): DataGroup {
    return _.groupBy(data, (record: RealtimeData) => propertiesGrouperFn({callId: record.callID}));
  }
}
