import {getGroupKey} from '../grouper/grouper.spec';
import {BillboardDataBuilder} from './billboard';
import {ColorPalette} from '../../../common/models/index';

describe('BillboardDataBuilder', () => {

  const paletteConfig: ColorPalette = {
    id: 'palette 1',
    userId: 'user 1',
    colors: ['#000000', '#111111', '#222222', '#333333', '#444444'],
    threshold: ['#555555', '#666666', '#777777']
  };

  const service = new BillboardDataBuilder(null);
  const paletteService = new BillboardDataBuilder(paletteConfig);

  const groupedDataEmpty = {
    [getGroupKey({instance: 'New Sales', measureTimestamp: 35})]: [
      {
        instance: 'New Sales',
        measureName: 'NotReady',
        measureValue: 11,
        measureTimestamp: 35
      }
    ],
    [getGroupKey({instance: 'New Sales', measureTimestamp: 12})]: [
      {
        instance: 'New Sales',
        measureName: 'NotReady',
        measureValue: 9,
        measureTimestamp: 12
      }
    ]
  };

  it('should return empty data when grouped data is empty', () => {
    const groupedData = {};

    const result = service.generate(groupedData);

    const expected = {
      current: {timestamp: null, value: null},
      passed: {timestamp: null, value: null}
    };

    expect(result).toEqual(expected);
  });

  it('should generate data for 2 grouped data', () => {
    const result = service.generate(groupedDataEmpty);

    const expected = {
      current: {timestamp: 35, value: 11},
      passed: {timestamp: 12, value: 9}
    };

    expect(result).toEqual(expected);
  });

  it('should generate data for 2 grouped data', () => {
    const result = paletteService.generate(groupedDataEmpty);
    const expected = {
      current: {timestamp: 35, value: 11},
      passed: {timestamp: 12, value: 9}
    };

    expect(result).toEqual(expected);
  });
});
