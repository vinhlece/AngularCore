import {FlexLayoutModule} from '@angular/flex-layout';
import {ReactiveFormsModule} from '@angular/forms';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatChipsModule, MatExpansionModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatRadioModule,
  MatSelectModule
} from '@angular/material';
import {sandboxOf} from 'angular-playground';
import {ColorPickerModule} from 'ngx-color-picker';
import * as mockPackages from '../../../../common/testing/mocks/mockPackages';
import {mockBarWidget, mockDataTypes} from '../../../../common/testing/mocks/widgets';
import {BreakpointThresholdColorsComponent} from '../breakpoint-threshold-colors/breakpoint-threshold-colors.component';
import {GaugeThresholdComponent} from '../breakpoint-threshold-input/breakpoint-threshold-input.component';
import {BreakpointThresholdValuesComponent} from '../breakpoint-threshold-values/breakpoint-threshold-values.component';
import {ChartTypeInputComponent} from '../chart-type-input/chart-type-input.component';
import {CheckboxComponent} from '../checkbox/checkbox.component';
import {ColorInputComponent} from '../color-input/color-input.component';
import {ColumnEditorComponent} from '../column-editor/column-editor.component';
import {ColumnsSettingsComponent} from '../columns-settings/columns-settings.component';
import {DataTypeInputComponent} from '../data-type-input/data-type-input.component';
import {DescriptionComponent} from '../description/description.component';
import {DisplayDataComponent} from '../display-data/display-data.component';
import {DisplayModeSelectionComponent} from '../display-mode-selection/display-mode-selection.component';
import {EditWidgetFormComponent} from '../edit-widget-form/edit-widget-form.component';
import {NumberInputComponent} from '../number-input/number-input.component';
import {RadioButtonsComponent} from '../radio-buttons/radio-buttons.component';
import {SelectionPanelComponent} from '../selection-panel/selection-panel.component';
import {StateColorInputComponent} from '../state-color-input/state-color-input.component';
import {ThresholdColorInputComponent} from '../threshold-color-input/threshold-color-input.component';
import {ThresholdLineInputComponent} from '../threshold-line-input/threshold-line-input.component';
import {TextInputComponent} from '../../../../layout/components/text-input/text-input.component';
import {WidgetSizeInputComponent} from '../widget-size-input/widget-size-input.component';
import {EditBarWidgetFormComponent} from './edit-bar-widget-form.component';
import {MeasureInputComponent} from '../measure-input/measure-input.component';
import {InstanceInputComponent} from '../instance-input/instance-input.component';
import {SelectionComponent} from '../selection/selection.component';
import {FontConfigComponent} from '../font-config/font-config.component';
import {SankeyNodesComponent} from '../sankey-nodes/sankey-nodes.component';
import {UrlsInputComponent} from '../urls-input/urls-input.component';
import {SankeyNodeComponent} from '../sankey-nodes/sankey-node/sankey-node.component';
import {UrlInputComponent} from '../urls-input/url-input/url-input.component';

export default sandboxOf(EditBarWidgetFormComponent, {
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
  .add('Edit bar widget form', {
    template: `
    <app-edit-bar-widget-form
      [widget]="widget"
      [dataTypes]="dataTypes"
      [measures]="measures"
    ></app-edit-bar-widget-form>
  `,
    context: {
      widget: mockBarWidget(),
      dataTypes: mockDataTypes(),
      measures: mockPackages.getAllMeasureByDataType('Queue Performance'),
      instances: ['New sales']
    }
  });
