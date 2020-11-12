import * as _ from 'lodash';

describe('transform', () => {
  const item1 = {
    key: 'New Sales',
    measureName: 'Available',
    measureValue: 3,
    measureTimestamp: 10
  };
  const item2 = {
    key: 'Upgrade',
    measureName: 'Available',
    measureValue: 5,
    measureTimestamp: 10
  };

  it('should return item has key value as a property with measureValue is measure measureValue', () => {
    const expected = {
      'New Sales': 3,
      measureName: 'Available',
      measureTimestamp: 10
    };
    const resultX = _.transform(item1, (result, value, key) => {
      if (key === 'key') {
        result[value] = item1.measureValue;
      } else {
        if (key !== 'measureValue') {
          result[key] = value;
        }
      }
    }, {});
    expect(resultX).toEqual(expected);
  });

  it('should return an item that merged from array', () => {
    const data = [item1, item2];
    const expected = {
      'New Sales': 3,
      'Upgrade': 5,
      measureName: 'Available',
      measureTimestamp: 10
    };

    const transformedData = _.map(data, (item) => {
      return _.transform(item, (result, value, key) => {
        if (key === 'key') {
          result[value] = item.measureValue;
        }
      }, {});
    });
    let result;
    _.forEach(transformedData, function(item) {
      result = _.assign(result, item);
    });
    result = _.assign(result, {measureName: item1.measureName}, {measureTimestamp: item1.measureTimestamp});
    expect(result).toEqual(expected);
  });
});
