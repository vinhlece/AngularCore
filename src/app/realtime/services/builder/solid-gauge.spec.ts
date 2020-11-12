import {getGroupKey} from '../grouper/grouper.spec';
import {SolidGaugeDataBuilder} from './solid-gauge';

describe('SolidGaugeDataBuilder', () => {
  it('should generate data for solid gauge', () => {
    const groupedData = {
      [getGroupKey({instance: 'Upgrade', measureTimestamp: 35})]: [
        {
          instance: 'New Sales',
          measureName: 'ContactsAnswered',
          measureValue: 11,
          measureTimestamp: 35
        }
      ]
    };

    const result = new SolidGaugeDataBuilder(null).generate(groupedData);

    const expected = [{
      data: [11]
    }];

    expect(result).toEqual(expected);
  });
});
