import {DataMapperService} from './data-mapper.services';

describe('data mapper', () => {
  describe('fromJSON', () => {
    it('should map json object into real time record', () => {
      const json = {
        QueueID: 'instance',
        measureId: 'instance',
        measureName: 'contacts answered',
        measureValue: 'value',
        measureTimestamp: 12345,
        agent: 'sean',
        queue: 'sell',
        segmentType: 'talk time',
        callID: 'zzz'
      };
      const expected = {
        dataType: 'queue performance',
        instance: 'instance',
        measureName: 'contacts answered',
        measureValue: 'value',
        measureTimestamp: 12345,
        agent: 'sean',
        queue: 'sell',
        segmentType: 'talk time',
        callID: 'zzz'
      };
      const mapper = new DataMapperService();
      const result = mapper.fromJSON({dataType: 'queue performance'}, json);
      expect(result).toEqual(expected);
    });
  });

  describe('fromKafkaMessage', () => {
    it('should create real time record from kafka message', () => {
      const data = {
        key: null,
        value: 'eyJjbGFzcyI6ImNvbS5jZW1kby5rYWZrYS5tZXNzYWdlLk1ldHJpY1JlcXVlc3QiLCJtZXNzYWdlSWQiOiJDaGVja2luZyxNb2JpbGUgVmlkZW8sZXNwLE5vcnRoRWFzdCIsIm1lc3NhZ2VQYXJ0aXRpb25JZCI6LTEsImJvZHkiOiJ7XCJtZWFzdXJlSWRcIjpcIkNoZWNraW5nLE1vYmlsZSBWaWRlbyxlc3AsTm9ydGhFYXN0XCIsXCJRdWV1ZUlEXCI6XCJDaGVja2luZyxNb2JpbGUgVmlkZW8sZXNwLE5vcnRoRWFzdFwiLFwibWVhc3VyZU5hbWVcIjpcIldvcmtPZmZlcmVkXCIsXCJtZWFzdXJlVmFsdWVcIjpcIjY0N1wiLFwibWVhc3VyZVRpbWVzdGFtcFwiOjE1Mjc2MTQ2NDcxMzB9In0=',
        partition: 0,
        offset: 16063820
      };
      const mapper = new DataMapperService();
      const result = mapper.fromKafkaMessage({dataType: 'queue performance'}, data);
      expect(result).toEqual({
        dataType: 'queue performance',
        instance: 'Checking,Mobile Video,esp,NorthEast',
        measureName: 'WorkOffered',
        measureValue: '647',
        measureTimestamp: 1527614647130,
      });
    });
  });
});

