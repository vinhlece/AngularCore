import {RealtimeData} from '../../models';
import {CompositeInterceptor} from './composite';

describe('CompositeInterceptor', () => {
  it('should do nothing and return original data', () => {
    const data: RealtimeData[] = [
      {instance: 'New Sales', measureName: 'ContactsAnswered', measureTimestamp: 1515553200000, measureValue: 103},
      {instance: 'Dog', measureName: 'ContactsAbandoned', measureTimestamp: 1515596400000, measureValue: 89},
      {instance: 'Upgrades', measureName: 'ContactsOffered', measureTimestamp: 1515564000000, measureValue: 61},
      {instance: 'New Sales', measureName: 'ContactsAbandoned', measureTimestamp: 1515600000000, measureValue: 53},
      {instance: 'Cat', measureName: 'ContactsAnswered', measureTimestamp: 1517752800000, measureValue: 26},
    ];

    const interceptor = new CompositeInterceptor();
    const result = interceptor.intercept(data);
    expect(result).toEqual(data);
  });
});
