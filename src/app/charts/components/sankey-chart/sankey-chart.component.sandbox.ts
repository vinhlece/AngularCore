import {sandboxOf} from 'angular-playground';
import {HighchartsDataConverterFactory} from '../../../realtime/services/converters/factory';
import {RealTimeDataProcessorImpl} from '../../../realtime/services/real-time-data-processor.service';
import {mockSankeyWidget} from '../../../common/testing/mocks/widgets';
import {SandBoxFormulaMeasureFactory} from '../../../measures/services/formula/formula-measure.service';
import {SankeyChartComponent} from './sankey-chart.component';
import {TimeUtilsImpl} from '../../../common/services/timeUtils';
import {generate} from 'rxjs/index';
import {appConfig} from '../../../config/app.config';
const dataType = 'Queue Performance';
const measureTimestamp = 1515567600000;

const realTimeData = [
  {instance: 'Ireland,Sales', measureName: 'SaninstanceLayer1', measureTimestamp: 1515553200000, measureValue: 20, dataType},
  {instance: 'Ireland,Sales,iPhone', measureName: 'SaninstanceLayer1', measureTimestamp: 1515596400000, measureValue: 15, dataType},
  {instance: 'Ireland,Sales,iPhone,v7', measureName: 'SaninstanceLayer1', measureTimestamp: 1515596400000, measureValue: 10, dataType},
  {instance: 'Ireland,Sales,iPhone,v6', measureName: 'SaninstanceLayer1', measureTimestamp: 1515596400000, measureValue: 5, dataType},
  {instance: 'Ireland,Sales,iPad', measureName: 'SaninstanceLayer1', measureTimestamp: 1515596400000, measureValue: 5, dataType},
  {instance: 'Ireland,Sales,iPad,v7', measureName: 'SaninstanceLayer1', measureTimestamp: 1515596400000, measureValue: 1, dataType},
  {instance: 'Ireland,Sales,iPad,v6', measureName: 'SaninstanceLayer1', measureTimestamp: 1515596400000, measureValue: 4, dataType},
  {instance: 'UK,Sales', measureName: 'SaninstanceLayer2', measureTimestamp: 1515567600000, measureValue: 40, dataType},
  {instance: 'UK,Sales,iPhone', measureName: 'SaninstanceLayer2', measureTimestamp: 1515567600000, measureValue: 15, dataType},
  {instance: 'UK,Sales,iPhone,v7', measureName: 'SaninstanceLayer2', measureTimestamp: 1515567600000, measureValue: 8, dataType},
  {instance: 'UK,Sales,iPhone,v6', measureName: 'SaninstanceLayer2', measureTimestamp: 1515567600000, measureValue: 7, dataType},
  {instance: 'UK,Sales,iPad', measureName: 'SaninstanceLayer2', measureTimestamp: 1515567600000, measureValue: 25, dataType},
  {instance: 'UK,Sales,iPad,v7', measureName: 'SaninstanceLayer2', measureTimestamp: 1515567600000, measureValue: 11, dataType},
  {instance: 'UK,Sales,iPad,v6', measureName: 'SaninstanceLayer2', measureTimestamp: 1515567600000, measureValue: 14, dataType},
];
let widget = {
  ...mockSankeyWidget(),
  instances: [
    'Ireland,Sales',
    'Sales,iPhone',
    'iPhone,v7',
    'iPhone,v6',
    'Sales,iPad',
    'iPad,v7',
    'iPad,v6',
    'UK,Sales',
    'Sales,iPhone',
    'iPhone,v7',
    'iPhone,v6',
    'Sales,iPad',
    'iPad,v7',
    'iPad,v6'
  ],
  measures: ['SaninstanceLayer1', 'SaninstanceLayer2']
};

const realTimeProcessor = new RealTimeDataProcessorImpl(new SandBoxFormulaMeasureFactory());

appConfig.performanceLogging = true;
let converter = new HighchartsDataConverterFactory(realTimeProcessor, new TimeUtilsImpl()).createSankeyConverter(widget, {});
let data = converter.convert(realTimeData);

export default sandboxOf(SankeyChartComponent, {
  imports: []
})
  .add('Highcharts Sankey Chart', {
    template: `
      <app-sankey-chart [data]="data" [widget]="widget" [size]="{height: 512}"></app-sankey-chart>
      <table>
      <tr>
        <td>Fake instance</td>
        <td>Fake measure</td>
        <td>Data point</td>
      </tr>
      <tr>
        <td><input id="instancefake" value="10" placeholder="instance" type="number"></td>
        <td><input id="measurefake" value="10" placeholder="measure" type="number"></td>
        <td><input id="dataPoint" value="100" placeholder="total data point" type="number"></td>
      </tr>
      <tr>
        <td>Widget instance</td>
        <td>Widget measure</td>
      </tr>
      <tr>
        <td><input id="instance" value="5" placeholder="instance" type="number"></td>
        <td><input id="measure" value="2" placeholder="measure" type="number"></td>
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
        const fakeData = this.generateFakedata(instanceFake, measureFake, dataPoint);
        this.updateWidgetData(instance, measure);
        const t1 = performance.now();
        converter = new HighchartsDataConverterFactory(realTimeProcessor, new TimeUtilsImpl()).createSankeyConverter(widget, {});
        data = converter.convert(fakeData);
        console.log('Convert time: (Sankey)', Math.floor(performance.now() - t1) + 'ms');
        this.data = data;
      },
      generateFakedata(instanceFake: number, measureFake: number, dataPoint: number) {
        const fakeData = [];
        let measureName;
        let measureValue;
        let instance;
        for (let y = 0; y <= measureFake; y++) {
          instance = 'Instance0';
          for (let x = 1; x < instanceFake; x++) {
            instance = instance + ',Instance' + x;
            measureName = 'Measure' + y;
            measureValue = Math.floor(Math.random() * Math.floor(150));
            const fakeDataPoint = {
              instance,
              measureName,
              measureValue,
              measureTimestamp,
              dataType
            };
            fakeData.push(fakeDataPoint);
          }
        }
        const totalDatapoint = instanceFake * measureFake * dataPoint;
        for (let i = fakeData.length; i < totalDatapoint; i++) {
          instance = instance + ',Fake_Instance' + i;
          measureName = 'Fake_Measure' + i;
          measureValue = Math.floor(Math.random() * Math.floor(150));
          const fakeDataPoint = {
            instance,
            measureName,
            measureValue,
            measureTimestamp,
            dataType
          };
          fakeData.push(fakeDataPoint);
        }
        return fakeData;
      },
      updateWidgetData(instance: number, measure: number): void {
        const instances = [];
        const measures = [];
        for (let y = 0; y < measure; y++) {
          measures.push('Measure' + y);
        }
        for (let x = 0; x < instance; x++) {
          instances.push('Instance' + x + ',' + 'Instance' + (x + 1));
        }
        widget = {
          ...widget,
          instances,
          measures
        };
      }
    }
  });
