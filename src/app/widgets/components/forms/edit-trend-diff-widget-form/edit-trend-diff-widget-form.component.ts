import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {PairItem, TrendDiffWidget, Widget} from '../../../models';
import {EditWidgetFormOptions} from '../edit-widget-form/edit-widget-form.component';
import {Subject} from 'rxjs/index';
import {AbstractEditWidget} from '../../new-side-bar/edit-widget-strategy/abstract-edit-widget';
import {TrendTypeConst} from '../../../models/constants';

@Component({
  selector: 'app-edit-trend-diff-widget-form',
  templateUrl: './edit-trend-diff-widget-form.component.html',
  styleUrls: ['./edit-trend-diff-widget-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditTrendDiffWidgetFormComponent extends AbstractEditWidget implements OnChanges {
  private _trendTypes: PairItem[] = TrendTypeConst;

  options: EditWidgetFormOptions;
  @Input() chartTypes: PairItem[];
  @Input() isEditingNewSideBar: boolean = false;
  @Input() saveSubject: Subject<TrendDiffWidget>;

  @Output() onChange = new EventEmitter<TrendDiffWidget>();
  @Output() onSubmit = new EventEmitter<TrendDiffWidget>();
  @Output() onCancel = new EventEmitter<void>();

  ngOnChanges() {
    this.options = this.createFormOptions({trendTypes: this._trendTypes, chartTypes: this.chartTypes});
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
