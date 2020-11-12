import {getRealTimeDataProcessor} from '../../../common/testing/mocks/processor';
import {mockTabularWidget} from '../../../common/testing/mocks/widgets';
import {TabularWidget} from '../../../widgets/models';
import {DataDisplayType} from '../../../widgets/models/enums';
import {RealtimeData} from '../../models';
import {HighchartsDataConverterFactory} from './factory';
import {TimeUtilsImpl} from '../../../common/services/timeUtils';

xdescribe('Converter BenchMark', () => {
  it('for show interval tabular will empty instances', () => {
    const data: RealtimeData[] = [];
    for (let i = 0; i < 1000000; i++) {
      data.push({
        instance: `instance ${randomNumber(0, 100)}`,
        measureName: `measure 1`,
        measureTimestamp: randomNumber(100, 1000),
        measureValue: randomNumber(1, 100)
      });
    }
    const factory = new HighchartsDataConverterFactory(getRealTimeDataProcessor(), new TimeUtilsImpl());

    const widget: TabularWidget = {
      ...mockTabularWidget(),
      measures: ['measure 1'],
      instances: [],
      displayData: DataDisplayType.ShowInterval
    };
    const converter = factory.createBarConverter(widget, {});
    converter.convert(data);
  });
});

function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}
