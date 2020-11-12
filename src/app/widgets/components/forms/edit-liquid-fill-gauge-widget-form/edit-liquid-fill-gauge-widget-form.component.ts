import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output
} from '@angular/core';
import { Measure } from '../../../../measures/models';
import {
  Widget,
  LiquidFillGaugeWidget
} from '../../../models';
import { EditWidgetFormOptions } from '../edit-widget-form/edit-widget-form.component';
import { Subject } from 'rxjs';
import { isNil, filter as _filter, uniq, includes } from 'lodash';
import {AbstractEditWidget} from '../../new-side-bar/edit-widget-strategy/abstract-edit-widget';

@Component({
  selector: 'app-edit-liquid-fill-gauge-widget-form',
  templateUrl: './edit-liquid-fill-gauge-widget-form.component.html',
  styleUrls: ['./edit-liquid-fill-gauge-widget-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditLiquidFillGaugeWidgetFormComponent extends AbstractEditWidget implements OnChanges {
  @Input() saveSubject: Subject<LiquidFillGaugeWidget>;

  @Output() onSubmit = new EventEmitter<LiquidFillGaugeWidget>();
  @Output() onCancel = new EventEmitter<void>();
  @Output() onChange = new EventEmitter<LiquidFillGaugeWidget>();

  options: EditWidgetFormOptions;

  ngOnChanges() {
    this.options = this.createFormOptions({});
  }

  handleSubmit(input) {
    this.onSubmit.emit({
      ...this.widget,
      ...input
    });
  }

  handleChange(input) {
    super.handleChange(input);
  }

  handleCancel() {
    this.onCancel.emit();
  }

  handleChangeType(widget: Widget) {
    super.handleChangeType(widget);
  }
}
