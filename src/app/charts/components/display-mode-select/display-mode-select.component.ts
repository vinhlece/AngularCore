import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DisplayMode } from '../../../dashboard/models/enums';
import {getIconPosition} from '../../utils/functions';

@Component({
  selector: 'app-display-mode-select',
  templateUrl: './display-mode-select.component.html',
  styleUrls: ['./display-mode-select.component.scss']
})
export class DisplayModeSelectComponent {
  @Input() selected: string;
  @Input() isExportMenu: boolean;
  @Input() marginLeft: number;
  @Output() onChangeMode = new EventEmitter<string>();

  changeDisplayMode() {
    this.onChangeMode.emit(this.getNextDisplayMode());
  }

  getNextDisplayMode() {
    return this.selected === DisplayMode.Latest
      ? DisplayMode.Historical
      : this.selected === DisplayMode.Historical
        ? DisplayMode.Timestamp
        : DisplayMode.Latest;
  }

  getIconStyle() {
    return getIconPosition(this.isExportMenu, 10, this.marginLeft);
  }
}
