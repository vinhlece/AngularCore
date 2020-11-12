import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Widget} from '../../models';
import {getChartThumbnail, isChartWidget} from '../../utils/functions';

@Component({
  selector: 'app-draggable-widget',
  templateUrl: './draggable-widget.component.html',
  styleUrls: ['./draggable-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DraggableWidgetComponent {
  @Input() widget: Widget;

  getIcon() {
    if (this.widget && this.widget.type && isChartWidget(this.widget.type)) {
      const id = this.widget.type.toString().replace(' ', '');
      return getChartThumbnail(id);
    }
  }
}
