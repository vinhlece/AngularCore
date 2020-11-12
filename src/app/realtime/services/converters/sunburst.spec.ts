import {mockSunburstWidget} from '../../../common/testing/mocks/widgets';
import {getChartColors} from '../../../common/utils/color';
import {DisplayMode} from '../../../dashboard/models/enums';
import {SandBoxFormulaMeasureFactory} from '../../../measures/services/formula/formula-measure.service';
import {RealTimeDataProcessorImpl} from '../real-time-data-processor.service';
import {HighchartsDataConverterFactory} from './factory';
import {ColorPalette} from '../../../common/models/index';
import {TimeUtilsImpl} from '../../../common/services/timeUtils';
import {isNullOrUndefined} from 'util';
import {getInstanceColor} from '../../../common/utils/function';
import * as Color from 'color';

describe('Sunburst converter', () => {
  const data = [
    {
      dataType: 'Queue Performance',
      instance: 'en,chat,Mortgage',
      measureName: 'SunBurstAnswered',
      measureValue: 2,
      measureTimestamp: 10,
      dimension: 'Continent',
      window: 'INSTANTANEOUS'
    },
    {
      dataType: 'Queue Performance',
      instance: 'en,chat,Mortgage',
      measureName: 'SunBurstAnswered',
      measureValue: 11,
      measureTimestamp: 35,
      dimension: 'Continent',
      window: 'INSTANTANEOUS'
    },
    {
      dataType: 'Queue Performance',
      instance: 'vi,banking,Saving',
      measureName: 'SunBurstAnswered',
      measureValue: 22,
      measureTimestamp: 43,
      dimension: 'Continent',
      window: 'INSTANTANEOUS'
    },
  ];
  const processor = new RealTimeDataProcessorImpl(new SandBoxFormulaMeasureFactory());
  const widget = {
    ...mockSunburstWidget(),
    dataType: 'Queue Performance',
    measures: ['SunBurstAnswered'],
    dimensions: [
      {
        dimension: 'Continent',
        systemInstances: [],
        customInstances: ['en,chat,Mortgage', 'vi,banking,Saving']
      }
    ],
    windows: ['INSTANTANEOUS'],
  };
  const paletteConfig: ColorPalette = {
    id: 'palette 1',
    userId: 'user 1',
    colors: ['#000000', '#111111', '#222222', '#333333', '#444444', '#888888'],
    threshold: ['#555555', '#666666', '#777777']
  };

  const changeInstanceColor = (expected) => {
    const expectedData = expected[0]['data'];
    const instanceList = expectedData.map(item => item.name);
    const instanceColors = [];
    for (let i = 0; i < instanceList.length; i++) {
      if (!isNullOrUndefined(getInstanceColor(instanceList[i], []))) {
        instanceColors.push(getInstanceColor(instanceList[i], []));
      }
    }
    let rootColor = null;

    for (let x = 0; x < data.length; x++) {
      instanceColors.forEach(instance => {
        if (expectedData[x].color) {
          rootColor = expectedData[x].color;
        }

        if (instance.name === expectedData[x].name) {
          expectedData[x].color = instance.color;
          x++;
          expectedData[x].color = Color(rootColor).lighten(0.1).hex();
          rootColor = null;
        }
      });
    }

    return expected;
  };

  it('should generate latest sunburst data if not select show time explorer values', () => {
    const converter = new HighchartsDataConverterFactory(processor, new TimeUtilsImpl()).createSunburstConverter(widget, {});
    const result = converter.convert(data);
    let expected = [{
      data: [
        {
          id: 'SunBurstAnswered',
          name: 'SunBurstAnswered',
          color: '#ffffff',
        },
        {
          id: 'en$en',
          name: 'en',
          parent: 'SunBurstAnswered',
          value: null,
          color: getChartColors()[0],
        },
        {
          id: 'en,chat$chat',
          name: 'chat',
          parent: 'en$en',
          value: null,
          color: null
        },
        {
          id: 'en,chat,Mortgage$Mortgage',
          parent: 'en,chat$chat',
          name: 'Mortgage',
          value: 11,
          color: null
        },
        {
          id: 'vi$vi',
          name: 'vi',
          parent: 'SunBurstAnswered',
          value: null,
          color: getChartColors()[1],
        },
        {
          id: 'vi,banking$banking',
          name: 'banking',
          parent: 'vi$vi',
          value: null,
          color: null
        },
        {
          id: 'vi,banking,Saving$Saving',
          name: 'Saving',
          parent: 'vi,banking$banking',
          value: 22,
          color: null
        }
      ]
    }];
    expected = changeInstanceColor(expected);
    expect(result).toEqual(expected);
  });

  it('[color palette] should generate latest sunburst data if not select show time explorer values', () => {
    const converter = new HighchartsDataConverterFactory(processor, new TimeUtilsImpl()).createSunburstConverter(widget, {colorPalette: paletteConfig});
    const result = converter.convert(data);
    let expected = [{
      data: [
        {
          id: 'SunBurstAnswered',
          name: 'SunBurstAnswered',
          color: '#ffffff',
        },
        {
          id: 'en$en',
          name: 'en',
          parent: 'SunBurstAnswered',
          value: null,
          color: paletteConfig.colors[0],
        },
        {
          id: 'en,chat$chat',
          name: 'chat',
          parent: 'en$en',
          value: null,
          color: null
        },
        {
          id: 'en,chat,Mortgage$Mortgage',
          parent: 'en,chat$chat',
          name: 'Mortgage',
          value: 11,
          color: null
        },
        {
          id: 'vi$vi',
          name: 'vi',
          parent: 'SunBurstAnswered',
          value: null,
          color: paletteConfig.colors[1],
        },
        {
          id: 'vi,banking$banking',
          name: 'banking',
          parent: 'vi$vi',
          value: null,
          color: null
        },
        {
          id: 'vi,banking,Saving$Saving',
          name: 'Saving',
          parent: 'vi,banking$banking',
          value: 22,
          color: null
        }
      ]
    }];
    expected = changeInstanceColor(expected);
    expect(result).toEqual(expected);
  });

  it('should generate previous sunburst data if select show time explorer values and prev timestamp on time explorer', () => {
    let expected = [{
      data: [
        {
          id: 'SunBurstAnswered',
          name: 'SunBurstAnswered',
          color: '#ffffff',
        },
        {
          id: 'en$en',
          name: 'en',
          parent: 'SunBurstAnswered',
          value: null,
          color: getChartColors()[0],
        },
        {
          id: 'en,chat$chat',
          name: 'chat',
          parent: 'en$en',
          value: null,
          color: null
        },
        {
          id: 'en,chat,Mortgage$Mortgage',
          parent: 'en,chat$chat',
          name: 'Mortgage',
          value: 2,
          color: null
        },
      ]
    }];
    expected = changeInstanceColor(expected);
    const historicalWidget = {...widget, displayMode: DisplayMode.Historical};
    const options = {goBackTimeRange: {startTimestamp: 0, endTimestamp: 27}};
    const converter = new HighchartsDataConverterFactory(processor, new TimeUtilsImpl()).createSunburstConverter(historicalWidget, options);
    const result = converter.convert(data);
    expect(result).toEqual(expected);
  });

  it('[color palette] should generate previous sunburst data if select show time explorer values and ' +
    'prev timestamp on time explorer', () => {
    let expected = [{
      data: [
        {
          id: 'SunBurstAnswered',
          name: 'SunBurstAnswered',
          color: '#ffffff',
        },
        {
          id: 'en$en',
          name: 'en',
          parent: 'SunBurstAnswered',
          value: null,
          color: paletteConfig.colors[0],
        },
        {
          id: 'en,chat$chat',
          name: 'chat',
          parent: 'en$en',
          value: null,
          color: null
        },
        {
          id: 'en,chat,Mortgage$Mortgage',
          parent: 'en,chat$chat',
          name: 'Mortgage',
          value: 2,
          color: null
        },
      ]
    }];
    expected = changeInstanceColor(expected);
    const historicalWidget = {...widget, displayMode: DisplayMode.Historical};
    const options = {goBackTimeRange: {startTimestamp: 0, endTimestamp: 27}, colorPalette: paletteConfig};
    const converter = new HighchartsDataConverterFactory(processor, new TimeUtilsImpl()).createSunburstConverter(historicalWidget, options);
    const result = converter.convert(data);
    expect(result).toEqual(expected);
  });
});
