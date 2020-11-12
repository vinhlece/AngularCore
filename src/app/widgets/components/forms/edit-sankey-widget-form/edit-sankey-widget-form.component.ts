import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {Measure} from '../../../../measures/models';
import {SankeyWidget, Widget} from '../../../models';
import {EditWidgetFormOptions} from '../edit-widget-form/edit-widget-form.component';
import {Subject} from 'rxjs/index';
import {AbstractEditWidget} from '../../new-side-bar/edit-widget-strategy/abstract-edit-widget';

@Component({
  selector: 'app-edit-sankey-widget-form',
  templateUrl: './edit-sankey-widget-form.component.html',
  styleUrls: ['./edit-sankey-widget-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditSankeyWidgetFormComponent extends AbstractEditWidget implements OnChanges {
  @Input() saveSubject: Subject<SankeyWidget>;

  @Output() onChange = new EventEmitter<SankeyWidget>();
  @Output() onSubmit = new EventEmitter<SankeyWidget>();
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
