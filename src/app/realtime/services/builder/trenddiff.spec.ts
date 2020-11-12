import {getColorScheme} from '../../../common/utils/color';
import {getMomentByDate, getMomentByDateTime} from '../../../common/services/timeUtils';
import {HighchartsDayTrendDiffDataBuilder, HighchartsShiftTrendDiffDataBuilder} from './trenddiff';
import {ColorPalette} from '../../../common/models/index';
import {Calculated} from '../../models/constants';

describe('TrendDiffDataBuilder', () => {
  const paletteConfig: ColorPalette = {
    id: 'palette 1',
    userId: 'user 1',
    colors: ['#000000', '#111111', '#222222', '#333333', '#444444'],
    threshold: ['#555555', '#666666', '#777777']
  };

  describe('HighchartsDayTrendDiffDataBuilder', () => {
    const groupedData = {
      [+getMomentByDate('22/02/2018')]: [
        {
          instance: 'New Sales',
          measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('22/02/2018 01:00:00'),
          measureValue: 1,
          metricCalcType: Calculated
        },
        {
          instance: 'New Sales',
          measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('22/02/2018 02:00:00'),
          measureValue: 2,
          metricCalcType: Calculated
        }
      ],
      [+getMomentByDate('25/02/2018')]: [
        {
          instance: 'New Sales',
          measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('25/02/2018 03:00:00'),
          measureValue: 4,
          metricCalcType: Calculated
        }
      ]
    };

    it('should return correct series points', () => {
      const builder = new HighchartsDayTrendDiffDataBuilder(null);
      const result = builder.generate(groupedData);
      const expected = [
        {
          name: '22/02/2018',
          data: [
            {
              x: +getMomentByDateTime('22/02/2018 01:00:00') - getMomentByDateTime('22/02/2018 01:00:00').startOf('day').valueOf(),
              y: 1,
            },
            {
              x: +getMomentByDateTime('22/02/2018 02:00:00') - getMomentByDateTime('22/02/2018 02:00:00').startOf('day').valueOf(),
              y: 2
            }
          ],
          color: getColorScheme()[0].primary,
          zoneAxis: 'x',
          zones: [ { value: null }, { dashStyle: 'dash' }]
        },
        {
          name: '25/02/2018',
          data: [
            {
              x: +getMomentByDateTime('25/02/2018 03:00:00') - getMomentByDateTime('25/02/2018 03:00:00').startOf('day').valueOf(),
              y: 4,
            }
          ],
          color: getColorScheme()[1].primary,
          zoneAxis: 'x',
          zones: [ { value: null }, { dashStyle: 'dash' }]
        }
      ];

      expect(result).toEqual(expected);
    });

    it('[color palette] should return correct series points', () => {
      const builder = new HighchartsDayTrendDiffDataBuilder(paletteConfig);
      const result = builder.generate(groupedData);
      const expected = [
        {
          name: '22/02/2018',
          data: [
            {
              x: +getMomentByDateTime('22/02/2018 01:00:00') - getMomentByDateTime('22/02/2018 01:00:00').startOf('day').valueOf(),
              y: 1,
            },
            {
              x: +getMomentByDateTime('22/02/2018 02:00:00') - getMomentByDateTime('22/02/2018 02:00:00').startOf('day').valueOf(),
              y: 2
            }
          ],
          color: paletteConfig.colors[0],
          zoneAxis: 'x',
          zones: [ { value: null }, { dashStyle: 'dash' }]
        },
        {
          name: '25/02/2018',
          data: [
            {
              x: +getMomentByDateTime('25/02/2018 03:00:00') - getMomentByDateTime('25/02/2018 03:00:00').startOf('day').valueOf(),
              y: 4,
            }
          ],
          color: paletteConfig.colors[1],
          zoneAxis: 'x',
          zones: [ { value: null }, { dashStyle: 'dash' }]
        }
      ];

      expect(result).toEqual(expected);
    });
  });

  describe('HighchartsShiftTrendDiffDataBuilder', () => {
    const groupedData = {
      [+getMomentByDateTime('28/2/2018 00:00:00')]: [
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('28/2/2018 00:00:00'), measureValue: 0,
          metricCalcType: Calculated
        },
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('28/2/2018 01:00:00'), measureValue: 1,
          metricCalcType: Calculated
        },
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('28/2/2018 02:00:00'), measureValue: 2,
          metricCalcType: Calculated
        },
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('28/2/2018 03:00:00'), measureValue: 3,
          metricCalcType: Calculated
        },
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('28/2/2018 04:00:00'), measureValue: 4,
          metricCalcType: Calculated
        },
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('28/2/2018 05:00:00'), measureValue: 5,
          metricCalcType: Calculated
        },
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('28/2/2018 06:00:00'), measureValue: 6,
          metricCalcType: Calculated
        },
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('28/2/2018 07:00:00'), measureValue: 7,
          metricCalcType: Calculated
        }
      ],
      [+getMomentByDateTime('28/2/2018 08:00:00')]: [
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('28/2/2018 08:00:00'), measureValue: 8,
          metricCalcType: Calculated
        },
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('28/2/2018 09:00:00'), measureValue: 9,
          metricCalcType: Calculated
        },
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('28/2/2018 10:00:00'), measureValue: 10,
          metricCalcType: Calculated
        }
      ]
    };

    it('should return correct series points', () => {
      const builder = new HighchartsShiftTrendDiffDataBuilder(8, null);
      const result = builder.generate(groupedData);
      const expected = [
        {
          name: '28/02/2018, 00:00:00',
          data: [
            {
              x: 0,
              y: 0
            },
            {
              x: 3600000,
              y: 1
            },
            {
              x: 7200000,
              y: 2
            },
            {
              x: 10800000,
              y: 3
            },
            {
              x: 14400000,
              y: 4
            },
            {
              x: 18000000,
              y: 5
            },
            {
              x: 21600000,
              y: 6
            },
            {
              x: 25200000,
              y: 7
            }
          ],
          color: getColorScheme()[0].primary,
          zoneAxis: 'x',
          zones: [ { value: null }, { dashStyle: 'dash' }]
        },
        {
          name: '28/02/2018, 08:00:00',
          data: [
            {
              x: 0,
              y: 8
            },
            {
              x: 3600000,
              y: 9
            },
            {
              x: 7200000,
              y: 10
            },
          ],
          color: getColorScheme()[1].primary,
          zoneAxis: 'x',
          zones: [ { value: null }, { dashStyle: 'dash' }]
        }
      ];

      expect(result).toEqual(expected);
    });

    it('[color palette] should return correct series points', () => {
      const builder = new HighchartsShiftTrendDiffDataBuilder(8, paletteConfig);
      const result = builder.generate(groupedData);
      const expected = [
        {
          name: '28/02/2018, 00:00:00',
          data: [
            {
              x: 0,
              y: 0
            },
            {
              x: 3600000,
              y: 1
            },
            {
              x: 7200000,
              y: 2
            },
            {
              x: 10800000,
              y: 3
            },
            {
              x: 14400000,
              y: 4
            },
            {
              x: 18000000,
              y: 5
            },
            {
              x: 21600000,
              y: 6
            },
            {
              x: 25200000,
              y: 7
            }
          ],
          color: paletteConfig.colors[0],
          zoneAxis: 'x',
          zones: [ { value: null }, { dashStyle: 'dash' }]
        },
        {
          name: '28/02/2018, 08:00:00',
          data: [
            {
              x: 0,
              y: 8
            },
            {
              x: 3600000,
              y: 9
            },
            {
              x: 7200000,
              y: 10
            },
          ],
          color: paletteConfig.colors[1],
          zoneAxis: 'x',
          zones: [ { value: null }, { dashStyle: 'dash' }]
        }
      ];

      expect(result).toEqual(expected);
    });
  });
});
