import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {Observable} from 'rxjs/internal/Observable';
import {QueryItem} from '../../../shared/collection';
import {CallTimeLineWidget} from '../../../widgets/models';
import {CallTimeLineGroupBy} from '../../../widgets/models/enums';
import {Legend, WidgetMouseEvent, ZoomEvent} from '../../models';
import {CallTimelineDatasource} from './datasource';
import {isNullOrUndefined} from 'util';
import {ColorPalette} from '../../../common/models/index';

@Component({
  selector: 'app-call-timeline',
  templateUrl: './call-timeline.component.html',
  styleUrls: ['./call-timeline.component.scss']
})
export class CallTimelineComponent implements OnInit, OnChanges {
  private _query: any;

  dataSource = new CallTimelineDatasource();
  filterData$: Observable<any>;

  @Input() widget: CallTimeLineWidget;
  @Input() data: any;
  @Input() size: any;
  @Input() zoom: ZoomEvent = {};
  @Input() colorPalette: ColorPalette;
  @Input() isOverlayWidget: boolean;

  @Output() onContextMenu = new EventEmitter<WidgetMouseEvent>();
  @Output() onMouseDown = new EventEmitter<WidgetMouseEvent>();
  @Output() onZoom = new EventEmitter<ZoomEvent>();
  @Output() onDoubleClick = new EventEmitter<WidgetMouseEvent>();
  @Output() onSearchChange = new EventEmitter<CallTimeLineWidget>();

  ngOnInit(): void {
    this.filterData$ = this.dataSource.getData();
  }

  ngOnChanges(): void {
    if (this.data) {
      this.dataSource.data = this.data;
    }
  }

  handleMouseDown(event) {
    this.onMouseDown.emit(event);
  }

  handleContextMenu(event) {
    this.onContextMenu.emit(event);
  }

  handleSearch(queries: string[]) {
    this._query = {
      ...this.parseQuery(queries),
      legends: this._query ? this._query.legends : []
    };
    this.dataSource.query = this._query;
    this.updateWidget();
  }

  handleZoom(event: ZoomEvent) {
    this.onZoom.emit(event);
  }

  handleToggleLegend(legends: Legend[]) {
    const names = legends.filter((legend: Legend) => !legend.enabled).map((legend: Legend) => legend.name);
    this._query = {...this._query, legends: {$notIn: names}};
    this.dataSource.query = this._query;
  }

  handleDoubleClick(event: any) {
    this.onDoubleClick.emit(event);
  }

  private parseQuery(queries: string[]): { [type: string]: QueryItem } {
    if (!queries || queries.length <= 0) {
      return {type: null, value: null};
    }
    const queryObj = {
      agent: {$contain: []},
      queue: {$contain: []},
      segmentType: {$contain: []},
      callID: {$contain: []},
    };
    queries.forEach(query => {
      const tokens = query.split(':');
      const type = tokens[0].trim();
      const value = tokens[1] ? tokens[1].trim() : null;
      if (value) {
        switch (type.toLowerCase()) {
          case CallTimeLineGroupBy.Agent.toString().toLowerCase():
            queryObj.agent.$contain.push(value);
            break;
          case CallTimeLineGroupBy.Queue.toString().toLowerCase():
            queryObj.queue.$contain.push(value);
            break;
          case CallTimeLineGroupBy.SegmentType.toString().toLowerCase():
            queryObj.segmentType.$contain.push(value);
            break;
          case CallTimeLineGroupBy.CallId.toString().toLowerCase():
            queryObj.callID.$contain.push(value);
            break;
          default:
            if (isNullOrUndefined(queryObj[type])) {
              queryObj[type] = {$contain: []};
            }
            queryObj[type].$contain.push(value);
        }
      }
    });
    return queryObj;
  }

  private updateWidget() {
    this.widget.agents = this._query.agent ? this._query.agent.$contain : [];
    this.widget.queues = this._query.queue ? this._query.queue.$contain : [];
    this.widget.segmentTypes = this._query.segmentType ? this._query.segmentType.$contain : [];
    const filters = Object.keys(this._query)
      .filter(property => (property !== CallTimeLineGroupBy.Agent
        && property !== CallTimeLineGroupBy.Queue
        && property !== CallTimeLineGroupBy.SegmentType
        && property !== 'legends' && this._query[property]))
      .reduce((accum: string[], property: string) =>
        [
          ...accum,
          ...this._query[property].$contain.map(item => `${property}:${item}`)
        ], []);
    this.widget.filters = [...filters];
    this.onSearchChange.emit({
      ...this.widget
    });
  }
}
