import {ViewContainerRef} from '@angular/core';
import {Store} from '@ngrx/store';
import * as dndActions from '../../../dashboard/actions/dnd.actions';
import * as plotActions from '../../../dashboard/actions/plot.actions';
import * as tabEditorActions from '../../../dashboard/actions/tab-editor.actions';
import {PlotPoint} from '../../../dashboard/models';
import {Draggable} from '../../../dashboard/models/enums';
import {SideBarItem} from '../../models';
import * as fromWidgets from '../../reducers';

export interface MouseBehavior {
  handleMouseDown(item: SideBarItem, event: MouseEvent, viewContainerRef: ViewContainerRef);

  handleDoubleClick(item: SideBarItem, event: MouseEvent, viewContainerRef: ViewContainerRef);
}

export abstract class AbstractMouseBehavior implements MouseBehavior {
  private _store: Store<fromWidgets.State>;

  get store(): Store<fromWidgets.State> {
    return this._store;
  }

  constructor(store: Store<fromWidgets.State>) {
    this._store = store;
  }

  handleMouseDown(item: SideBarItem, event: MouseEvent, viewContainerRef: ViewContainerRef) {
    // no op
  }

  handleDoubleClick(item: SideBarItem, event: MouseEvent, viewContainerRef: ViewContainerRef) {
    // no op
  }
}

export class WidgetSideBarItemMouseBehavior extends AbstractMouseBehavior {
  constructor(store: Store<fromWidgets.State>) {
    super(store);
  }

  handleMouseDown(item: SideBarItem, event: MouseEvent, viewContainerRef: ViewContainerRef) {
    this.store.dispatch(new tabEditorActions.DragWidget({event, payload: item.payload}));
  }

  handleDoubleClick(item: SideBarItem, event: MouseEvent, viewContainerRef: ViewContainerRef) {
    this.store.dispatch(new tabEditorActions.AddWidget(item.payload));
  }
}

export class MeasureSideBarItemMouseBehavior extends AbstractMouseBehavior {
  constructor(store: Store<fromWidgets.State>) {
    super(store);
  }

  handleMouseDown(item: SideBarItem, event: MouseEvent, viewContainerRef: ViewContainerRef) {
    const point: PlotPoint = {trigger: 'mousedown', dataType: item.payload.dataType, measure: item.payload.name};
    this.store.dispatch(new plotActions.Plot(point));
    this.store.dispatch(new dndActions.DragMetric({event, draggable: Draggable.Measure, parent: viewContainerRef}));
  }
}

export class InstanceSideBarItemMouseBehavior extends AbstractMouseBehavior {
  constructor(store: Store<fromWidgets.State>) {
    super(store);
  }

  handleMouseDown(item: SideBarItem, event: MouseEvent, viewContainerRef: ViewContainerRef) {
    const point: PlotPoint = {trigger: 'mousedown', instance: item.payload};
    this.store.dispatch(new plotActions.Plot(point));
    this.store.dispatch(new dndActions.DragMetric({event, draggable: Draggable.Instance, parent: viewContainerRef}));
  }
}
