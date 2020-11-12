import {ConverterOptions} from '..';
import {StatusMeasures} from '../../../measures/models/enums';
import {mockBillboardWidget} from '../../../common/testing/mocks/widgets';
import {SandBoxFormulaMeasureFactory} from '../../../measures/services/formula/formula-measure.service';
import {RealtimeData} from '../../models';
import {RealTimeDataProcessorImpl} from '../real-time-data-processor.service';
import {HighchartsDataConverterFactory} from './factory';
import {TimeUtilsImpl} from '../../../common/services/timeUtils';
import {BillboardWidget} from '../../../widgets/models/index';

describe('BillboardDataConverterService', () => {
  const item1: RealtimeData = {
    instance: 'New Sales',
    measureName: StatusMeasures.Available,
    measureValue: 3,
    measureTimestamp: 10,
    dataType: 'Queue Performance',
    dimension: 'Continent',
    window: 'INSTANTANEOUS'
  };
  const item2: RealtimeData = {
    instance: 'New Sales',
    measureName: StatusMeasures.Available,
    measureValue: 12,
    measureTimestamp: 35,
    dataType: 'Queue Performance',
    dimension: 'Continent',
    window: 'INSTANTANEOUS'
  };
  const item3: RealtimeData = {
    instance: 'New Sales',
    measureName: StatusMeasures.Available,
    measureValue: 5,
    measureTimestamp: 27,
    dataType: 'Queue Performance',
    dimension: 'Continent',
    window: 'INSTANTANEOUS'
  };
  const item4: RealtimeData = {
    instance: 'New Sales',
    measureName: StatusMeasures.NotReady,
    measureValue: 5,
    measureTimestamp: 3,
    dataType: 'Queue Performance',
    dimension: 'Continent',
    window: 'INSTANTANEOUS'
  };
  const item5: RealtimeData = {
    instance: 'New Sales',
    measureName: StatusMeasures.NotReady,
    measureValue: 5,
    measureTimestamp: 11,
    dataType: 'Queue Performance',
    dimension: 'Continent',
    window: 'INSTANTANEOUS'
  };
  const data = [item1, item2, item3, item4, item5];
  const processor = new RealTimeDataProcessorImpl(new SandBoxFormulaMeasureFactory());
  const widget = {
    ...mockBillboardWidget(),
    measures: [StatusMeasures.Available],
    dimensions: [
      {
        dimension: 'Continent',
        systemInstances: [],
        customInstances: ['New Sales']
      }
    ],
    windows: ['INSTANTANEOUS'],
    id: 'billboard'
  };

  it('should return the measureValue of the latest timestamp', () => {
    const service = new HighchartsDataConverterFactory(processor, new TimeUtilsImpl()).createBillboardConverter(widget, {});
    const expectData = {
      current: {timestamp: 35, value: 12},
      passed: {timestamp: null, value: null}
    };
    const convertData = service.convert(data);
    expect(convertData).toEqual(expectData);
  });

  it('should return the measureValue of the latest timestamp when set the previousEnd', () => {
    const options: ConverterOptions = {goBackTimeRange: {startTimestamp: 0, endTimestamp: 30}};
    const service = new HighchartsDataConverterFactory(processor, new TimeUtilsImpl()).createBillboardConverter(widget, options);
    const expectData = {
      current: {timestamp: 35, value: 12},
      passed: {timestamp: 27, value: 5}
    };
    const convertData = service.convert(data);
    expect(convertData).toEqual(expectData);
  });

  it('should display custom timestamp when real time mode is off', () => {
    const options: ConverterOptions = {
      goBackTimeRange: {
        startTimestamp: 0, endTimestamp: 30
      },
      realTimeMode: {
        'billboard': false
      }
    };

    (widget as BillboardWidget).timestamps = [10];

    const service = new HighchartsDataConverterFactory(processor, new TimeUtilsImpl()).createBillboardConverter(widget, options);
    const expectData = {
      current: {timestamp: 10, value: 3},
      passed: {timestamp: 27, value: 5}
    };
    const convertData = service.convert(data);
    expect(convertData).toEqual(expectData);
  });

  it('should display latest data when real time mode is on', () => {
    const options: ConverterOptions = {
      goBackTimeRange: {
        startTimestamp: 0, endTimestamp: 30
      },
      realTimeMode: {
        'billboard': true
      }
    };

    (widget as BillboardWidget).timestamps = [10];

    const service = new HighchartsDataConverterFactory(processor, new TimeUtilsImpl()).createBillboardConverter(widget, options);
    const expectData = {
      current: {timestamp: 35, value: 12},
      passed: {timestamp: 27, value: 5}
    };
    const convertData = service.convert(data);
    expect(convertData).toEqual(expectData);
  });
});
