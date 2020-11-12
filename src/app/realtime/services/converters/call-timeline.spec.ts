import {RealtimeData} from '../../models';
import {mockCallTimeLineWidget} from '../../../common/testing/mocks/widgets';
import {ConverterOptions} from '../index';
import {RealTimeDataProcessorImpl} from '../real-time-data-processor.service';
import {SandBoxFormulaMeasureFactory} from '../../../measures/services/formula/formula-measure.service';
import {HighchartsDataConverterFactory} from './factory';
import {getChartColors} from '../../../common/utils/color';
import {TimeUtilsImpl} from '../../../common/services/timeUtils';

const data: RealtimeData[] = [
  {
    agent: 'Sean',
    callID: 'c1',
    dataType: 'Queue Performance',
    measureName: 'CallTimeLine',
    measureTimestamp: 1546315200000,
    measureValue: 1520000,
    queue: 'Advisory',
    segmentType: 'ContactsAnswered'
  },
  {
    agent: 'Sean',
    callID: 'c1',
    dataType: 'Queue Performance',
    measureName: 'CallTimeLine',
    measureTimestamp: 1546329000000,
    measureValue: 7820000,
    queue: 'Advisory',
    segmentType: 'TalkTime'
  },
  {
    agent: 'Sean',
    callID: 'c1',
    dataType: 'Queue Performance',
    measureName: 'CallTimeLine',
    measureTimestamp: 1546357800000,
    measureValue: 1820000,
    queue: 'Advisory',
    segmentType: 'QueueTime'
  },
  {
    agent: 'Tom',
    callID: 'c2',
    dataType: 'Queue Performance',
    measureName: 'CallTimeLine',
    measureTimestamp: 1546315600000,
    measureValue: 5050000,
    queue: 'Sell',
    segmentType: 'ContactsAnswered'
  },
  {
    agent: 'Tom',
    callID: 'c2',
    dataType: 'Queue Performance',
    measureName: 'CallTimeLine',
    measureTimestamp: 1546334500000,
    measureValue: 1450000,
    queue: 'Sell',
    segmentType: 'TalkTime'
  },
  {
    agent: 'Tom',
    callID: 'c2',
    dataType: 'Queue Performance',
    measureName: 'CallTimeLine',
    measureTimestamp: 1546398700000,
    measureValue: 3540000,
    queue: 'Sell',
    segmentType: 'QueueTime'
  },
  {
    agent: 'Tony',
    callID: 'c3',
    dataType: 'Queue Performance',
    measureName: 'CallTimeLine',
    measureTimestamp: 1546323400000,
    measureValue: 7300000,
    queue: 'Support',
    segmentType: 'ContactsAnswered'
  },
  {
    agent: 'Tony',
    callID: 'c3',
    dataType: 'Queue Performance',
    measureName: 'CallTimeLine',
    measureTimestamp: 1546343200000,
    measureValue: 3220000,
    queue: 'Support',
    segmentType: 'TalkTime'
  },
  {
    agent: 'Tony',
    callID: 'c3',
    dataType: 'Queue Performance',
    measureName: 'CallTimeLine',
    measureTimestamp: 1546356700000,
    measureValue: 5280000,
    queue: 'Support',
    segmentType: 'QueueTime'
  }
];

describe('Highcharts CallTimeLine Converter', () => {
  const processor = new RealTimeDataProcessorImpl(new SandBoxFormulaMeasureFactory());
  const factory = new HighchartsDataConverterFactory(processor, new TimeUtilsImpl());
  describe('GroupBy Agent', () => {
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
    it('should return empty list when realtime data is empty', () => {
      const options: ConverterOptions = {};
      const service = factory.createCallTimeLineConverter(widget, options);
      const realTimeData = [];
      const result = service.convert(realTimeData);
      const expected = [];
      expect(result).toEqual(expected);
    });
    it('should return converted data when realtime data is not empty', () => {
      const options: ConverterOptions = {};
      const service = factory.createCallTimeLineConverter(widget, options);
      const realTimeData = data;
      const result = service.convert(realTimeData);
      const expected = [
        {
          name: 'Sean',
          data: [
            {
              color: getChartColors()[2],
              start: 1546329000000,
              name: 'c1-Sean-Advisory-TalkTime',
              end: 1546329000000 + 7820000,
              y: 0,
              ...realTimeData[1]
            },
            {
              color: getChartColors()[1],
              start: 1546357800000,
              name: 'c1-Sean-Advisory-QueueTime',
              end: 1546357800000 + 1820000,
              y: 0,
              ...realTimeData[2]
            },
            {
              color: getChartColors()[0],
              start: 1546315200000,
              name: 'c1-Sean-Advisory-ContactsAnswered',
              end: 1546315200000 + 1520000,
              y: 0,
              ...realTimeData[0]
            },
          ]
        },

        {
          name: 'Tony',
          data: [
            {
              color: getChartColors()[0],
              start: 1546323400000,
              name: 'c3-Tony-Support-ContactsAnswered',
              end: 1546323400000 + 7300000,
              y: 1,
              ...realTimeData[6]
            },
            {
              color: getChartColors()[1],
              start: 1546356700000,
              name: 'c3-Tony-Support-QueueTime',
              end: 1546356700000 + 5280000,
              y: 1,
              ...realTimeData[8]
            },
            {
              color: getChartColors()[2],
              start: 1546343200000,
              name: 'c3-Tony-Support-TalkTime',
              end: 1546343200000 + 3220000,
              y: 1,
              ...realTimeData[7]
            }
          ]
        },
        {
          name: 'Tom',
          data: [
            {
              color: getChartColors()[0],
              start: 1546315600000,
              name: 'c2-Tom-Sell-ContactsAnswered',
              end: 1546315600000 + 5050000,
              y: 2,
              ...realTimeData[3]
            },
            {
              color: getChartColors()[1],
              start: 1546398700000,
              name: 'c2-Tom-Sell-QueueTime',
              end: 1546398700000 + 3540000,
              y: 2,
              ...realTimeData[5]
            },
            {
              color: getChartColors()[2],
              start: 1546334500000,
              name: 'c2-Tom-Sell-TalkTime',
              end: 1546334500000 + 1450000,
              y: 2,
              ...realTimeData[4]
            }
          ]
        },
      ];
      expect(result).toEqual(expected);
    });
  });
});
