import {ViewContainerRef} from '@angular/core';
import {Store} from '@ngrx/store';
import {WidgetMouseEvent} from '../../../charts/models';
import * as dndActions from '../../actions/dnd.actions';
import {DndPayload} from '../../models';
import {Draggable} from '../../models/enums';
import * as fromDashboards from '../../reducers';

export interface DndBehavior {
  dragOnPoint(event: WidgetMouseEvent, viewContainerRef: ViewContainerRef);

  dragOnHeader(event: WidgetMouseEvent, viewContainerRef: ViewContainerRef);
}

export class NoDnd implements DndBehavior {
  dragOnPoint(event: WidgetMouseEvent, viewContainerRef: ViewContainerRef) {
    // no op
  }

  dragOnHeader(event: WidgetMouseEvent, viewContainerRef: ViewContainerRef) {
    // no op
  }
}

export class CommonDndBehavior implements DndBehavior {
  private _store: Store<fromDashboards.State>;

  constructor(store: Store<fromDashboards.State>) {
    this._store = store;
  }

  get store(): Store<fromDashboards.State> {
    return this._store;
  }

  dragOnPoint(event: WidgetMouseEvent, viewContainerRef: ViewContainerRef) {
    this.store.dispatch(new dndActions.DragMetric({event, parent: viewContainerRef, draggable: Draggable.Both}));
  }

  dragOnHeader(event: WidgetMouseEvent, viewContainerRef: ViewContainerRef) {
    // no op
  }
}

export class TableDndBehavior extends CommonDndBehavior {
  dragOnHeader(event: WidgetMouseEvent, viewContainerRef: ViewContainerRef) {
    const payload: DndPayload = {event, parent: viewContainerRef, draggable: Draggable.Measure, hideDraggable: true};
    this.store.dispatch(new dndActions.DragMetric(payload));
  }
}
