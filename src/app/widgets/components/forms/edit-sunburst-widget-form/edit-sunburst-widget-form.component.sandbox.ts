import {FlexLayoutModule} from '@angular/flex-layout';
import {ReactiveFormsModule} from '@angular/forms';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatChipsModule, MatExpansionModule,
  MatIconModule,
  MatInputModule, MatListModule,
  MatRadioModule,
  MatSelectModule
} from '@angular/material';
import {sandboxOf} from 'angular-playground';
import {ChartTypeInputComponent} from '../chart-type-input/chart-type-input.component';
import {DataTypeInputComponent} from '../data-type-input/data-type-input.component';
import {EditWidgetFormComponent} from '../edit-widget-form/edit-widget-form.component';
import {ThresholdColorInputComponent} from '../threshold-color-input/threshold-color-input.component';
import {TextInputComponent} from '../../../../layout/components/text-input/text-input.component';
import {WidgetSizeInputComponent} from '../widget-size-input/widget-size-input.component';
import {EditSunburstWidgetFormComponent} from './edit-sunburst-widget-form.component';
import {CheckboxComponent} from '../checkbox/checkbox.component';
import {DescriptionComponent} from '../description/description.component';
import {RadioButtonsComponent} from '../radio-buttons/radio-buttons.component';
import {ColumnsSettingsComponent} from '../columns-settings/columns-settings.component';
import {DisplayDataComponent} from '../display-data/display-data.component';
import {DisplayModeSelectionComponent} from '../display-mode-selection/display-mode-selection.component';
import {NumberInputComponent} from '../number-input/number-input.component';
import {GaugeThresholdComponent} from '../breakpoint-threshold-input/breakpoint-threshold-input.component';
import {StateColorInputComponent} from '../state-color-input/state-color-input.component';
import {ThresholdLineInputComponent} from '../threshold-line-input/threshold-line-input.component';
import {SelectionPanelComponent} from '../selection-panel/selection-panel.component';
import {ColumnEditorComponent} from '../column-editor/column-editor.component';
import {BreakpointThresholdColorsComponent} from '../breakpoint-threshold-colors/breakpoint-threshold-colors.component';
import {BreakpointThresholdValuesComponent} from '../breakpoint-threshold-values/breakpoint-threshold-values.component';
import {ColorInputComponent} from '../color-input/color-input.component';
import {ColorPickerModule} from 'ngx-color-picker';
import {mockDataTypes, mockMeasureNames, mockSunburstWidget} from '../../../../common/testing/mocks/widgets';
import {MeasureInputComponent} from '../measure-input/measure-input.component';
import {InstanceInputComponent} from '../instance-input/instance-input.component';
import {SelectionComponent} from '../selection/selection.component';
import {FontConfigComponent} from '../font-config/font-config.component';
import {SankeyNodeComponent} from '../sankey-nodes/sankey-node/sankey-node.component';
import {SankeyNodesComponent} from '../sankey-nodes/sankey-nodes.component';
import {UrlInputComponent} from '../urls-input/url-input/url-input.component';
import {UrlsInputComponent} from '../urls-input/urls-input.component';

export default sandboxOf(EditSunburstWidgetFormComponent, {
  imports: [
    ReactiveFormsModule,
    FlexLayoutModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatChipsModule,
    MatIconModule,
    MatRadioModule,
    MatListModule,
    ColorPickerModule,
    MatExpansionModule
  ],
  declarations: [
    EditWidgetFormComponent,
    TextInputComponent,
    WidgetSizeInputComponent,
    DataTypeInputComponent,
    ChartTypeInputComponent,
    MeasureInputComponent,
    InstanceInputComponent,
    ThresholdColorInputComponent,
    CheckboxComponent,
    DescriptionComponent,
    RadioButtonsComponent,
    ColumnsSettingsComponent,
    DisplayDataComponent,
    DisplayModeSelectionComponent,
    NumberInputComponent,
    GaugeThresholdComponent,
    StateColorInputComponent,
    ThresholdLineInputComponent,
    SelectionPanelComponent,
    ColumnEditorComponent,
    BreakpointThresholdColorsComponent,
    BreakpointThresholdValuesComponent,
    ColorInputComponent,
    SelectionComponent,
    FontConfigComponent,
    SankeyNodeComponent,
    SankeyNodesComponent,
    UrlInputComponent,
    UrlsInputComponent
  ]
})
  .add('Edit Sunburst widget form', {
    template: `
    <app-edit-sunburst-form
      [widget]="widget"
      [dataTypes]="dataTypes"
      [measures]="measures"
    ></app-edit-sunburst-form>
  `,
    context: {
      widget: mockSunburstWidget(),
      measures: mockMeasureNames('Queue', 'Performance'),
      dataTypes: mockDataTypes(),
    }
  });
