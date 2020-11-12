import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SideBarItem} from '../../models';

@Component({
  selector: 'app-side-bar-item',
  templateUrl: './side-bar-item.component.html',
  styleUrls: ['./side-bar-item.component.scss']
})
export class SideBarItemComponent {
  @Input() item: SideBarItem;

  @Output() onMouseDown = new EventEmitter<MouseEvent>();
  @Output() onDoubleClick = new EventEmitter<MouseEvent>();

  handleMouseDown(event: MouseEvent) {
    this.onMouseDown.emit(event);
  }

  handleDoubleClick(event: MouseEvent) {
    this.onDoubleClick.emit(event);
  }
}
