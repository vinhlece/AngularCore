import {mockTabularWidget} from '../../../common/testing/mocks/widgets';
import {WidgetThresholdColorConfig} from '../../../widgets/models';
import {DataDisplayType, WidgetThresholdColor} from '../../../widgets/models/enums';
import {getGroupKey} from '../grouper/grouper.spec';
import {TabularDataBuilder} from './tabular';

describe('TabularDataBuilder', () => {
  it('should return empty list when grouped data is empty', () => {
    const groupedData = {};

    const builder = new TabularDataBuilder(mockTabularWidget(), null);
    const result = builder.generate(groupedData);

    const expected = [];
    expect(result).toEqual(expected);
  });

  describe('latest table', () => {
    const columns = [{id: 'NotReady', type: 'number'}];
    const displayData = DataDisplayType.EndOfTimeline;
    const thresholdColor: WidgetThresholdColorConfig = {
      greater: WidgetThresholdColor.Red,
      lesser: WidgetThresholdColor.Green
    };
    const builder = new TabularDataBuilder({...mockTabularWidget(), displayData, columns, thresholdColor}, null);

    it('only have latest record', () => {
      const groupedData = {
        [getGroupKey({instance: 'Upgrade'})]: [
          {
            instance: 'Upgrade',
            measureName: 'NotReady',
            measureValue: 11,
            measureTimestamp: 35
          }
        ],
        [getGroupKey({instance: 'New Sales'})]: [
          {
            instance: 'New Sales',
            measureName: 'NotReady',
            measureValue: 9,
            measureTimestamp: 35
          }
        ]
      };
      const result = builder.generate(groupedData);
      const expected = [
        {
          name: 'Upgrade',
          timestamp: 35,
          data: {
            Key: {
              primary: {value: 'Upgrade', color: 'inherit', autoInvokeUrl: false, format: 'string'},
              secondary: null
            },
            Agent: {
              primary: {value: null, color: 'inherit', autoInvokeUrl: false, format: 'string'},
              secondary: null
            },
            Queue: {
              primary: {value: null, color: 'inherit', autoInvokeUrl: false, format: 'string'},
              secondary: null
            },
            Region: {
              primary: {value: null, color: 'inherit', autoInvokeUrl: false, format: 'string'},
              secondary: null
            },
            AutoInvokeUrls: [],
            MeasureTimestamp: {
              primary: {value: 35, color: 'inherit', autoInvokeUrl: false, format: 'datetime'},
              secondary: null
            },
            Id: 'Upgrade',
            NotReady: {
              primary: {value: 11, color: 'inherit', autoInvokeUrl: false, format: 'number'},
              secondary: null
            }
          }
        },
        {
          name: 'New Sales',
          timestamp: 35,
          data: {
            Key: {
              primary: {value: 'New Sales', color: 'inherit', autoInvokeUrl: false, format: 'string'},
              secondary: null
            },
            Agent: {
              primary: {value: null, color: 'inherit', autoInvokeUrl: false, format: 'string'},
              secondary: null
            },
            Queue: {
              primary: {value: null, color: 'inherit', autoInvokeUrl: false, format: 'string'},
              secondary: null
            },
            Region: {
              primary: {value: null, color: 'inherit', autoInvokeUrl: false, format: 'string'},
              secondary: null
            },
            AutoInvokeUrls: [],
            MeasureTimestamp: {
              primary: {value: 35, color: 'inherit', autoInvokeUrl: false, format: 'datetime'},
              secondary: null
            },
            Id: 'New Sales',
            NotReady: {
              primary: {value: 9, color: 'inherit', autoInvokeUrl: false, format: 'number'},
              secondary: null
            }
          }
        },
      ];

      expect(result).toEqual(expected);
    });

    it('have latest & previous records', () => {
      const groupedData = {
        [getGroupKey({instance: 'Upgrade'})]: [
          {
            instance: 'Upgrade',
            measureName: 'NotReady',
            measureValue: 11,
            measureTimestamp: 35
          },
          {
            instance: 'Upgrade',
            measureName: 'NotReady',
            measureValue: 12,
            measureTimestamp: 9
          }
        ],
        [getGroupKey({instance: 'New Sales'})]: [
          {
            instance: 'New Sales',
            measureName: 'NotReady',
            measureValue: 9,
            measureTimestamp: 35
          },
          {
            instance: 'New Sales',
            measureName: 'NotReady',
            measureValue: 8,
            measureTimestamp: 2
          }
        ]
      };
      const result = builder.generate(groupedData);
      const expected = [
        {
          name: 'Upgrade',
          timestamp: 35,
          data: {
            Key: {
              primary: {value: 'Upgrade', color: 'inherit', autoInvokeUrl: false, format: 'string'},
              secondary: null
            },
            Agent: {
              primary: {value: null, color: 'inherit', autoInvokeUrl: false, format: 'string'},
              secondary: null
            },
            Queue: {
              primary: {value: null, color: 'inherit', autoInvokeUrl: false, format: 'string'},
              secondary: null
            },
            Region: {
              primary: {value: null, color: 'inherit', autoInvokeUrl: false, format: 'string'},
              secondary: null
            },
            AutoInvokeUrls: [],
            MeasureTimestamp: {
              primary: {value: 35, color: 'inherit', autoInvokeUrl: false, format: 'datetime'},
              secondary: null
            },
            Id: 'Upgrade',
            NotReady: {
              primary: {value: 11, color: 'inherit', autoInvokeUrl: false, format: 'number'},
              secondary: {value: 12, color: 'black', format: 'number'}
            }
          }
        },
        {
          name: 'New Sales',
          timestamp: 35,
          data: {
            Key: {
              primary: {value: 'New Sales', color: 'inherit', autoInvokeUrl: false, format: 'string'},
              secondary: null
            },
            Agent: {
              primary: {value: null, color: 'inherit', autoInvokeUrl: false, format: 'string'},
              secondary: null
            },
            Queue: {
              primary: {value: null, color: 'inherit', autoInvokeUrl: false, format: 'string'},
              secondary: null
            },
            Region: {
              primary: {value: null, color: 'inherit', autoInvokeUrl: false, format: 'string'},
              secondary: null
            },
            AutoInvokeUrls: [],
            MeasureTimestamp: {
              primary: {value: 35, color: 'inherit', autoInvokeUrl: false, format: 'datetime'},
              secondary: null
            },
            Id: 'New Sales',
            NotReady: {
              primary: {value: 9, color: 'inherit', autoInvokeUrl: false, format: 'number'},
              secondary: {value: 8, color: 'black', format: 'number'}
            }
          }
        },
      ];

      expect(result).toEqual(expected);
    });
  });

  describe('historical table', () => {
    const columns = [{id: 'NotReady', type: 'number'}, {id: 'Available', type: 'number'}];
    const displayData = DataDisplayType.ShowInterval;
    const builder = new TabularDataBuilder({...mockTabularWidget(), displayData, columns}, null);

    it('should not distinct latest & previous', () => {
      const groupedData = {
        [getGroupKey({instance: 'Upgrade', measureTimestamp: 35})]: [
          {
            instance: 'Upgrade',
            measureName: 'NotReady',
            measureValue: 11,
            measureTimestamp: 35
          },
          {
            instance: 'Upgrade',
            measureName: 'Available',
            measureValue: 2,
            measureTimestamp: 35
          }
        ],
        [getGroupKey({instance: 'New Sales', measureTimestamp: 35})]: [
          {
            instance: 'New Sales',
            measureName: 'NotReady',
            measureValue: 9,
            measureTimestamp: 35
          },
          {
            instance: 'New Sales',
            measureName: 'Available',
            measureValue: 33,
            measureTimestamp: 35
          }
        ]
      };
      const result = builder.generate(groupedData);
      const expected = [
        {
          name: 'Upgrade',
          timestamp: 35,
          data: {
            Key: {
              primary: {value: 'Upgrade', color: 'inherit', autoInvokeUrl: false, format: 'string'},
              secondary: null
            },
            Agent: {
              primary: {value: null, color: 'inherit', autoInvokeUrl: false, format: 'string'},
              secondary: null
            },
            Queue: {
              primary: {value: null, color: 'inherit', autoInvokeUrl: false, format: 'string'},
              secondary: null
            },
            Region: {
              primary: {value: null, color: 'inherit', autoInvokeUrl: false, format: 'string'},
              secondary: null
            },
            AutoInvokeUrls: [],
            MeasureTimestamp: {
              primary: {value: 35, color: 'inherit', autoInvokeUrl: false, format: 'datetime'},
              secondary: null
            },
            Id: '35_Upgrade',
            NotReady: {
              primary: {value: 11, color: 'inherit', autoInvokeUrl: false, format: 'number'},
              secondary: null
            },
            Available: {
              primary: {value: 2, color: 'inherit', autoInvokeUrl: false, format: 'number'},
              secondary: null
            }
          }
        },
        {
          name: 'New Sales',
          timestamp: 35,
          data: {
            Key: {
              primary: {value: 'New Sales', color: 'inherit', autoInvokeUrl: false, format: 'string'},
              secondary: null
            },
            Agent: {
              primary: {value: null, color: 'inherit', autoInvokeUrl: false, format: 'string'},
              secondary: null
            },
            Queue: {
              primary: {value: null, color: 'inherit', autoInvokeUrl: false, format: 'string'},
              secondary: null
            },
            Region: {
              primary: {value: null, color: 'inherit', autoInvokeUrl: false, format: 'string'},
              secondary: null
            },
            AutoInvokeUrls: [],
            MeasureTimestamp: {
              primary: {value: 35, color: 'inherit', autoInvokeUrl: false, format: 'datetime'},
              secondary: null
            },
            Id: '35_New Sales',
            NotReady: {
              primary: {value: 9, color: 'inherit', autoInvokeUrl: false, format: 'number'},
              secondary: null
            },
            Available: {
              primary: {value: 33, color: 'inherit', autoInvokeUrl: false, format: 'number'},
              secondary: null
            }
          }
        },
      ];

      expect(result).toEqual(expected);
    });
  });
});
