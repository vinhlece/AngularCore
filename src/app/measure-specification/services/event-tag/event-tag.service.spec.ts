import {EventTagService} from './event-tag.service';

describe('event tag', () => {
  it('should extract correct parameter model from string', () => {
    const service = new EventTagService();
    const query = 'eventType = "AGENT" AND currentContactState != "LOGIN" AND currentContactState1 != "LOGIN1"';
    const result = service.extract(query);
    expect(result).toEqual([{
      type: 'EQUALS',
      name: 'body.userdata.eventType',
      value: 'AGENT'
    }, {
      type: 'NOT_EQUALS',
      name: 'body.userdata.currentContactState',
      value: 'LOGIN'
    }, {
      type: 'NOT_EQUALS',
      name: 'body.userdata.currentContactState1',
      value: 'LOGIN1'
    }]);
  });

  it('should extract correct parameter model from number', () => {
    const service = new EventTagService();
    const query = 'eventType = 4.78 AND currentContactState != -45.6 AND currentContactState1 != -45.61';
    const result = service.extract(query);
    expect(result).toEqual([{
      type: 'EQUALS',
      name: 'body.userdata.eventType',
      value: '4.78'
    }, {
      type: 'NOT_EQUALS',
      name: 'body.userdata.currentContactState',
      value: '-45.6'
    }, {
      type: 'NOT_EQUALS',
      name: 'body.userdata.currentContactState1',
      value: '-45.61'
    }]);
  });

  it('should extract correct parameter model from AND keyword', () => {
    const service = new EventTagService();
    const query = 'eventType = "AGENT AND C" AND currentContactState != "LOGIN AND" AND currentContactState1 != "AND LOGIN1"';
    const result = service.extract(query);
    expect(result).toEqual([{
      type: 'EQUALS',
      name: 'body.userdata.eventType',
      value: 'AGENT AND C'
    }, {
      type: 'NOT_EQUALS',
      name: 'body.userdata.currentContactState',
      value: 'LOGIN AND'
    }, {
      type: 'NOT_EQUALS',
      name: 'body.userdata.currentContactState1',
      value: 'AND LOGIN1'
    }]);
  });

  it('should extract correct parameter model from single basic expression', () => {
    const service = new EventTagService();
    const query = 'eventType = "AGENT AND C"';
    const result = service.extract(query);
    expect(result).toEqual([{
      type: 'EQUALS',
      name: 'body.userdata.eventType',
      value: 'AGENT AND C'
    }]);
  });

  it('should not extract correct parameter model from invalid query', () => {
    const service = new EventTagService();
    let query = 'eventType = AGENT AND C';
    let result = service.extract(query);
    expect(result).toEqual([]);
    query = 'eventType = AGENT';
    result = service.extract(query);
    expect(result).toEqual([]);
  });
});
