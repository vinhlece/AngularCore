import {StatusMeasures} from '../../../measures/models/enums';
import {getColorScheme} from '../../../common/utils/color';
import {AppDateTimeFormat} from '../../../common/models/enums';
import {mockBarWidget} from '../../../common/testing/mocks/widgets';
import {getMomentByTimestamp, TimeUtilsImpl} from '../../../common/services/timeUtils';
import {WidgetMode} from '../../../widgets/constants/widget-types';
import {SandBoxFormulaMeasureFactory} from '../../../measures/services/formula/formula-measure.service';
import {RealtimeData} from '../../models';
import {ConverterOptions} from '../index';
import {RealTimeDataProcessorImpl} from '../real-time-data-processor.service';
import {HighchartsDataConverterFactory} from './factory';
import {ColorPalette} from '../../../common/models/index';
import {BarMode, BarWidget} from '../../../widgets/models/index';
import {ColorStyle} from '../../models/enum';

const data: RealtimeData[] = [
  {
    instance: 'New Sales',
    measureName: StatusMeasures.NotReady,
    measureValue: 1,
    measureTimestamp: 1,
    dataType: 'Queue Performance',
    dimension: 'Continent',
    window: 'INSTANTANEOUS'
  },
  {
    instance: 'New Sales',
    measureName: StatusMeasures.Available,
    measureValue: 2,
    measureTimestamp: 1,
    dataType: 'Queue Performance',
    dimension: 'Continent',
    window: 'INSTANTANEOUS'
  },
  {
    instance: 'Upgrade',
    measureName: StatusMeasures.NotReady,
    measureValue: 3,
    measureTimestamp: 1,
    dataType: 'Queue Performance',
    dimension: 'Continent',
    window: 'INSTANTANEOUS'
  },
  {
    instance: 'Upgrade',
    measureName: StatusMeasures.Available,
    measureValue: 4,
    measureTimestamp: 1,
    dataType: 'Queue Performance',
    dimension: 'Continent',
    window: 'INSTANTANEOUS'
  },
  {
    instance: 'New Sales',
    measureName: StatusMeasures.NotReady,
    measureValue: 5,
    measureTimestamp: 23,
    dataType: 'Queue Performance',
    dimension: 'Continent',
    window: 'INSTANTANEOUS'
  },
  {
    instance: 'New Sales',
    measureName: StatusMeasures.Available,
    measureValue: 6,
    measureTimestamp: 23,
    dataType: 'Queue Performance',
    dimension: 'Continent',
    window: 'INSTANTANEOUS'
  },
  {
    instance: 'Upgrade',
    measureName: StatusMeasures.NotReady,
    measureValue: 7,
    measureTimestamp: 23,
    dataType: 'Queue Performance',
    dimension: 'Continent',
    window: 'INSTANTANEOUS'
  },
  {
    instance: 'Upgrade',
    measureName: StatusMeasures.Available,
    measureValue: 8,
    measureTimestamp: 23,
    dataType: 'Queue Performance',
    dimension: 'Continent',
    window: 'INSTANTANEOUS'
  },
  {
    instance: 'New Sales',
    measureName: StatusMeasures.NotReady,
    measureValue: 9,
    measureTimestamp: 35,
    dataType: 'Queue Performance',
    dimension: 'Continent',
    window: 'INSTANTANEOUS'
  },
  {
    instance: 'New Sales',
    measureName: StatusMeasures.Available,
    measureValue: 10,
    measureTimestamp: 35,
    dataType: 'Queue Performance',
    dimension: 'Continent',
    window: 'INSTANTANEOUS'
  },
  {
    instance: 'Upgrade',
    measureName: StatusMeasures.NotReady,
    measureValue: 11,
    measureTimestamp: 35,
    dataType: 'Queue Performance',
    dimension: 'Continent',
    window: 'INSTANTANEOUS'
  },
  {
    instance: 'Upgrade',
    measureName: StatusMeasures.Available,
    measureValue: 12,
    measureTimestamp: 35,
    dataType: 'Queue Performance',
    dimension: 'Continent',
    window: 'INSTANTANEOUS'
  },
];

describe('Highcharts Bar Converter', () => {
  const processor = new RealTimeDataProcessorImpl(new SandBoxFormulaMeasureFactory());
  const factory = new HighchartsDataConverterFactory(processor, new TimeUtilsImpl());
  const getDateByTimeStamp = (timestamp) => getMomentByTimestamp(timestamp).format(AppDateTimeFormat.dateTime);
  const paletteConfig: ColorPalette = {
    id: 'palette 1',
    userId: 'user 1',
    colors: ['#000000', '#111111', '#222222', '#333333', '#444444'],
    threshold: ['#555555', '#666666', '#777777']
  };

  describe('WidgetMode.Measures', () => {
    const measures = [StatusMeasures.NotReady];
    const instances = ['New Sales', 'Upgrade'];
    const widget = {
      ...mockBarWidget(),
      mode: {
        value: WidgetMode.Measures,
        timeGroup: null
      },
      measures,
      dimensions: [
        {
          dimension: 'Continent',
          systemInstances: [],
          customInstances: instances
        }
      ],
      windows: ['INSTANTANEOUS'],
    };

    describe('convert', () => {
      it('should return empty list when realtime data is empty', () => {
        const options: ConverterOptions = {};
        const service = factory.createBarConverter(widget, options);
        const realTimeData = [];
        const result = service.convert(realTimeData);
        const expected = [];
        expect(result).toEqual(expected);
      });

      it('should return list contains latest render data when previous timestamp is null', () => {
        const options: ConverterOptions = {
          goBackTimeRange: null
        };
        const service = factory.createBarConverter(widget, options);
        const result = service.convert(data);
        const expected = [
          {
            name: 'New Sales' + ' - INSTANTANEOUS (' + getMomentByTimestamp(35).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'NotReady', y: 9, tooltip: `New Sales - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
            ],
            color: getColorScheme()[0].primary,
            stack: 0,
            measureName: 'NotReady',
            instance: 'New Sales',
            window: 'INSTANTANEOUS'
          },
          {
            name: 'Upgrade' + ' - INSTANTANEOUS (' + getMomentByTimestamp(35).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'NotReady', y: 11, tooltip: `Upgrade - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
            ],
            color: getColorScheme()[1].primary,
            stack: 0,
            measureName: 'NotReady',
            instance: 'Upgrade',
            window: 'INSTANTANEOUS'
          }
        ];
        expect(result).toEqual(expected);
      });

      it('[color palette] should return list contains latest render data when previous timestamp is null', () => {
        const options: ConverterOptions = {
          goBackTimeRange: null,
          colorPalette: paletteConfig
        };
        const service = factory.createBarConverter(widget, options);
        const result = service.convert(data);
        const expected = [
          {
            name: 'New Sales' + ' - INSTANTANEOUS (' + getMomentByTimestamp(35).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'NotReady', y: 9, tooltip: `New Sales - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
            ],
            color: paletteConfig.colors[0],
            stack: 0,
            measureName: 'NotReady',
            instance: 'New Sales',
            window: 'INSTANTANEOUS'
          },
          {
            name: 'Upgrade' + ' - INSTANTANEOUS (' + getMomentByTimestamp(35).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'NotReady', y: 11, tooltip: `Upgrade - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
            ],
            color: paletteConfig.colors[1],
            stack: 0,
            measureName: 'NotReady',
            instance: 'Upgrade',
            window: 'INSTANTANEOUS'
          }
        ];
        expect(result).toEqual(expected);
      });

      it('should return list contains latest render data when previous time line is greater than max timestamp', () => {
        const options: ConverterOptions = {
          goBackTimeRange: {startTimestamp: 0, endTimestamp: 100}
        };
        const service = factory.createBarConverter(widget, options);
        const result = service.convert(data);
        const expected = [
          {
            name: 'New Sales' + ' - INSTANTANEOUS (' + getMomentByTimestamp(35).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'NotReady', y: 9, tooltip: `New Sales - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
            ],
            color: getColorScheme()[0].primary,
            stack: 0,
            measureName: 'NotReady',
            instance: 'New Sales',
            window: 'INSTANTANEOUS'
          },
          {
            name: 'Upgrade' + ' - INSTANTANEOUS (' + getMomentByTimestamp(35).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'NotReady', y: 11, tooltip: `Upgrade - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
            ],
            color: getColorScheme()[1].primary,
            stack: 0,
            measureName: 'NotReady',
            instance: 'Upgrade',
            window: 'INSTANTANEOUS'
          }
        ];

        expect(result).toEqual(expected);
      });

      it('[color palette] should return list contains latest render data when previous time line is greater than max timestamp', () => {
        const options: ConverterOptions = {
          goBackTimeRange: {startTimestamp: 0, endTimestamp: 100},
          colorPalette: paletteConfig
        };
        const service = factory.createBarConverter(widget, options);
        const result = service.convert(data);
        const expected = [
          {
            name: 'New Sales' + ' - INSTANTANEOUS (' + getMomentByTimestamp(35).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'NotReady', y: 9, tooltip: `New Sales - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
            ],
            color: paletteConfig.colors[0],
            stack: 0,
            measureName: 'NotReady',
            instance: 'New Sales',
            window: 'INSTANTANEOUS'
          },
          {
            name: 'Upgrade' + ' - INSTANTANEOUS (' + getMomentByTimestamp(35).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'NotReady', y: 11, tooltip: `Upgrade - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
            ],
            color: paletteConfig.colors[1],
            stack: 0,
            measureName: 'NotReady',
            instance: 'Upgrade',
            window: 'INSTANTANEOUS'
          }
        ];

        expect(result).toEqual(expected);
      });

      it('should return list contains latest and previous render data when previous time line is less than max timestamp', () => {
        const options: ConverterOptions = {
          goBackTimeRange: {startTimestamp: 0, endTimestamp: 23}
        };
        const service = factory.createBarConverter(widget, options);
        const result = service.convert(data);
        const expected = [
          {
            name: 'New Sales' + ' - INSTANTANEOUS (' + getMomentByTimestamp(35).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'NotReady', y: 9, tooltip: `New Sales - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
            ],
            color: getColorScheme()[0].primary,
            stack: 0,
            measureName: 'NotReady',
            instance: 'New Sales',
            window: 'INSTANTANEOUS'
          },
          {
            name: 'New Sales' + ' - INSTANTANEOUS (' + getMomentByTimestamp(23).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'NotReady', y: 5, tooltip: `New Sales - INSTANTANEOUS (${getDateByTimeStamp(23)})`},
            ],
            color: 'url(#historical-pattern-0)',
            stack: 1,
            measureName: 'NotReady',
            instance: 'New Sales',
            window: 'INSTANTANEOUS'
          },
          {
            name: 'Upgrade' + ' - INSTANTANEOUS (' + getMomentByTimestamp(35).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'NotReady', y: 11, tooltip: `Upgrade - INSTANTANEOUS (${getDateByTimeStamp(35)})`}],
            color: getColorScheme()[1].primary,
            stack: 0,
            measureName: 'NotReady',
            instance: 'Upgrade',
            window: 'INSTANTANEOUS'
          },
          {
            name: 'Upgrade' + ' - INSTANTANEOUS (' + getMomentByTimestamp(23).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'NotReady', y: 7, tooltip: `Upgrade - INSTANTANEOUS (${getDateByTimeStamp(23)})`}
            ],
            color: 'url(#historical-pattern-1)',
            stack: 1,
            measureName: 'NotReady',
            instance: 'Upgrade',
            window: 'INSTANTANEOUS'
          }
        ];
        expect(result).toEqual(expected);
      });

      it('[color palette] should return list contains latest and previous render data when ' +
        'previous time line is less than max timestamp', () => {
        const options: ConverterOptions = {
          goBackTimeRange: {startTimestamp: 0, endTimestamp: 23},
          colorPalette: paletteConfig
        };
        const service = factory.createBarConverter(widget, options);
        const result = service.convert(data);
        const expected = [
          {
            name: 'New Sales' + ' - INSTANTANEOUS (' + getMomentByTimestamp(35).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'NotReady', y: 9, tooltip: `New Sales - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
            ],
            color: paletteConfig.colors[0],
            stack: 0,
            measureName: 'NotReady',
            instance: 'New Sales',
            window: 'INSTANTANEOUS'
          },
          {
            name: 'New Sales' + ' - INSTANTANEOUS (' + getMomentByTimestamp(23).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'NotReady', y: 5, tooltip: `New Sales - INSTANTANEOUS (${getDateByTimeStamp(23)})`},
            ],
            color: 'url(#historical-pattern-0)',
            stack: 1,
            measureName: 'NotReady',
            instance: 'New Sales',
            window: 'INSTANTANEOUS'
          },
          {
            name: 'Upgrade' + ' - INSTANTANEOUS (' + getMomentByTimestamp(35).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'NotReady', y: 11, tooltip: `Upgrade - INSTANTANEOUS (${getDateByTimeStamp(35)})`}],
            color: paletteConfig.colors[1],
            stack: 0,
            measureName: 'NotReady',
            instance: 'Upgrade',
            window: 'INSTANTANEOUS'
          },
          {
            name: 'Upgrade' + ' - INSTANTANEOUS (' + getMomentByTimestamp(23).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'NotReady', y: 7, tooltip: `Upgrade - INSTANTANEOUS (${getDateByTimeStamp(23)})`}
            ],
            color: 'url(#historical-pattern-1)',
            stack: 1,
            measureName: 'NotReady',
            instance: 'Upgrade',
            window: 'INSTANTANEOUS'
          }
        ];
        expect(result).toEqual(expected);
      });

      it('should return list contains latest data and latest to previous timestamp data ' +
        'when previous time line is less than max timestamp and no data at previous timestamp', () => {
        const options: ConverterOptions = {
          goBackTimeRange: {startTimestamp: 0, endTimestamp: 30}
        };
        const service = factory.createBarConverter(widget, options);
        const result = service.convert(data);
        const expected = [
          {
            name: 'New Sales' + ' - INSTANTANEOUS (' + getMomentByTimestamp(35).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'NotReady', y: 9, tooltip: `New Sales - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
            ],
            color: getColorScheme()[0].primary,
            stack: 0,
            measureName: 'NotReady',
            instance: 'New Sales',
            window: 'INSTANTANEOUS'
          },
          {
            name: 'New Sales' + ' - INSTANTANEOUS (' + getMomentByTimestamp(23).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'NotReady', y: 5, tooltip: `New Sales - INSTANTANEOUS (${getDateByTimeStamp(23)})`},
            ],
            color: 'url(#historical-pattern-0)',
            stack: 1,
            measureName: 'NotReady',
            instance: 'New Sales',
            window: 'INSTANTANEOUS'
          },
          {
            name: 'Upgrade' + ' - INSTANTANEOUS (' + getMomentByTimestamp(35).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'NotReady', y: 11, tooltip: `Upgrade - INSTANTANEOUS (${getDateByTimeStamp(35)})`}],
            color: getColorScheme()[1].primary,
            stack: 0,
            measureName: 'NotReady',
            instance: 'Upgrade',
            window: 'INSTANTANEOUS'
          },
          {
            name: 'Upgrade' + ' - INSTANTANEOUS (' + getMomentByTimestamp(23).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'NotReady', y: 7, tooltip: `Upgrade - INSTANTANEOUS (${getDateByTimeStamp(23)})`}
            ],
            color: 'url(#historical-pattern-1)',
            stack: 1,
            measureName: 'NotReady',
            instance: 'Upgrade',
            window: 'INSTANTANEOUS'
          }
        ];
        expect(result).toEqual(expected);
      });

      it('[color palette] should return list contains latest data and latest to previous timestamp data ' +
        'when previous time line is less than max timestamp and no data at previous timestamp', () => {
        const options: ConverterOptions = {
          goBackTimeRange: {startTimestamp: 0, endTimestamp: 30},
          colorPalette: paletteConfig
        };
        const service = factory.createBarConverter(widget, options);
        const result = service.convert(data);
        const expected = [
          {
            name: 'New Sales' + ' - INSTANTANEOUS (' + getMomentByTimestamp(35).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'NotReady', y: 9, tooltip: `New Sales - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
            ],
            color: paletteConfig.colors[0],
            stack: 0,
            measureName: 'NotReady',
            instance: 'New Sales',
            window: 'INSTANTANEOUS'
          },
          {
            name: 'New Sales' + ' - INSTANTANEOUS (' + getMomentByTimestamp(23).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'NotReady', y: 5, tooltip: `New Sales - INSTANTANEOUS (${getDateByTimeStamp(23)})`},
            ],
            color: 'url(#historical-pattern-0)',
            stack: 1,
            measureName: 'NotReady',
            instance: 'New Sales',
            window: 'INSTANTANEOUS'
          },
          {
            name: 'Upgrade' + ' - INSTANTANEOUS (' + getMomentByTimestamp(35).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'NotReady', y: 11, tooltip: `Upgrade - INSTANTANEOUS (${getDateByTimeStamp(35)})`}],
            color: paletteConfig.colors[1],
            stack: 0,
            measureName: 'NotReady',
            instance: 'Upgrade',
            window: 'INSTANTANEOUS'
          },
          {
            name: 'Upgrade' + ' - INSTANTANEOUS (' + getMomentByTimestamp(23).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'NotReady', y: 7, tooltip: `Upgrade - INSTANTANEOUS (${getDateByTimeStamp(35)})`}
            ],
            color: 'url(#historical-pattern-1)',
            stack: 1,
            measureName: 'NotReady',
            instance: 'Upgrade',
            window: 'INSTANTANEOUS'
          }
        ];
        expect(result).toEqual(expected);
      });
    });
  });

  describe('WidgetMode.Instances', () => {
    const measures = [StatusMeasures.NotReady, StatusMeasures.Available];
    const instances = ['New Sales', 'Upgrade'];
    const widget = {
      ...mockBarWidget(),
      mode: {
        value: WidgetMode.Instances,
        timeGroup: null
      },
      measures,
      dimensions: [
        {
          dimension: 'Continent',
          systemInstances: [],
          customInstances: instances
        }
      ],
      windows: ['INSTANTANEOUS'],
    };

    describe('convert', () => {
      it('should return empty list when realtime data is empty', () => {
        const options: ConverterOptions = {
          goBackTimeRange: {startTimestamp: 0, endTimestamp: 0}
        };
        const service = factory.createBarConverter(widget, options);
        const realTimeData = [];

        const result = service.convert(realTimeData);

        const expected = [];
        expect(result).toEqual(expected);
      });

      it('should return list contains latest render data when previous timeline is null', () => {
        const options: ConverterOptions = {
          goBackTimeRange: null
        };
        const service = factory.createBarConverter(widget, options);
        const result = service.convert(data);

        const expected = [
          {
            name: 'NotReady' + ' - INSTANTANEOUS (' + getMomentByTimestamp(35).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'New Sales', y: 9, tooltip: `NotReady - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
              {name: 'Upgrade', y: 11, tooltip: `NotReady - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
            ],
            color: getColorScheme()[0].primary,
            stack: 0,
            measureName: 'NotReady',
            instance: 'New Sales',
            window: 'INSTANTANEOUS'
          },
          {
            name: 'Available' + ' - INSTANTANEOUS (' + getMomentByTimestamp(35).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'New Sales', y: 10, tooltip: `Available - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
              {name: 'Upgrade', y: 12, tooltip: `Available - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
            ],
            color: getColorScheme()[1].primary,
            stack: 0,
            measureName: 'Available',
            instance: 'New Sales',
            window: 'INSTANTANEOUS'
          },
        ];
        expect(result).toEqual(expected);
      });

      it('[color palette] should return list contains latest render data when previous timeline is null', () => {
        const options: ConverterOptions = {
          goBackTimeRange: null,
          colorPalette: paletteConfig
        };
        const service = factory.createBarConverter(widget, options);
        const result = service.convert(data);
        const expected = [
          {
            name: 'NotReady' + ' - INSTANTANEOUS (' + getMomentByTimestamp(35).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'New Sales', y: 9, tooltip: `NotReady - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
              {name: 'Upgrade', y: 11, tooltip: `NotReady - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
            ],
            color: paletteConfig.colors[0],
            stack: 0,
            measureName: 'NotReady',
            instance: 'New Sales',
            window: 'INSTANTANEOUS'
          },
          {
            name: 'Available' + ' - INSTANTANEOUS (' + getMomentByTimestamp(35).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'New Sales', y: 10, tooltip: `Available - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
              {name: 'Upgrade', y: 12, tooltip: `Available - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
            ],
            color: paletteConfig.colors[1],
            stack: 0,
            measureName: 'Available',
            instance: 'New Sales',
            window: 'INSTANTANEOUS'
          },
        ];
        expect(result).toEqual(expected);
      });

      it('should return list contains latest render data when previous time line is greater than max timestamp', () => {
        const options: ConverterOptions = {
          goBackTimeRange: {startTimestamp: 0, endTimestamp: 100}
        };
        const service = factory.createBarConverter(widget, options);
        const result = service.convert(data);
        const expected = [
          {
            name: 'NotReady' + ' - INSTANTANEOUS (' + getMomentByTimestamp(35).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'New Sales', y: 9, tooltip: `NotReady - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
              {name: 'Upgrade', y: 11, tooltip: `NotReady - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
            ],
            color: getColorScheme()[0].primary,
            stack: 0,
            measureName: 'NotReady',
            instance: 'New Sales',
            window: 'INSTANTANEOUS'
          },
          {
            name: 'Available' + ' - INSTANTANEOUS (' + getMomentByTimestamp(35).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'New Sales', y: 10, tooltip: `Available - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
              {name: 'Upgrade', y: 12, tooltip: `Available - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
            ],
            color: getColorScheme()[1].primary,
            stack: 0,
            measureName: 'Available',
            instance: 'New Sales',
            window: 'INSTANTANEOUS'
          },
        ];
        expect(result).toEqual(expected);
      });

      it('[color palette] should return list contains latest render data when previous time line is greater than max timestamp', () => {
        const options: ConverterOptions = {
          goBackTimeRange: {startTimestamp: 0, endTimestamp: 100},
          colorPalette: paletteConfig
        };
        const service = factory.createBarConverter(widget, options);
        const result = service.convert(data);
        const expected = [
          {
            name: 'NotReady' + ' - INSTANTANEOUS (' + getMomentByTimestamp(35).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'New Sales', y: 9, tooltip: `NotReady - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
              {name: 'Upgrade', y: 11, tooltip: `NotReady - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
            ],
            color: paletteConfig.colors[0],
            stack: 0,
            measureName: 'NotReady',
            instance: 'New Sales',
            window: 'INSTANTANEOUS'
          },
          {
            name: 'Available' + ' - INSTANTANEOUS (' + getMomentByTimestamp(35).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'New Sales', y: 10, tooltip: `Available - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
              {name: 'Upgrade', y: 12, tooltip: `Available - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
            ],
            color: paletteConfig.colors[1],
            stack: 0,
            measureName: 'Available',
            instance: 'New Sales',
            window: 'INSTANTANEOUS'
          },
        ];
        expect(result).toEqual(expected);
      });

      it('should return list contains latest and previous render data when previous time line is less than max timestamp', () => {
        const options: ConverterOptions = {
          goBackTimeRange: {startTimestamp: 0, endTimestamp: 23}
        };
        const service = factory.createBarConverter(widget, options);
        const result = service.convert(data);
        const expected = [
          {
            name: 'NotReady' + ' - INSTANTANEOUS (' + getMomentByTimestamp(35).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'New Sales', y: 9, tooltip: `NotReady - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
              {name: 'Upgrade', y: 11, tooltip: `NotReady - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
            ],
            color: getColorScheme()[0].primary,
            stack: 0,
            measureName: 'NotReady',
            instance: 'New Sales',
            window: 'INSTANTANEOUS'
          },
          {
            name: 'NotReady' + ' - INSTANTANEOUS (' + getMomentByTimestamp(23).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'New Sales', y: 5, tooltip: `NotReady - INSTANTANEOUS (${getDateByTimeStamp(23)})`},
              {name: 'Upgrade', y: 7, tooltip: `NotReady - INSTANTANEOUS (${getDateByTimeStamp(23)})`},
            ],
            color: 'url(#historical-pattern-0)',
            stack: 1,
            measureName: 'NotReady',
            instance: 'New Sales',
            window: 'INSTANTANEOUS'
          },
          {
            name: 'Available' + ' - INSTANTANEOUS (' + getMomentByTimestamp(35).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'New Sales', y: 10, tooltip: `Available - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
              {name: 'Upgrade', y: 12, tooltip: `Available - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
            ],
            color: getColorScheme()[1].primary,
            stack: 0,
            measureName: 'Available',
            instance: 'New Sales',
            window: 'INSTANTANEOUS'
          },
          {
            name: 'Available' + ' - INSTANTANEOUS (' + getMomentByTimestamp(23).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'New Sales', y: 6, tooltip: `Available - INSTANTANEOUS (${getDateByTimeStamp(23)})`},
              {name: 'Upgrade', y: 8, tooltip: `Available - INSTANTANEOUS (${getDateByTimeStamp(23)})`},
            ],
            color: 'url(#historical-pattern-1)',
            stack: 1,
            measureName: 'Available',
            instance: 'New Sales',
            window: 'INSTANTANEOUS'
          },
        ];
        expect(result).toEqual(expected);
      });

      it('[color palette] should return list contains latest and previous render data when ' +
        'previous time line is less than max timestamp', () => {
        const options: ConverterOptions = {
          goBackTimeRange: {startTimestamp: 0, endTimestamp: 23},
          colorPalette: paletteConfig
        };
        const service = factory.createBarConverter(widget, options);
        const result = service.convert(data);
        const expected = [
          {
            name: 'NotReady' + ' - INSTANTANEOUS (' + getMomentByTimestamp(35).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'New Sales', y: 9, tooltip: `NotReady - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
              {name: 'Upgrade', y: 11, tooltip: `NotReady - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
            ],
            color: paletteConfig.colors[0],
            stack: 0,
            measureName: 'NotReady',
            instance: 'New Sales',
            window: 'INSTANTANEOUS'
          },
          {
            name: 'NotReady' + ' - INSTANTANEOUS (' + getMomentByTimestamp(23).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'New Sales', y: 5, tooltip: `NotReady - INSTANTANEOUS (${getDateByTimeStamp(23)})`},
              {name: 'Upgrade', y: 7, tooltip: `NotReady - INSTANTANEOUS (${getDateByTimeStamp(23)})`},
            ],
            color: 'url(#historical-pattern-0)',
            stack: 1,
            measureName: 'NotReady',
            instance: 'New Sales',
            window: 'INSTANTANEOUS'
          },
          {
            name: 'Available' + ' - INSTANTANEOUS (' + getMomentByTimestamp(35).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'New Sales', y: 10, tooltip: `Available - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
              {name: 'Upgrade', y: 12, tooltip: `Available - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
            ],
            color: paletteConfig.colors[1],
            stack: 0,
            measureName: 'Available',
            instance: 'New Sales',
            window: 'INSTANTANEOUS'
          },
          {
            name: 'Available' + ' - INSTANTANEOUS (' + getMomentByTimestamp(23).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'New Sales', y: 6, tooltip: `Available - INSTANTANEOUS (${getDateByTimeStamp(23)})`},
              {name: 'Upgrade', y: 8, tooltip: `Available - INSTANTANEOUS (${getDateByTimeStamp(23)})`},
            ],
            color: 'url(#historical-pattern-1)',
            stack: 1,
            measureName: 'Available',
            instance: 'New Sales',
            window: 'INSTANTANEOUS'
          },
        ];
        expect(result).toEqual(expected);
      });

      it('should return list contains latest data and latest to previous timestamp data ' +
        'when previous time line is less than max timestamp and no data at previous timestamp', () => {
        const options: ConverterOptions = {
          goBackTimeRange: {startTimestamp: 0, endTimestamp: 30}
        };
        const service = factory.createBarConverter(widget, options);
        const result = service.convert(data);
        const expected = [
          {
            name: 'NotReady' + ' - INSTANTANEOUS (' + getMomentByTimestamp(35).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'New Sales', y: 9, tooltip: `NotReady - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
              {name: 'Upgrade', y: 11, tooltip: `NotReady - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
            ],
            color: getColorScheme()[0].primary,
            stack: 0,
            measureName: 'NotReady',
            instance: 'New Sales',
            window: 'INSTANTANEOUS'
          },
          {
            name: 'NotReady' + ' - INSTANTANEOUS (' + getMomentByTimestamp(23).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'New Sales', y: 5, tooltip: `NotReady - INSTANTANEOUS (${getDateByTimeStamp(23)})`},
              {name: 'Upgrade', y: 7, tooltip: `NotReady - INSTANTANEOUS (${getDateByTimeStamp(23)})`},
            ],
            color: 'url(#historical-pattern-0)',
            stack: 1,
            measureName: 'NotReady',
            instance: 'New Sales',
            window: 'INSTANTANEOUS'
          },
          {
            name: 'Available' + ' - INSTANTANEOUS (' + getMomentByTimestamp(35).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'New Sales', y: 10, tooltip: `Available - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
              {name: 'Upgrade', y: 12, tooltip: `Available - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
            ],
            color: getColorScheme()[1].primary,
            stack: 0,
            measureName: 'Available',
            instance: 'New Sales',
            window: 'INSTANTANEOUS'
          },
          {
            name: 'Available' + ' - INSTANTANEOUS (' + getMomentByTimestamp(23).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'New Sales', y: 6, tooltip: `Available - INSTANTANEOUS (${getDateByTimeStamp(23)})`},
              {name: 'Upgrade', y: 8, tooltip: `Available - INSTANTANEOUS (${getDateByTimeStamp(23)})`},
            ],
            color: 'url(#historical-pattern-1)',
            stack: 1,
            measureName: 'Available',
            instance: 'New Sales',
            window: 'INSTANTANEOUS'
          },
        ];
        expect(result).toEqual(expected);
      });

      it('[color palette] should return list contains latest data and latest to previous timestamp data ' +
        'when previous time line is less than max timestamp and no data at previous timestamp', () => {
        const options: ConverterOptions = {
          goBackTimeRange: {startTimestamp: 0, endTimestamp: 30},
          colorPalette: paletteConfig
        };
        const service = factory.createBarConverter(widget, options);
        const result = service.convert(data);
        const expected = [
          {
            name: 'NotReady' + ' - INSTANTANEOUS (' + getMomentByTimestamp(35).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'New Sales', y: 9, tooltip: `NotReady - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
              {name: 'Upgrade', y: 11, tooltip: `NotReady - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
            ],
            color: paletteConfig.colors[0],
            stack: 0,
            measureName: 'NotReady',
            instance: 'New Sales',
            window: 'INSTANTANEOUS'
          },
          {
            name: 'NotReady' + ' - INSTANTANEOUS (' + getMomentByTimestamp(23).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'New Sales', y: 5, tooltip: `NotReady - INSTANTANEOUS (${getDateByTimeStamp(23)})`},
              {name: 'Upgrade', y: 7, tooltip: `NotReady - INSTANTANEOUS (${getDateByTimeStamp(23)})`},
            ],
            color: 'url(#historical-pattern-0)',
            stack: 1,
            measureName: 'NotReady',
            instance: 'New Sales',
            window: 'INSTANTANEOUS'
          },
          {
            name: 'Available' + ' - INSTANTANEOUS (' + getMomentByTimestamp(35).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'New Sales', y: 10, tooltip: `Available - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
              {name: 'Upgrade', y: 12, tooltip: `Available - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
            ],
            color: paletteConfig.colors[1],
            stack: 0,
            measureName: 'Available',
            instance: 'New Sales',
            window: 'INSTANTANEOUS'
          },
          {
            name: 'Available' + ' - INSTANTANEOUS (' + getMomentByTimestamp(23).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'New Sales', y: 6, tooltip: `Available - INSTANTANEOUS (${getDateByTimeStamp(23)})`},
              {name: 'Upgrade', y: 8, tooltip: `Available - INSTANTANEOUS (${getDateByTimeStamp(23)})`},
            ],
            color: 'url(#historical-pattern-1)',
            stack: 1,
            measureName: 'Available',
            instance: 'New Sales',
            window: 'INSTANTANEOUS'
          },
        ];
        expect(result).toEqual(expected);
      });

      it('[color] should change with previous data ', () => {
        const data1: RealtimeData[] = [
          {
            instance: 'New Sales',
            measureName: StatusMeasures.NotReady,
            measureValue: 1,
            measureTimestamp: 35,
            dataType: 'Queue Performance',
            dimension: 'Continent',
            window: 'INSTANTANEOUS'
          },
          {
            instance: 'New Sales',
            measureName: StatusMeasures.NotReady,
            measureValue: 2,
            measureTimestamp: 23,
            dataType: 'Queue Performance',
            dimension: 'Continent',
            window: 'INSTANTANEOUS'
          }
        ];
        const options: ConverterOptions = {
          goBackTimeRange: {startTimestamp: 0, endTimestamp: 30},
          colorPalette: paletteConfig
        };
        const service = factory.createBarConverter(widget, options);
        const result = service.convert(data1);
        const expected = [
          {
            name: 'NotReady' + ' - INSTANTANEOUS (' + getMomentByTimestamp(35).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'New Sales', y: 1, tooltip: `NotReady - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
            ],
            color: paletteConfig.colors[0],
            stack: 0,
            measureName: 'NotReady',
            instance: 'New Sales',
            window: 'INSTANTANEOUS'
          },
          {
            name: 'NotReady' + ' - INSTANTANEOUS (' + getMomentByTimestamp(23).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'New Sales', y: 2, tooltip: `NotReady - INSTANTANEOUS (${getDateByTimeStamp(23)})`},
            ],
            color: 'url(#historical-pattern-0)',
            stack: 1,
            measureName: 'NotReady',
            instance: 'New Sales',
            window: 'INSTANTANEOUS'
          }
        ];
        expect(result).toEqual(expected);
      });

      it('[color] should not change with data have same measure but different instance', () => {
        const data1: RealtimeData[] = [
          {
            instance: 'Upgrade',
            measureName: StatusMeasures.NotReady,
            measureValue: 1,
            measureTimestamp: 35,
            dataType: 'Queue Performance',
            dimension: 'Continent',
            window: 'INSTANTANEOUS'
          },
          {
            instance: 'New Sales',
            measureName: StatusMeasures.NotReady,
            measureValue: 2,
            measureTimestamp: 23,
            dataType: 'Queue Performance',
            dimension: 'Continent',
            window: 'INSTANTANEOUS'
          }
        ];
        const options: ConverterOptions = {
          goBackTimeRange: null,
          colorPalette: paletteConfig
        };
        const service = factory.createBarConverter(widget, options);
        const result = service.convert(data1);

        const expected = [
          {
            name: 'NotReady' + ' - INSTANTANEOUS (' + getMomentByTimestamp(35).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'Upgrade', y: 1, tooltip: `NotReady - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
              {name: 'New Sales', y: 2, tooltip: `NotReady - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
            ],
            color: paletteConfig.colors[0],
            stack: 0,
            measureName: 'NotReady',
            instance: 'Upgrade',
            window: 'INSTANTANEOUS'
          }
        ];
        expect(result).toEqual(expected);
      });

      const dataSameIntance: RealtimeData[] = [
        {
          instance: 'Upgrade',
          measureName: StatusMeasures.NotReady,
          measureValue: 1,
          measureTimestamp: 35,
          dataType: 'Queue Performance',
          group: ColorStyle.Solid,
          dimension: 'Continent',
          window: 'INSTANTANEOUS'
        },
        {
          instance: 'Upgrade',
          measureName: StatusMeasures.NotReady,
          measureValue: 10,
          measureTimestamp: 12,
          dataType: 'Queue Performance',
          group: ColorStyle.Slash,
          dimension: 'Continent',
          window: 'INSTANTANEOUS'
        },
        {
          instance: 'Upgrade',
          measureName: StatusMeasures.NotReady,
          measureValue: 2,
          measureTimestamp: 23,
          dataType: 'Queue Performance',
          group: ColorStyle.Dash,
          dimension: 'Continent',
          window: 'INSTANTANEOUS'
        }
      ];


      const dataDifferentIntance: RealtimeData[] = [
        {
          instance: 'Upgrade',
          measureName: StatusMeasures.NotReady,
          measureValue: 1,
          measureTimestamp: 35,
          dataType: 'Queue Performance',
          group: ColorStyle.Solid,
          dimension: 'Continent',
          window: 'INSTANTANEOUS'
        },
        {
          instance: 'New Sales',
          measureName: StatusMeasures.NotReady,
          measureValue: 50,
          measureTimestamp: 35,
          dataType: 'Queue Performance',
          group: ColorStyle.Solid,
          dimension: 'Continent',
          window: 'INSTANTANEOUS'
        },
        {
          instance: 'New Sales',
          measureName: StatusMeasures.NotReady,
          measureValue: 2,
          measureTimestamp: 23,
          dataType: 'Queue Performance',
          group: ColorStyle.Dash,
          dimension: 'Continent',
          window: 'INSTANTANEOUS'
        },
        {
          instance: 'Upgrade',
          measureName: StatusMeasures.NotReady,
          measureValue: 4,
          measureTimestamp: 23,
          dataType: 'Queue Performance',
          group: ColorStyle.Dash,
          dimension: 'Continent',
          window: 'INSTANTANEOUS'
        },
        {
          instance: 'Upgrade',
          measureName: StatusMeasures.NotReady,
          measureValue: 10,
          measureTimestamp: 12,
          dataType: 'Queue Performance',
          group: ColorStyle.Slash,
          dimension: 'Continent',
          window: 'INSTANTANEOUS'
        },
        {
          instance: 'New Sales',
          measureName: StatusMeasures.NotReady,
          measureValue: 40,
          measureTimestamp: 12,
          dataType: 'Queue Performance',
          group: ColorStyle.Slash,
          dimension: 'Continent',
          window: 'INSTANTANEOUS'
        }
      ];

      it('[color] should change when setting custom timestamp with same instances', () => {
        const options: ConverterOptions = {
          goBackTimeRange: null,
          colorPalette: paletteConfig,
          realTimeMode: {
            'bar': true
          }
        };
        const newWidget: BarWidget = {
          ...widget,
          id: 'bar',
          mode: {
            value: WidgetMode.Instances
          },
          timestamps: [10, 23]
        };
        const service = factory.createBarConverter(newWidget, options);
        const result = service.convert(dataSameIntance);
        const expected = [
          {
            name: 'NotReady' + ' - INSTANTANEOUS (' + getMomentByTimestamp(35).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'Upgrade', y: 1, tooltip: `NotReady - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
            ],
            color: paletteConfig.colors[0],
            stack: 0,
            measureName: 'NotReady',
            instance: 'Upgrade',
            window: 'INSTANTANEOUS'
          },
          {
            name: 'NotReady' + ' - INSTANTANEOUS (' + getMomentByTimestamp(23).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'Upgrade', y: 2, tooltip: `NotReady - INSTANTANEOUS (${getDateByTimeStamp(23)})`},
            ],
            color: 'url(#custom-pattern-0)',
            stack: 2,
            measureName: 'NotReady',
            instance: 'Upgrade',
            window: 'INSTANTANEOUS'
          }
        ];
        expect(result).toEqual(expected);
      });

      it('[color] should change when setting custom and goback timestamp with same instances', () => {
        const options: ConverterOptions = {
          goBackTimeRange: {
            startTimestamp: 0,
            endTimestamp: 15
          },
          colorPalette: paletteConfig,
          realTimeMode: {
            'bar': true
          }
        };
        const newWidget: BarWidget = {
          ...widget,
          id: 'bar',
          mode: {
            value: WidgetMode.Instances
          },
          timestamps: [10, 23]
        };
        const service = factory.createBarConverter(newWidget, options);
        const result = service.convert(dataSameIntance);
        const expected = [
          {
            name: 'NotReady' + ' - INSTANTANEOUS (' + getMomentByTimestamp(35).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'Upgrade', y: 1, tooltip: `NotReady - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
            ],
            color: paletteConfig.colors[0],
            stack: 0,
            measureName: 'NotReady',
            instance: 'Upgrade',
            window: 'INSTANTANEOUS'
          },
          {
            name: 'NotReady' + ' - INSTANTANEOUS (' + getMomentByTimestamp(23).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'Upgrade', y: 2, tooltip: `NotReady - INSTANTANEOUS (${getDateByTimeStamp(23)})`},
            ],
            color: 'url(#custom-pattern-0)',
            stack: 2,
            measureName: 'NotReady',
            instance: 'Upgrade',
            window: 'INSTANTANEOUS'
          },
          {
            name: 'NotReady' + ' - INSTANTANEOUS (' + getMomentByTimestamp(12).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'Upgrade', y: 10, tooltip: `NotReady - INSTANTANEOUS (${getDateByTimeStamp(12)})`},
            ],
            color: 'url(#historical-pattern-0)',
            stack: 1,
            measureName: 'NotReady',
            instance: 'Upgrade',
            window: 'INSTANTANEOUS'
          }
        ];
        expect(result).toEqual(expected);
      });

      it('[color] should change when setting custom and goback timestamp with same instances and real time mode off', () => {
        const options: ConverterOptions = {
          goBackTimeRange: {
            startTimestamp: 0,
            endTimestamp: 15
          },
          colorPalette: paletteConfig,
          realTimeMode: {
            'bar': false
          }
        };
        const newWidget: BarWidget = {
          ...widget,
          id: 'bar',
          mode: {
            value: WidgetMode.Instances
          },
          timestamps: [10, 23]
        };
        const service = factory.createBarConverter(newWidget, options);
        const result = service.convert(dataSameIntance);
        const expected = [
          {
            name: 'NotReady' + ' - INSTANTANEOUS (' + getMomentByTimestamp(23).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'Upgrade', y: 2, tooltip: `NotReady - INSTANTANEOUS (${getDateByTimeStamp(23)})`},
            ],
            color: paletteConfig.colors[0],
            stack: 0,
            measureName: 'NotReady',
            instance: 'Upgrade',
            window: 'INSTANTANEOUS'
          },
          {
            name: 'NotReady' + ' - INSTANTANEOUS (' + getMomentByTimestamp(12).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'Upgrade', y: 10, tooltip: `NotReady - INSTANTANEOUS (${getDateByTimeStamp(12)})`},
            ],
            color: 'url(#historical-pattern-0)',
            stack: 1,
            measureName: 'NotReady',
            instance: 'Upgrade',
            window: 'INSTANTANEOUS'
          }
        ];
        expect(result).toEqual(expected);
      });

      it('[color] should change when setting custom and timestamp with different instances', () => {
        const options: ConverterOptions = {
          goBackTimeRange: {
            startTimestamp: 0,
            endTimestamp: 15
          },
          colorPalette: paletteConfig,
          realTimeMode: {
            'bar': true
          }
        };
        const newWidget: BarWidget = {
          ...widget,
          id: 'bar',
          mode: {
            value: WidgetMode.Instances
          },
          timestamps: [10, 23]
        };
        const service = factory.createBarConverter(newWidget, options);
        const result = service.convert(dataDifferentIntance);
        const expected = [
          {
            name: 'NotReady' + ' - INSTANTANEOUS (' + getMomentByTimestamp(35).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'Upgrade', y: 1, tooltip: `NotReady - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
              {name: 'New Sales', y: 50, tooltip: `NotReady - INSTANTANEOUS (${getDateByTimeStamp(35)})`}
            ],
            color: paletteConfig.colors[0],
            stack: 0,
            measureName: 'NotReady',
            instance: 'Upgrade',
            window: 'INSTANTANEOUS'
          },
          {
            name: 'NotReady' + ' - INSTANTANEOUS (' + getMomentByTimestamp(23).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'Upgrade', y: 4, tooltip: `NotReady - INSTANTANEOUS (${getDateByTimeStamp(23)})`},
              {name: 'New Sales', y: 2, tooltip: `NotReady - INSTANTANEOUS (${getDateByTimeStamp(23)})`}
            ],
            color: 'url(#custom-pattern-0)',
            stack: 2,
            measureName: 'NotReady',
            instance: 'Upgrade',
            window: 'INSTANTANEOUS'
          },
          {
            name: 'NotReady' + ' - INSTANTANEOUS (' + getMomentByTimestamp(12).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'Upgrade', y: 10, tooltip: `NotReady - INSTANTANEOUS (${getDateByTimeStamp(12)})`},
              {name: 'New Sales', y: 40, tooltip: `NotReady - INSTANTANEOUS (${getDateByTimeStamp(12)})`}
            ],
            color: 'url(#historical-pattern-0)',
            stack: 1,
            measureName: 'NotReady',
            instance: 'Upgrade',
            window: 'INSTANTANEOUS'
          }

        ];
        expect(result).toEqual(expected);
      });

      it('[color] should change when setting custom and timestamp with different instances when real time off', () => {
        const options: ConverterOptions = {
          goBackTimeRange: {
            startTimestamp: 0,
            endTimestamp: 15
          },
          colorPalette: paletteConfig,
          realTimeMode: {
            'bar': false
          }
        };
        const newWidget: BarWidget = {
          ...widget,
          id: 'bar',
          mode: {
            value: WidgetMode.Instances
          },
          timestamps: [10, 23]
        };
        const service = factory.createBarConverter(newWidget, options);
        const result = service.convert(dataDifferentIntance);
        const expected = [
          {
            name: 'NotReady' + ' - INSTANTANEOUS (' + getMomentByTimestamp(23).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'Upgrade', y: 4, tooltip: `NotReady - INSTANTANEOUS (${getDateByTimeStamp(23)})`},
              {name: 'New Sales', y: 2, tooltip: `NotReady - INSTANTANEOUS (${getDateByTimeStamp(23)})`},
            ],
            color: paletteConfig.colors[0],
            stack: 0,
            measureName: 'NotReady',
            instance: 'Upgrade',
            window: 'INSTANTANEOUS'
          },
          {
            name: 'NotReady' + ' - INSTANTANEOUS (' + getMomentByTimestamp(12).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'Upgrade', y: 10, tooltip: `NotReady - INSTANTANEOUS (${getDateByTimeStamp(12)})`},
              {name: 'New Sales', y: 40, tooltip: `NotReady - INSTANTANEOUS (${getDateByTimeStamp(12)})`},
            ],
            color: 'url(#historical-pattern-0)',
            stack: 1,
            measureName: 'NotReady',
            instance: 'Upgrade',
            window: 'INSTANTANEOUS'
          }
        ];
        expect(result).toEqual(expected);
      });
    });
  });
});
