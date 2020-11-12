import {getColorScheme} from '../../../common/utils/color';
import {AppDateTimeFormat} from '../../../common/models/enums';
import {getMomentByTimestamp} from '../../../common/services/timeUtils';
import {WidgetMode} from '../../../widgets/constants/widget-types';
import {getGroupKey} from '../grouper/grouper.spec';
import {HighchartsBarDataBuilder} from './bar';
import {ColorPalette} from '../../../common/models/index';
import {ColorStyle} from '../../models/enum';
import {mockBarWidget} from '../../../common/testing/mocks/widgets';

describe('BarDataBuilder', () => {
  describe('generate', () => {
    const getDateByTimeStamp = (timestamp) => getMomentByTimestamp(timestamp).format(AppDateTimeFormat.dateTime);
    const paletteConfig: ColorPalette = {
      id: 'palette 1',
      userId: 'user 1',
      colors: ['#000000', '#111111', '#222222', '#333333', '#444444'],
      threshold: ['#555555', '#666666', '#777777']
    };
    const widget = mockBarWidget();
    const widgetMeasures = {
      ...widget,
      mode: {
        value: WidgetMode.Measures
      }
    };
    const widgetInstance = {
      ...widget,
      mode: {
        value: WidgetMode.Instances
      }
    }

    describe('WidgetMode.Measures', () => {
      let service;
      let paleteService;

      const groupedDataDifferent = {
        [getGroupKey({instance: 'Upgrade', measureTimestamp: 35})]: [
          {
            instance: 'Upgrade',
            measureName: 'NotReady',
            measureValue: 11,
            measureTimestamp: 35,
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
            dimension: 'Continent',
            window: 'INSTANTANEOUS'
          }
        ]
      };

      const groupedDataSaming = {
        [getGroupKey({instance: 'New Sales', measureTimestamp: 35})]: [
          {
            instance: 'New Sales',
            measureName: 'NotReady',
            measureValue: 11,
            measureTimestamp: 35,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'
          }
        ],
        [getGroupKey({instance: 'New Sales', measureTimestamp: 23, group: ColorStyle.Slash})]: [
          {
            instance: 'New Sales',
            measureName: 'NotReady',
            measureValue: 9,
            measureTimestamp: 23,
            group: ColorStyle.Slash,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'
          }
        ]
      };

      const fourGroupedData = {
        [getGroupKey({instance: 'Upgrade', measureTimestamp: 35})]: [
          {
            instance: 'Upgrade',
            measureName: 'NotReady',
            measureValue: 11,
            measureTimestamp: 35,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'
          }
        ],
        [getGroupKey({instance: 'Upgrade', measureTimestamp: 23, group: ColorStyle.Slash})]: [
          {
            instance: 'Upgrade',
            measureName: 'NotReady',
            measureValue: 7,
            measureTimestamp: 23,
            group: ColorStyle.Slash,
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
            dimension: 'Continent',
            window: 'INSTANTANEOUS'
          }
        ],
        [getGroupKey({instance: 'New Sales', measureTimestamp: 23, group: ColorStyle.Slash})]: [
          {
            instance: 'New Sales',
            measureName: 'NotReady',
            measureValue: 5,
            measureTimestamp: 23,
            group: ColorStyle.Slash,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'
          }
        ]
      };

      beforeEach(() => {

        service = new HighchartsBarDataBuilder(widgetMeasures, null, []);
        paleteService = new HighchartsBarDataBuilder(widgetMeasures, paletteConfig, []);
      });

      it('should return empty list when data is empty', () => {
        const groupedData = {};

        const result = service.generate(groupedData);

        expect(result).toEqual([]);
      });

      it('should generate data for 2 grouped data - level 1 is different', () => {
        const result = service.generate(groupedDataDifferent);

        const expected = [
          {
            name: 'Upgrade' + ' - INSTANTANEOUS (' + getDateByTimeStamp(35) + ')',
            data: [
              {name: 'NotReady', y: 11, tooltip: `Upgrade - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
            ],
            color: getColorScheme()[0].primary,
            stack: 0,
            measureName: 'NotReady',
            instance: 'Upgrade',
            window: 'INSTANTANEOUS'
          },
          {
            name: 'New Sales' + ' - INSTANTANEOUS (' + getDateByTimeStamp(35) + ')',
            data: [
              {name: 'NotReady', y: 9, tooltip: `New Sales - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
            ],
            color: getColorScheme()[1].primary,
            stack: 0,
            measureName: 'NotReady',
            instance: 'New Sales',
            window: 'INSTANTANEOUS'
          },
        ];

        expect(result).toEqual(expected);
      });

      it('[color palette] should generate data for 2 grouped data - level 1 is different', () => {
        const result = paleteService.generate(groupedDataDifferent);
        console.log(result)
        const expected = [
          {
            name: 'Upgrade' + ' - INSTANTANEOUS (' + getMomentByTimestamp(35).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'NotReady', y: 11, tooltip: `Upgrade - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
            ],
            color: paletteConfig.colors[0],
            stack: 0,
            measureName: 'NotReady',
            instance: 'Upgrade',
            window: 'INSTANTANEOUS'
          },
          {
            name: 'New Sales' + ' - INSTANTANEOUS (' + getMomentByTimestamp(35).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'NotReady', y: 9, tooltip: `New Sales - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
            ],
            color: paletteConfig.colors[1],
            stack: 0,
            measureName: 'NotReady',
            instance: 'New Sales',
            window: 'INSTANTANEOUS'
          },
        ];

        expect(result).toEqual(expected);
      });

      it('should generate data for 2 grouped data - level 1 is the same', () => {
        const result = service.generate(groupedDataSaming);

        const expected = [
          {
            name: 'New Sales' + ' - INSTANTANEOUS (' + getMomentByTimestamp(35).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'NotReady', y: 11, tooltip: `New Sales - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
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
              {name: 'NotReady', y: 9, tooltip: `New Sales - INSTANTANEOUS (${getDateByTimeStamp(23)})`},
            ],
            color: 'url(#historical-pattern-0)',
            stack: 1,
            measureName: 'NotReady',
            instance: 'New Sales',
            window: 'INSTANTANEOUS'
          },
        ];

        expect(result).toEqual(expected);
      });

      it('[color palette] should generate data for 2 grouped data - level 1 is the same', () => {
        const result = paleteService.generate(groupedDataSaming);

        const expected = [
          {
            name: 'New Sales' + ' - INSTANTANEOUS (' + getMomentByTimestamp(35).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'NotReady', y: 11, tooltip: `New Sales - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
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
              {name: 'NotReady', y: 9, tooltip: `New Sales - INSTANTANEOUS (${getDateByTimeStamp(23)})`},
            ],
            color: 'url(#historical-pattern-0)',
            stack: 1,
            measureName: 'NotReady',
            instance: 'New Sales',
            window: 'INSTANTANEOUS'
          },
        ];

        expect(result).toEqual(expected);
      });

      it('should generate data for 4 grouped data', () => {
        const result = service.generate(fourGroupedData);

        const expected = [
          {
            name: 'Upgrade' + ' - INSTANTANEOUS (' + getMomentByTimestamp(35).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'NotReady', y: 11, tooltip: `Upgrade - INSTANTANEOUS (${getDateByTimeStamp(35)})`}
              ],
            color: getColorScheme()[0].primary,
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
            color: 'url(#historical-pattern-0)',
            stack: 1,
            measureName: 'NotReady',
            instance: 'Upgrade',
            window: 'INSTANTANEOUS'
          },
          {
            name: 'New Sales' + ' - INSTANTANEOUS (' + getMomentByTimestamp(35).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'NotReady', y: 9, tooltip: `New Sales - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
            ],
            color: getColorScheme()[1].primary,
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
            color: 'url(#historical-pattern-1)',
            stack: 1,
            measureName: 'NotReady',
            instance: 'New Sales',
            window: 'INSTANTANEOUS'
          },
        ];
        expect(result).toEqual(expected);
      });

      it('[color palette] should generate data for 4 grouped data', () => {
        const result = paleteService.generate(fourGroupedData);

        const expected = [
          {
            name: 'Upgrade' + ' - INSTANTANEOUS (' + getMomentByTimestamp(35).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'NotReady', y: 11, tooltip: `Upgrade - INSTANTANEOUS (${getDateByTimeStamp(35)})`}
              ],
            color: paletteConfig.colors[0],
            stack: 0,
            measureName: 'NotReady',
            instance: 'Upgrade',
            window: 'INSTANTANEOUS'
          },
          {
            name: 'Upgrade' + ' - INSTANTANEOUS (' + getMomentByTimestamp(23).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'NotReady', y: 7, tooltip: `Upgrade - INSTANTANEOUS (${getDateByTimeStamp(35)})`}],
            color: 'url(#historical-pattern-0)',
            stack: 1,
            measureName: 'NotReady',
            instance: 'Upgrade',
            window: 'INSTANTANEOUS'
          },
          {
            name: 'New Sales' + ' - INSTANTANEOUS (' + getMomentByTimestamp(35).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'NotReady', y: 9, tooltip: `New Sales - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
            ],
            color: paletteConfig.colors[1],
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
            color: 'url(#historical-pattern-1)',
            stack: 1,
            measureName: 'NotReady',
            instance: 'New Sales',
            window: 'INSTANTANEOUS'
          },
        ];
        expect(result).toEqual(expected);
      });
    });

    describe('WidgetMode.Instances', () => {
      let service;
      let paleteService;

      const groupedDataDifferent = {
        [getGroupKey({measureName: 'NotReady', measureTimestamp: 35})]: [
          {
            instance: 'New Sales',
            measureName: 'NotReady',
            measureValue: 9,
            measureTimestamp: 35,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'
          },
          {
            instance: 'Upgrade',
            measureName: 'NotReady',
            measureValue: 11,
            measureTimestamp: 35,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'
          }
        ],
        [getGroupKey({measureName: 'Available', measureTimestamp: 35})]: [
          {
            instance: 'New Sales',
            measureName: 'Available',
            measureValue: 10,
            measureTimestamp: 35,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'
          },
          {
            instance: 'Upgrade',
            measureName: 'Available',
            measureValue: 12,
            measureTimestamp: 35,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'
          }
        ]
      };

      const groupedDataSaming = {
        [getGroupKey({measureName: 'NotReady', measureTimestamp: 35})]: [
          {
            instance: 'New Sales',
            measureName: 'NotReady',
            measureValue: 11,
            measureTimestamp: 35,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'
          }
        ],
        [getGroupKey({measureName: 'NotReady', measureTimestamp: 23, group: ColorStyle.Slash})]: [
          {
            instance: 'New Sales',
            measureName: 'NotReady',
            measureValue: 9,
            measureTimestamp: 23,
            group: ColorStyle.Slash,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'
          }
        ]
      };

      const fourGroupedData = {
        [getGroupKey({measureName: 'NotReady', measureTimestamp: 35})]: [
          {
            instance: 'New Sales',
            measureName: 'NotReady',
            measureValue: 10,
            measureTimestamp: 35,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'
          },
          {
            instance: 'Upgrade',
            measureName: 'NotReady',
            measureValue: 11,
            measureTimestamp: 35,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'
          }
        ],
        [getGroupKey({measureName: 'NotReady', measureTimestamp: 23, group: ColorStyle.Slash})]: [
          {
            instance: 'New Sales',
            measureName: 'NotReady',
            measureValue: 6,
            measureTimestamp: 23,
            group: ColorStyle.Slash,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'
          },
          {
            instance: 'Upgrade',
            measureName: 'NotReady',
            measureValue: 7,
            measureTimestamp: 23,
            group: ColorStyle.Slash,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'
          }
        ],
        [getGroupKey({measureName: 'Available', measureTimestamp: 35})]: [
          {
            instance: 'New Sales',
            measureName: 'Available',
            measureValue: 11,
            measureTimestamp: 35,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'
          },
          {
            instance: 'Upgrade',
            measureName: 'Available',
            measureValue: 12,
            measureTimestamp: 35,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'
          }
        ],
        [getGroupKey({measureName: 'Available', measureTimestamp: 23, group: ColorStyle.Slash})]: [
          {
            instance: 'New Sales',
            measureName: 'Available',
            measureValue: 4,
            measureTimestamp: 23,
            group: ColorStyle.Slash,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'
          },
          {
            instance: 'Upgrade',
            measureName: 'Available',
            measureValue: 5,
            measureTimestamp: 23,
            group: ColorStyle.Slash,
            dimension: 'Continent',
            window: 'INSTANTANEOUS'
          }
        ],
      };

      beforeEach(() => {
        service = new HighchartsBarDataBuilder(widgetInstance, null, []);
        paleteService = new HighchartsBarDataBuilder(widgetInstance, paletteConfig, []);
      });

      it('should return empty list when data is empty', () => {
        const groupedData = {};

        const result = service.generate(groupedData);

        expect(result).toEqual([]);
      });

      it('should generate data for 2 grouped data - level 1 is different', () => {
        const result = service.generate(groupedDataDifferent);

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

      it('[color palette] should generate data for 2 grouped data - level 1 is different', () => {
        const result = paleteService.generate(groupedDataDifferent);

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

      it('should generate data for 2 grouped data - level 1 is the same', () => {
        const result = service.generate(groupedDataSaming);

        const expected = [
          {
            name: 'NotReady' + ' - INSTANTANEOUS (' + getMomentByTimestamp(35).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'New Sales', y: 11, tooltip: `NotReady - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
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
              {name: 'New Sales', y: 9, tooltip: `NotReady - INSTANTANEOUS (${getDateByTimeStamp(23)})`},
            ],
            color: 'url(#historical-pattern-0)',
            stack: 1,
            measureName: 'NotReady',
            instance: 'New Sales',
            window: 'INSTANTANEOUS'
          },
        ];

        expect(result).toEqual(expected);
      });

      it('[color palette] should generate data for 2 grouped data - level 1 is the same', () => {
        const result = paleteService.generate(groupedDataSaming);

        const expected = [
          {
            name: 'NotReady' + ' - INSTANTANEOUS (' + getMomentByTimestamp(35).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'New Sales', y: 11, tooltip: `NotReady - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
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
              {name: 'New Sales', y: 9, tooltip: `NotReady - INSTANTANEOUS (${getDateByTimeStamp(23)})`},
            ],
            color: 'url(#historical-pattern-0)',
            stack: 1,
            measureName: 'NotReady',
            instance: 'New Sales',
            window: 'INSTANTANEOUS'
          },
        ];

        expect(result).toEqual(expected);
      });

      it('should generate data for 4 grouped data', () => {
        const result = service.generate(fourGroupedData);

        const expected = [
          {
            name: 'NotReady' + ' - INSTANTANEOUS (' + getMomentByTimestamp(35).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'New Sales', y: 10, tooltip: `NotReady - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
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
              {name: 'New Sales', y: 6, tooltip: `NotReady - INSTANTANEOUS (${getDateByTimeStamp(23)})`},
              {name: 'Upgrade', y: 7, tooltip: `NotReady - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
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
              {name: 'New Sales', y: 11, tooltip: `Available - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
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
              {name: 'New Sales', y: 4, tooltip: `Available - INSTANTANEOUS (${getDateByTimeStamp(23)})`},
              {name: 'Upgrade', y: 5, tooltip: `Available - INSTANTANEOUS (${getDateByTimeStamp(23)})`},
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

      it('[color palette] should generate data for 4 grouped data', () => {
        const result = paleteService.generate(fourGroupedData);

        const expected = [
          {
            name: 'NotReady' + ' - INSTANTANEOUS (' + getMomentByTimestamp(35).format(AppDateTimeFormat.dateTime) + ')',
            data: [
              {name: 'New Sales', y: 10, tooltip: `NotReady - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
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
              {name: 'New Sales', y: 6, tooltip: `NotReady - INSTANTANEOUS (${getDateByTimeStamp(23)})`},
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
              {name: 'New Sales', y: 11, tooltip: `Available - INSTANTANEOUS (${getDateByTimeStamp(35)})`},
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
              {name: 'New Sales', y: 4, tooltip: `Available - INSTANTANEOUS (${getDateByTimeStamp(23)})`},
              {name: 'Upgrade', y: 5, tooltip: `Available - INSTANTANEOUS (${getDateByTimeStamp(23)})`},
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
    });
  });
});
