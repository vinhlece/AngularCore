import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DisplayMode} from '../../../dashboard/models/enums';
import {getIconPosition} from '../../utils/functions';

@Component({
  selector: 'app-display-mode-switcher',
  templateUrl: './display-mode-switcher.component.html',
  styleUrls: ['./display-mode-switcher.component.scss']
})
export class DisplayModeSwitcherComponent {
  @Input() displayMode: DisplayMode;
  @Input() color: string;
  @Input() isExportMenu: boolean;

  @Output() onClick = new EventEmitter<void>();

  handleClick() {
    this.onClick.emit();
  }

  getSwitchStyles() {
    return this.displayMode === DisplayMode.Historical ? {color: this.color} : {color: '#00c900'};
  }

  getIconStyle() {
    return getIconPosition(this.isExportMenu, 11);
  }
}
