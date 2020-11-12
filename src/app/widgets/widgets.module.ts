import {CdkTableModule} from '@angular/cdk/table';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';
import {ColorPickerModule} from 'ngx-color-picker';
import {ChartsModule} from '../charts/charts.module';
import {LayoutModule} from '../layout/layout.module';
import {HighchartsDataConverterFactory} from '../realtime/services/converters/factory';
import {DataSourceFactoryImpl} from '../realtime/services/datasource/factory';
import {SampleRealTimeDataService} from '../realtime/services/fake/sample-real-time-data.service';
import {RealTimeDataProcessorImpl} from '../realtime/services/real-time-data-processor.service';
import {DATA_CONVERTER_FACTORY, DATA_SOURCE_FACTORY, REAL_TIME_DATA_PROCESSOR} from '../realtime/services/tokens';
import {AuthenticatedGuardService} from '../user/services/auth/authenticated-guard.service';
import {DraggableMetricsComponent} from './components/draggable-metrics/draggable-metrics.component';
import {DraggableWidgetComponent} from './components/draggable-widget/draggable-widget.component';
import {EditWidgetNavComponent} from './components/edit-widget-nav';
import {AddWidgetFormComponent} from './components/forms/add-widget-form';
import {BreakpointThresholdColorsComponent} from './components/forms/breakpoint-threshold-colors/breakpoint-threshold-colors.component';
import {GaugeThresholdComponent} from './components/forms/breakpoint-threshold-input/breakpoint-threshold-input.component';
import {BreakpointThresholdValuesComponent} from './components/forms/breakpoint-threshold-values/breakpoint-threshold-values.component';
import {ChartTypeInputComponent} from './components/forms/chart-type-input/chart-type-input.component';
import {CheckboxComponent} from './components/forms/checkbox/checkbox.component';
import {ColorInputComponent} from './components/forms/color-input/color-input.component';
import {ColumnEditorComponent} from './components/forms/column-editor/column-editor.component';
import {ColumnsSettingsComponent} from './components/forms/columns-settings/columns-settings.component';
import {DataTypeInputComponent} from './components/forms/data-type-input/data-type-input.component';
import {DescriptionComponent} from './components/forms/description/description.component';
import {DisplayDataComponent} from './components/forms/display-data/display-data.component';
import {DisplayModeSelectionComponent} from './components/forms/display-mode-selection/display-mode-selection.component';
import {EditBarWidgetFormComponent} from './components/forms/edit-bar-widget-form/edit-bar-widget-form.component';
import {EditBillboardWidgetFormComponent} from './components/forms/edit-billboard-widget-form/edit-billboard-widget-form.component';
import {EditLiquidFillGaugeWidgetFormComponent} from './components/forms/edit-liquid-fill-gauge-widget-form/edit-liquid-fill-gauge-widget-form.component';
import {EditCallTimeLineWidgetFormComponent} from './components/forms/edit-call-time-line-widget-form/edit-call-time-line-widget-form.component';
import {EditGeoMapFormComponent} from './components/forms/edit-geo-map-widget-form/edit-geo-map-widget-form.component';
import {EditLineWidgetFormComponent} from './components/forms/edit-line-widget-form/edit-line-widget-form.component';
import {EditSankeyWidgetFormComponent} from './components/forms/edit-sankey-widget-form/edit-sankey-widget-form.component';
import {EditSolidGaugeWidgetFormComponent} from './components/forms/edit-solid-gauge-widget-form/edit-solid-gauge-widget-form.component';
import {EditSunburstWidgetFormComponent} from './components/forms/edit-sunburst-widget-form/edit-sunburst-widget-form.component';
import {EditTabularWidgetFormComponent} from './components/forms/edit-tabular-widget-form/edit-tabular-widget-form.component';
import {EditTrendDiffWidgetFormComponent} from './components/forms/edit-trend-diff-widget-form/edit-trend-diff-widget-form.component';
import {EditWidgetFormComponent} from './components/forms/edit-widget-form/edit-widget-form.component';
import {InstanceInputComponent} from './components/forms/instance-input/instance-input.component';
import {MeasureInputComponent} from './components/forms/measure-input/measure-input.component';
import {NumberInputComponent} from './components/forms/number-input/number-input.component';
import {RadioButtonsComponent} from './components/forms/radio-buttons/radio-buttons.component';
import {SelectionPanelComponent} from './components/forms/selection-panel/selection-panel.component';
import {StateColorInputComponent} from './components/forms/state-color-input/state-color-input.component';
import {ThresholdColorInputComponent} from './components/forms/threshold-color-input/threshold-color-input.component';
import {ThresholdLineInputComponent} from './components/forms/threshold-line-input/threshold-line-input.component';
import {WidgetSizeInputComponent} from './components/forms/widget-size-input/widget-size-input.component';
import {WidgetTypeInputComponent} from './components/forms/widget-type-input/widget-type-input.component';
import {SideBarItemComponent} from './components/side-bar-item/side-bar-item.component';
import {SideBarComponent} from './components/side-bar/side-bar.component';
import {WidgetListComponent} from './components/widget-list';
import {AddWidgetContainer} from './containers/add-widget/add-widget.container';
import {DraggableMetricsContainer} from './containers/draggable-metrics/draggable-metrics.container';
import {EditBarWidgetContainer} from './containers/edit-widget/edit-bar-widget/edit-bar-widget.container';
import {EditBillboardWidgetContainer} from './containers/edit-widget/edit-billboard-widget/edit-billboard-widget.container';
import {
  EditLiquidFillGaugeWidgetContainer} from './containers/edit-widget/edit-liquid-fill-gauge-widget/edit-liquid-fill-gauge-widget.container';
import {EditCallTimeLineWidgetContainer} from './containers/edit-widget/edit-call-time-line-widget/edit-call-time-line-widget.container';
import {EditGeoMapWidgetContainer} from './containers/edit-widget/edit-geo-map-widget/edit-geo-map-widget.container';
import {EditLineWidgetContainer} from './containers/edit-widget/edit-line-widget/edit-line-widget.container';
import {EditTabularWidgetContainer} from './containers/edit-widget/edit-tabular-widget/edit-tabular-widget.container';
import {EditSankeyWidgetContainer} from './containers/edit-widget/edit-sankey-widget/edit-sankey-widget.container';
import {EditSolidGaugeWidgetContainer} from './containers/edit-widget/edit-solid-gauge-widget/edit-solid-gauge-widget.container';
import {EditSunburstWidgetContainer} from './containers/edit-widget/edit-sunburst-widget/edit-sunburst-widget.container';
import {EditTrendDiffLineWidgetContainer} from './containers/edit-widget/edit-trend-diff-line-widget/edit-trend-diff-line-widget.container';
import {FilterableWidgetListContainer} from './containers/filterable-widget-list';
import {SideBarItemContainer} from './containers/side-bar-item/side-bar-item.container';
import {SideBarContainer} from './containers/side-bar/side-bar.container';
import {InstancesEffects} from './effects/instances.effects';
import {SearchEffects} from './effects/search.effects';
import {WidgetsEffects} from './effects/widgets.effects';
import {reducers} from './reducers';
import {WidgetService} from './services/http/widgets.service';
import {DRAGGABLE_SERVICE, SEARCH_DEBOUNCE_TIME, WIDGETS_FACTORY} from './services/tokens';
import {DraggableServiceImpl} from './services/ui/draggable.service';
import {WidgetsFactoryImpl} from './services/widgets.factory';
import {DataConfigFactory} from './utils/data-config-factory';
import {SelectionComponent} from './components/forms/selection/selection.component';
import {FontConfigComponent} from './components/forms/font-config/font-config.component';
import {SankeyNodeComponent} from './components/forms/sankey-nodes/sankey-node/sankey-node.component';
import {SankeyNodesComponent} from './components/forms/sankey-nodes/sankey-nodes.component';
import {UrlsInputComponent} from './components/forms/urls-input/urls-input.component';
import {UrlInputComponent} from './components/forms/urls-input/url-input/url-input.component';
import {MatMomentDateModule} from '@angular/material-moment-adapter';

// tslint:disable:max-line-length
import {AutoInvokeUrlColorComponent} from './components/forms/breakpoint-threshold-colors/auto-invoke-url-color/auto-invoke-url-color.component';
import {SideBarEditorContainer} from './containers/side-bar-editor/side-bar-editor-container';
import { TimeRangeComponent } from './components/forms/time-range/time-range.component';
import { TimeRangeIntervalComponent } from './components/forms/time-range-interval/time-range-interval.component';
import { DatePickerComponent } from './components/forms/date-picker/date-picker.component';
import { InputRangeComponent } from './components/forms/input-range/input-range.component';
import { CheckboxListComponent } from './components/forms/checkbox-list/checkbox-list.component';
import {OwlDateTimeModule} from 'ng-pick-datetime';
import { DateTimePickerComponent } from './components/forms/date-time-picker/date-time-picker.component';
import {OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE} from 'ng-pick-datetime';
import {OwlMomentDateTimeModule} from 'ng-pick-datetime-moment';
import { NewSideBarComponent } from './components/new-side-bar/new-side-bar.component';
import { ConfigureWidgetComponent } from './components/forms/configure-widget/configure-widget.component';
import {NewSideBarContainer} from './containers/new-side-bar/new-side-bar.container';
import { DataDialogComponent } from './components/forms/data-dialog/data-dialog.component';
import {NewDialogWithDataComponent} from './components/forms/common/new-dialog-with-data.component';
import { GaugeValueComponent } from './components/forms/gauge-value/gauge-value.component';
import {ChartStyleComponent} from './components/forms/chart-style/chart-style.component';
import {OldBreakpointThresholdValuesComponent} from './components/forms/old-breakpoint-threshold-values/old-breakpoint-threshold-values.component';
import {OldBreakpointThresholdColorsComponent} from './components/forms/old-breakpoint-threshold-colors/old-breakpoint-threshold-colors.component';
import {OldGaugeThresholdComponent} from './components/forms/old-breakpoint-threshold-input/old-breakpoint-threshold-input.component';
import {SideBarAppearanceContainer} from './containers/side-bar-appearance/side-bar-appearance.container';
import {EditWidgetDialogComponent} from './components/edit-widget-dialog/edit-widget-dialog.component';
import {ItemFilterComponent} from './components/forms/item-filter/item-filter.component';
import {WidgetItemsComponent} from './components/forms/widget-items/widget-items.component';
import {DimensionFilterComponent} from './components/forms/dimension-filter/dimension-filter.component';
import {DimensionFilterContainer} from './containers/dimension-filter/dimension-filter.container';
import {TitlePositionComponent} from './components/forms/title-position/title-position.component';
import {TranslateModule} from '@ngx-translate/core';
import {EditLabelWidgetFormComponent} from './components/forms/edit-label-widget-form/edit-label-widget-form.component';
import {EditLabelWidgetContainer} from './containers/edit-widget/edit-label-widget/edit-label-widget.container';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatRadioModule } from '@angular/material/radio';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatInputModule} from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {ChangeWidgetTypeDialogComponent} from './components/forms/change-widget-type-dialog/change-widget-type-dialog.component';
import {ChangeTypeDialogComponent} from './components/forms/common/change-type-dialog';
import { EditBubbleWidgetContainer } from './containers/edit-widget/edit-bubble-widget/edit-bubble-widget.container';
import { EditBubbleWidgetFormComponent } from './components/forms/edit-bubble-widget-form/edit-bubble-widget-form.component';
import {EditEventViewerWidgetFormComponent} from './components/forms/edit-event-viewer-widget-form/edit-event-viewer-widget-form.component';
import {EditEventViewerWidgetContainer} from './containers/edit-widget/edit-event-viewer-widget/edit-event-viewer-widget.container';
import { HideKpiComponent } from './components/forms/hide-kpi/hide-kpi.component';
import {ThemeModule} from '../theme/theme.module';
import {ListChartIconComponent} from './components/forms/list-chart-icon/list-chart-icon.component';
import { EditWidgetFormExpandComponent } from './components/forms/edit-widget-form-expand/edit-widget-form-expand.component';
import { EditWidgetExpandContentComponent } from './components/forms/edit-widget-form-expand/edit-widget-expand-content/edit-widget-expand-content.component';
import { StackSettingsComponent } from './components/forms/stack-settings/stack-settings.component';
import {DataPickerChipComponent} from './components/data-picker-chip/data-picker-chip.component';

export const MOMENT_FORMATS = {
  parseInput: 'L LTS',
  fullPickerInput: 'L LTS',
  datePickerInput: 'L',
  timePickerInput: 'LTS',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY',
};

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    FlexLayoutModule,
    CdkTableModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatMenuModule,
    MatListModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatSidenavModule,
    MatChipsModule,
    MatRadioModule,
    MatExpansionModule,
    LayoutModule,
    ChartsModule,
    ColorPickerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule,
    MatTabsModule, MatTooltipModule,
    OwlDateTimeModule,
    OwlMomentDateTimeModule,
    RouterModule.forChild([
      {path: 'widgets/new', component: AddWidgetContainer, canActivate: [AuthenticatedGuardService]},
      {path: 'widgets', component: FilterableWidgetListContainer, canActivate: [AuthenticatedGuardService]},
      {path: 'widgets/:id/edit', component: EditWidgetNavComponent, canActivate: [AuthenticatedGuardService]},
    ]),
    StoreModule.forFeature('widgets', reducers),
    EffectsModule.forFeature([
      WidgetsEffects,
      SearchEffects,
      InstancesEffects
    ]),
    TranslateModule,
    ThemeModule
  ],
  exports: [
    AddWidgetContainer,
    EditBarWidgetContainer,
    FilterableWidgetListContainer,
    WidgetListComponent,
    AddWidgetFormComponent,
    EditWidgetNavComponent,
    EditTabularWidgetFormComponent,
    SideBarContainer,
    EditTrendDiffLineWidgetContainer,
    EditBillboardWidgetContainer,
    EditLiquidFillGaugeWidgetContainer,
    EditCallTimeLineWidgetContainer,
    SideBarEditorContainer,
    TimeRangeComponent,
    CheckboxListComponent,
    DescriptionComponent,
    DateTimePickerComponent,
    NewSideBarContainer,
    ColorInputComponent,
    ListChartIconComponent
  ],
  declarations: [
    AddWidgetContainer,
    EditBarWidgetContainer,
    EditLineWidgetContainer,
    FilterableWidgetListContainer,
    WidgetListComponent,
    EditWidgetNavComponent,
    AddWidgetFormComponent,
    EditWidgetFormComponent,
    EditBarWidgetFormComponent,
    EditLineWidgetFormComponent,
    EditSolidGaugeWidgetFormComponent,
    BreakpointThresholdValuesComponent,
    BreakpointThresholdColorsComponent,
    GaugeThresholdComponent,
    WidgetSizeInputComponent,
    WidgetTypeInputComponent,
    DataTypeInputComponent,
    ChartTypeInputComponent,
    ColorInputComponent,
    StateColorInputComponent,
    SelectionPanelComponent,
    ColumnEditorComponent,
    ColumnsSettingsComponent,
    DisplayDataComponent,
    DisplayModeSelectionComponent,
    TitlePositionComponent,
    RadioButtonsComponent,
    DescriptionComponent,
    EditTabularWidgetFormComponent,
    EditSolidGaugeWidgetContainer,
    SideBarComponent,
    SideBarContainer,
    MeasureInputComponent,
    InstanceInputComponent,
    DraggableWidgetComponent,
    SideBarItemComponent,
    SideBarItemContainer,
    EditTrendDiffWidgetFormComponent,
    EditTrendDiffLineWidgetContainer,
    EditBillboardWidgetFormComponent,
    EditBillboardWidgetContainer,
    EditLiquidFillGaugeWidgetContainer,
    EditLiquidFillGaugeWidgetFormComponent,
    EditSankeyWidgetFormComponent,
    EditSankeyWidgetContainer,
    ThresholdColorInputComponent,
    NumberInputComponent,
    CheckboxComponent,
    DraggableMetricsComponent,
    DraggableMetricsContainer,
    EditGeoMapFormComponent,
    EditGeoMapWidgetContainer,
    ThresholdLineInputComponent,
    EditTabularWidgetContainer,
    EditSunburstWidgetFormComponent,
    EditSunburstWidgetContainer,
    EditCallTimeLineWidgetFormComponent,
    EditCallTimeLineWidgetContainer,
    SelectionComponent,
    FontConfigComponent,
    SankeyNodeComponent,
    SankeyNodesComponent,
    UrlsInputComponent,
    UrlInputComponent,
    AutoInvokeUrlColorComponent,
    SideBarEditorContainer,
    TimeRangeComponent,
    TimeRangeIntervalComponent,
    DatePickerComponent,
    InputRangeComponent,
    CheckboxListComponent,
    DateTimePickerComponent,
    GaugeValueComponent,
    NewSideBarComponent,
    NewSideBarContainer,
    ConfigureWidgetComponent,
    DataDialogComponent,
    NewDialogWithDataComponent,
    ChartStyleComponent,
    OldBreakpointThresholdValuesComponent,
    OldBreakpointThresholdColorsComponent,
    OldGaugeThresholdComponent,
    SideBarAppearanceContainer,
    EditWidgetDialogComponent,
    ItemFilterComponent,
    WidgetItemsComponent,
    DimensionFilterComponent,
    DimensionFilterContainer,
    EditLabelWidgetContainer,
    EditLabelWidgetFormComponent,
    ChangeWidgetTypeDialogComponent,
    ChangeTypeDialogComponent,
    EditBubbleWidgetContainer,
    EditBubbleWidgetFormComponent,
    EditEventViewerWidgetContainer,
    EditEventViewerWidgetFormComponent,
    HideKpiComponent,
    ListChartIconComponent,
    StackSettingsComponent,
    EditWidgetFormExpandComponent,
    EditWidgetExpandContentComponent,
    DataPickerChipComponent
  ],
  entryComponents: [
    DraggableMetricsContainer,
    NewDialogWithDataComponent,
    EditWidgetDialogComponent,
    ChangeTypeDialogComponent
  ],
  providers: [
    MatDatepickerModule,
    WidgetService,
    AuthenticatedGuardService,
    DataConfigFactory,
    SampleRealTimeDataService,
    {
      provide: DATA_CONVERTER_FACTORY,
      useClass: HighchartsDataConverterFactory
    },
    {
      provide: DATA_SOURCE_FACTORY,
      useClass: DataSourceFactoryImpl
    },
    {
      provide: REAL_TIME_DATA_PROCESSOR,
      useClass: RealTimeDataProcessorImpl
    },
    {
      provide: DRAGGABLE_SERVICE,
      useClass: DraggableServiceImpl
    },
    {
      provide: WIDGETS_FACTORY,
      useClass: WidgetsFactoryImpl
    },
    {
      provide: SEARCH_DEBOUNCE_TIME,
      useValue: 500
    },
    {provide: OWL_DATE_TIME_FORMATS, useValue: MOMENT_FORMATS},
    {provide: OWL_DATE_TIME_LOCALE, useValue: 'en-gb'}
  ]
})
export class WidgetsModule {
}
