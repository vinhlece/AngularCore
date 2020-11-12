import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';

import {SolidGaugeWidget, Widget} from '../../../models';
import {EditWidgetFormOptions} from '../edit-widget-form/edit-widget-form.component';
import {Subject} from 'rxjs/index';
import {AbstractEditWidget} from '../../new-side-bar/edit-widget-strategy/abstract-edit-widget';
import {DisplayModeLocale} from '../../../../dashboard/models/constants';

@Component({
  selector: 'app-edit-solid-gauge-widget-form',
  templateUrl: './edit-solid-gauge-widget-form.component.html',
  styleUrls: ['./edit-solid-gauge-widget-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditSolidGaugeWidgetFormComponent extends AbstractEditWidget implements OnChanges {
  displayModes = DisplayModeLocale;
  @Input() saveSubject: Subject<SolidGaugeWidget>;

  @Output() onSubmit = new EventEmitter<SolidGaugeWidget>();
  @Output() onCancel = new EventEmitter<void>();

  options: EditWidgetFormOptions;

  ngOnChanges() {
    this.options = this.createFormOptions({displayModes: this.displayModes});
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
