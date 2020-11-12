import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Measure} from '../../../measures/models';

@Component({
  selector: 'app-draggable-metrics',
  templateUrl: './draggable-metrics.component.html',
  styleUrls: ['./draggable-metrics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DraggableMetricsComponent {
  @Input() measure: Measure;
  @Input() instance: string;
  @Input() agent: string;
  @Input() queue: string;
  @Input() segmentType: string;
  @Input() node: string;
  @Input() group: any;
}
