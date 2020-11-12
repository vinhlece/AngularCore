import {getColorScheme} from '../../../common/utils/color';
import {mockLineWidget} from '../../../common/testing/mocks/widgets';
import {TimeUtilsImpl} from '../../../common/services/timeUtils';
import {SandBoxFormulaMeasureFactory} from '../../../measures/services/formula/formula-measure.service';
import {RealtimeData} from '../../models';
import {ConverterOptions} from '../index';
import {RealTimeDataProcessorImpl} from '../real-time-data-processor.service';
import {HighchartsDataConverterFactory} from './factory';
import {ColorPalette} from '../../../common/models/index';
import {TimeRangeType} from '../../../dashboard/models/enums';
import {Calculated} from '../../models/constants';

describe('LineDataConverterService', () => {
  const timeUtils = new TimeUtilsImpl();

  const item1: RealtimeData = {
    instance: 'New Sales',
    measureName: 'Contacts Abandoned',
    measureValue: 3,
    measureTimestamp: timeUtils.getTimestampByDate({day: 20, month: 4, year: 2018, hour: 10, minute: 0, second: 0}),
    dataType: 'Queue Performance',
    metricCalcType: Calculated,
    dimension: 'Continent',
    window: 'INSTANTANEOUS'
  };
  const item2: RealtimeData = {
    instance: 'New Sales',
    measureName: 'Contacts Abandoned',
    measureValue: 12,
    measureTimestamp: timeUtils.getTimestampByDate({day: 20, month: 4, year: 2018, hour: 10, minute: 0, second: 20}),
    dataType: 'Queue Performance',
    metricCalcType: Calculated,
    dimension: 'Continent',
    window: 'INSTANTANEOUS'
  };
  const item3: RealtimeData = {
    instance: 'Upgrades',
    measureName: 'Contacts Answered',
    measureValue: 5,
    measureTimestamp: timeUtils.getTimestampByDate({day: 20, month: 4, year: 2018, hour: 10, minute: 0, second: 31}),
    dataType: 'Queue Performance',
    metricCalcType: Calculated,
    dimension: 'Continent',
    window: 'INSTANTANEOUS'
  };
  const item4: RealtimeData = {
    instance: 'Upgrades',
    measureName: 'Contacts Abandoned',
    measureValue: 6,
    measureTimestamp: timeUtils.getTimestampByDate({day: 20, month: 4, year: 2018, hour: 10, minute: 0, second: 49}),
    dataType: 'Queue Performance',
    metricCalcType: Calculated,
    dimension: 'Continent',
    window: 'INSTANTANEOUS'
  };
  const item5: RealtimeData = {
    instance: 'General Queries',
    measureName: 'Contacts Answered',
    measureValue: 24,
    measureTimestamp: timeUtils.getTimestampByDate({day: 20, month: 4, year: 2018, hour: 10, minute: 0, second: 59}),
    dataType: 'Queue Performance',
    metricCalcType: Calculated,
    dimension: 'Continent',
    window: 'INSTANTANEOUS'
  };
  const item6: RealtimeData = {
    instance: 'New Sales',
    measureName: 'Contacts Answered',
    measureValue: 25,
    measureTimestamp: timeUtils.getTimestampByDate({day: 20, month: 4, year: 2018, hour: 9, minute: 0, second: 0}),
    dataType: 'Queue Performance',
    metricCalcType: Calculated,
    dimension: 'Continent',
    window: 'INSTANTANEOUS'
  };
  const paletteConfig: ColorPalette = {
    id: 'palette 1',
    userId: 'user 1',
    colors: ['#000000', '#111111', '#222222', '#333333', '#444444'],
    threshold: ['#555555', '#666666', '#777777']
  };

  const widget = {
    ...mockLineWidget(),
    measures: ['Contacts Abandoned', 'Contacts Answered'],
    dimensions: [
      {
        dimension: 'Continent',
        systemInstances: [],
        customInstances: ['New Sales', 'Upgrades', 'General Queries']
      }
    ],
    windows: ['INSTANTANEOUS']
  };

  const processor = new RealTimeDataProcessorImpl(new SandBoxFormulaMeasureFactory());

  it('should return converted data in sorted order by measure timestamp', () => {
    const options: ConverterOptions = {
      goBackTimeRange: null,
      currentTimeRange: {
        type: TimeRangeType.Day,
        value: 1
      }
    };
    const service = new HighchartsDataConverterFactory(processor, new TimeUtilsImpl()).createLineConverter(widget, options);

    const data = [item1, item2, item3, item4, item5];
    const expected = [
      {
        id: 'Contacts Abandoned-New Sales',
        name: 'Contacts Abandoned (New Sales)',
        data: [
          {x: timeUtils.getTimestampByDate({day: 20, month: 4, year: 2018, hour: 10, minute: 0, second: 0}), y: 12}
        ],
        color: getColorScheme()[0].primary,
        zoneAxis: 'x',
        zones: [ { value: null }, { dashStyle: 'dash' }],
        measureName: 'Contacts Abandoned',
        instance: 'New Sales',
        window: 'INSTANTANEOUS'
      },
      {
        id: 'Contacts Answered-Upgrades',
        name: 'Contacts Answered (Upgrades)',
        data: [
          {x: timeUtils.getTimestampByDate({day: 20, month: 4, year: 2018, hour: 10, minute: 0, second: 0}), y: 5}],
        color: getColorScheme()[1].primary,
        zoneAxis: 'x',
        zones: [ { value: null }, { dashStyle: 'dash' }],
        measureName: 'Contacts Answered',
        instance: 'Upgrades',
        window: 'INSTANTANEOUS'
      },
      {
        id: 'Contacts Abandoned-Upgrades',
        name: 'Contacts Abandoned (Upgrades)',
        data: [
          {x: timeUtils.getTimestampByDate({day: 20, month: 4, year: 2018, hour: 10, minute: 0, second: 0}), y: 6}],
        color: getColorScheme()[2].primary,
        zoneAxis: 'x',
        zones: [ { value: null }, { dashStyle: 'dash' }],
        measureName: 'Contacts Abandoned',
        instance: 'Upgrades',
        window: 'INSTANTANEOUS'
      },
      {
        id: 'Contacts Answered-General Queries',
        name: 'Contacts Answered (General Queries)',
        data: [
          {x: timeUtils.getTimestampByDate({day: 20, month: 4, year: 2018, hour: 10, minute: 0, second: 0}), y: 24}
        ],
        color: getColorScheme()[3].primary,
        zoneAxis: 'x',
        zones: [ { value: null }, { dashStyle: 'dash' }],
        measureName: 'Contacts Answered',
        instance: 'General Queries',
        window: 'INSTANTANEOUS'
      }
    ];
    const result = service.convert(data);
    expect(result).toEqual(expected);
  });

  it('[color palette] should return converted data in sorted order by measure timestamp', () => {
    const options: ConverterOptions = {
      goBackTimeRange: null,
      colorPalette: paletteConfig,
      currentTimeRange: {
        type: TimeRangeType.Day,
        value: 1
      }
    };
    const service = new HighchartsDataConverterFactory(processor, new TimeUtilsImpl()).createLineConverter(widget, options);
    const data = [item1, item2, item3, item4, item5];
    const expected = [
      {
        id: 'Contacts Abandoned-New Sales',
        name: 'Contacts Abandoned (New Sales)',
        data: [
          {x: timeUtils.getTimestampByDate({day: 20, month: 4, year: 2018, hour: 10, minute: 0, second: 0}), y: 12}
        ],
        color: paletteConfig.colors[0],
        zoneAxis: 'x',
        zones: [ { value: null }, { dashStyle: 'dash' }],
        measureName: 'Contacts Abandoned',
        instance: 'New Sales',
        window: 'INSTANTANEOUS'
      },
      {
        id: 'Contacts Answered-Upgrades',
        name: 'Contacts Answered (Upgrades)',
        data: [
          {x: timeUtils.getTimestampByDate({day: 20, month: 4, year: 2018, hour: 10, minute: 0, second: 0}), y: 5}],
        color: paletteConfig.colors[1],
        zoneAxis: 'x',
        zones: [ { value: null }, { dashStyle: 'dash' }],
        measureName: 'Contacts Answered',
        instance: 'Upgrades',
        window: 'INSTANTANEOUS'
      },
      {
        id: 'Contacts Abandoned-Upgrades',
        name: 'Contacts Abandoned (Upgrades)',
        data: [
          {x: timeUtils.getTimestampByDate({day: 20, month: 4, year: 2018, hour: 10, minute: 0, second: 0}), y: 6}],
        color: paletteConfig.colors[2],
        zoneAxis: 'x',
        zones: [ { value: null }, { dashStyle: 'dash' }],
        measureName: 'Contacts Abandoned',
        instance: 'Upgrades',
        window: 'INSTANTANEOUS'
      },
      {
        id: 'Contacts Answered-General Queries',
        name: 'Contacts Answered (General Queries)',
        data: [
          {x: timeUtils.getTimestampByDate({day: 20, month: 4, year: 2018, hour: 10, minute: 0, second: 0}), y: 24}
        ],
        color: paletteConfig.colors[3],
        zoneAxis: 'x',
        zones: [ { value: null }, { dashStyle: 'dash' }],
        measureName: 'Contacts Answered',
        instance: 'General Queries',
        window: 'INSTANTANEOUS'
      }
    ];
    const result = service.convert(data);
    expect(result).toEqual(expected);
  });

  it('[timestamps] should return converted data for timestamp', () => {
    const options: ConverterOptions = {
      goBackTimeRange: null,
      colorPalette: paletteConfig,
      currentTimeRange: {
        type: TimeRangeType.Day,
        value: 1
      }
    };
    const newWidget = {
      ...widget,
      timestamps: [timeUtils.getTimestampByDate({day: 20, month: 4, year: 2018, hour: 9, minute: 0, second: 0})]
    }
    const service = new HighchartsDataConverterFactory(processor, new TimeUtilsImpl()).createLineConverter(newWidget, options);

    const data = [item1, item2, item3, item4, item5, item6];
    const expected = [
      {
        id: 'Contacts Abandoned-New Sales',
        name: 'Contacts Abandoned (New Sales)',
        data: [
          {x: timeUtils.getTimestampByDate({day: 20, month: 4, year: 2018, hour: 10, minute: 0, second: 0}), y: 12}
        ],
        color: paletteConfig.colors[0],
        zoneAxis: 'x',
        zones: [ { value: null }, { dashStyle: 'dash' }],
        measureName: 'Contacts Abandoned',
        instance: 'New Sales',
        window: 'INSTANTANEOUS'
      },
      {
        id: 'Contacts Answered-Upgrades',
        name: 'Contacts Answered (Upgrades)',
        data: [
          {x: timeUtils.getTimestampByDate({day: 20, month: 4, year: 2018, hour: 10, minute: 0, second: 0}), y: 5}],
        color: paletteConfig.colors[1],
        zoneAxis: 'x',
        zones: [ { value: null }, { dashStyle: 'dash' }],
        measureName: 'Contacts Answered',
        instance: 'Upgrades',
        window: 'INSTANTANEOUS'
      },
      {
        id: 'Contacts Abandoned-Upgrades',
        name: 'Contacts Abandoned (Upgrades)',
        data: [
          {x: timeUtils.getTimestampByDate({day: 20, month: 4, year: 2018, hour: 10, minute: 0, second: 0}), y: 6}],
        color: paletteConfig.colors[2],
        zoneAxis: 'x',
        zones: [ { value: null }, { dashStyle: 'dash' }],
        measureName: 'Contacts Abandoned',
        instance: 'Upgrades',
        window: 'INSTANTANEOUS'
      },
      {
        id: 'Contacts Answered-General Queries',
        name: 'Contacts Answered (General Queries)',
        data: [
          {x: timeUtils.getTimestampByDate({day: 20, month: 4, year: 2018, hour: 10, minute: 0, second: 0}), y: 24}
        ],
        color: paletteConfig.colors[3],
        zoneAxis: 'x',
        zones: [ { value: null }, { dashStyle: 'dash' }],
        measureName: 'Contacts Answered',
        instance: 'General Queries',
        window: 'INSTANTANEOUS'
      },
      {
        id: 'Contacts Answered-New Sales',
        name: 'Contacts Answered (New Sales)',
        data: [
          {x: timeUtils.getTimestampByDate({day: 20, month: 4, year: 2018, hour: 9, minute: 0, second: 0}), y: 25}
        ],
        color: paletteConfig.colors[4],
        zoneAxis: 'x',
        zones: [ { value: null }, { dashStyle: 'dash' }],
        measureName: 'Contacts Answered',
        instance: 'New Sales',
        window: 'INSTANTANEOUS'
      }
    ];
    const result = service.convert(data);
    expect(result).toEqual(expected);
  });
});
