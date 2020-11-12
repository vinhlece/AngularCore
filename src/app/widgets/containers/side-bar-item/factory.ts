import {SideBarItem} from '../../models';
import {
  AbstractSideBarItemBehaviors,
  InstanceSideBarItemBehaviors,
  MeasureSideBarItemBehaviors,
  WidgetSideBarItemBehavior
} from './behaviors';
import * as fromWidgets from '../../reducers';
import {Store} from '@ngrx/store';
import {Injectable} from '@angular/core';

@Injectable()
export class SideBarItemBehaviorsFactory {
  private _store: Store<fromWidgets.State>;

  constructor(store: Store<fromWidgets.State>) {
    this._store = store;
  }

  create(item: SideBarItem): AbstractSideBarItemBehaviors {
    switch (item.type) {
      case 'widgets':
        return new WidgetSideBarItemBehavior(this._store);
      case 'instances':
        return new InstanceSideBarItemBehaviors(this._store);
      case 'measures':
        return new MeasureSideBarItemBehaviors(this._store);
      default:
        throw new Error('Side bar item is not valid.');
    }
  }
}
