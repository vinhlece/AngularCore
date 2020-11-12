import * as _ from 'lodash';
describe('_.zipWith', () => {
  const arr1 = [
    {
      key: 1,
      value: 2
    },
    {
      key: 2,
      value: 5
    }
  ];
  const arr2 = [
    {
      key: 1,
      value: 5
    },
    {
      key: 2,
      value: 11
    }
  ];
  it('return merge array items', () => {
    const expected = [
      {
        key: 1,
        value1: 2,
        value2: 5
      },
      {
        key: 2,
        value1: 5,
        value2: 11
      }
    ];
    const result = _.zipWith(arr1, arr2, (item1, item2) => {
      return {
        key: item1.key,
        value1: item1.value,
        value2: item2.value
      }
    });
    expect(result).toEqual(expected);
  })
});
