import * as _ from 'lodash';

describe('mix', () => {
  const obj1 = {
    key: 'Sean',
    measureName: 'measure 1',
    measureValue: 'value 1',
    measureTimestamp: 1
  };
  const obj2 = {
    key: 'Sean',
    measureName: 'measure 1',
    measureValue: 3,
    measureTimestamp: 2
  };
  const obj3 = {
    key: 'Other',
    measureName: 'measure 1',
    measureValue: 1,
    measureTimestamp: 3
  };
  const obj4 = {
    key: 'Other',
    measureName: 'measure 1',
    measureValue: 'value 2',
    measureTimestamp: 2
  };


  const data = [ obj1, obj2, obj3, obj4];

  describe('_.groupBy', () => {
    it('should return array of latest distinct agents', () => {
      const result = _.chain(data)
        .groupBy('key')
        .map(group => {
          return _.maxBy(group, (item) => item.measureTimestamp);
        })
        .value();
      const expected = [obj2, obj3];
      expect(result).toEqual(expected);
    });
  });
  describe('_.transform', () => {
    it('should returns measureName value as a column', () => {
      const input = [obj2, obj3];
      const result = _.chain(input)
        .map((item) => {
          const changed = {
            key: item.key,
            measureTimestamp: item.measureTimestamp,
          };
          changed[item.measureName] = item.measureValue;
          return changed;
        })
        .value();
      const expected = [
        {
          key: obj2.key,
          'measure 1' : obj2.measureValue,
          measureTimestamp: obj2.measureTimestamp
        },
        {
          key: obj3.key,
          'measure 1' : obj3.measureValue,
          measureTimestamp: obj3.measureTimestamp
        }
      ];
      expect(result).toEqual(expected);
    });

    it('combine with group', () => {
      const result = _.chain(data)
        .groupBy('key')
        .map(group => {
          return _.maxBy(group, (item) => item.measureTimestamp);
        })
        .map((item) => {
          const changed = {
            key: item.key,
            measureTimestamp: item.measureTimestamp,
          };
          changed[item.measureName] = item.measureValue;
          return changed;
        })
        .value();
      const expected = [
        {
          key: obj2.key,
          'measure 1' : obj2.measureValue,
          measureTimestamp: obj2.measureTimestamp
        },
        {
          key: obj3.key,
          'measure 1' : obj3.measureValue,
          measureTimestamp: obj3.measureTimestamp
        }
      ];
      expect(result).toEqual(expected);
    });
  })
});
