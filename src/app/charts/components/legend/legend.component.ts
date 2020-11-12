import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Legend} from '../../models';
import {WidgetFont} from '../../../widgets/models/index';

@Component({
  selector: 'app-legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.scss']
})
export class LegendComponent {
  @Input() legends: Legend[];
  @Input() font: WidgetFont;

  @Output() onToggle = new EventEmitter<Legend>();

  handleToggle(legend: Legend) {
    legend.enabled = !legend.enabled;
    this.onToggle.emit(legend);
  }

  getLabelStyle(legend: Legend) {
    const style = {
      color: !legend.enabled ? '#C3C3C3' : legend.color
    };
    if (this.font) {
      return {
        ...style,
        fontSize: this.font.fontSize ? `${this.font.fontSize}px` : '12px',
        fontWeight: 'bold',
      };
    }
    return style;
  }

  getPointStyle(legend: Legend) {
    const style = {
      color: !legend.enabled ? '#C3C3C3' : legend.color
    };
    if (this.font) {
      return {
        ...style,
        fontSize: this.font.fontSize ? `${this.font.fontSize + 12}px` : '24px',
      };
    }
    return style;
  }
}
