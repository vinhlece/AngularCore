import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {Measure} from '../../../../measures/models';
import {LineWidget, PairItem, Widget} from '../../../models';
import {EditWidgetFormOptions} from '../edit-widget-form/edit-widget-form.component';
import {validateFunc} from '../../../../common/utils/function';
import {Subject} from 'rxjs/index';
import {AbstractEditWidget} from '../../new-side-bar/edit-widget-strategy/abstract-edit-widget';

@Component({
  selector: 'app-edit-line-widget-form',
  templateUrl: './edit-line-widget-form.component.html',
  styleUrls: ['./edit-line-widget-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditLineWidgetFormComponent extends AbstractEditWidget implements OnChanges {
  options: EditWidgetFormOptions;

  @Input() chartTypes: PairItem[];
  @Input() saveSubject: Subject<LineWidget>;

  @Output() onSubmit = new EventEmitter<LineWidget>();
  @Output() onCancel = new EventEmitter<void>();

  ngOnChanges() {
    this.options = this.createFormOptions({
      chartTypes: this.chartTypes
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
