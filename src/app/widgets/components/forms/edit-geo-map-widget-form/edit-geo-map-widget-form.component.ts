import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {GeoMapWidget, Widget} from '../../../models';
import {EditWidgetFormOptions} from '../edit-widget-form/edit-widget-form.component';
import {Subject} from 'rxjs/index';
import {AbstractEditWidget} from '../../new-side-bar/edit-widget-strategy/abstract-edit-widget';
import {DisplayModeLocale} from '../../../../dashboard/models/constants';

@Component({
  selector: 'app-edit-geo-map-widget-form',
  templateUrl: './edit-geo-map-widget-form.component.html',
  styleUrls: ['./edit-geo-map-widget-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditGeoMapFormComponent extends AbstractEditWidget implements OnChanges {
  options: EditWidgetFormOptions;
  displayModes = DisplayModeLocale;

  @Input() saveSubject: Subject<GeoMapWidget>;

  @Output() onSubmit = new EventEmitter<GeoMapWidget>();
  @Output() onCancel = new EventEmitter<void>();

  ngOnChanges() {

    this.options = this.createFormOptions({
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
