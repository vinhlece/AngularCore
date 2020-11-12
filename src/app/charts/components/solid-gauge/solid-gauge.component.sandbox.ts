import {MatButtonModule, MatIconModule, MatSelectModule, MatTooltipModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {sandboxOf} from 'angular-playground';
import {mockSolidGaugeWidget} from '../../../common/testing/mocks/widgets';
import {DisplayModeSwitcherComponent} from '../display-mode-switcher/display-mode-switcher.component';
import {SolidGaugeComponent} from './solid-gauge.component';
import {ValueLabelComponent} from '../value-label/value-label.component';
import {FitTextDirective} from '../../../layout/components/fit-text/fit-text.directive';
let stopIntv = null;
import {DisplayModeSelectComponent} from '../display-mode-select/display-mode-select.component';
import {generateData} from '../line-chart/line-chart.component.sandbox';
import {SandBoxFormulaMeasureFactory} from '../../../measures/services/formula/formula-measure.service';
import {Widget} from '../../../widgets/models/index';
import {TimeUtilsImpl} from '../../../common/services/timeUtils';
import {HighchartsDataConverterFactory} from '../../../realtime/services/converters/factory';
import {ChartDataConverterService} from '../../../realtime/services/converters/index';
import {TIME_UTILS} from '../../../common/services/tokens';
import {RealTimeDataProcessorImpl} from '../../../realtime/services/real-time-data-processor.service';

const count = 0;
const dataPoint = [{
  name: 'Speed',
  data: [count],
}];
let widget = mockSolidGaugeWidget();
const processor = new RealTimeDataProcessorImpl(new SandBoxFormulaMeasureFactory());
export default sandboxOf(SolidGaugeComponent, {
  imports: [
    BrowserAnimationsModule,
    MatTooltipModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule
  ],
  declarations: [
    DisplayModeSwitcherComponent,
    ValueLabelComponent,
    FitTextDirective,
    SolidGaugeComponent,
    DisplayModeSelectComponent
  ],
  providers: [
    {provide: TIME_UTILS, useClass: TimeUtilsImpl},
  ]
})
  .add('Solid gauge', {
    template: `<app-solid-gauge
                   [widget]="widget"
                   [data]="data"
                   [size]="{height: 512}"
  ></app-solid-gauge>
  <div style="text-align: center">
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
        <td><button (click)="onReload()"> Run</button></td>
      </tr>
      </table>
  </div>`,
    context: {
      widget,
      data: dataPoint,
      onReload() {
        const instanceFake = $('#instancefake').val() ? parseInt($('#instancefake').val().toString()) : 10;
        const measureFake = $('#measurefake').val() ? parseInt($('#measurefake').val().toString()) : 10;
        const instance = $('#instance').val() ? parseInt($('#instance').val().toString()) : 10;
        const measure = $('#measure').val() ? parseInt($('#measure').val().toString()) : 10;
        const newDataPoint = $('#dataPoint').val() ? parseInt($('#dataPoint').val().toString()) : 400;
        const fakeData = generateData(instanceFake, measureFake, instance, measure, newDataPoint, null, widget);
        const t1 = performance.now();
        const converter: ChartDataConverterService = new HighchartsDataConverterFactory(processor, new TimeUtilsImpl()).createSolidGaugeConverter(
          widget as Widget, {});
        const data = converter.convert(fakeData);
        console.log('Convert time (Solid gauge): ' + Math.floor(performance.now() - t1) + 'ms');
        this.data = [data[data.length - 1]];
        // stopIntv = setInterval(() => {
        // }, 4000);
      },
    }
  });
