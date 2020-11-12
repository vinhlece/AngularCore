import {ChangeDetectionStrategy, Component, Input, OnChanges} from '@angular/core';
import {GridMetrics} from '../../models';

@Component({
  selector: 'app-grid-lines',
  templateUrl: './grid-lines.component.html',
  styleUrls: ['./grid-lines.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridLinesComponent implements OnChanges {
  horizontalLines: { top: number; left: number }[] = [];
  verticalLines: { top: number; left: number }[] = [];

  @Input() rows: number;
  @Input() columns: number;
  @Input() metrics: GridMetrics;

  ngOnChanges() {
    this.buildGridLines();
  }

  private buildGridLines() {
    this.buildHorizontalGridLines();
    this.buildVerticalGridLines();
  }

  private buildHorizontalGridLines() {
    this.horizontalLines = [];
    for (let i = 0; i < this.rows + 1; i++) {
      const top = this.metrics.gridLinesRowHeight * i;
      const left = 0;
      this.horizontalLines.push({top, left});
    }
  }

  private buildVerticalGridLines() {
    this.verticalLines = [];
    for (let i = 0; i < this.columns + 1; i++) {
      const top = 0;
      const left = this.metrics.gridLinesRowWidth * i;
      this.verticalLines.push({top, left});
    }
  }
}
