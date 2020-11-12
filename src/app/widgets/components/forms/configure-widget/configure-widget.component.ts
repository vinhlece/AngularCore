import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ChartIcons} from '../../../models/enums';
import { MatDialog } from '@angular/material/dialog';
import {Widget} from '../../../models/index';
import {WidgetType} from '../../../constants/widget-types';
import {AbstractControl, FormBuilder, FormGroup} from '@angular/forms';
import {EditWidgetFormControl, EditWidgetFormOptions} from '../edit-widget-form/edit-widget-form.component';
import {Observable, Subject} from 'rxjs/index';

@Component({
  selector: 'app-configure-widget',
  templateUrl: './configure-widget.component.html',
  styleUrls: ['./configure-widget.component.scss'],
})
export class ConfigureWidgetComponent {
  private _fb: FormBuilder;
  private _dialogService: MatDialog;
  private _appearanceData: Widget;
  private _widget: Widget;

  @Input()
  get widget(): Widget {
    return this._widget;
  }
  set widget(data: Widget) {
    this._widget = data;
    this.selectedTab = data ? 0 : 1;
  }
  @Output() onCreateWidgetType = new EventEmitter<WidgetType>();
  @Output() onUpdateWidgetType = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<void>();

  icons = Object.keys(ChartIcons);
  form: FormGroup;
  saveSubject: Subject<Widget> = new Subject<Widget>();
  selectedTab = 1;
  isValid: any = {data: false, appearance: false};

  constructor(dialogService: MatDialog, fb: FormBuilder) {
    this._dialogService = dialogService;
    this._fb = fb;
  }

  getIcon(id) {
    return ChartIcons[id];
  }

  getTooltip(icon) {
    const widgetTypes = Object.keys(WidgetType);
    const selectedType = widgetTypes.find(type => type.toLowerCase() === icon.replace('_', ''));
    return WidgetType[selectedType];
  }

  getSelectedIconStyle(item) {
    if (this.widget && this.widget.type.toLowerCase().replace(' ', '_') === item) {
      return {
        color: 'blue'
      };
    }
  }

  getChartType(item) {
    if (this.widget) {
      const data = {
        item,
        widget: this.widget
      };
      this.onUpdateWidgetType.emit(data);
    } else {
      this.onCreateWidgetType.emit(item);
    }
  }

  handleCancel() {
    this._dialogService.closeAll();
    this.onCancel.emit();
  }

  handleSave() {
    this.onSave.emit();
  }

  handleSubmit() {
    this.saveSubject.next(this._appearanceData);
  }

  handleAppearanceChange(widget: Widget) {
    this._appearanceData = widget;
  }
}

