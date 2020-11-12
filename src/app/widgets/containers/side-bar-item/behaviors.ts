import {ViewContainerRef} from '@angular/core';
import {Store} from '@ngrx/store';
import {SideBarItem} from '../../models';
import * as fromWidgets from '../../reducers';
import {
  InstanceSideBarItemMouseBehavior,
  MeasureSideBarItemMouseBehavior,
  MouseBehavior,
  WidgetSideBarItemMouseBehavior
} from './mouse-behavior';

export abstract class AbstractSideBarItemBehaviors {
  private _store: Store<fromWidgets.State>;

  mouseBehavior: MouseBehavior;

  constructor(store: Store<fromWidgets.State>) {
    this._store = store;
  }

  handleMouseDown(item: SideBarItem, event: MouseEvent, viewContainerRef: ViewContainerRef) {
    this.mouseBehavior.handleMouseDown(item, event, viewContainerRef);
  }

  handleDoubleClick(item: SideBarItem, event: MouseEvent, viewContainerRef: ViewContainerRef) {
    this.mouseBehavior.handleDoubleClick(item, event, viewContainerRef);
  }
}

export class WidgetSideBarItemBehavior extends AbstractSideBarItemBehaviors {
  constructor(store: Store<fromWidgets.State>) {
    super(store);

    this.mouseBehavior = new WidgetSideBarItemMouseBehavior(store);
  }
}

export class InstanceSideBarItemBehaviors extends AbstractSideBarItemBehaviors {
  constructor(store: Store<fromWidgets.State>) {
    super(store);

    this.mouseBehavior = new InstanceSideBarItemMouseBehavior(store);
  }
}

export class MeasureSideBarItemBehaviors extends AbstractSideBarItemBehaviors {
  constructor(store: Store<fromWidgets.State>) {
    super(store);

    this.mouseBehavior = new MeasureSideBarItemMouseBehavior(store);
  }
}
