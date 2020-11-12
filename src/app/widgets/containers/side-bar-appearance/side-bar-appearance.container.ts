import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Widget} from '../../models/index';
import {WidgetType} from '../../constants/widget-types';
import {EditWidgetType} from '../../models/enums';
import {BAR_CHART_TYPES} from '../../constants/bar-chart-types';
import {BarStyleConst, LineChartTypesConst} from '../../models/constants';

@Component({
  selector: 'app-side-bar-appearance-container',
  templateUrl: './side-bar-appearance.container.html',
  styleUrls: ['./side-bar-appearance.container.scss']
})
export class SideBarAppearanceContainer {

  @Input() widget: Widget;
  readonly WIDGET_TYPES = WidgetType;
  readonly EditWidgetType = EditWidgetType;
  chartTypes = BAR_CHART_TYPES;
  lineChartTypes = LineChartTypesConst;
  chartStyles = BarStyleConst;
  @Output() onChange = new EventEmitter<Widget>();
  @Output() onValidate = new EventEmitter<boolean>();

  handleChange(event: any) {
    this.onChange.emit(event);
  }

  handleValidate(event) {
    this.onValidate.emit(event);
  }
}
