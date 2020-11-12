import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {EditWidgetFormOptions} from '../edit-widget-form/edit-widget-form.component';
import {BarWidget, Widget} from '../../../models/index';
import {Subject} from 'rxjs/Rx';
import {AbstractEditWidget} from '../../new-side-bar/edit-widget-strategy/abstract-edit-widget';

@Component({
  selector: 'app-edit-bubble-widget-form',
  templateUrl: './edit-bubble-widget-form.component.html',
  styleUrls: ['./edit-bubble-widget-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditBubbleWidgetFormComponent extends AbstractEditWidget implements OnChanges {
  @Input() saveSubject: Subject<BarWidget>;

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
