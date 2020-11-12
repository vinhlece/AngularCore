import {Injectable} from '@angular/core';
import {SANKEY} from '../../dashboard/models/constants';
import {
  AGENT_PERFORMANCE, AGENT_STATUS, AWS_AGENT, QUEUE_PERFORMANCE,
  QUEUE_STATUS
} from '../../measures/models/constants';
import {Topic} from '../models';
import {uuid} from '../../common/utils/uuid';

@Injectable()
export class TopicMapper {
  getTopic(dataType: string): Topic {
    return {
      name: this.getTopicName(dataType),
      channel: this.getChannel(dataType),
      dataType,
      subscriptionId: `subscription-${uuid()}`
    };
  }

  private getTopicName(dataType: string): string {
    switch (dataType) {
      case AGENT_PERFORMANCE:
        return 'reporting_agent_performance';
      case AGENT_STATUS:
        return 'reporting_agent_status';
      case QUEUE_PERFORMANCE:
        return 'reporting_queue_performance';
      case QUEUE_STATUS:
        return 'reporting_queue_status';
      case SANKEY:
        return 'reporting_sankey';
      case AWS_AGENT:
        return 'reporting_aws_agent';
      default:
        return `reporting_${dataType.replace(' ', '_').toLowerCase()}`;
    }
  }

  private getChannel(dataType: string): string {
    switch (dataType) {
      case AGENT_PERFORMANCE:
        return 'agentperformance';
      case AGENT_STATUS:
        return 'agentstatus';
      case QUEUE_PERFORMANCE:
        return 'queueperformance';
      case QUEUE_STATUS:
        return 'queuestatus';
      case SANKEY:
        return 'sankey';
      case AWS_AGENT:
        return 'aws_agent';
      default:
        return `${dataType.replace(' ', '_').toLowerCase()}`;
    }
  }
}
