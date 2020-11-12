import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {AbstractEditWidget} from '../../new-side-bar/edit-widget-strategy/abstract-edit-widget';
import {Widget} from '../../../models/index';
import {Subject} from 'rxjs/index';
import {EditWidgetFormOptions} from '../edit-widget-form/edit-widget-form.component';

@Component({
  selector: 'app-edit-event-viewer-widget-form',
  templateUrl: './edit-event-viewer-widget-form.component.html',
  styleUrls: ['./edit-event-viewer-widget-form.component.scss']
})
export class EditEventViewerWidgetFormComponent extends AbstractEditWidget implements OnChanges {
  @Input() chartTypes;
  @Input() chartStyles;
  @Input() saveSubject: Subject<Widget>;

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
}
