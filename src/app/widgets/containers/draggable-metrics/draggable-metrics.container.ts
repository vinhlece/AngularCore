import {Component, ElementRef, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {flatMap, map} from 'rxjs/operators';
import {GroupParams, PlotPoint} from '../../../dashboard/models';
import * as fromDashboards from '../../../dashboard/reducers';
import {Measure} from '../../../measures/models';
import * as fromMeasures from '../../../measures/reducers';

@Component({
  selector: 'app-draggable-metrics-container',
  template: `
    <app-draggable-metrics [measure]="measure$ | async"
                           [instance]="instance$ | async"
                           [agent]="agent$ | async"
                           [queue]="queue$ | async"
                           [segmentType]="segmentType$ | async"
                           [node]="node$ | async"
                           [group]="group$ | async"
    ></app-draggable-metrics>
  `
})
export class DraggableMetricsContainer implements OnInit {
  private _store: Store<fromDashboards.State>;

  el: ElementRef;
  measure$: Observable<Measure>;
  instance$: Observable<string>;
  agent$: Observable<string>;
  queue$: Observable<string>;
  segmentType$: Observable<string>;
  node$: Observable<string>;
  group$: Observable<GroupParams>;

  constructor(store: Store<fromDashboards.State>, el: ElementRef) {
    this._store = store;
    this.el = el;
  }

  ngOnInit() {
    const plotPoint$ = this._store.pipe(select(fromDashboards.getPlotPoint));
    this.measure$ = plotPoint$.pipe(flatMap((point: PlotPoint) => this.getMeasure(point.dataType, point.measure)));
    this.instance$ = plotPoint$.pipe(map((point: PlotPoint) => point.instance));
    this.agent$ = plotPoint$.pipe(map((point: PlotPoint) => point.agent));
    this.queue$ = plotPoint$.pipe(map((point: PlotPoint) => point.queue));
    this.segmentType$ = plotPoint$.pipe(map((point: PlotPoint) => point.segmentType));
    this.node$ = plotPoint$.pipe(map((point: PlotPoint) => point.node));
    this.group$ = plotPoint$.pipe(map((point: PlotPoint) => point.groupParams));
  }

  private getMeasure(dataType: string, measureName: string): Observable<Measure> {
    return this._store.pipe(select(fromMeasures.getMeasure(dataType, measureName)));
  }
}
