import {Component, Input} from '@angular/core';
import {PlotLineLabel} from '../../models';

@Component({
  selector: 'app-plot-line-label',
  templateUrl: './plot-line-label.component.html',
  styleUrls: ['./plot-line-label.component.scss']
})
export class PlotLineLabelComponent {
  @Input() labels: PlotLineLabel[];
}
