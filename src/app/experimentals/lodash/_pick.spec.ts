import * as _ from 'lodash';

describe('_.pick', () => {
  it('should returns picked properties', () => {
    const data = {
      agentID: 'Sean',
      measureName: 'measure',
      measureValue: 'value',
      measureTimestamp: Date.now()
    };
    const selectColumns = [{name: 'measureName'}, {name: 'measureValue'}];
    const expectedData = {
      measureName: 'measure',
      measureValue: 'value'
    };

    const actualData = _.pick(data, _.map(selectColumns, 'name'));
    expect(actualData).toEqual(expectedData);
  });
});
