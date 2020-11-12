import {getColorScheme} from '../../../common/utils/color';
import {mockTrendDiffLineWidget} from '../../../common/testing/mocks/widgets';
import {getMomentByDate, getMomentByDateTime, TimeUtilsImpl} from '../../../common/services/timeUtils';
import {TrendType} from '../../../widgets/models/enums';
import {SandBoxFormulaMeasureFactory} from '../../../measures/services/formula/formula-measure.service';
import {RealtimeData} from '../../models';
import {RealTimeDataProcessorImpl} from '../real-time-data-processor.service';
import {HighchartsDataConverterFactory} from './factory';
import {ColorPalette} from '../../../common/models/index';
import {Calculated} from '../../models/constants';

describe('TrendDiffConverter', () => {
  const processor = new RealTimeDataProcessorImpl(new SandBoxFormulaMeasureFactory());
  const paletteConfig: ColorPalette = {
    id: 'palette 1',
    userId: 'user 1',
    colors: ['#000000', '#111111', '#222222', '#333333', '#444444'],
    threshold: ['#555555', '#666666', '#777777']
  };

  describe('DayTrendDiffConverter', () => {
    const data: RealtimeData[] = [
      {
        instance: 'New Sales', measureName: 'ContactsAnswered',
        measureTimestamp: +getMomentByDateTime('22/2/2018 01:00:00'), measureValue: 1,
        dataType: 'Queue Performance',
        metricCalcType: Calculated,
        dimension: 'Continent',
        window: 'INSTANTANEOUS'
      },
      {
        instance: 'New Sales', measureName: 'ContactsAnswered',
        measureTimestamp: +getMomentByDateTime('22/2/2018 02:00:00'), measureValue: 2,
        dataType: 'Queue Performance',
        metricCalcType: Calculated,
        dimension: 'Continent',
        window: 'INSTANTANEOUS'
      },
      {
        instance: 'New Sales', measureName: 'ContactsAnswered',
        measureTimestamp: +getMomentByDateTime('23/2/2018 01:00:00'), measureValue: 3,
        dataType: 'Queue Performance',
        metricCalcType: Calculated,
        dimension: 'Continent',
        window: 'INSTANTANEOUS'
      },
      {
        instance: 'New Sales', measureName: 'ContactsAnswered',
        measureTimestamp: +getMomentByDateTime('25/2/2018 03:00:00'), measureValue: 4,
        dataType: 'Queue Performance',
        metricCalcType: Calculated,
        dimension: 'Continent',
        window: 'INSTANTANEOUS'
      },
      {
        instance: 'New Sales', measureName: 'ContactsAnswered',
        measureTimestamp: +getMomentByDateTime('26/2/2018 05:00:00'), measureValue: 5,
        dataType: 'Queue Performance',
        metricCalcType: Calculated,
        dimension: 'Continent',
        window: 'INSTANTANEOUS'
      },
    ];
    const startTimestamp = +getMomentByDate('22/2/2018');
    const endTimestamp = +getMomentByDate('1/3/2018');
    const widget = {
      ...mockTrendDiffLineWidget(),
      dimensions: [
        {
          dimension: 'Continent',
          systemInstances: [],
          customInstances: ['New Sales']
        }
      ],
      windows: ['INSTANTANEOUS'],
      measures: ['ContactsAnswered'],
      trendType: TrendType.Day,
      period: 3
    };

    it('should convert to correct data', () => {
      const converter = new HighchartsDataConverterFactory(processor, new TimeUtilsImpl()).createTrendDiffConverter(widget, {
        goBackTimeRange: {startTimestamp, endTimestamp}
      });
      const result = converter.convert(data);
      const expected = [
        {
          name: '23/02/2018',
          data: [
            {
              x: +getMomentByDateTime('23/2/2018 01:00:00') - getMomentByDateTime('23/02/2018 01:00:00').startOf('day').valueOf(),
              y: 3,
            }
          ],
          color: getColorScheme()[0].primary,
          zoneAxis: 'x',
          zones: [ { value: null }, { dashStyle: 'dash' }]
        },
        {
          name: '26/02/2018',
          data: [
            {
              x: +getMomentByDateTime('26/02/2018 05:00:00') - getMomentByDateTime('26/02/2018 05:00:00').startOf('day').valueOf(),
              y: 5,
            }
          ],
          color: getColorScheme()[1].primary,
          lineWidth: 5,
          zoneAxis: 'x',
          zones: [ { value: null }, { dashStyle: 'dash' }]
        }
      ];

      expect(result).toEqual(expected);
    });

    it('[color palette] should convert to correct data', () => {
      const converter = new HighchartsDataConverterFactory(processor, new TimeUtilsImpl()).createTrendDiffConverter(widget, {
        goBackTimeRange: {startTimestamp, endTimestamp},
        colorPalette: paletteConfig
      });
      const result = converter.convert(data);
      const expected = [
        {
          name: '23/02/2018',
          data: [
            {
              x: +getMomentByDateTime('23/2/2018 01:00:00') - getMomentByDateTime('23/02/2018 01:00:00').startOf('day').valueOf(),
              y: 3,
            }
          ],
          color: paletteConfig.colors[0],
          zoneAxis: 'x',
          zones: [ { value: null }, { dashStyle: 'dash' }]
        },
        {
          name: '26/02/2018',
          data: [
            {
              x: +getMomentByDateTime('26/02/2018 05:00:00') - getMomentByDateTime('26/02/2018 05:00:00').startOf('day').valueOf(),
              y: 5,
            }
          ],
          color: paletteConfig.colors[1],
          lineWidth: 5,
          zoneAxis: 'x',
          zones: [ { value: null }, { dashStyle: 'dash' }]
        }
      ];

      expect(result).toEqual(expected);
    });
  });

  describe('ShiftTrendDiffConverter', () => {
    const data: RealtimeData[] = [
      {
        instance: 'New Sales',
        measureName: 'ContactsAnswered',
        measureTimestamp: +getMomentByDateTime('28/2/2018 00:00:00'),
        measureValue: 0,
        dataType: 'Queue Performance',
        metricCalcType: Calculated,
        dimension: 'Continent',
        window: 'INSTANTANEOUS'
      },
      {
        instance: 'New Sales',
        measureName: 'ContactsAnswered',
        measureTimestamp: +getMomentByDateTime('28/2/2018 01:00:00'),
        measureValue: 1,
        dataType: 'Queue Performance',
        metricCalcType: Calculated,
        dimension: 'Continent',
        window: 'INSTANTANEOUS'
      },
      {
        instance: 'New Sales',
        measureName: 'ContactsAnswered',
        measureTimestamp: +getMomentByDateTime('28/2/2018 02:00:00'),
        measureValue: 2,
        dataType: 'Queue Performance',
        metricCalcType: Calculated,
        dimension: 'Continent',
        window: 'INSTANTANEOUS'
      },
      {
        instance: 'New Sales',
        measureName: 'ContactsAnswered',
        measureTimestamp: +getMomentByDateTime('28/2/2018 03:00:00'),
        measureValue: 3,
        dataType: 'Queue Performance',
        metricCalcType: Calculated,
        dimension: 'Continent',
        window: 'INSTANTANEOUS'
      },
      {
        instance: 'New Sales',
        measureName: 'ContactsAnswered',
        measureTimestamp: +getMomentByDateTime('28/2/2018 04:00:00'),
        measureValue: 4,
        dataType: 'Queue Performance',
        metricCalcType: Calculated,
        dimension: 'Continent',
        window: 'INSTANTANEOUS'
      },
      {
        instance: 'New Sales',
        measureName: 'ContactsAnswered',
        measureTimestamp: +getMomentByDateTime('28/2/2018 05:00:00'),
        measureValue: 5,
        dataType: 'Queue Performance',
        metricCalcType: Calculated,
        dimension: 'Continent',
        window: 'INSTANTANEOUS'
      },
      {
        instance: 'New Sales',
        measureName: 'ContactsAnswered',
        measureTimestamp: +getMomentByDateTime('28/2/2018 06:00:00'),
        measureValue: 6,
        dataType: 'Queue Performance',
        metricCalcType: Calculated,
        dimension: 'Continent',
        window: 'INSTANTANEOUS'
      },
      {
        instance: 'New Sales',
        measureName: 'ContactsAnswered',
        measureTimestamp: +getMomentByDateTime('28/2/2018 07:00:00'),
        measureValue: 7,
        dataType: 'Queue Performance',
        metricCalcType: Calculated,
        dimension: 'Continent',
        window: 'INSTANTANEOUS'
      },
      {
        instance: 'New Sales',
        measureName: 'ContactsAnswered',
        measureTimestamp: +getMomentByDateTime('28/2/2018 08:00:00'),
        measureValue: 8,
        dataType: 'Queue Performance',
        metricCalcType: Calculated,
        dimension: 'Continent',
        window: 'INSTANTANEOUS'
      },
      {
        instance: 'New Sales',
        measureName: 'ContactsAnswered',
        measureTimestamp: +getMomentByDateTime('28/2/2018 09:00:00'),
        measureValue: 9,
        dataType: 'Queue Performance',
        metricCalcType: Calculated,
        dimension: 'Continent',
        window: 'INSTANTANEOUS'
      },
      {
        instance: 'New Sales',
        measureName: 'ContactsAnswered',
        measureTimestamp: +getMomentByDateTime('28/2/2018 10:00:00'),
        measureValue: 10,
        dataType: 'Queue Performance',
        metricCalcType: Calculated,
        dimension: 'Continent',
        window: 'INSTANTANEOUS'
      }
    ];
    const startTimestamp = +getMomentByDate('27/2/2018');
    const endTimestamp = +getMomentByDate('1/3/2018');
    const widget = {
      ...mockTrendDiffLineWidget(),
      measures: ['ContactsAnswered'],
      dimensions: [
        {
          dimension: 'Continent',
          systemInstances: [],
          customInstances: ['New Sales']
        }
      ],
      windows: ['INSTANTANEOUS'],
      trendType: TrendType.Shift,
      period: 8
    };

    it('should convert to correct data', () => {
      const converter = new HighchartsDataConverterFactory(processor, new TimeUtilsImpl()).createTrendDiffConverter(widget, {
        goBackTimeRange: {startTimestamp, endTimestamp}
      });
      const result = converter.convert(data);
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
            }
          ],
          color: getColorScheme()[1].primary,
          lineWidth: 5,
          zoneAxis: 'x',
          zones: [ { value: null }, { dashStyle: 'dash' }]
        }
      ];

      expect(result).toEqual(expected);
    });

    it('[color palette] should convert to correct data', () => {
      const converter = new HighchartsDataConverterFactory(processor, new TimeUtilsImpl()).createTrendDiffConverter(widget, {
        goBackTimeRange: {startTimestamp, endTimestamp},
        colorPalette: paletteConfig
      });
      const result = converter.convert(data);
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
            }
          ],
          color: paletteConfig.colors[1],
          lineWidth: 5,
          zoneAxis: 'x',
          zones: [ { value: null }, { dashStyle: 'dash' }]
        }
      ];

      expect(result).toEqual(expected);
    });
  });
});
