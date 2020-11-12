import {DisplayMode} from '../../../dashboard/models/enums';
import {mockGeoMapWidget} from '../../../common/testing/mocks/widgets';
import {SandBoxFormulaMeasureFactory} from '../../../measures/services/formula/formula-measure.service';
import {RealtimeData} from '../../models';
import {RealTimeDataProcessorImpl} from '../real-time-data-processor.service';
import {HighchartsDataConverterFactory} from './factory';
import * as map from '../../../charts/components/geo-map/us-all';
import {TimeUtilsImpl} from '../../../common/services/timeUtils';

describe('Geo Map converter', () => {
  const item1: RealtimeData = {
    instance: 'Alabama-Montgomery',
    measureName: 'ContactsAnswered',
    measureValue: 3,
    measureTimestamp: 10,
    dataType: 'Queue Performance',
    dimension: 'Continent',
    window: 'INSTANTANEOUS'
  };
  const item2: RealtimeData = {
    instance: 'Alabama-Montgomery',
    measureName: 'ContactsAnswered',
    measureValue: 12,
    measureTimestamp: 35,
    dataType: 'Queue Performance',
    dimension: 'Continent',
    window: 'INSTANTANEOUS'
  };
  const item3: RealtimeData = {
    instance: 'Alabama-Montgomery',
    measureName: 'ContactsAnswered',
    measureValue: 5,
    measureTimestamp: 27,
    dataType: 'Queue Performance',
    dimension: 'Continent',
    window: 'INSTANTANEOUS'
  };
  const item4: RealtimeData = {
    instance: 'Alaska-Juneau',
    measureName: 'ContactsAnswered',
    measureValue: 20,
    measureTimestamp: 3,
    dataType: 'Queue Performance',
    dimension: 'Continent',
    window: 'INSTANTANEOUS'
  };
  const item5: RealtimeData = {
    instance: 'Alaska-Juneau',
    measureName: 'ContactsAnswered',
    measureValue: 5,
    measureTimestamp: 35,
    dataType: 'Queue Performance',
    dimension: 'Continent',
    window: 'INSTANTANEOUS'
  };
  const data = [item1, item2, item3, item4, item5];
  const processor = new RealTimeDataProcessorImpl(new SandBoxFormulaMeasureFactory());
  const widget = {
    ...mockGeoMapWidget(),
    measures: ['ContactsAnswered'],
    windows: ['INSTANTANEOUS'],
    dimensions: [
      {
        dimension: 'Continent',
        systemInstances: [],
        customInstances: ['Alaska-Juneau', 'Alabama-Montgomery']
      }
    ],
  };
  const mapSetting = {
    name: widget.measures[0],
    mapData: map,
    borderColor: '#606060',
    nullColor: widget.stateColor.parentStateColor,  // change state color
    showInLegend: false
  };

  const latestExpected = [
    mapSetting,
    {
      color: '#3d00ff',
      data: [{
        abbrev: 'AL',
        capital: 'Montgomery',
        lat: 32.38012,
        lon: -86.300629,
        parentState: 'Alabama',
        population: 205764,
        z: 12
      },
        {
          abbrev: 'AK',
          capital: 'Juneau',
          lat: 58.29974,
          lon: -134.406794,
          parentState: 'Alaska',
          population: 31275,
          z: 5
        }],
      dataLabels: {
        enabled: true,
        format: '{point.capital}'
      },
      name: widget.measures[0],
      type: 'mapbubble'
    }]
  ;

  const previousExpected = [
    mapSetting,
    {
      color: '#3d00ff',
      data: [{
        abbrev: 'AL',
        capital: 'Montgomery',
        lat: 32.38012,
        lon: -86.300629,
        parentState: 'Alabama',
        population: 205764,
        z: 5
      },
        {
          abbrev: 'AK',
          capital: 'Juneau',
          lat: 58.29974,
          lon: -134.406794,
          parentState: 'Alaska',
          population: 31275,
          z: 20
        }],
      dataLabels: {
        enabled: true,
        format: '{point.capital}'
      },
      name: widget.measures[0],
      type: 'mapbubble'
    }]
  ;
  it('should generate latest geo map data if not select show time explorer values', () => {
    const converter = new HighchartsDataConverterFactory(processor, new TimeUtilsImpl()).createGeoMapConverter(widget, {});
    const result = converter.convert(data);
    expect(result).toEqual(latestExpected);
  });

  it('should generate latest geo map data if not select prev timestamp on time explorer', () => {
    const converter = new HighchartsDataConverterFactory(processor, new TimeUtilsImpl()).createGeoMapConverter(widget, {});
    const result = converter.convert(data);
    expect(result).toEqual(latestExpected);
  });

  it('should generate previous geo map data if select show time explorer values and prev timestamp on time explorer', () => {
    const tempWidget = {
      ...widget,
      displayMode: DisplayMode.Historical,
    };
    const converter = new HighchartsDataConverterFactory(processor, new TimeUtilsImpl())
      .createGeoMapConverter(tempWidget, {goBackTimeRange: {startTimestamp: 0, endTimestamp: 27}});
    const result = converter.convert(data);
    expect(result).toEqual(previousExpected);
  });
});
