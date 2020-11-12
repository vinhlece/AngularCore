import {Component, Input, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs/internal/Observable';
import {filter, map, withLatestFrom} from 'rxjs/operators';
import {isNullOrUndefined} from 'util';
import * as fromDashboards from '../../../dashboard/reducers';
import {PlotLineLabel, Point} from '../../models';

@Component({
  selector: 'app-plot-line-label-container',
  templateUrl: './plot-line-label.container.html',
  styleUrls: ['./plot-line-label.container.scss']
})
export class PlotLineLabelContainer implements OnInit {
  private _store: Store<fromDashboards.State>;

  labels$: Observable<PlotLineLabel[]>;

  @Input() placeholderId: string;

  constructor(store: Store<fromDashboards.State>) {
    this._store = store;
  }

  ngOnInit() {
    this.labels$ = this._store.pipe(
      select(fromDashboards.getWidgetData(this.placeholderId)),
      withLatestFrom(this._store.pipe(select(fromDashboards.getCurrentTimestamp))),
      filter(([data]) => !isNullOrUndefined(data)),
      map(([data, currentTimestamp]) => {
        return data
          .filter((series: any) => series.data.length > 0 && series.data[0].x <= currentTimestamp)
          .map((series: any) => this.getPlotLineLabel(series, currentTimestamp));
      })
    );
  }

  private getPlotLineLabel(series: any, currentTimestamp: number): PlotLineLabel {
    return {
      name: series.name,
      color: series.color,
      value: this.getPlotLineLabelValue(series, currentTimestamp)
    };
  }

  private getPlotLineLabelValue(series: any, currentTimestamp: number): number {
    return this.binarySearch(series.data, currentTimestamp).y;
  }

  private binarySearch(points: Point[], key: number): Point {
    return this.internalBinarySearch(points, 0, points.length - 1, key);
  }

  private internalBinarySearch(points: Point[], lo: number, hi: number, key: number): Point {
    if (lo > hi) {
      return points[hi];
    }
    const mid = Math.floor((lo + hi) / 2);
    if (key < points[mid].x) {
      return this.internalBinarySearch(points, lo, mid - 1, key);
    } else if (key > points[mid].x) {
      return this.internalBinarySearch(points, mid + 1, hi, key);
    }
    return points[mid];
  }
}
