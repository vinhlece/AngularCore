import {CdkTableModule} from '@angular/cdk/table';
import {CommonModule} from '@angular/common';
import {CUSTOM_ELEMENTS_SCHEMA, Injector, NgModule} from '@angular/core';
import {createCustomElement} from '@angular/elements';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import {AgGridModule} from 'ag-grid-angular';
import {DragulaModule} from 'ng2-dragula';
import {LayoutModule} from '../layout/layout.module';
import {BarChartComponent} from './components/bar-chart/bar-chart.component';
import {BillboardComponent} from './components/billboard/billboard.component';
import {EventViewerComponent} from './components/event-viewer/event-viewer.component';
import {CallTimelineComponent} from './components/call-timeline/call-timeline.component';
import {GanttCallTimelineComponent} from './components/call-timeline/gantt/gantt-call-timeline.component';
import {DisplayModeSwitcherComponent} from './components/display-mode-switcher/display-mode-switcher.component';
import {GeoMapComponent} from './components/geo-map/geo-map.component';
import {GroupCellRendererComponent} from './components/group-cell-renderer/group-cell-renderer.component';
import {HeaderRendererComponent} from './components/header-renderer/header-renderer.component';
import {LegendComponent} from './components/legend/legend.component';
import {LineChartComponent} from './components/line-chart/line-chart.component';
import {PlotLineLabelComponent} from './components/plot-line-label/plot-line-label.component';
import {RangeSelectorComponent} from './components/range-selector/range-selector.component';
import {SankeyChartComponent} from './components/sankey-chart/sankey-chart.component';
import {SolidGaugeComponent} from './components/solid-gauge/solid-gauge.component';
import {SunburstComponent} from './components/sunburst/sunburst.component';
import {TableCellRendererComponent} from './components/table-cell-renderer/table-cell-renderer.component';
import {TableComponent} from './components/table/table.component';
import {TabularCellComponent} from './components/tabular-cell/tabular-cell.component';
import {ValueLabelComponent} from './components/value-label/value-label.component';
import {PlotLineLabelContainer} from './containers/plot-line-label/plot-line-label.container';
import {CallTimelineFiterBarComponent} from './components/call-timeline/call-timeline-fiter-bar/call-timeline-fiter-bar.component';
import { DisplayModeSelectComponent } from './components/display-mode-select/display-mode-select.component';
import { LiquidFillGaugeComponent } from './components/liquid-fill-gauge/liquid-fill-gauge.component';
import {TranslateModule} from '@ngx-translate/core';
import { BubbleComponent } from './components/bubble/bubble.component';
import { EventViewerModule } from '../measure-specification/event-viewer/event-viewer.module';
import { LegendConfigurationComponent } from './components/legend-configuration/legend-configuration.component';
import {LegendDialogComponent} from './components/dialog/legend-dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    CdkTableModule,
    MatSortModule,
    FlexLayoutModule,
    MatIconModule,
    MatFormFieldModule,
    LayoutModule,
    MatPaginatorModule,
    MatInputModule,
    MatAutocompleteModule,
    DragulaModule,
    MatTooltipModule,
    AgGridModule.withComponents([TableCellRendererComponent, GroupCellRendererComponent, HeaderRendererComponent]),
    MatSelectModule,
    MatIconModule,
    MatChipsModule,
    MatProgressBarModule,
    TranslateModule,
    EventViewerModule,
    MatCheckboxModule,
    MatButtonModule
  ],
  declarations: [
    BarChartComponent,
    DisplayModeSwitcherComponent,
    LineChartComponent,
    SankeyChartComponent,
    SolidGaugeComponent,
    GeoMapComponent,
    BillboardComponent,
    EventViewerComponent,
    TabularCellComponent,
    PlotLineLabelComponent,
    PlotLineLabelContainer,
    TableComponent,
    TableCellRendererComponent,
    GroupCellRendererComponent,
    HeaderRendererComponent,
    ValueLabelComponent,
    SunburstComponent,
    GanttCallTimelineComponent,
    CallTimelineComponent,
    RangeSelectorComponent,
    LegendComponent,
    CallTimelineFiterBarComponent,
    DisplayModeSelectComponent,
    LiquidFillGaugeComponent,
    BubbleComponent,
    LegendDialogComponent,
    LegendConfigurationComponent
  ],
  exports: [
    BarChartComponent,
    LineChartComponent,
    SankeyChartComponent,
    SolidGaugeComponent,
    BillboardComponent,
    EventViewerComponent,
    GeoMapComponent,
    TableComponent,
    SunburstComponent,
    CallTimelineComponent,
    LiquidFillGaugeComponent,
    BubbleComponent,
    DisplayModeSelectComponent
  ],
  entryComponents: [
    PlotLineLabelContainer,
    ValueLabelComponent,
    LegendDialogComponent,
    LegendConfigurationComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ChartsModule {
  constructor(private injector: Injector) {
    const plotLineLabel = createCustomElement(PlotLineLabelContainer, {injector});
    customElements.define('plot-line-label-container', plotLineLabel);
    const valueLabel = createCustomElement(ValueLabelComponent, {injector});
    customElements.define('value-label', valueLabel);
  }
}
