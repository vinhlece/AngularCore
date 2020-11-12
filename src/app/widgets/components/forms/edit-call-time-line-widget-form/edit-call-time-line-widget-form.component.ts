import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {Measure} from '../../../../measures/models';
import {CallTimeLineWidget, Widget} from '../../../models';
import {EditWidgetFormOptions} from '../edit-widget-form/edit-widget-form.component';
import {CallTimeLineGroupBy} from '../../../models/enums';
import * as _ from 'lodash';
import {Subject} from 'rxjs/index';
import {AbstractEditWidget} from '../../new-side-bar/edit-widget-strategy/abstract-edit-widget';

@Component({
  selector: 'app-edit-call-time-line-widget-form',
  templateUrl: './edit-call-time-line-widget-form.component.html',
  styleUrls: ['./edit-call-time-line-widget-form.component.scss']
})
export class EditCallTimeLineWidgetFormComponent extends AbstractEditWidget implements OnChanges {
  private _groupByList = _.values(CallTimeLineGroupBy);
  @Input() chartTypes: string[];
  @Input() segmentTypes: Measure[];
  @Input() saveSubject: Subject<CallTimeLineWidget>;

  @Output() onSubmit = new EventEmitter<Widget>();
  @Output() onCancel = new EventEmitter<void>();

  options: EditWidgetFormOptions;

  ngOnChanges() {
    this.options = this.createFormOptions({
      chartTypes: this.chartTypes,
      segmentTypes: this.segmentTypes,
      groupByList: this._groupByList
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
