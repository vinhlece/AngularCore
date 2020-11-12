import {getGroupKey} from '../grouper/grouper.spec';
import {CallTimelineBuilder} from './call-timeline';
import {mockCallTimeLineWidget} from '../../../common/testing/mocks/widgets';
import {ColorPalette} from '../../../common/models/index';
import {getChartColors} from '../../../common/utils/color';

describe('CallTimelineBuilder', () => {
  const widget = {
    ...mockCallTimeLineWidget(),
    agents: [
      'Sean',
      'Tom',
      'Tony',
    ],
    queues: [
      'Advisory',
      'Sell',
      'Support'
    ],
    groupBy: 'agent',
    measures: ['CallTimeLine'],
    segmentTypes: [
      'ContactsAnswered',
      'QueueTime',
      'TalkTime'
    ],
  };

  const paletteConfig: ColorPalette = {
    id: 'palette 1',
    userId: 'user 1',
    colors: ['#000000', '#111111', '#222222', '#333333', '#444444'],
    threshold: ['#555555', '#666666', '#777777']
  };
  const service = new CallTimelineBuilder(widget, null);
  const paleteService = new CallTimelineBuilder(widget, paletteConfig);

  it('should return empty data when grouped data is empty', () => {
    const groupedData = {};

    const result = service.generate(groupedData);

    const expected = [];

    expect(result).toEqual(expected);
  });

  it('should generate data for 2 grouped data', () => {
    const groupedData = {
      [getGroupKey({agent: 'Sean'})]: [
        {
          agent: 'Sean',
          callID: 'c1',
          dataType: 'Queue Performance',
          measureName: 'CallTimeLine',
          measureTimestamp: 1546329000000,
          measureValue: 7820000,
          queue: 'Advisory',
          segmentType: 'TalkTime',
        }
      ],
      [getGroupKey({agent: 'Tom'})]: [
        {
          agent: 'Tom',
          callID: 'c2',
          dataType: 'Queue Performance',
          measureName: 'CallTimeLine',
          measureTimestamp: 1546334500000,
          measureValue: 1450000,
          queue: 'Sell',
          segmentType: 'TalkTime'
        }
      ]
    };

    const result = paleteService.generate(groupedData);
    const expected = [
      {
        name: 'Sean',
        data: [
          {
            agent: 'Sean',
            color: paletteConfig.colors[2],
            start: 1546329000000,
            name: 'c1-Sean-Advisory-TalkTime',
            queue: 'Advisory',
            segmentType: 'TalkTime',
            end: 1546329000000 + 7820000,
            y: 0,
            callID: 'c1',
            dataType: 'Queue Performance',
            measureName: 'CallTimeLine',
            measureTimestamp: 1546329000000,
            measureValue: 7820000,
          },
        ]
      },
      {
        name: 'Tom',
        data: [
          {
            agent: 'Tom',
            color: paletteConfig.colors[2],
            start: 1546334500000,
            name: 'c2-Tom-Sell-TalkTime',
            queue: 'Sell',
            segmentType: 'TalkTime',
            end: 1546334500000 + 1450000,
            y: 1,
            callID: 'c2',
            dataType: 'Queue Performance',
            measureName: 'CallTimeLine',
            measureTimestamp: 1546334500000,
            measureValue: 1450000,
          }
        ]
      },
    ];

    expect(result).toEqual(expected);
  });
});
