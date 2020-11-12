import {getCurrentMoment, getMomentByDate, getMomentByDateTime} from '../../../common/services/timeUtils';
import {SandBoxFormulaMeasureFactory} from '../../../measures/services/formula/formula-measure.service';
import {RealtimeData} from '../../models';
import {RealTimeDataProcessorImpl} from '../real-time-data-processor.service';
import {DateGrouper, ShiftGrouper} from './trenddiff';

describe('TrendDiff Grouper', () => {
  const processor = new RealTimeDataProcessorImpl(new SandBoxFormulaMeasureFactory());

  describe('DateGrouper', () => {
    it('should return 2 group items for 2 days, each item has data in that day', () => {
      const startTimestamp = +getMomentByDate('20/2/2018 00:22:12');
      const endTimestamp = +getMomentByDate('1/3/2018 11:31:43');
      const period = 3;

      const data: RealtimeData[] = [
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('20/2/2018 01:00:00'), measureValue: 1
        },
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('20/2/2018 02:00:00'), measureValue: 2
        },
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('23/2/2018 12:00:00'), measureValue: 2
        },
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('23/2/2018 9:10:22'), measureValue: 6
        },
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('26/2/2018 01:22:00'), measureValue: 3
        },
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('1/3/2018 03:00:00'), measureValue: 4
        },
      ];
      const grouper = new DateGrouper(processor, startTimestamp, endTimestamp, period);

      const groupedData = grouper.groupData(data);

      const expected = {
        [+getMomentByDate('20/2/2018')]: [
          {
            instance: 'New Sales',
            measureName: 'ContactsAnswered',
            measureTimestamp: +getMomentByDateTime('20/2/2018 01:00:00'),
            measureValue: 1
          },
          {
            instance: 'New Sales',
            measureName: 'ContactsAnswered',
            measureTimestamp: +getMomentByDateTime('20/2/2018 02:00:00'),
            measureValue: 2
          },
        ],
        [+getMomentByDate('23/2/2018')]: [
          {
            instance: 'New Sales',
            measureName: 'ContactsAnswered',
            measureTimestamp: +getMomentByDateTime('23/2/2018 12:00:00'),
            measureValue: 2
          },
          {
            instance: 'New Sales',
            measureName: 'ContactsAnswered',
            measureTimestamp: +getMomentByDateTime('23/2/2018 9:10:22'),
            measureValue: 6
          },
        ],
        [+getMomentByDate('26/2/2018')]: [
          {
            instance: 'New Sales',
            measureName: 'ContactsAnswered',
            measureTimestamp: +getMomentByDateTime('26/2/2018 01:22:00'),
            measureValue: 3
          },
        ],
        [+getMomentByDate('1/3/2018')]: [
          {
            instance: 'New Sales',
            measureName: 'ContactsAnswered',
            measureTimestamp: +getMomentByDateTime('1/3/2018 03:00:00'),
            measureValue: 4
          },
        ]
      };

      expect(groupedData).toEqual(expected);
    });

    it('should return 1 group items for 2 days, each item has data in that day when lines limit = 1', () => {
      const startTimestamp = +getMomentByDate('22/2/2018');
      const endTimestamp = +getMomentByDate('25/2/2018');
      const period = 3;
      const linesLimit = 1;

      const data: RealtimeData[] = [
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('22/2/2018 01:00:00'), measureValue: 1
        },
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('22/2/2018 02:00:00'), measureValue: 2
        },
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('23/2/2018 01:00:00'), measureValue: 3
        },
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('25/2/2018 03:00:00'), measureValue: 4
        },
      ];
      const grouper = new DateGrouper(processor, startTimestamp, endTimestamp, period, linesLimit);

      const groupedData = grouper.groupData(data);

      const expected = {
        [+getMomentByDate('25/2/2018')]: [
          {
            instance: 'New Sales',
            measureName: 'ContactsAnswered',
            measureTimestamp: +getMomentByDateTime('25/2/2018 03:00:00'),
            measureValue: 4
          }
        ]
      };

      expect(groupedData).toEqual(expected);
    });

    it('should return empty group if data does not meet the conditions', () => {
      const startTimestamp = +getMomentByDate('22/2/2018');
      const endTimestamp = +getMomentByDate('1/3/2018');
      const period = 3;

      const data: RealtimeData[] = [
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('21/2/2018 01:00:00'), measureValue: 1
        },
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('24/2/2018 02:00:00'), measureValue: 2
        },
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('24/2/2018 01:00:00'), measureValue: 3
        },
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('27/2/2018 03:00:00'), measureValue: 4
        },
      ];

      const grouper = new DateGrouper(processor, startTimestamp, endTimestamp, period);

      const groupedData = grouper.groupData(data);

      expect(groupedData).toEqual({});
    });

    it('should always include latest line', () => {
      const startTimestamp = +getMomentByDate('21/2/2018');
      const endTimestamp = +getMomentByDate('25/2/2018');
      const period = 3;
      const linesLimit = 2;
      const now = getCurrentMoment();

      const data: RealtimeData[] = [
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('22/2/2018 01:00:00'), measureValue: 1
        },
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('22/2/2018 02:00:00'), measureValue: 2
        },
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('23/2/2018 01:00:00'), measureValue: 3
        },
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('25/2/2018 03:00:00'), measureValue: 4
        },
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +now, measureValue: 5
        }
      ];
      const grouper = new DateGrouper(processor, startTimestamp, endTimestamp, period, linesLimit);

      const groupedData = grouper.groupData(data);

      const expected = {
        [+getMomentByDate('25/2/2018')]: [
          {
            instance: 'New Sales',
            measureName: 'ContactsAnswered',
            measureTimestamp: +getMomentByDateTime('25/2/2018 03:00:00'),
            measureValue: 4
          }
        ],
        [+now.clone().startOf('days')]: [
          {
            instance: 'New Sales',
            measureName: 'ContactsAnswered',
            measureTimestamp: +now,
            measureValue: 5
          }
        ]
      };

      expect(groupedData).toEqual(expected);
    });
  });

  describe('ShiftGrouper', () => {
    it('should return 2 group items', () => {
      const startTimestamp = +getMomentByDate('27/2/2018');
      const endTimestamp = +getMomentByDate('1/3/2018');
      const period = 8;

      const data: RealtimeData[] = [
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('28/2/2018 00:00:00'), measureValue: 0
        },
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('28/2/2018 01:00:00'), measureValue: 1
        },
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('28/2/2018 02:00:00'), measureValue: 2
        },
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('28/2/2018 03:00:00'), measureValue: 3
        },
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('28/2/2018 04:00:00'), measureValue: 4
        },
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('28/2/2018 05:00:00'), measureValue: 5
        },
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('28/2/2018 06:00:00'), measureValue: 6
        },
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('28/2/2018 07:00:00'), measureValue: 7
        },
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('28/2/2018 08:00:00'), measureValue: 8
        },
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('28/2/2018 09:00:00'), measureValue: 9
        },
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('28/2/2018 10:00:00'), measureValue: 10
        }
      ];

      const grouper = new ShiftGrouper(processor, startTimestamp, endTimestamp, period);

      const groupedData = grouper.groupData(data);

      const expected = {
        [+getMomentByDateTime('28/2/2018 00:00:00')]: [
          {
            instance: 'New Sales', measureName: 'ContactsAnswered',
            measureTimestamp: +getMomentByDateTime('28/2/2018 00:00:00'), measureValue: 0
          },
          {
            instance: 'New Sales', measureName: 'ContactsAnswered',
            measureTimestamp: +getMomentByDateTime('28/2/2018 01:00:00'), measureValue: 1
          },
          {
            instance: 'New Sales', measureName: 'ContactsAnswered',
            measureTimestamp: +getMomentByDateTime('28/2/2018 02:00:00'), measureValue: 2
          },
          {
            instance: 'New Sales', measureName: 'ContactsAnswered',
            measureTimestamp: +getMomentByDateTime('28/2/2018 03:00:00'), measureValue: 3
          },
          {
            instance: 'New Sales', measureName: 'ContactsAnswered',
            measureTimestamp: +getMomentByDateTime('28/2/2018 04:00:00'), measureValue: 4
          },
          {
            instance: 'New Sales', measureName: 'ContactsAnswered',
            measureTimestamp: +getMomentByDateTime('28/2/2018 05:00:00'), measureValue: 5
          },
          {
            instance: 'New Sales', measureName: 'ContactsAnswered',
            measureTimestamp: +getMomentByDateTime('28/2/2018 06:00:00'), measureValue: 6
          },
          {
            instance: 'New Sales', measureName: 'ContactsAnswered',
            measureTimestamp: +getMomentByDateTime('28/2/2018 07:00:00'), measureValue: 7
          }
        ],
        [+getMomentByDateTime('28/2/2018 08:00:00')]: [
          {
            instance: 'New Sales', measureName: 'ContactsAnswered',
            measureTimestamp: +getMomentByDateTime('28/2/2018 08:00:00'), measureValue: 8
          },
          {
            instance: 'New Sales', measureName: 'ContactsAnswered',
            measureTimestamp: +getMomentByDateTime('28/2/2018 09:00:00'), measureValue: 9
          },
          {
            instance: 'New Sales', measureName: 'ContactsAnswered',
            measureTimestamp: +getMomentByDateTime('28/2/2018 10:00:00'), measureValue: 10
          }
        ]
      };

      expect(groupedData).toEqual(expected);
    });

    it('should return 1 group items when lineslimit = 1', () => {
      const startTimestamp = +getMomentByDate('27/2/2018');
      const endTimestamp = +getMomentByDateTime('28/2/2018 23:59:59');
      const period = 8;
      const linesLimit = 1;

      const data: RealtimeData[] = [
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('28/2/2018 00:00:00'), measureValue: 0
        },
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('28/2/2018 01:00:00'), measureValue: 1
        },
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('28/2/2018 02:00:00'), measureValue: 2
        },
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('28/2/2018 03:00:00'), measureValue: 3
        },
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('28/2/2018 04:00:00'), measureValue: 4
        },
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('28/2/2018 05:00:00'), measureValue: 5
        },
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('28/2/2018 06:00:00'), measureValue: 6
        },
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('28/2/2018 07:00:00'), measureValue: 7
        },
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('28/2/2018 08:00:00'), measureValue: 8
        },
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('28/2/2018 09:00:00'), measureValue: 9
        },
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('28/2/2018 10:00:00'), measureValue: 10
        },
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('28/2/2018 23:00:00'), measureValue: 23
        }
      ];

      const grouper = new ShiftGrouper(processor, startTimestamp, endTimestamp, period, linesLimit);

      const groupedData = grouper.groupData(data);

      const expected = {
        [+getMomentByDateTime('28/2/2018 16:00:00')]: [
          {
            instance: 'New Sales', measureName: 'ContactsAnswered',
            measureTimestamp: +getMomentByDateTime('28/2/2018 23:00:00'), measureValue: 23
          }
        ]
      };

      expect(groupedData).toEqual(expected);
    });

    it('should return empty group if data does not meet the conditions', () => {
      const startTimestamp = +getMomentByDate('22/2/2018');
      const endTimestamp = +getMomentByDate('1/3/2018');
      const period = 8;

      const data: RealtimeData[] = [
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('21/2/2018 01:00:00'), measureValue: 1
        }
      ];
      const grouper = new ShiftGrouper(processor, startTimestamp, endTimestamp, period);

      const groupedData = grouper.groupData(data);

      expect(groupedData).toEqual({});
    });

    it('should always include latest line', () => {
      const startTimestamp = +getMomentByDate('27/2/2018');
      const endTimestamp = +getMomentByDateTime('28/2/2018 23:59:59');
      const period = 8;
      const linesLimit = 2;

      const now = getCurrentMoment();
      const nowInHours = now.clone().hour();
      const position = Math.floor(nowInHours / period);
      const start = now.clone().startOf('days').add(position * period, 'hours');

      const data: RealtimeData[] = [
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('28/2/2018 00:00:00'), measureValue: 0
        },
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('28/2/2018 01:00:00'), measureValue: 1
        },
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('28/2/2018 02:00:00'), measureValue: 2
        },
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('28/2/2018 03:00:00'), measureValue: 3
        },
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('28/2/2018 04:00:00'), measureValue: 4
        },
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('28/2/2018 05:00:00'), measureValue: 5
        },
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('28/2/2018 06:00:00'), measureValue: 6
        },
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('28/2/2018 07:00:00'), measureValue: 7
        },
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('28/2/2018 08:00:00'), measureValue: 8
        },
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('28/2/2018 09:00:00'), measureValue: 9
        },
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('28/2/2018 10:00:00'), measureValue: 10
        },
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +getMomentByDateTime('28/2/2018 23:00:00'), measureValue: 23
        },
        {
          instance: 'New Sales', measureName: 'ContactsAnswered',
          measureTimestamp: +now, measureValue: 25
        }
      ];

      const grouper = new ShiftGrouper(processor, startTimestamp, endTimestamp, period, linesLimit);

      const groupedData = grouper.groupData(data);

      const expected = {
        [+getMomentByDateTime('28/2/2018 16:00:00')]: [
          {
            instance: 'New Sales', measureName: 'ContactsAnswered',
            measureTimestamp: +getMomentByDateTime('28/2/2018 23:00:00'), measureValue: 23
          }
        ],
        [+start]: [
          {
            instance: 'New Sales',
            measureName: 'ContactsAnswered',
            measureTimestamp: +now,
            measureValue: 25
          }
        ]
      };

      expect(groupedData).toEqual(expected);
    });
  });
});
