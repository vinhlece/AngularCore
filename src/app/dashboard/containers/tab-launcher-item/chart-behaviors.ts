import {Store} from '@ngrx/store';
import {ChangeChartTypeEvent} from '../../../charts/models';
import {Widget} from '../../../widgets/models';
import * as placeholdersActions from '../../actions/placeholders.actions';
import * as fromDashboards from '../../reducers';

export interface ChartBehavior {
  changeChartType(event: ChangeChartTypeEvent);
}

export class NotUseChart implements ChartBehavior {
  changeChartType(event: ChangeChartTypeEvent) {
  }
}

export class ChartBehaviorImpl {
  private _store: Store<fromDashboards.State>;
  private _widget: Widget;
  private _placeholderId: string;

  constructor(store: Store<fromDashboards.State>, placeholderId: string, widget: Widget) {
    this._store = store;
    this._placeholderId = placeholderId;
    this._widget = widget;
  }

  changeChartType(event: ChangeChartTypeEvent) {
    this._store.dispatch(new placeholdersActions.ChangeChartType({
      placeholderId: this._placeholderId,
      chartType: event.newChartType
    }));
  }
}
