import { Inject, Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { from, Observable, of } from 'rxjs';
import * as fromRealTime from '../../reducers';
import * as websocketActions from '../../actions/web-socket/subscription.action';
import { catchError, filter, map, mergeMap, withLatestFrom } from 'rxjs/internal/operators';
import { WebSocketSubscription } from '../../models/web-socket/widget-container';
import { ISubscriptionService } from '../../services/index';
import { SUBSCRIPTION_SERVICE } from '../../services/tokens';
import { Widget } from '../../../widgets/models/index';
import * as _ from 'lodash';
import { DummyAction } from '../../../common/actions/index';
import { Stream, Topic } from '../../models/index';
import { isNullOrUndefined } from 'util';
import * as realTimeAction from '../../actions/web-socket/real-time-client.action';
import * as pollingActions from '../../actions/rest-api/polling.actions';
import { FormulaMeasureFactory } from '../../../measures/services/index';
import { FORMULA_MEASURE_FACTORY } from '../../../measures/services/tokens';
import { getFormulaMeasures } from '../../utils/formatter';
import { unionInstances } from '../../../common/utils/function';
import * as PolicyGroupAction from '../../actions/web-socket/policy-group.actions';

@Injectable()
export class SubscriptionEffect {
  private _actions$: Actions;
  private _store: Store<fromRealTime.State>;
  private _subscriptionService: ISubscriptionService;
  private _formulaMeasureFactory: FormulaMeasureFactory;

  @Effect() add$: Observable<Action>;
  @Effect() create$: Observable<Action>;
  @Effect() remove$: Observable<Action>;
  @Effect() removeAll$: Observable<Action>;

  constructor(action$: Actions,
    store: Store<fromRealTime.State>,
    @Inject(SUBSCRIPTION_SERVICE) subscriptionService: ISubscriptionService,
    @Inject(FORMULA_MEASURE_FACTORY) formulaMeasureFactory: FormulaMeasureFactory) {
    this._actions$ = action$;
    this._store = store;
    this._subscriptionService = subscriptionService;
    this._formulaMeasureFactory = formulaMeasureFactory;

    this.createSubscription();
    this.addSubscription();
    this.removeSubscription();
    this.removeAllSubscription();
  }

  private addSubscription() {
    const launchingWidgets$ = this._store.pipe(select(fromRealTime.getLaunchingWidgets));
    const currentUser$ = this._store.pipe(select(fromRealTime.getCurrentUser));
    const topics$ = this._store.pipe(select(fromRealTime.getTopics));
    const existSubscriptions$ = this._store.pipe(select(fromRealTime.getWebSocketSubscriptions));
    const globalFilters$ = this._store.pipe(select(fromRealTime.getGlobalFilters));
    this.add$ = this._actions$.pipe(
      ofType(websocketActions.ADD_SUBSCRIPTION),
      withLatestFrom(launchingWidgets$, currentUser$, topics$, existSubscriptions$, globalFilters$),
      filter(([action, launchingWidgets, currentUser, topics, existSubscriptions, globalFilters]) => currentUser && !isNullOrUndefined(currentUser.id)),
      mergeMap(([action, launchingWidgets, currentUser, topics, existSubscriptions, globalFilters]) => {
        const subscriptions = this.getSubscription(launchingWidgets, currentUser.id, topics, existSubscriptions, globalFilters);
        const actionsArray = [];
        subscriptions.forEach(subscription => {
          actionsArray.push(new websocketActions.Create(subscription));
        });
        return actionsArray.length > 0 ? actionsArray : [new DummyAction()];
      })
    );
  }

  private createSubscription() {
    this.create$ = this._actions$.pipe(
      ofType(websocketActions.CREATE_SUBSCRIPTION),
      mergeMap((action: websocketActions.Create) =>
        this._subscriptionService.add(action.payload).pipe(
          mergeMap((webSocketSubscriptions: WebSocketSubscription) => [
            new websocketActions.AddSuccess(action.payload),
            new pollingActions.PumpUp(action.payload.packageName),
            new PolicyGroupAction.Initialize(action.payload.packageName)
          ]
          ),
          catchError((error: Error) => of(new websocketActions.Error(error.message)))
        ))
    );
  }

  private removeSubscription() {
    this.remove$ = this._actions$.pipe(
      ofType(websocketActions.DELETE_SUBSCRIPTION),
      mergeMap((action: websocketActions.Delete) => {
        return this._subscriptionService.remove(action.payload).pipe(
          map((id: string) => {
            return new websocketActions.DeleteSuccess(id);
          }),
          catchError((error: Error) => of(new websocketActions.Error(error.message)))
        );
      })
    );
  }

  private removeAllSubscription() {
    const subscriptions$ = this._store.pipe(select(fromRealTime.getWebSocketSubscriptions));
    this.removeAll$ = this._actions$.pipe(
      ofType(realTimeAction.RESET_DATA),
      withLatestFrom(subscriptions$),
      map(([action, subscriptions]) => {
        subscriptions.forEach(subscription => {
          this._subscriptionService.remove(subscription).subscribe();
        });
        return new websocketActions.DeleteAllSuccess();
      })
    );
  }

  private getSubscription(launchingWidgets: Widget[],
    userId: string, topics: Topic[], existSubscriptions: WebSocketSubscription[], globalFilters: string[]) {
    const subscriptions = [];
    const groupByDataType = _.groupBy(launchingWidgets, (widget) => widget.dataType);
    _.forIn(groupByDataType, (group, packageName) => {
      const measureInstances = {};
      let windows = [];
      group.forEach((widget: Widget) => {
        const isQualifiedWidget = (currentWidget: Widget) => (currentWidget.measures && currentWidget.measures.length > 0
          && currentWidget.dimensions && currentWidget.dimensions.length > 0);
        if (!isQualifiedWidget(widget)) {
          return;
        }
        let instances = [];
        widget.measures.forEach(widgetMeasure => {
          const allMeasures = getFormulaMeasures(this._formulaMeasureFactory, widgetMeasure);
          allMeasures.forEach(measure => {
            widget.dimensions.forEach(widgetDimension => {
              instances = unionInstances(widgetDimension);
              windows = widget.windows;
              const dimension = widgetDimension.dimension;
              if (widget.showAllData && widget.dimensions.length > 0 && instances.length === 0) {
                if (measureInstances[measure]) {
                  measureInstances[measure]['dimension'][dimension] = [];
                  measureInstances[measure]['windows'] = _.union(measureInstances[measure]['windows'], windows);
                } else {
                  measureInstances[measure] = { dimension: {}, windows };
                  measureInstances[measure]['dimension'][dimension] = [];
                }
              } else {
                if (measureInstances[measure]) {
                  if (!measureInstances[measure]['dimension'][dimension] || measureInstances[measure]['dimension'][dimension].length > 0) {
                    measureInstances[measure]['dimension'][dimension] = _.union(measureInstances[measure]['dimension'][dimension], instances);
                  }
                  measureInstances[measure]['windows'] = _.union(measureInstances[measure]['windows'], windows);
                } else if (instances.length > 0) {
                  measureInstances[measure] = { dimension: {}, windows };
                  measureInstances[measure]['dimension'][dimension] = _.union(instances, globalFilters);
                }
              }
            });
          });
        });
      });
      const subscribed = existSubscriptions.find(item => item.packageName === packageName);
      let isDirty = !isNullOrUndefined(subscribed);
      if (subscribed) {
        isDirty = this.checkDirty(subscribed, measureInstances);
      }

      const measureFilters = Object.keys(measureInstances).map(key => {
        const topic = topics.find(i => i.dataType === packageName);
        if (!topic || !topic.isSubscribed) {
          return;
        }

        const listDimensions = Object.keys(measureInstances[key]['dimension']);
        const separatedListDimensions = _.flatten(listDimensions.map(d => d.split(',')));

        const dimensionFilters = separatedListDimensions.map(d => ({
          dimension: d,
          included: measureInstances[key]['dimension'][d]
        }
        ));
        return {
          measure: key,
          dimensionFilters: dimensionFilters,
          windows: measureInstances[key]['windows']
        };
      }).filter(item => !isNullOrUndefined(item));
      const selectedTopic = topics.find(i => i.dataType === packageName);
      if (!isDirty && selectedTopic && selectedTopic.clientId && measureFilters.length > 0) {
        if (subscriptions.findIndex(item => item.id === selectedTopic.subscriptionId) < 0) {
          subscriptions.push({
            sessionId: selectedTopic.clientId,
            id: selectedTopic.subscriptionId,
            user: userId,
            measureFilters,
            packageName
          });
        }
      }
    });
    return subscriptions;
  }

  private checkDirty(subcription: WebSocketSubscription, measureInstances: any): boolean {
    if (subcription.measureFilters.length === 0) {
      return false;
    }
    const measures = Object.keys(measureInstances);
    for (let x = 0; x < measures.length; x++) {
      const selected = subcription.measureFilters.find(item => item.measure === measures[x]);
      if (!selected) {
        return false;
      }

      const newSubcriptionData = measureInstances[measures[x]];
      const newDimensions = Object.keys(newSubcriptionData['dimension']);
      const newWindow = newSubcriptionData['windows'];
      const oldDimensions = selected.dimensionFilters.map(item => item.dimension);
      const oldWindow = selected.windows;

      if (selected.dimensionFilters.length > 0) {
        if (_.difference(newWindow, oldWindow).length !== 0) {
          return false;
        }

        if (_.difference(newDimensions, oldDimensions).length !== 0) {
          return false;
        } else {
          for (let i = 0; i < newDimensions.length; i++) {
            const newInstances = newSubcriptionData['dimension'][newDimensions[i]];
            const oldInstances = selected.dimensionFilters.find(item => item.dimension === newDimensions[i]).included;
            if (_.difference(newInstances, oldInstances).length !== 0) {
              return false;
            }
          }
        }
      }
    }

    return true;
  }
}
