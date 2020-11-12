import {DisplayMode} from '../../../dashboard/models/enums';
import {mockSolidGaugeWidget} from '../../../common/testing/mocks/widgets';
import {SandBoxFormulaMeasureFactory} from '../../../measures/services/formula/formula-measure.service';
import {RealtimeData} from '../../models';
import {RealTimeDataProcessorImpl} from '../real-time-data-processor.service';
import {HighchartsDataConverterFactory} from './factory';
import {TimeUtilsImpl} from '../../../common/services/timeUtils';

describe('Solid gauge converter', () => {
  const item1: RealtimeData = {
    instance: 'New Sales',
    measureName: 'ContactsAnswered',
    measureValue: 3,
    measureTimestamp: 10,
    dataType: 'Queue Performance',
    dimension: 'Continent',
    window: 'INSTANTANEOUS'
  };
  const item2: RealtimeData = {
    instance: 'New Sales',
    measureName: 'ContactsAnswered',
    measureValue: 12,
    measureTimestamp: 35,
    dataType: 'Queue Performance',
    dimension: 'Continent',
    window: 'INSTANTANEOUS'
  };
  const item3: RealtimeData = {
    instance: 'New Sales',
    measureName: 'ContactsAnswered',
    measureValue: 5,
    measureTimestamp: 27,
    dataType: 'Queue Performance',
    dimension: 'Continent',
    window: 'INSTANTANEOUS'
  };
  const item4: RealtimeData = {
    instance: 'New Sales',
    measureName: 'ContactsOffered',
    measureValue: 5,
    measureTimestamp: 3,
    dataType: 'Queue Performance',
    dimension: 'Continent',
    window: 'INSTANTANEOUS'
  };
  const item5: RealtimeData = {
    instance: 'New Sales',
    measureName: 'ContactsOffered',
    measureValue: 5,
    measureTimestamp: 11,
    dataType: 'Queue Performance',
    dimension: 'Continent',
    window: 'INSTANTANEOUS'
  };
  const data = [item1, item2, item3, item4, item5];
  const processor = new RealTimeDataProcessorImpl(new SandBoxFormulaMeasureFactory());
  const widget = {
    ...mockSolidGaugeWidget(),
    measures: ['ContactsAnswered'],
    dimensions: [
      {
        dimension: 'Continent',
        systemInstances: [],
        customInstances: ['New Sales']
      }
    ],
    windows: ['INSTANTANEOUS']
  };

  it('should generate latest solid gauge data if not select show time explorer values', () => {
    const expected = [{
      data: [12]
    }];
    const tempWidget = {
      ...widget,
      timestamps: [10]
    };
    const converter = new HighchartsDataConverterFactory(processor, new TimeUtilsImpl()).createSolidGaugeConverter(tempWidget, {});
    const result = converter.convert(data);
    expect(result).toEqual(expected);
  });

  it('should generate latest solid gauge data if not select prev timestamp on time explorer', () => {
    const expected = [{
      data: [12]
    }];
    const tempWidget = {
      ...widget,
      timestamps: [10]
    };
    const converter = new HighchartsDataConverterFactory(processor, new TimeUtilsImpl()).createSolidGaugeConverter(tempWidget, {});
    const result = converter.convert(data);
    expect(result).toEqual(expected);
  });

  it('should generate previous solid gauge data if select show time explorer values and prev timestamp on time explorer', () => {
    const expected = [{
      data: [5]
    }];
    const tempWidget = {
      ...widget,
      displayMode: DisplayMode.Historical,
      timestamps: [10]
    };
    const converter = new HighchartsDataConverterFactory(processor, new TimeUtilsImpl())
      .createSolidGaugeConverter(tempWidget, {goBackTimeRange: {startTimestamp: 0, endTimestamp: 27}});
    const result = converter.convert(data);
    expect(result).toEqual(expected);
  });

  it('should display custom timestamp when have timestamp with mode timestamp', () => {
    const expected = [{
      data: [3]
    }];
    const tempWidget = {
      ...widget,
      displayMode: DisplayMode.Timestamp,
      timestamps: [10]
    };
    const converter = new HighchartsDataConverterFactory(processor, new TimeUtilsImpl())
      .createSolidGaugeConverter(tempWidget, {goBackTimeRange: {startTimestamp: 0, endTimestamp: 27}});
    const result = converter.convert(data);
    expect(result).toEqual(expected);
  });

  it('should display latest data when does not have timestamp with mode timestamp', () => {
    const expected = [{
      data: [12]
    }];
    const tempWidget = {
      ...widget,
      displayMode: DisplayMode.Timestamp,
      timestamps: []
    };
    const converter = new HighchartsDataConverterFactory(processor, new TimeUtilsImpl())
      .createSolidGaugeConverter(tempWidget, {goBackTimeRange: {startTimestamp: 0, endTimestamp: 27}});
    const result = converter.convert(data);
    expect(result).toEqual(expected);
  });
});
