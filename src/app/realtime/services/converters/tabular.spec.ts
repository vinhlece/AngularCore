import {DataDisplayType, WidgetThresholdColor} from '../../../widgets/models/enums';
import {getRealTimeDataProcessor} from '../../../common/testing/mocks/processor';
import {mockTabularWidget} from '../../../common/testing/mocks/widgets';
import {WidgetThresholdColorConfig} from '../../../widgets/models';
import {RealtimeData} from '../../models';
import {ConverterOptions} from '../index';
import {HighchartsDataConverterFactory} from './factory';
import {TimeUtilsImpl} from '../../../common/services/timeUtils';

// TODO: remove x
describe('TabularConverter', () => {
  it('should return empty list when data is empty', () => {
    const groupedData = {};

    const converter = new HighchartsDataConverterFactory(getRealTimeDataProcessor(), new TimeUtilsImpl()).createTabularConverter(mockTabularWidget(), {});
    const result = converter.convert([]);

    const expected = {
      data: [],
      autoInvokeUrls: []
    };
    expect(result).toEqual(expected);
  });

  describe('latest table', () => {
    const measures = ['NotReady'];
    const dimensions = [
      {
        dimension: 'Continent',
        systemInstances: [],
        customInstances: ['New Sales', 'Upgrade']
      }
    ];
    const windows = ['INSTANTANEOUS'];
    const newDimensions = [
      {
        dimension: 'Continent',
        systemInstances: [],
        customInstances: ['Upgrade', 'Tom,Sales,EU-1', 'Tom,Sales']
      }
    ];
    const columns = [{id: 'Key', type: 'string'}, {id: 'MeasureTimestamp', type: 'datetime'}, {
      id: 'NotReady',
      type: 'number'
    }];
    const displayData = DataDisplayType.EndOfTimeline;
    const thresholdColor: WidgetThresholdColorConfig = {
      greater: WidgetThresholdColor.Red,
      lesser: WidgetThresholdColor.Green
    };
    const widget = {...mockTabularWidget(), dimensions, windows, measures, displayData, columns, thresholdColor, showAllData: false};

    it('only have latest record', () => {
      const data: RealtimeData[] = [
        {
          instance: 'Upgrade',
          measureName: 'NotReady',
          measureValue: 11,
          measureTimestamp: 35,
          dataType: 'Queue Performance',
          dimension: 'Continent',
          window: 'INSTANTANEOUS'
        }
      ];
      const converter = new HighchartsDataConverterFactory(getRealTimeDataProcessor(), new TimeUtilsImpl()).createTabularConverter(widget, {});
      const result = converter.convert(data);
      const emptyRow = {
        Key: {
          primary: {value: null, color: 'inherit', format: 'string'},
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
        MeasureTimestamp: {
          primary: {value: null, color: 'inherit', format: 'datetime'},
          secondary: null
        },
        NotReady: {
          primary: {value: null, color: 'inherit', format: 'number'},
          secondary: null
        }
      };
      const expected = {
        autoInvokeUrls: [],
        data: [{
          AutoInvokeUrls: [],
          Id: 'Upgrade',
          Key: {
            primary: {value: 'Upgrade', color: 'inherit', format: 'string', autoInvokeUrl: false},
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
          MeasureTimestamp: {
            primary: {value: 35, color: 'inherit', format: 'datetime', autoInvokeUrl: false},
            secondary: null
          },
          NotReady: {
            primary: {value: 11, color: 'inherit', format: 'number', autoInvokeUrl: false},
            secondary: null
          }
        }]
      };

      expect(result).toEqual(expected);
    });

    it('have latest & previous records', () => {
      const data: RealtimeData[] = [
        {
          instance: 'Upgrade',
          measureName: 'NotReady',
          measureValue: 11,
          measureTimestamp: 35,
          dataType: 'Queue Performance',
          dimension: 'Continent',
          window: 'INSTANTANEOUS'
        },
        {
          instance: 'Upgrade',
          measureName: 'NotReady',
          measureValue: 12,
          measureTimestamp: 9,
          dataType: 'Queue Performance',
          dimension: 'Continent',
          window: 'INSTANTANEOUS'
        },
        {
          instance: 'New Sales',
          measureName: 'NotReady',
          measureValue: 9,
          measureTimestamp: 35,
          dataType: 'Queue Performance',
          dimension: 'Continent',
          window: 'INSTANTANEOUS'
        },
        {
          instance: 'New Sales',
          measureName: 'NotReady',
          measureValue: 8,
          measureTimestamp: 2,
          dataType: 'Queue Performance',
          dimension: 'Continent',
          window: 'INSTANTANEOUS'
        }
      ];
      const options: ConverterOptions = {goBackTimeRange: {startTimestamp: 0, endTimestamp: 20}};
      const converter = new HighchartsDataConverterFactory(getRealTimeDataProcessor(), new TimeUtilsImpl()).createTabularConverter(widget, options);
      const result = converter.convert(data);
      const expected = {
        autoInvokeUrls: [],
        data: [{
          AutoInvokeUrls: [],
          Id: 'Upgrade',
          Key: {
            primary: {value: 'Upgrade', color: 'inherit', format: 'string', autoInvokeUrl: false},
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
          MeasureTimestamp: {
            primary: {value: 35, color: 'inherit', format: 'datetime', autoInvokeUrl: false},
            secondary: null
          },
          NotReady: {
            primary: {value: 11, color: 'inherit', format: 'number', autoInvokeUrl: false},
            secondary: {value: 12, color: 'black', format: 'number'}
          }
        }, {
          AutoInvokeUrls: [],
          Id: 'New Sales',
          Key: {
            primary: {value: 'New Sales', color: 'inherit', format: 'string', autoInvokeUrl: false},
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
          MeasureTimestamp: {
            primary: {value: 35, color: 'inherit', format: 'datetime', autoInvokeUrl: false},
            secondary: null
          },
          NotReady: {
            primary: {value: 9, color: 'inherit', format: 'number', autoInvokeUrl: false},
            secondary: {value: 8, color: 'black', format: 'number'}
          }
        }]
      };

      expect(result).toEqual(expected);
    });

    it('display instance with 1 part when have 1 key column', () => {
      const newColumns = [
        {
          id: 'Key',
          type: 'string'
        }, {
          id: 'NotReady',
          type: 'number'
        }, {
          id: 'Agent',
          type: 'string'
        }];

      const newWidget = {
        ...widget,
        columns: newColumns,
        dimensions: newDimensions
      }

      const data: RealtimeData[] = [
        {
          instance: 'Upgrade',
          measureName: 'NotReady',
          measureValue: 11,
          measureTimestamp: 35,
          dataType: 'Queue Performance',
          dimension: 'Continent',
          window: 'INSTANTANEOUS'
        },
        {
          instance: 'Tom,Sales,EU-1',
          measureName: 'NotReady',
          measureValue: 12,
          measureTimestamp: 9,
          dataType: 'Queue Performance',
          dimension: 'Continent',
          window: 'INSTANTANEOUS'
        },
        {
          instance: 'Tom,Sales',
          measureName: 'NotReady',
          measureValue: 9,
          measureTimestamp: 35,
          dataType: 'Queue Performance',
          dimension: 'Continent',
          window: 'INSTANTANEOUS'
        }
      ];
      const options: ConverterOptions = {};
      const converter = new HighchartsDataConverterFactory(getRealTimeDataProcessor(), new TimeUtilsImpl()).createTabularConverter(newWidget, options);
      const result = converter.convert(data);
      const expected = {
        autoInvokeUrls: [],
        data: [{
          AutoInvokeUrls: [],
          Id: 'Upgrade',
          Key: {
            primary: {value: 'Upgrade', color: 'inherit', format: 'string', autoInvokeUrl: false},
            secondary: null
          },
          Agent: {
            primary: {value: 'Upgrade', color: 'inherit', autoInvokeUrl: false, format: 'string'},
            secondary: null
          },
          Queue: {
            primary: { value: undefined, color: 'inherit', autoInvokeUrl: false, format: 'string'},
            secondary: null
          },
          Region: {
            primary: { value: undefined, color: 'inherit', autoInvokeUrl: false, format: 'string'},
            secondary: null
          },
          MeasureTimestamp: {
            primary: {value: 35, color: 'inherit', format: 'datetime', autoInvokeUrl: false},
            secondary: null
          },
          NotReady: {
            primary: {value: 11, color: 'inherit', format: 'number', autoInvokeUrl: false},
            secondary: null
          }
        }]
      };

      expect(result).toEqual(expected);
    });

    it('display instance with 2 part when have 2 key column', () => {
      const newColumns = [
        {
          id: 'Key',
          type: 'string'
        }, {
          id: 'NotReady',
          type: 'number'
        }, {
          id: 'Agent',
          type: 'string'
        }, {
          id: 'Queue',
          type: 'string'
        }];

      const newWidget = {
        ...widget,
        columns: newColumns,
        dimensions: newDimensions
      }

      const data: RealtimeData[] = [
        {
          instance: 'Upgrade',
          measureName: 'NotReady',
          measureValue: 11,
          measureTimestamp: 35,
          dataType: 'Queue Performance',
          dimension: 'Continent',
          window: 'INSTANTANEOUS'
        },
        {
          instance: 'Tom,Sales,EU-1',
          measureName: 'NotReady',
          measureValue: 12,
          measureTimestamp: 9,
          dataType: 'Queue Performance',
          dimension: 'Continent',
          window: 'INSTANTANEOUS'
        },
        {
          instance: 'Tom,Sales',
          measureName: 'NotReady',
          measureValue: 9,
          measureTimestamp: 35,
          dataType: 'Queue Performance',
          dimension: 'Continent',
          window: 'INSTANTANEOUS'
        }
      ];
      const options: ConverterOptions = {};
      const converter = new HighchartsDataConverterFactory(getRealTimeDataProcessor(), new TimeUtilsImpl()).createTabularConverter(newWidget, options);
      const result = converter.convert(data);
      const expected = {
        autoInvokeUrls: [],
        data: [{
          AutoInvokeUrls: [],
          Id: 'Tom,Sales',
          Key: {
            primary: {value: 'Tom,Sales', color: 'inherit', format: 'string', autoInvokeUrl: false},
            secondary: null
          },
          Agent: {
            primary: {value: 'Tom', color: 'inherit', autoInvokeUrl: false, format: 'string'},
            secondary: null
          },
          Queue: {
            primary: { value: 'Sales', color: 'inherit', autoInvokeUrl: false, format: 'string'},
            secondary: null
          },
          Region: {
            primary: { value: undefined, color: 'inherit', autoInvokeUrl: false, format: 'string'},
            secondary: null
          },
          MeasureTimestamp: {
            primary: {value: 35, color: 'inherit', format: 'datetime', autoInvokeUrl: false},
            secondary: null
          },
          NotReady: {
            primary: {value: 9, color: 'inherit', format: 'number', autoInvokeUrl: false},
            secondary: null
          }
        }]
      };

      expect(result).toEqual(expected);
    });

    it('display instance with 3 part when have 3 key column', () => {
      const newColumns = [
        {
          id: 'Key',
          type: 'string'
        }, {
          id: 'NotReady',
          type: 'number'
        }, {
          id: 'Agent',
          type: 'string'
        }, {
          id: 'Queue',
          type: 'string'
        }, {
          id: 'Region',
          type: 'string'
        }];

      const newWidget = {
        ...widget,
        columns: newColumns,
        dimensions: newDimensions
      }

      const data: RealtimeData[] = [
        {
          instance: 'Upgrade',
          measureName: 'NotReady',
          measureValue: 11,
          measureTimestamp: 35,
          dataType: 'Queue Performance',
          dimension: 'Continent',
          window: 'INSTANTANEOUS'
        },
        {
          instance: 'Tom,Sales,EU-1',
          measureName: 'NotReady',
          measureValue: 12,
          measureTimestamp: 9,
          dataType: 'Queue Performance',
          dimension: 'Continent',
          window: 'INSTANTANEOUS'
        },
        {
          instance: 'Tom,Sales',
          measureName: 'NotReady',
          measureValue: 9,
          measureTimestamp: 35,
          dataType: 'Queue Performance',
          dimension: 'Continent',
          window: 'INSTANTANEOUS'
        }
      ];
      const options: ConverterOptions = {};
      const converter = new HighchartsDataConverterFactory(getRealTimeDataProcessor(), new TimeUtilsImpl()).createTabularConverter(newWidget, options);
      const result = converter.convert(data);
      const expected = {
        autoInvokeUrls: [],
        data: [{
          AutoInvokeUrls: [],
          Id: 'Tom,Sales,EU-1',
          Key: {
            primary: {value: 'Tom,Sales,EU-1', color: 'inherit', format: 'string', autoInvokeUrl: false},
            secondary: null
          },
          Agent: {
            primary: {value: 'Tom', color: 'inherit', autoInvokeUrl: false, format: 'string'},
            secondary: null
          },
          Queue: {
            primary: { value: 'Sales', color: 'inherit', autoInvokeUrl: false, format: 'string'},
            secondary: null
          },
          Region: {
            primary: { value: 'EU-1', color: 'inherit', autoInvokeUrl: false, format: 'string'},
            secondary: null
          },
          MeasureTimestamp: {
            primary: {value: 9, color: 'inherit', format: 'datetime', autoInvokeUrl: false},
            secondary: null
          },
          NotReady: {
            primary: {value: 12, color: 'inherit', format: 'number', autoInvokeUrl: false},
            secondary: null
          }
        }]
      };

      expect(result).toEqual(expected);
    });
  });

  describe('historical table', () => {
    const measures = ['NotReady'];
    const dimensions = [
        {
          dimension: 'Continent',
          systemInstances: [],
          customInstances: ['New Sales', 'Upgrade']
        }
      ];
    const windows = ['INSTANTANEOUS'];
    const columns = [{id: 'Key', type: 'string'}, {id: 'MeasureTimestamp', type: 'datetime'}, {
      id: 'NotReady',
      type: 'number'
    }];
    const displayData = DataDisplayType.ShowInterval;
    const widget = {...mockTabularWidget(), dimensions, windows, measures, displayData, columns};

    it('should not distinct latest & previous records', () => {
      const data: RealtimeData[] = [
        {
          instance: 'Upgrade',
          measureName: 'NotReady',
          measureValue: 11,
          measureTimestamp: 35,
          dataType: 'Queue Performance',
          dimension: 'Continent',
          window: 'INSTANTANEOUS'
        },
        {
          instance: 'Upgrade',
          measureName: 'NotReady',
          measureValue: 12,
          measureTimestamp: 9,
          dataType: 'Queue Performance',
          dimension: 'Continent',
          window: 'INSTANTANEOUS'
        },
        {
          instance: 'New Sales',
          measureName: 'NotReady',
          measureValue: 9,
          measureTimestamp: 35,
          dataType: 'Queue Performance',
          dimension: 'Continent',
          window: 'INSTANTANEOUS'
        },
        {
          instance: 'New Sales',
          measureName: 'NotReady',
          measureValue: 8,
          measureTimestamp: 2,
          dataType: 'Queue Performance',
          dimension: 'Continent',
          window: 'INSTANTANEOUS'
        }
      ];
      const options: ConverterOptions = {goBackTimeRange: {startTimestamp: 0, endTimestamp: 20}};
      const converter = new HighchartsDataConverterFactory(getRealTimeDataProcessor(), new TimeUtilsImpl()).createTabularConverter(widget, options);
      const result = converter.convert(data);
      const expected = {
        autoInvokeUrls: [],
        data: [{
          AutoInvokeUrls: [],
          Id: '35_New Sales',
          Key: {
            primary: {value: 'New Sales', color: 'inherit', format: 'string', autoInvokeUrl: false},
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
          MeasureTimestamp: {
            primary: {value: 35, color: 'inherit', format: 'datetime', autoInvokeUrl: false},
            secondary: null
          },
          NotReady: {
            primary: {value: 9, color: 'inherit', format: 'number', autoInvokeUrl: false},
            secondary: null
          }
        }, {
          AutoInvokeUrls: [],
          Id: '2_New Sales',
          Key: {
            primary: {value: 'New Sales', color: 'inherit', format: 'string', autoInvokeUrl: false},
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
          MeasureTimestamp: {
            primary: {value: 2, color: 'inherit', format: 'datetime', autoInvokeUrl: false},
            secondary: null
          },
          NotReady: {
            primary: {value: 8, color: 'inherit', format: 'number', autoInvokeUrl: false},
            secondary: null
          }
        }, {
          AutoInvokeUrls: [],
          Id: '35_Upgrade',
          Key: {
            primary: {value: 'Upgrade', color: 'inherit', format: 'string', autoInvokeUrl: false},
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
          MeasureTimestamp: {
            primary: {value: 35, color: 'inherit', format: 'datetime', autoInvokeUrl: false},
            secondary: null
          },
          NotReady: {
            primary: {value: 11, color: 'inherit', format: 'number', autoInvokeUrl: false},
            secondary: null
          }
        }, {
          AutoInvokeUrls: [],
          Id: '9_Upgrade',
          Key: {
            primary: {value: 'Upgrade', color: 'inherit', format: 'string', autoInvokeUrl: false},
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
          MeasureTimestamp: {
            primary: {value: 9, color: 'inherit', format: 'datetime', autoInvokeUrl: false},
            secondary: null
          },
          NotReady: {
            primary: {value: 12, color: 'inherit', format: 'number', autoInvokeUrl: false},
            secondary: null
          }
        }]
      };

      expect(result).toEqual(expected);
    });
  });
});
