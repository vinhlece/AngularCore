import {sandboxOf} from 'angular-playground';
import {ChartDataConverterService} from '../../../realtime/services/converters';
import {HighchartsDataConverterFactory} from '../../../realtime/services/converters/factory';
import {RealTimeDataProcessorImpl} from '../../../realtime/services/real-time-data-processor.service';
import {mockBarWidget} from '../../../common/testing/mocks/widgets';
import {VERTICAL} from '../../../widgets/constants/bar-chart-types';
import {WidgetMode} from '../../../widgets/constants/widget-types';
import {SandBoxFormulaMeasureFactory} from '../../../measures/services/formula/formula-measure.service';
import {BarChartComponent} from './bar-chart.component';
import {Widget} from '../../../widgets/models';
import {TimeUtilsImpl} from '../../../common/services/timeUtils';
import {TIME_UTILS} from '../../../common/services/tokens';
import {generateData} from '../line-chart/line-chart.component.sandbox';
import {appConfig} from '../../../config/app.config';

const realTimeData = [
  {instance: 'New Sales', measureName: 'ContactsAnswered', measureTimestamp: 1515549600000, measureValue: 103, dataType: 'Queue Performance'},
  {instance: 'Upgrades', measureName: 'ContactsAnswered', measureTimestamp: 15155049600000, measureValue: 99, dataType: 'Queue Performance'},
  {instance: 'New Sales', measureName: 'ContactsAbandoned', measureTimestamp: 1515549600000, measureValue: 103, dataType: 'Queue Performance'},
  {instance: 'Upgrades', measureName: 'ContactsAbandoned', measureTimestamp: 1515549600000, measureValue: 99, dataType: 'Queue Performance'}
];
const dataType = 'Queue Performance';
const startTimeStamp = 1515549600000;
const instances = ['Cat', 'Dog', 'Fish', 'New Sales', 'Snake', 'Tiger', 'Rose', 'Dragon', 'Rabbit', 'Upgrades'];
const measures = ['ContactsAnswered', 'InstantaneousContactsAnswered', 'InstAttributeMatched',
  'ContactsOffered', 'ServiceLevel', 'Checking', 'ContactsAbandoned', 'Measure1', 'Measure2', 'Measure3'];
let widget = mockBarWidget({
  instances: instances,
  measures: measures,
  mode: {
    value: WidgetMode.Measures,
    timeGroup: null
  },
  chartType: VERTICAL,
  chartStyle: 'Normal',
  timestamps: []
});
const processor = new RealTimeDataProcessorImpl(new SandBoxFormulaMeasureFactory());
let converter: ChartDataConverterService = new HighchartsDataConverterFactory(processor, new TimeUtilsImpl()).createBarConverter(
  widget as Widget, {});
let data = converter.convert(realTimeData);
appConfig.performanceLogging = true;
export default sandboxOf(BarChartComponent, {
  imports: [],
  providers: [
    {provide: TIME_UTILS, useClass: TimeUtilsImpl},
  ]
})
  .add('Highcharts Bar Chart', {
    template: `
      <app-bar-chart [data]="data" [widget]="widget"></app-bar-chart>
      <table>
      <tr>
        <td>Fake instance</td>
        <td>Fake measure</td>
        <td>Data point</td>
      </tr>
      <tr>
        <td><input id="instancefake" value="10" placeholder="instance" type="number"></td>
        <td><input id="measurefake" value="10" placeholder="measure" type="number"></td>
        <td><input id="dataPoint" value="400" placeholder="dataPoint" type="number"></td>
      </tr>
      <tr>
        <td>Widget instance</td>
        <td>Widget measure</td>
        <td>Is Stacked bar</td>
      </tr>
      <tr>
        <td><input id="instance" value="1" placeholder="instance" type="number"></td>
        <td><input id="measure" value="10" placeholder="measure" type="number"></td>
        <td><input id="isstacked" checked type="checkbox"></td>
        <td><button (click)="onReload()"> Run</button></td>
      </tr>
      </table>
    `,
    context: {
      data: data,
      widget: widget,
      onClick: (e) => console.log(e),
      onContextMenu: (e) => console.log(e),
      onReload() {
        const instanceFake = $('#instancefake').val() ? parseInt($('#instancefake').val().toString()) : 10;
        const measureFake = $('#measurefake').val() ? parseInt($('#measurefake').val().toString()) : 10;
        const instance = $('#instance').val() ? parseInt($('#instance').val().toString()) : 10;
        const measure = $('#measure').val() ? parseInt($('#measure').val().toString()) : 10;
        const dataPoint = $('#dataPoint').val() ? parseInt($('#dataPoint').val().toString()) : 400;
        const isStacked = $('#isstacked').is(':checked');
        widget = {
          ...widget,
          chartStyle: isStacked ? 'Stacked' : 'Normal',
        };
        const fakeData = generateData(instanceFake, measureFake, instance, measure, dataPoint, null, widget);
        const t2 = performance.now();
        converter = new HighchartsDataConverterFactory(processor, new TimeUtilsImpl()).createBarConverter(
          widget as Widget, {});
        data = converter.convert(fakeData);
        const t3 = performance.now();
        console.log('Convert: ', Math.floor(t3 - t2) + 'ms');
        this.data = data;
        this.widget = widget;
      }
    }
  });
