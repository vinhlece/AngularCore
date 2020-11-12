import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Subscription} from '../../models';
import {ReportingDataSubscriptionService} from '../index';
import {TopicMapper} from '../TopicMapper';

@Injectable()
export class FakeReportingSubscriptionService implements ReportingDataSubscriptionService {
  private _topicMapper: TopicMapper;

  constructor() {
    this._topicMapper = new TopicMapper();
  }

  addNewPackage(packageName: string, topicName: string): Observable<any> {
    return of({});
  }

  makeSubscriptionToPackage(userName: string, packageName: string): Observable<Subscription> {
    return of({
      username: 'sean',
      packageName: 'queuestatus',
      kafkaStream: 'queuestatus',
      id: '1234'
    });
  }
}
