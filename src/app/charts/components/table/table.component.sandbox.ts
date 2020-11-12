import {TableComponent} from './table.component';
import {mockTabularWidget} from '../../../common/testing/mocks/widgets';
import {DataDisplayType, WidgetThresholdColor} from '../../../widgets/models/enums';
import {sandboxOf} from 'angular-playground';
import {AgGridModule} from 'ag-grid-angular';
import {MatAutocompleteModule, MatIconModule, MatInputModule, MatSelectModule} from '@angular/material';
import {TableCellRendererComponent} from '../table-cell-renderer/table-cell-renderer.component';
import {RAW_DATA} from '../../testData/rawDataTest';
import {HighchartsDataConverterFactory} from '../../../realtime/services/converters/factory';
import {SandBoxFormulaMeasureFactory} from '../../../measures/services/formula/formula-measure.service';
import {RealTimeDataProcessorImpl} from '../../../realtime/services/real-time-data-processor.service';
import {TabularWidget} from '../../../widgets/models/index';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {TabularCellComponent} from '../tabular-cell/tabular-cell.component';
import {RangeSelectorComponent} from '../range-selector/range-selector.component';
import {HeaderRendererComponent} from '../header-renderer/header-renderer.component';
import {getCurrentMoment, TimeUtilsImpl} from '../../../common/services/timeUtils';
import {GroupCellRendererComponent} from '../group-cell-renderer/group-cell-renderer.component';
import {appConfig} from '../../../config/app.config';
import {generateData} from '../line-chart/line-chart.component.sandbox';
import {isNullOrUndefined} from 'util';
import {generate} from 'rxjs/index';

let tabularWidget: TabularWidget = {
  ...mockTabularWidget(),
  columns: [],
  thresholdColor: {
    greater: WidgetThresholdColor.Green,
    lesser: WidgetThresholdColor.Red
  },
  showAllData: false,
  measures: [],
  instances: [],
  customTimeRange: null,
  flashing: true,
  hideIcon: false,
  paging: {
    size: 100,
    index: 0
  },
  displayData: DataDisplayType.EndOfTimeline
};
let isGroup = true;
appConfig.performanceLogging = true;
const rawData = RAW_DATA.map(item => { return {...item, dataType: tabularWidget.dataType}; });
function getData() {
  const instanceFake = $('#instancefake').val() ? parseInt($('#instancefake').val().toString()) : 10;
  const measureFake = $('#measurefake').val() ? parseInt($('#measurefake').val().toString()) : 10;
  const instanceInput = $('#instance').val() ? parseInt($('#instance').val().toString()) : 10;
  const measureInput = $('#measure').val() ? parseInt($('#measure').val().toString()) : 10;
  const dataPoint = $('#dataPoint').val() ? parseInt($('#dataPoint').val().toString()) : 400;
  isGroup = $('#isgroup').is(':checked');
  tabularWidget = updateWidget(tabularWidget, instanceInput, measureInput, isGroup);
  let fakeData = generateFakeData(instanceFake, measureFake, dataPoint, isGroup);

  const t1 = performance.now();
  const data = new HighchartsDataConverterFactory(new RealTimeDataProcessorImpl(new SandBoxFormulaMeasureFactory()), new TimeUtilsImpl())
    .createTabularConverter(tabularWidget, {})
    .convert(fakeData);
  console.log('Convert: ', Math.floor(performance.now() - t1) + 'ms');
  fakeData = [];
  return data;
}

function generateFakeData(fakeInstances: number, fakeMeasures: number, datapoint: number, group: boolean) {
  const fakeData2 = [];
  let measureTimestamp = +getCurrentMoment().startOf('day');
  const temp = group ? fakeMeasures + 5 : fakeMeasures + 2;
  for (let x = 0; x < fakeInstances; x++) {
    const instance = tabularWidget.instances[x];
    for (let y = 0; y < temp; y++) {
      const measure = tabularWidget.measures[y] ? tabularWidget.measures[y] : 'measure' + y;
      if (isNullOrUndefined(measure) || isNullOrUndefined(checkSpecialMeasure(measure))) {
        for (let i = 0; i < datapoint; i++) {
          const measureValue = Math.floor(Math.random() * Math.floor(15));
          measureTimestamp = measureTimestamp + 3600;
          const fakeDataPoint = {
            instance,
            measureName: measure,
            measureValue,
            measureTimestamp,
            dataType: tabularWidget.dataType
          };
          fakeData2.push(fakeDataPoint);
        }
      }
    }
  }

  return fakeData2;
}

function checkSpecialMeasure(item) {
  const defaultMeasures = ['Key', 'MeasureTimestamp', 'Agent', 'Queue', 'Region'];
  return defaultMeasures.find(measure => measure === item);
}

function updateWidget (widget: TabularWidget, widgetInstances: number, widgetMeasures: number, group: boolean) {
  const instances = [];
  let measures = [];
  let columns = [];

  if (group) {
    measures = ['Key', 'MeasureTimestamp', 'Agent', 'Queue', 'Region'];
    columns = [
      {id: 'Key', title: 'Instance', type: 'string', visibility: true},
      {id: 'Agent', title: 'Agent', type: 'string', visibility: true, group: {enable: true, priority: 0}},
      {id: 'Queue', title: 'Queue', type: 'string', visibility: true, group: {enable: true, priority: 1}},
      {id: 'Region', title: 'Region', type: 'string', visibility: true, group: {enable: true, priority: 2}},
      {id: 'MeasureTimestamp', title: 'Package Timestamp', type: 'datetime', visibility: true}
    ];
    for (let x = 0; x < widgetInstances; x++) {
      const instance = 'instance' + x + ',Sales,US';
      instances.push(instance);
    }
  } else {
    measures = ['Key', 'MeasureTimestamp'];
    columns = [
      {id: 'Key', title: 'Instance', type: 'string', visibility: true},
      {id: 'MeasureTimestamp', title: 'Package Timestamp', type: 'datetime', visibility: true}
    ];
    for (let x = 0; x < widgetInstances; x++) {
      const instance = 'instance' + x;
      instances.push(instance);
    }
  }

  for (let y = 0; y < widgetMeasures; y++) {
    const measure = 'measure' + y;
    measures.push(measure);
  }

  const isExist = (id: string) => columns.find(column => column.id === id);

  measures.forEach(measure => {
    if (isNullOrUndefined(isExist(measure))) {
      const column = {id: measure, title: measure, type: 'number', visibility: true};
      columns.push(column);
    }
  });

  widget = {
    ...widget,
    instances,
    measures,
    columns
  }
  return widget;
}

export default sandboxOf(TableComponent, {
  imports: [
    AgGridModule.withComponents([TableCellRendererComponent]),
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule
  ],
  declarations: [
    TableComponent,
    TabularCellComponent,
    RangeSelectorComponent,
    TableCellRendererComponent,
    HeaderRendererComponent,
    GroupCellRendererComponent
    // TimeRangeSettingComponent,
  ],
  entryComponents: [
    HeaderRendererComponent,
    GroupCellRendererComponent
  ]
})
  .add('Ag Table - should show data with converter', {
    template: `<app-table-component
              [widget]="widget" [data]="data" [size]="{height: 900}"></app-table-component>`,
    context: {
      widget: tabularWidget,
      data: getData()
    }
  })
  .add('Ag Table - should show large data with converter for performance testing', {
    template: `<app-table-component
              [widget]="widget" [data]="data" [size]="{height: 800}"></app-table-component>
              <table>
                 <tr>
                  <td>Fake instance</td>
                  <td>Fake measure</td>
                  <td>Data point</td>
                </tr>
                <tr>
                  <td><input id="instancefake" value="10" placeholder="instance" type="number"></td>
                  <td><input id="measurefake" value="10" placeholder="measure" type="number"></td>
                  <td><input id="dataPoint" value="400" placeholder="total data point" type="number"></td>
                </tr>
                <tr>
                  <td>Widget instance</td>
                  <td>Widget measure</td>
                </tr>
                <tr>
                  <td><input id="instance" value="10" placeholder="instance" type="number"></td>
                  <td><input id="measure" value="10" placeholder="measure" type="number"></td>
                </tr>
                <tr>
                  <td>Group</td>
                </tr>
                <tr>
                  <td><input id="isgroup" type="checkbox"></td>
                  <td><button (click)="onReload()"> Run</button></td>
                </tr>
              </table>`,
    context: {
      widget: tabularWidget,
      data: getData(),
      onReload() {
        this.data = getData();
        this.widget = {...tabularWidget};
      }
    }
  })
  .add('Ag Table - should show latest and previous data', {
    template: `<app-table-component [widget]="widget" [data]="data"></app-table-component>`,
    context: {
      widget: tabularWidget,
      data: getData()
    }
  });
