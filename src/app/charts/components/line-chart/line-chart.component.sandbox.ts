import {MatIconModule, MatTooltipModule} from '@angular/material';
import {sandboxOf} from 'angular-playground';
import {HighchartsDataConverterFactory} from '../../../realtime/services/converters/factory';
import {RealTimeDataProcessorImpl} from '../../../realtime/services/real-time-data-processor.service';
import {mockLineWidget, mockTrendDiffLineWidget} from '../../../common/testing/mocks/widgets';
import {SandBoxFormulaMeasureFactory} from '../../../measures/services/formula/formula-measure.service';
import {LineChartComponent} from './line-chart.component';
import {TIME_UTILS} from '../../../common/services/tokens';
import {getCurrentMoment, TimeUtilsImpl} from '../../../common/services/timeUtils';
import {TrendType} from '../../../widgets/models/enums';
import {Widget} from '../../../widgets/models/index';
import {appConfig} from '../../../config/app.config';

const realTimeData = [
  {instance: 'New Sales', measureName: 'ContactsAnswered', measureTimestamp: 1515553200000, measureValue: 103, dataType: 'Queue Performance'},
  {instance: 'New Sales', measureName: 'ContactsAnswered', measureTimestamp: 1515596400000, measureValue: 89, dataType: 'Queue Performance'},
  {instance: 'Upgrades', measureName: 'ContactsAnswered', measureTimestamp: 1517752800000, measureValue: 123, dataType: 'Queue Performance'},
  {instance: 'Upgrades', measureName: 'ContactsAnswered', measureTimestamp: 1515564000000, measureValue: 61, dataType: 'Queue Performance'},
  {instance: 'New Sales', measureName: 'ContactsAnswered', measureTimestamp: 1515600000000, measureValue: 53, dataType: 'Queue Performance'},
  {instance: 'New Sales', measureName: 'ContactsAnswered', measureTimestamp: 1517752800000, measureValue: 26, dataType: 'Queue Performance'},
  {instance: 'New Sales', measureName: 'ContactsAnswered', measureTimestamp: 1515542400000, measureValue: 12, dataType: 'Queue Performance'},
  {instance: 'Upgrades', measureName: 'ContactsAnswered', measureTimestamp: 1515567600000, measureValue: 21, dataType: 'Queue Performance'},
  {instance: 'New Sales', measureName: 'ContactsAnswered', measureTimestamp: 1515564000000, measureValue: 120, dataType: 'Queue Performance'},
  {instance: 'Upgrades', measureName: 'ContactsAnswered', measureTimestamp: 1515553200000, measureValue: 117, dataType: 'Queue Performance'},
  {instance: 'Upgrades', measureName: 'ContactsAnswered', measureTimestamp: 1515556800000, measureValue: 106, dataType: 'Queue Performance'},
  {instance: 'New Sales', measureName: 'ContactsAnswered', measureTimestamp: 1515549600000, measureValue: 103, dataType: 'Queue Performance'},
  {instance: 'Upgrades', measureName: 'ContactsAnswered', measureTimestamp: 1515582000000, measureValue: 99, dataType: 'Queue Performance'},
  {instance: 'Upgrades', measureName: 'ContactsAnswered', measureTimestamp: 1515542400000, measureValue: 58, dataType: 'Queue Performance'},
];
let widget = {...mockLineWidget(),
  instances: ['Cat', 'Dog', 'Fish', 'New Sales', 'Snake', 'Tiger', 'Rose', 'Dragon', 'Rabbit'],
  measures: ['ContactsAnswered', 'InstantaneousContactsAnswered', 'InstAttributeMatched', 'ContactsOffered', 'ContactsAnswered'],
  customTimeRange: null,
  chartType: 'line'
};
let trendDiffWidget = {...mockTrendDiffLineWidget(),
  instances: ['Cat', 'Dog', 'Fish', 'New Sales', 'Snake', 'Tiger', 'Rose', 'Dragon', 'Rabbit'],
  measures: ['ContactsAnswered', 'InstantaneousContactsAnswered', 'InstAttributeMatched', 'ContactsOffered', 'ContactsAnswered'],
  customTimeRange: null,
  chartType: 'area',
  period: 1,
  trendType: TrendType.Day
};

const brushWidget = {
  ...widget,
  chartType: 'line'
};
const dataType = 'Queue Performance';
const startTimeStamp = 1570060800000;

const realtimeProcessor = new RealTimeDataProcessorImpl(new SandBoxFormulaMeasureFactory());
let converter;
let data = [];
appConfig.performanceLogging = true;

export const randomData = (prefix: string, max: number): string[] => {
  const dataValue = [];
  for (let i = 0; i < max; i++) {
    dataValue.push(`${prefix}_${i}`);
  }
  return dataValue;
};
export const generateData = (instanceFake: number, measureFake: number, instance: number, measure: number, dataPoint: number, dayTrenddiff?: number, updateWidget?: Widget) => {
  const fakeInstances = randomData('Cat', instanceFake);
  const fakeMeasures = randomData('ContactCall', measureFake);
  const fakeData = [];
  if (instance <= fakeInstances.length && measure <= fakeMeasures.length) {
    if (!dayTrenddiff) {
      widget = {
        ...widget,
        instances : fakeInstances.slice(0, instance),
        measures : fakeMeasures.slice(0, measure)
      };
    } else {
      trendDiffWidget = {
        ...trendDiffWidget,
        instances : fakeInstances.slice(0, instance),
        measures : fakeMeasures.slice(0, measure)
      };
    }
    if (updateWidget) {
      updateWidget.instances = fakeInstances.slice(0, instance);
      updateWidget.measures = fakeMeasures.slice(0, measure);
    }
    const genData = (timestamp: number, interval: number, x: number, y: number) => {
      let measureTimestamp = timestamp;
      for (let i = 0; i < dataPoint; i++) {
        let measureValue = Math.floor(Math.random() * Math.floor(updateWidget ? 150 : 15));
        if (updateWidget) {
          measureValue += 50;
        }
        measureTimestamp = measureTimestamp + interval;
        const fakeDataPoint = {
          instance: fakeInstances[x],
          measureName: fakeMeasures[y],
          dataType,
          measureTimestamp,
          measureValue
        };
        fakeData.push(fakeDataPoint);
      }
    };
    for (let x = 0; x < instanceFake; x++) {
      for (let y = 0; y < measureFake; y++) {
        let measureTimestamp = startTimeStamp;
        let interval = 300000;
        if (dayTrenddiff) {
          interval = 86400 / dataPoint * 1000;
          for (let i = 0; i < dayTrenddiff; i++) {
            measureTimestamp = +getCurrentMoment().subtract(i + 1, 'days');
            genData(measureTimestamp, interval, x, y);
          }
        } else {
          genData(measureTimestamp, interval, x, y);
        }
      }
    }
  }
  return fakeData;
};

export default sandboxOf(LineChartComponent, {
  imports: [
    MatIconModule,
    MatTooltipModule
  ],
  providers: [
    {provide: TIME_UTILS, useClass: TimeUtilsImpl},
  ]
})
  .add('Highcharts Line Chart', {
    template: `
      <app-line-chart [data]="data" [widget]="widget"></app-line-chart>
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
      </tr>
      <tr>
        <td><input id="instance" value="1" placeholder="instance" type="number"></td>
        <td><input id="measure" value="10" placeholder="measure" type="number"></td>
        <td><button (click)="onReload()"> Run</button></td>
      </tr>
      </table>
    `,
    context: {
      data,
      widget,
      onReload() {
        const instanceFake = $('#instancefake').val() ? parseInt($('#instancefake').val().toString()) : 10;
        const measureFake = $('#measurefake').val() ? parseInt($('#measurefake').val().toString()) : 10;
        const instance = $('#instance').val() ? parseInt($('#instance').val().toString()) : 10;
        const measure = $('#measure').val() ? parseInt($('#measure').val().toString()) : 10;
        const dataPoint = $('#dataPoint').val() ? parseInt($('#dataPoint').val().toString()) : 400;
        const fakeData = generateData(instanceFake, measureFake, instance, measure, dataPoint);
        const t2 = performance.now();
        converter = new HighchartsDataConverterFactory(realtimeProcessor, new TimeUtilsImpl()).createLineConverter(widget, {});
        data = converter.convert(fakeData);
        const t3 = performance.now();
        console.log('Convert: ', Math.floor(t3 - t2) + 'ms');
        this.data = [...data];
      }
    }
  })
  .add('Highcharts Line With Focus Chart', {
    template: `
      <app-line-chart [data]="data" [widget]="widget"></app-line-chart>
    `,
    context: {
      data,
      widget: brushWidget,
    }
  })
  .add('Highcharts Trend-diff Chart', {
    template: `
      <app-line-chart [data]="data" [widget]="widget"></app-line-chart>
      <table>
      <tr>
        <td>Fake instance</td>
        <td>Fake measure</td>
        <td>Data point</td>
        <td>Day trenddiff</td>
      </tr>
      <tr>
        <td><input id="instance" value="1" placeholder="instance" type="number"></td>
        <td><input id="measure" value="10" placeholder="measure" type="number"></td>
        <td><input id="dataPoint" value="400" placeholder="dataPoint" type="number"></td>
        <td><input id="daytrenddiff" value="5" placeholder="day trenddiff" type="number"></td>
        <td><button (click)="onReload()"> Run</button></td>
      </tr>
      </table>
    `,
    context: {
      data,
      widget: trendDiffWidget,
      onReload() {
        const instance = $('#instance').val() ? parseInt($('#instance').val().toString()) : 10;
        const measure = $('#measure').val() ? parseInt($('#measure').val().toString()) : 10;
        const dataPoint = $('#dataPoint').val() ? parseInt($('#dataPoint').val().toString()) : 400;
        const dayTrenddiff = ($('#daytrenddiff').val() ? parseInt($('#daytrenddiff').val().toString()) : 5) - 1;
        const fakeData = generateData(instance, measure, 1, 1, dataPoint, dayTrenddiff);
        let min = fakeData[0].measureTimestamp;
        let max = fakeData[0].measureTimestamp;
        fakeData.forEach(item => {
          if (item.measureTimestamp < min) {
            min = item.measureTimestamp;
          }
          if (item.measureTimestamp > max) {
            max = item.measureTimestamp;
          }
        });
        const t2 = performance.now();
        const options = {mainTimeRange: {startTimestamp: min, endTimestamp: max}};
        converter = new HighchartsDataConverterFactory(realtimeProcessor, new TimeUtilsImpl())
          .createTrendDiffConverter(trendDiffWidget, options);
        data = converter.convert(fakeData);
        const t3 = performance.now();
        console.log('Convert: ', Math.floor(t3 - t2) + 'ms');
        this.data = [...data];
      }
    }
  });
