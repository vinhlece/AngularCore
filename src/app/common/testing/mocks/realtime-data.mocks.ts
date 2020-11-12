import {AGENT_PERFORMANCE} from '../../../measures/models/constants';
import {QUEUE_PERFORMANCE, QUEUE_STATUS} from '../../../measures/models/constants';
import {RealtimeData, Stream} from '../../../realtime/models';

export function mockRealtimeData(options: any = {}): RealtimeData {
  return {
    instance: options.key || 'agent1234',
    measureName: options.measureName || 'measure',
    measureValue: options.measureValue || 10,
    measureTimestamp: Date.now()
  };
}

export function mockQueuePerformancePackageOptions(): Stream {
  return {
    dataType: QUEUE_PERFORMANCE,
    instance: 'New Sales',
  };
}

export function mockQueueStatusPackageOptions(): Stream {
  return {
    dataType: QUEUE_STATUS,
    instance: 'Available',
  };
}

export function mockAgentPerformancePackageOptions(): Stream {
  return {
    dataType: AGENT_PERFORMANCE,
    instance: 'abc',
  };
}
