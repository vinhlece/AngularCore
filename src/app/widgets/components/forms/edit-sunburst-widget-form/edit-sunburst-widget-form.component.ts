import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {PairItem, SunburstWidget, Widget} from '../../../models';
import {EditWidgetFormOptions} from '../edit-widget-form/edit-widget-form.component';
import {Subject} from 'rxjs/index';
import {AbstractEditWidget} from '../../new-side-bar/edit-widget-strategy/abstract-edit-widget';
import {DisplayModeLocale, LabelModeConst} from '../../../../dashboard/models/constants';

@Component({
  selector: 'app-edit-sunburst-form',
  templateUrl: './edit-sunburst-widget-form.component.html',
  styleUrls: ['./edit-sunburst-widget-form.component.scss']
})
export class EditSunburstWidgetFormComponent extends AbstractEditWidget implements OnChanges {
  @Input() saveSubject: Subject<SunburstWidget>;

  @Output() onSubmit = new EventEmitter<SunburstWidget>();
  @Output() onCancel = new EventEmitter<void>();

  displayModes: PairItem[] = DisplayModeLocale;
  labelModes: PairItem[] = LabelModeConst;
  options: EditWidgetFormOptions;

  ngOnChanges() {
    this.options = this.createFormOptions({
      labelModes: this.labelModes,
      displayModes: this.displayModes
    });
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
