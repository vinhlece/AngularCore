import {mockSankeyWidget} from '../../../common/testing/mocks/widgets';
import {SandBoxFormulaMeasureFactory} from '../../../measures/services/formula/formula-measure.service';
import {RealtimeData} from '../../models';
import {RealTimeDataProcessorImpl} from '../real-time-data-processor.service';
import {HighchartsDataConverterFactory} from './factory';
import {getColorScheme} from '../../../common/utils/color';
import {ColorPalette} from '../../../common/models/index';
import {TimeUtilsImpl} from '../../../common/services/timeUtils';
import {getInstanceColor} from '../../../common/utils/function';

describe('SankeyConverter', () => {
  const data: RealtimeData[] = [
    {
      instance: 'Ireland,Sales',
      measureName: 'SankeyLayer1',
      measureTimestamp: 1515553200000,
      measureValue: 20,
      dataType: 'Queue Performance',
      dimension: 'Continent',
      window: 'INSTANTANEOUS'
    },
    {
      instance: 'Ireland,Sales,iPhone',
      measureName: 'SankeyLayer1',
      measureTimestamp: 1515596400000,
      measureValue: 15,
      dataType: 'Queue Performance',
      dimension: 'Continent',
      window: 'INSTANTANEOUS'
    },
    {
      instance: 'Ireland,Sales,iPhone,v7',
      measureName: 'SankeyLayer1',
      measureTimestamp: 1515596400000,
      measureValue: 10,
      dataType: 'Queue Performance',
      dimension: 'Continent',
      window: 'INSTANTANEOUS'
    },
    {
      instance: 'Ireland,Sales,iPhone,v6',
      measureName: 'SankeyLayer1',
      measureTimestamp: 1515596400000,
      measureValue: 5,
      dataType: 'Queue Performance',
      dimension: 'Continent',
      window: 'INSTANTANEOUS'
    },
    {
      instance: 'Ireland,Sales,iPad',
      measureName: 'SankeyLayer1',
      measureTimestamp: 1515596400000,
      measureValue: 5,
      dataType: 'Queue Performance',
      dimension: 'Continent',
      window: 'INSTANTANEOUS'
    },
    {
      instance: 'Ireland,Sales,iPad,v7',
      measureName: 'SankeyLayer1',
      measureTimestamp: 1515596400000,
      measureValue: 1,
      dataType: 'Queue Performance',
      dimension: 'Continent',
      window: 'INSTANTANEOUS'
    },
    {
      instance: 'Ireland,Sales,iPad,v6',
      measureName: 'SankeyLayer1',
      measureTimestamp: 1515596400000,
      measureValue: 4,
      dataType: 'Queue Performance',
      dimension: 'Continent',
      window: 'INSTANTANEOUS'
    },
    {
      instance: 'UK,Sales',
      measureName: 'SankeyLayer2',
      measureTimestamp: 1515567600000,
      measureValue: 40,
      dataType: 'Queue Performance',
      dimension: 'Continent',
      window: 'INSTANTANEOUS'
    },
    {
      instance: 'UK,Sales,iPhone',
      measureName: 'SankeyLayer2',
      measureTimestamp: 1515567600000,
      measureValue: 15,
      dataType: 'Queue Performance',
      dimension: 'Continent',
      window: 'INSTANTANEOUS'
    },
    {
      instance: 'UK,Sales,iPhone,v7',
      measureName: 'SankeyLayer2',
      measureTimestamp: 1515567600000,
      measureValue: 8,
      dataType: 'Queue Performance',
      dimension: 'Continent',
      window: 'INSTANTANEOUS'
    },
    {
      instance: 'UK,Sales,iPhone,v6',
      measureName: 'SankeyLayer2',
      measureTimestamp: 1515567600000,
      measureValue: 7,
      dataType: 'Queue Performance',
      dimension: 'Continent',
      window: 'INSTANTANEOUS'
    },
    {
      instance: 'UK,Sales,iPad',
      measureName: 'SankeyLayer2',
      measureTimestamp: 1515567600000,
      measureValue: 25,
      dataType: 'Queue Performance',
      dimension: 'Continent',
      window: 'INSTANTANEOUS'
    },
    {
      instance: 'UK,Sales,iPad,v7',
      measureName: 'SankeyLayer2',
      measureTimestamp: 1515567600000,
      measureValue: 11,
      dataType: 'Queue Performance',
      dimension: 'Continent',
      window: 'INSTANTANEOUS'
    },
    {
      instance: 'UK,Sales,iPad,v6',
      measureName: 'SankeyLayer2',
      measureTimestamp: 1515567600000,
      measureValue: 14,
      dataType: 'Queue Performance',
      dimension: 'Continent',
      window: 'INSTANTANEOUS'
    },
  ];
  const paletteConfig: ColorPalette = {
    id: 'palette 1',
    userId: 'user 1',
    colors: ['#000000', '#111111', '#222222', '#333333', '#444444', '#888888'],
    threshold: ['#555555', '#666666', '#777777']
  };

  it('should convert to sankey data, each measure is a layer, instance empty and show all data is true', () => {
    const expected = [
      {
        name: 'SankeyLayer1',
        data: [
          {from: 'Ireland', to: 'Sales', weight: 20},
          {from: 'Sales', to: 'iPhone', weight: 15},
          {from: 'iPhone', to: 'v7', weight: 10},
          {from: 'iPhone', to: 'v6', weight: 5},
          {from: 'Sales', to: 'iPad', weight: 5},
          {from: 'iPad', to: 'v7', weight: 1},
          {from: 'iPad', to: 'v6', weight: 4}
        ],
        nodes: [
          {id: 'Ireland', color: getColorScheme()[0].primary},
          {id: 'Sales', color: getColorScheme()[1].primary, column: 2},
          {id: 'iPhone', color: getColorScheme()[2].primary, column: 3},
          {id: 'v7', color: getColorScheme()[3].primary, column: 4},
          {id: 'v6', color: getColorScheme()[4].primary, column: 5},
          {id: 'iPad', color: getColorScheme()[5].primary, column: 6},
        ]
      },
      {
        name: 'SankeyLayer2',
        data: [
          {from: 'UK', to: 'Sales', weight: 40},
          {from: 'Sales', to: 'iPhone', weight: 15},
          {from: 'iPhone', to: 'v7', weight: 8},
          {from: 'iPhone', to: 'v6', weight: 7},
          {from: 'Sales', to: 'iPad', weight: 25},
          {from: 'iPad', to: 'v7', weight: 11},
          {from: 'iPad', to: 'v6', weight: 14}
        ],
        nodes: [
          {id: 'UK', color: getColorScheme()[0].primary, column: 1},
          {id: 'Sales', color: getColorScheme()[1].primary, column: 2},
          {id: 'iPhone', color: getColorScheme()[2].primary, column: 3},
          {id: 'v7', color: getColorScheme()[3].primary, column: 4},
          {id: 'v6', color: getColorScheme()[4].primary, column: 5},
          {id: 'iPad', color: getColorScheme()[5].primary, column: 6},
        ]
      }
    ];

    const factory = new HighchartsDataConverterFactory(new RealTimeDataProcessorImpl(new SandBoxFormulaMeasureFactory()), new TimeUtilsImpl());
    const widget = {
      ...mockSankeyWidget(),
      measures: ['SankeyLayer1', 'SankeyLayer2'],
      nodes: [
        {id: 'UK', column: 1},
        {id: 'Sales', column: 2},
        {id: 'iPhone', column: 3},
        {id: 'v7', column: 4},
        {id: 'v6', column: 5},
        {id: 'iPad', column: 6},
      ],
      dimensions: [
        {
          dimension: 'Continent',
          systemInstances: [],
          customInstances: []
        }
      ],
      showAllData: true,
      windows: ['INSTANTANEOUS']
    };
    const converter = factory.createSankeyConverter(widget, {});
    const result = converter.convert(data);
    expect(result).toEqual(expected);
  });

  it('should convert to sankey data when user input instance', () => {
    const expected = [
      {
        name: 'SankeyLayer1',
        data: [
          {from: 'Sales', to: 'iPhone', weight: 15},
        ],
        nodes: [
          {id: 'Sales', color: getColorScheme()[0].primary, column: 1},
          {id: 'iPhone', color: getColorScheme()[1].primary, column: 2},
        ]
      },
    ];

    const factory = new HighchartsDataConverterFactory(new RealTimeDataProcessorImpl(new SandBoxFormulaMeasureFactory()), new TimeUtilsImpl());
    const widget = {
      ...mockSankeyWidget(),
      measures: ['SankeyLayer1'],
      dimensions: [
        {
          dimension: 'Continent',
          systemInstances: [],
          customInstances: ['Sales,iPhone']
        }
      ],
      windows: ['INSTANTANEOUS'],
      nodes: [
        {id: 'Sales', column: 1},
        {id: 'iPhone', column: 2}
      ]
    };
    const converter = factory.createSankeyConverter(widget, {});
    const result = converter.convert(data);
    expect(result).toEqual(expected);
  });

  it('should convert to sankey data when not input instance', () => {
    const expected = [
      {
        name: 'SankeyLayer1',
        data: [
          {from: 'Ireland', to: 'Sales', weight: 20},
          {from: 'Sales', to: 'iPhone', weight: 15},
          {from: 'iPhone', to: 'v7', weight: 10},
          {from: 'iPhone', to: 'v6', weight: 5},
          {from: 'Sales', to: 'iPad', weight: 5},
          {from: 'iPad', to: 'v7', weight: 1},
          {from: 'iPad', to: 'v6', weight: 4}
        ],
        nodes: [
          {id: 'Ireland', color: getColorScheme()[0].primary},
          {id: 'Sales', color: getColorScheme()[1].primary, column: 2},
          {id: 'iPhone', color: getColorScheme()[2].primary, column: 3},
          {id: 'v7', color: getColorScheme()[3].primary, column: 4},
          {id: 'v6', color: getColorScheme()[4].primary, column: 5},
          {id: 'iPad', color: getColorScheme()[5].primary, column: 6},
        ]
      },
      {
        name: 'SankeyLayer2',
        data: [
          {from: 'UK', to: 'Sales', weight: 40},
          {from: 'Sales', to: 'iPhone', weight: 15},
          {from: 'iPhone', to: 'v7', weight: 8},
          {from: 'iPhone', to: 'v6', weight: 7},
          {from: 'Sales', to: 'iPad', weight: 25},
          {from: 'iPad', to: 'v7', weight: 11},
          {from: 'iPad', to: 'v6', weight: 14}
        ],
        nodes: [
          {id: 'UK', color: getColorScheme()[0].primary, column: 1},
          {id: 'Sales', color: getColorScheme()[1].primary, column: 2},
          {id: 'iPhone', color: getColorScheme()[2].primary, column: 3},
          {id: 'v7', color: getColorScheme()[3].primary, column: 4},
          {id: 'v6', color: getColorScheme()[4].primary, column: 5},
          {id: 'iPad', color: getColorScheme()[5].primary, column: 6},
        ]
      }
    ];

    const factory = new HighchartsDataConverterFactory(new RealTimeDataProcessorImpl(new SandBoxFormulaMeasureFactory()), new TimeUtilsImpl());
    const widget = {
      ...mockSankeyWidget(),
      measures: ['SankeyLayer1', 'SankeyLayer2'],
      instances: [],
      nodes: [
        {id: 'UK', column: 1},
        {id: 'Sales', column: 2},
        {id: 'iPhone', column: 3},
        {id: 'v7', column: 4},
        {id: 'v6', column: 5},
        {id: 'iPad', column: 6},
      ],
      showAllData: true
    };
    const converter = factory.createSankeyConverter(widget, {});
    const result = converter.convert(data);
    expect(result).toEqual(expected);
  });

  it('[color palette] should convert to sankey data, each measure is a layer', () => {
    const expected = [
      {
        name: 'SankeyLayer1',
        data: [
          {from: 'Ireland', to: 'Sales', weight: 20},
          {from: 'Sales', to: 'iPhone', weight: 15},
          {from: 'iPhone', to: 'v7', weight: 10},
          {from: 'iPhone', to: 'v6', weight: 5},
          {from: 'Sales', to: 'iPad', weight: 5},
          {from: 'iPad', to: 'v7', weight: 1},
          {from: 'iPad', to: 'v6', weight: 4}
        ],
        nodes: [
          {id: 'Ireland', color: paletteConfig.colors[0]},
          {id: 'Sales', color: paletteConfig.colors[1], column: 2},
          {id: 'iPhone', color: paletteConfig.colors[2], column: 3},
          {id: 'v7', color: paletteConfig.colors[3], column: 4},
          {id: 'v6', color: paletteConfig.colors[4], column: 5},
          {id: 'iPad', color: paletteConfig.colors[5], column: 6},
        ]
      },
      {
        name: 'SankeyLayer2',
        data: [
          {from: 'UK', to: 'Sales', weight: 40},
          {from: 'Sales', to: 'iPhone', weight: 15},
          {from: 'iPhone', to: 'v7', weight: 8},
          {from: 'iPhone', to: 'v6', weight: 7},
          {from: 'Sales', to: 'iPad', weight: 25},
          {from: 'iPad', to: 'v7', weight: 11},
          {from: 'iPad', to: 'v6', weight: 14}
        ],
        nodes: [
          {id: 'UK', color: paletteConfig.colors[0], column: 1},
          {id: 'Sales', color: paletteConfig.colors[1], column: 2},
          {id: 'iPhone', color: paletteConfig.colors[2], column: 3},
          {id: 'v7', color: paletteConfig.colors[3], column: 4},
          {id: 'v6', color: paletteConfig.colors[4], column: 5},
          {id: 'iPad', color: paletteConfig.colors[5], column: 6},
        ]
      }
    ];

    const factory = new HighchartsDataConverterFactory(new RealTimeDataProcessorImpl(new SandBoxFormulaMeasureFactory()), new TimeUtilsImpl());
    const widget = {
      ...mockSankeyWidget(),
      measures: ['SankeyLayer1', 'SankeyLayer2'],
      nodes: [
        {id: 'UK', column: 1},
        {id: 'Sales', column: 2},
        {id: 'iPhone', column: 3},
        {id: 'v7', column: 4},
        {id: 'v6', column: 5},
        {id: 'iPad', column: 6},
      ],
      instances: [],
      showAllData: true
    };
    const converter = factory.createSankeyConverter(widget, {colorPalette: paletteConfig});
    const result = converter.convert(data);
    expect(result).toEqual(expected);
  });
});
