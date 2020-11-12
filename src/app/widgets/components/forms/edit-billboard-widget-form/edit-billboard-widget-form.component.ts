import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {Measure} from '../../../../measures/models';
import {BillboardWidget, Widget} from '../../../models';
import {EditWidgetFormOptions} from '../edit-widget-form/edit-widget-form.component';
import {Subject} from 'rxjs/index';
import {isNullOrUndefined} from 'util';
import {AbstractEditWidget} from '../../new-side-bar/edit-widget-strategy/abstract-edit-widget';

@Component({
  selector: 'app-edit-billboard-widget-form',
  templateUrl: './edit-billboard-widget-form.component.html',
  styleUrls: ['./edit-billboard-widget-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditBillboardWidgetFormComponent extends AbstractEditWidget implements OnChanges {
  @Input() saveSubject: Subject<BillboardWidget>;

  @Output() onSubmit = new EventEmitter<Widget>();
  @Output() onCancel = new EventEmitter<void>();

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
