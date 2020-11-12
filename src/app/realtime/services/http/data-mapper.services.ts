import {Injectable} from '@angular/core';
import {RealtimeData, Topic} from '../../models';
import {Message} from './real-time.services';

@Injectable()
export class DataMapperService {
  fromKafkaMessage(topic: Topic, message: Message): RealtimeData {
    message = this.decode(message);
    const model = JSON.parse(JSON.parse(message.value).body);
    return this.fromJSON(topic, model);
  }

  fromJSON(topic: Topic, json): RealtimeData {
    const initialRecord = {dataType: topic.dataType};
    return Object.keys(json).reduce((record: RealtimeData, key: string) => {
      if (key === 'measureId' || key === 'QueueID' || key === 'agentID') {
        record.instance = json[key];
      } else {
        record[key] = json[key];
      }
      return record;
    }, initialRecord);
  }

  private decode(message: Message): Message {
    return {
      key: atob(message.key),
      value: atob(message.value),
      partition: message.partition,
      offset: message.offset
    };
  }
}
