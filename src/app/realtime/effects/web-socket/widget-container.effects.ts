import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Action, select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import * as fromRealTime from '../../reducers';
import * as widgetContainerActions from '../../actions/web-socket/widget-container.actions';
import {filter, map, mergeMap, withLatestFrom} from 'rxjs/internal/operators';
import {WidgetContainer} from '../../models/web-socket/widget-container';
import {Widget} from '../../../widgets/models/index';
import {uuid} from '../../../common/utils/uuid';
import * as pollingActions from '../../actions/rest-api/polling.actions';
import {TopicMapper} from '../../services/TopicMapper';
import {User} from '../../../user/models/user';
import * as realTimeClientAction from '../../actions/web-socket/real-time-client.action';
import * as realTimeDataActions from '../../actions/rest-api/real-time-data.actions';
import {isNullOrUndefined} from 'util';

@Injectable()
export class WidgetContainerEffects {
  readonly BASE_WS_URL = 'http://132.145.235.222:2021/';
  private _actions$: Actions;
  private _store: Store<fromRealTime.State>;
  private _topicMapper: TopicMapper;

  @Effect() trigger$: Observable<Action>;
  @Effect() removeWidgetContainer$: Observable<Action>;

  constructor(action: Actions, store: Store<fromRealTime.State>, topicMapper: TopicMapper) {
    this._actions$ = action;
    this._store = store;
    this._topicMapper = topicMapper;

    this.triggerEffect();
    this.removeWidgetContainerTrigger();
  }

  private triggerEffect() {
    const launchingWidgets$ = this._store.pipe(select(fromRealTime.getLaunchingWidgets));
    const widgetContainers$ = this._store.pipe(select(fromRealTime.getWidgetContainers));
    const currentUser$ = this._store.pipe(select(fromRealTime.getCurrentUser));
    this.trigger$ = launchingWidgets$.pipe(
        withLatestFrom(widgetContainers$, currentUser$),
        filter(([launchingWidgets, widgetsContainers]) => launchingWidgets.length > 0 &&
          (isNullOrUndefined(widgetsContainers) || widgetsContainers.length === 0)),
        mergeMap(([launchingWidgets, widgetContainers, currentUser]) => {
          const newContainer = this.updateWidgetContainer(launchingWidgets, widgetContainers, currentUser);
          return [new widgetContainerActions.ModifyWidgetContainerSuccess(newContainer), new realTimeClientAction.Initialize()];
        })
      );
  }

  private removeWidgetContainerTrigger() {
    const widgetContainers$ = this._store.pipe(select(fromRealTime.getWidgetContainers));
    this.removeWidgetContainer$ = this._actions$.pipe(
      ofType(pollingActions.STOP),
      withLatestFrom(widgetContainers$),
      mergeMap(([action, widgetContainers]) => {
        return [new realTimeClientAction.ResetData(), new widgetContainerActions.ModifyWidgetContainerSuccess(null)];
      })
    );
  }

  private updateWidgetContainer(launchingWidgets: Widget[], widgetContainers: WidgetContainer[], currentUser: User): WidgetContainer[] {
    if (!widgetContainers) {
      widgetContainers = [];
    }
    widgetContainers.push({id: uuid(), dataType: 'subscriptionpublisher', widgetIds: null, subscription: null});
    return widgetContainers;
  }

  private removeSubscriptions(widgetContainers: WidgetContainer[]) {
    if (widgetContainers) {
      // this._store.dispatch(new subscriptionActions.DeleteAll());
      const removeDataType = widgetContainers.reduce((acc, item) => {
        acc[item.dataType] = null;
        return acc;
      }, {});
      this._store.dispatch(new realTimeDataActions.ClearOtherInstancesStorage(removeDataType));
    }
  }

}
