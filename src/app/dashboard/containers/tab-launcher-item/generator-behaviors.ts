import {Store} from '@ngrx/store';
import {isNullOrUndefined} from 'util';
import * as pollingActions from '../../../realtime/actions/rest-api/polling.actions';
import {Widget} from '../../../widgets/models';
import * as fromDashboards from '../../reducers';
import { unionDimensions } from '../../../common/utils/function';

const dispatch = (store: Store<fromDashboards.State>, widget: Widget, meta?: any) => {
  const unionInstances = unionDimensions(widget);
  const instances = unionInstances.length > 0 ? unionInstances : [''];
  const dataType = widget.dataType;

  const streams = instances.map((instance: string) => {
    return {
      dataType,
      instance,
      dirty: false
    };
  });
  store.dispatch(new pollingActions.Generate(streams, meta, widget.measures));
};

export interface GeneratorBehavior {
  generate(): void;
}

export class GenerateNothing implements GeneratorBehavior {
  generate(): void {
    // no op
  }
}

export class TimeRangeGenerator implements GeneratorBehavior {
  private _store: Store<fromDashboards.State>;
  private _widget: Widget;

  constructor(store: Store<fromDashboards.State>, widget: Widget) {
    this._store = store;
    this._widget = widget;
  }

  generate(): void {
    if (!isNullOrUndefined(this._widget.dataType)) {
      dispatch(this._store, this._widget);
    }
  }
}

export class GoBackGenerator implements GeneratorBehavior {
  private _store: Store<fromDashboards.State>;
  private _widget: Widget;

  constructor(store: Store<fromDashboards.State>, widget: Widget) {
    this._store = store;
    this._widget = widget;
  }

  generate(): void {
    if (!isNullOrUndefined(this._widget.dataType)) {
      dispatch(this._store, this._widget, {goBack: true});
    }
  }
}
