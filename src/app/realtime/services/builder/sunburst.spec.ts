import {getChartColors} from '../../../common/utils/color';
import {getGroupKey} from '../grouper/grouper.spec';
import {SunburstDataBuilder} from './sunburst';
import {ColorPalette} from '../../../common/models/index';
import {getInstanceColor} from '../../../common/utils/function';
import {isNullOrUndefined} from 'util';
import * as Color from 'color';

describe('SunburstDataBuilder', () => {

  const paletteConfig: ColorPalette = {
    id: 'palette 1',
    userId: 'user 1',
    colors: ['#000000', '#111111', '#222222', '#333333', '#444444'],
    threshold: ['#555555', '#666666', '#777777']
  };

  const groupedData = {
    [getGroupKey({measureName: 'SunBurstAnswered'})]: [
      {
        instance: 'en,chat,Mortgage',
        measureName: 'SunBurstAnswered',
        measureValue: 11,
        measureTimestamp: 35
      },
      {
        instance: 'fr,chat,Savings',
        measureName: 'SunBurstAnswered',
        measureValue: 22,
        measureTimestamp: 43
      },
    ]
  };

  const changeInstanceColor = (expected) => {
    const data = expected[0]['data'];
    const instanceList = data.map(item => item.name);
    const instanceColors = [];
    for (let i = 0; i < instanceList.length; i++) {
      if (!isNullOrUndefined(getInstanceColor(instanceList[i], []))) {
        instanceColors.push(getInstanceColor(instanceList[i], []));
      }
    }
    let rootColor = null;

    for (let x = 0; x < data.length; x++) {
      instanceColors.forEach(instance => {
        if (data[x].color) {
          rootColor = data[x].color;
        }

        if (instance.name === data[x].name) {
          data[x].color = instance.color;
          x++;
          data[x].color = Color(rootColor).lighten(0.1).hex();
          rootColor = null;
        }
      });
    }

    return expected;
  };

  it('should generate data for sunburst', () => {
    const result = new SunburstDataBuilder(null, []).generate(groupedData);
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
          id: 'fr$fr',
          name: 'fr',
          parent: 'SunBurstAnswered',
          value: null,
          color: getChartColors()[1],
        },
        {
          id: 'fr,chat$chat',
          name: 'chat',
          parent: 'fr$fr',
          value: null,
          color: null
        },
        {
          id: 'fr,chat,Savings$Savings',
          name: 'Savings',
          parent: 'fr,chat$chat',
          value: 22,
          color: null
        }
      ]
    }];
    expected = changeInstanceColor(expected);

    expect(result).toEqual(expected);
  });

  it('[color palette] should generate data for sunburst', () => {
    const result = new SunburstDataBuilder(paletteConfig, []).generate(groupedData);

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
          id: 'fr$fr',
          name: 'fr',
          parent: 'SunBurstAnswered',
          value: null,
          color: paletteConfig.colors[1],
        },
        {
          id: 'fr,chat$chat',
          name: 'chat',
          parent: 'fr$fr',
          value: null,
          color: null
        },
        {
          id: 'fr,chat,Savings$Savings',
          name: 'Savings',
          parent: 'fr,chat$chat',
          value: 22,
          color: null
        }
      ]
    }];
    expected = changeInstanceColor(expected);

    expect(result).toEqual(expected);
  });
});
