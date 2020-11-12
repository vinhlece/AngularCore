import {getGroupKey} from '../grouper/grouper.spec';
import {GeoMapDataBuilder} from './geo-map';
import {mockGeoMapWidget} from '../../../common/testing/mocks/widgets';

describe('GeoMapDataBuilder', () => {
  const widget = mockGeoMapWidget({measures: ['ContactsAbandoned'], instances: ['Alabama - Montgomery']});
  const service = new GeoMapDataBuilder(widget, null, []);

  it('should return empty data when grouped data is empty', () => {
    const groupedData = {};

    const result = service.generate(groupedData);

    const expected = [];

    expect(result).toEqual(expected);
  });

  it('should return data when grouped data is NOT empty', () => {
    const groupedData = {
      [getGroupKey({instance: 'Alabama - Montgomery', measureTimestamp: 35})]: [
        {
          instance: 'Alabama - Montgomery',
          measureName: 'ContactsAbandoned',
          measureValue: 11,
          measureTimestamp: 35
        },
        {
          instance: 'Alabama - Montgomery',
          measureName: 'ContactsAbandoned',
          measureValue: 9,
          measureTimestamp: 35
        }
      ]
    };

    const result = service.generate(groupedData);

    expect(result.length).toEqual(1);
  });
});
