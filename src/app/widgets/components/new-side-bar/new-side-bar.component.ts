import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {WidgetType} from '../../constants/widget-types';
import {Widget} from '../../models/index';
import {Default_Config, PlaceholderDefaultSize} from '../../models/constants';
import {uuid} from '../../../common/utils/uuid';

@Component({
  selector: 'app-new-side-bar',
  templateUrl: './new-side-bar.component.html',
  styleUrls: ['./new-side-bar.component.scss']
})
export class NewSideBarComponent implements OnInit {

  @Output() onCancel = new EventEmitter<any>();
  @Output() onSave = new EventEmitter<any>();

  @Input() widget: Widget;
  @Output() onCreateWidgetType = new EventEmitter<WidgetType>();
  @Output() onUpdateWidgetType = new EventEmitter<any>();

  widgetTypes = Object.values(WidgetType);

  constructor() { }

  ngOnInit() {
  }

  createNewWidget(type) {
    const widgetType = this.getWidgetType(type);
    if (widgetType) {
      const blankWidget = this.createBlankWidget(type, widgetType);
      this.onCreateWidgetType.emit(blankWidget);
    }
  }

  updateWidget(data) {
    const widgetType = this.getWidgetType(data.item);
    if (widgetType) {
      const blankWidget = this.createBlankWidget(data.item, widgetType, data);
      this.onUpdateWidgetType.emit(blankWidget);
    }
  }

  handleCancel() {
    this.onCancel.emit();
  }

  handleSave(event: Widget) {
    this.onSave.emit(event);
  }

  private createBlankWidget(iconType, widgetType, oldWidget = null) {
    let data = {};
    if (oldWidget && oldWidget.widget) {
      data = {
        id: oldWidget.widget.id,
        userId: oldWidget.widget.userId
      };
    }
    return {
      ...data,
      id: uuid(),
      name: 'Untitled',
      type: widgetType,
      defaultSize: PlaceholderDefaultSize,
      dataType: 'Queue Performance',
      measures: ['contacts_conferenced'],
      instances: ['Dog'],
      focus: true,
      ...this.createWidgetDefaultOption(iconType)
    };
  }

  private getWidgetType(type: string) {
    return this.widgetTypes.find(widgetType => widgetType.toLowerCase().replace(' ', '_') === type);
  }

  private createWidgetDefaultOption(selectedType) {
    return Default_Config[selectedType] ? Default_Config[selectedType] : null;
  }
}
