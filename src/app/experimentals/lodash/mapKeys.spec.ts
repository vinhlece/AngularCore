import * as _ from 'lodash';

describe('mapKeys', () => {
  it('change key name', () => {
    const object = {
      agentId: 'id',
      measureName: 'measure',
      measureValue: 2,
      measureTimestamp: 2
    };

    const expected = {
      key: 'id',
      measureName: 'measure',
      measureValue: 2,
      measureTimestamp: 2
    };

    const result = _.mapKeys(object, (value, key) => {
      if (key === 'agentId') {
        return 'key';
      } else {
        return key;
      }
    });
    expect(result).toEqual(expected);
  });
});
