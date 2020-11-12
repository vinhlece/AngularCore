import {getColorScheme} from '../../../common/utils/color';
import {getGroupKey} from '../grouper/grouper.spec';
import {HighchartsLineDataBuilder} from './line';
import {ColorPalette} from '../../../common/models/index';
import {Calculated} from '../../models/constants';
import {mockLineWidget} from '../../../common/testing/mocks/widgets';

describe('LineChartBuilder', () => {
  describe('HighChart - generate', () => {
    let service;
    let paletteService;

    const paletteConfig: ColorPalette = {
      id: 'palette 1',
      userId: 'user 1',
      colors: ['#000000', '#111111', '#222222', '#333333', '#444444'],
      threshold: ['#555555', '#666666', '#777777']
    };

    const widget = mockLineWidget();

    const twoGroupedData = {
      [getGroupKey({instance: 'Upgrade', measureTimestamp: 35})]: [
        {
          instance: 'Upgrade',
          measureName: 'NotReady',
          measureValue: 11,
          measureTimestamp: 35,
          metricCalcType: Calculated,
          dimension: 'Continent',
          window: 'INSTANTANEOUS'
        }
      ],
      [getGroupKey({instance: 'New Sales', measureTimestamp: 35})]: [
        {
          instance: 'New Sales',
          measureName: 'NotReady',
          measureValue: 9,
          measureTimestamp: 35,
          metricCalcType: Calculated,
          dimension: 'Continent',
          window: 'INSTANTANEOUS'
        }
      ]
    };

    beforeEach(() => {
      service = new HighchartsLineDataBuilder(null, [], widget);
      paletteService = new HighchartsLineDataBuilder(paletteConfig, [], widget);
    });

    it('should return empty list when grouped data is empty', () => {
      const groupedData = {};

      const result = service.generate(groupedData);

      const expected = [];
      expect(result).toEqual(expected);
    });

    it('should generate data for 2 grouped data', () => {
      const result = service.generate(twoGroupedData);

      const expected = [
        {
          id: 'NotReady-Upgrade',
          name: 'NotReady (Upgrade)',
          data: [
            {x: 35, y: 11},
          ],
          color: getColorScheme()[0].primary,
          zoneAxis: 'x',
          zones: [ { value: null }, { dashStyle: 'dash' }],
          measureName: 'NotReady',
          instance: 'Upgrade',
          window: 'INSTANTANEOUS'
        },
        {
          id: 'NotReady-New Sales',
          name: 'NotReady (New Sales)',
          data: [
            {x: 35, y: 9},
          ],
          color: getColorScheme()[1].primary,
          zoneAxis: 'x',
          zones: [ { value: null }, { dashStyle: 'dash' }],
          measureName: 'NotReady',
          instance: 'New Sales',
          window: 'INSTANTANEOUS'
        },
      ];

      expect(result).toEqual(expected);
    });

    it('[color palette] should generate data for 2 grouped data', () => {
      const result = paletteService.generate(twoGroupedData);

      const expected = [
        {
          id: 'NotReady-Upgrade',
          name: 'NotReady (Upgrade)',
          data: [
            {x: 35, y: 11},
          ],
          color: paletteConfig.colors[0],
          zoneAxis: 'x',
          zones: [ { value: null }, { dashStyle: 'dash' }],
          measureName: 'NotReady',
          instance: 'Upgrade',
          window: 'INSTANTANEOUS'
        },
        {
          id: 'NotReady-New Sales',
          name: 'NotReady (New Sales)',
          data: [
            {x: 35, y: 9},
          ],
          color: paletteConfig.colors[1],
          zoneAxis: 'x',
          zones: [ { value: null }, { dashStyle: 'dash' }],
          measureName: 'NotReady',
          instance: 'New Sales',
          window: 'INSTANTANEOUS'
        },
      ];

      expect(result).toEqual(expected);
    });
  });
});
