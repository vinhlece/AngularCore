import {SandBoxFormulaMeasureFactory} from '../../../measures/services/formula/formula-measure.service';
import {DataGroup} from '../../models';
import {getGroupKey} from '../grouper/grouper.spec';
import {RealTimeDataProcessorImpl} from '../real-time-data-processor.service';
import {HighchartsSankeyDataBuilder} from './sankey';
import {getColorScheme} from '../../../common/utils/color';
import {mockSankeyWidget} from '../../../common/testing/mocks/widgets';
import {ColorPalette} from '../../../common/models/index';
import {getInstanceColor} from '../../../common/utils/function';

describe('SankeyDataBuilder', () => {

  const groupData: DataGroup = {
    [getGroupKey({measureName: 'SankeyLayer1'})]: [
      {
        instance: 'Ireland,Sales',
        measureName: 'SankeyLayer1',
        measureTimestamp: 1515553200000,
        measureValue: 20
      },
      {
        instance: 'Ireland,Sales,iPhone',
        measureName: 'SankeyLayer1',
        measureTimestamp: 1515596400000,
        measureValue: 15
      },
      {
        instance: 'Ireland,Sales,iPhone,v7',
        measureName: 'SankeyLayer1',
        measureTimestamp: 1515596400000,
        measureValue: 10
      },
      {
        instance: 'Ireland,Sales,iPhone,v6',
        measureName: 'SankeyLayer1',
        measureTimestamp: 1515596400000,
        measureValue: 5
      },
      {
        instance: 'Ireland,Sales,iPad',
        measureName: 'SankeyLayer1',
        measureTimestamp: 1515596400000,
        measureValue: 5
      },
      {
        instance: 'Ireland,Sales,iPad,v7',
        measureName: 'SankeyLayer1',
        measureTimestamp: 1515596400000,
        measureValue: 1
      },
      {
        instance: 'Ireland,Sales,iPad,v6',
        measureName: 'SankeyLayer1',
        measureTimestamp: 1515596400000,
        measureValue: 4
      },
    ]
    ,
    [getGroupKey({measureName: 'SankeyLayer2'})]: [
      {instance: 'UK,Sales', measureName: 'SankeyLayer2', measureTimestamp: 1515567600000, measureValue: 40},
      {instance: 'UK,Sales,iPhone', measureName: 'SankeyLayer2', measureTimestamp: 1515567600000, measureValue: 15},
      {instance: 'UK,Sales,iPhone,v7', measureName: 'SankeyLayer2', measureTimestamp: 1515567600000, measureValue: 8},
      {instance: 'UK,Sales,iPhone,v6', measureName: 'SankeyLayer2', measureTimestamp: 1515567600000, measureValue: 7},
      {instance: 'UK,Sales,iPad', measureName: 'SankeyLayer2', measureTimestamp: 1515567600000, measureValue: 25},
      {instance: 'UK,Sales,iPad,v7', measureName: 'SankeyLayer2', measureTimestamp: 1515567600000, measureValue: 11},
      {instance: 'UK,Sales,iPad,v6', measureName: 'SankeyLayer2', measureTimestamp: 1515567600000, measureValue: 14},
    ]
  };

  const paletteConfig: ColorPalette = {
    id: 'palette 1',
    userId: 'user 1',
    colors: ['#000000', '#111111', '#222222', '#333333', '#444444', '#888888'],
    threshold: ['#555555', '#666666', '#777777']
  };

  it('should convert to sankey data for each layer', () => {
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
          {id: 'Sales', color:  getColorScheme()[1].primary},
          {id: 'iPhone', color: getColorScheme()[2].primary},
          {id: 'v7', color: getColorScheme()[3].primary},
          {id: 'v6', color: getColorScheme()[4].primary},
          {id: 'iPad', color: getColorScheme()[5].primary},
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
          {id: 'UK', color: getColorScheme()[0].primary},
          {id: 'Sales', color: getColorScheme()[1].primary},
          {id: 'iPhone', color: getColorScheme()[2].primary},
          {id: 'v7', color: getColorScheme()[3].primary},
          {id: 'v6', color: getColorScheme()[4].primary},
          {id: 'iPad', color: getColorScheme()[5].primary},
        ]
      }
    ];

    const processor = new RealTimeDataProcessorImpl(new SandBoxFormulaMeasureFactory());
    const result = new HighchartsSankeyDataBuilder(processor, mockSankeyWidget(), null, []).generate(groupData);

    expect(result).toEqual(expected);
  });

  it('[color palette] should convert to sankey data for each layer', () => {
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
          {id: 'Sales', color: paletteConfig.colors[1]},
          {id: 'iPhone', color: paletteConfig.colors[2]},
          {id: 'v7', color: paletteConfig.colors[3]},
          {id: 'v6', color: paletteConfig.colors[4]},
          {id: 'iPad', color: paletteConfig.colors[5]},
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
          {id: 'UK', color: paletteConfig.colors[0]},
          {id: 'Sales', color: paletteConfig.colors[1]},
          {id: 'iPhone', color: paletteConfig.colors[2]},
          {id: 'v7', color: paletteConfig.colors[3]},
          {id: 'v6', color: paletteConfig.colors[4]},
          {id: 'iPad', color: paletteConfig.colors[5]},
        ]
      }
    ];

    const processor = new RealTimeDataProcessorImpl(new SandBoxFormulaMeasureFactory());
    const result = new HighchartsSankeyDataBuilder(processor, mockSankeyWidget(), paletteConfig, []).generate(groupData);

    expect(result).toEqual(expected);
  });
});
