import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {BarWidget, Widget} from '../../../models';
import {EditWidgetFormOptions} from '../edit-widget-form/edit-widget-form.component';
import {Subject} from 'rxjs/index';
import {AbstractEditWidget} from '../../new-side-bar/edit-widget-strategy/abstract-edit-widget';
import {BarStyleDivider} from '../../../constants/constants';

@Component({
  selector: 'app-edit-bar-widget-form',
  templateUrl: './edit-bar-widget-form.component.html',
  styleUrls: ['./edit-bar-widget-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditBarWidgetFormComponent extends AbstractEditWidget implements OnChanges {
  @Input() chartTypes;
  @Input() chartStyles;
  @Input() saveSubject: Subject<BarWidget>;

  @Output() onSubmit = new EventEmitter<Widget>();
  @Output() onCancel = new EventEmitter<void>();

  options: EditWidgetFormOptions;

  ngOnChanges() {
    this.options = this.createFormOptions({
      chartTypes: this.chartTypes,
      chartStyles: this.chartStyles
    });
  }

  handleSubmit(input) {
    if (input.chartStyle) {
      input = this.formatWidgetValue(input);
    }

    this.onSubmit.emit({
      ...this.widget,
      ...input
    });
  }

  handleChange(input) {
    if (input.chartStyle) {
      input = this.formatWidgetValue(input);
    }
    super.handleChange(input);
  }

  handleCancel() {
    this.onCancel.emit();
  }

  handleChangeType(widget: Widget) {
    super.handleChangeType(widget);
  }

  formatWidgetValue(input) {
    const chartStyleType = input.chartStyle.split(BarStyleDivider);
    if (chartStyleType.length < 2) {
      return input;
    }
    const chartStyle = chartStyleType[0].trim();
    const chartType = chartStyleType[1].trim();
    return {
      ...input,
      chartStyle,
      chartType
    };
  }
}

