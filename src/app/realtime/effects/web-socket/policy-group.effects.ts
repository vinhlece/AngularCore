import {Inject, Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Action, select, Store} from '@ngrx/store';
import {Observable, of} from 'rxjs';
import * as fromRealTime from '../../reducers';
import * as PolicyActions from '../../actions/web-socket/policy-group.actions';
import {catchError, concatMap, filter, map, mergeMap, withLatestFrom} from 'rxjs/internal/operators';
import {WidgetType} from '../../../widgets/constants/widget-types';
import {Widget} from '../../../widgets/models/index';
import {unionDimensions} from '../../../common/utils/function';
import {PolicyGroup, RealtimeData, ActionPolicy, KPIPolicyItem, PolicyInfo} from '../../models/index';
import {KPIService} from '../../services/index';
import {KPI_SERVICE} from '../../services/tokens';
import * as pollingActions from '../../actions/rest-api/polling.actions';
import {TimeUtils} from '../../../common/services/index';
import {TIME_UTILS} from '../../../common/services/tokens';
import {TimeRangeType} from '../../../dashboard/models/enums';
import {KpiThreshold} from '../../models/constants';
import * as _ from 'lodash';
import {DummyAction} from '../../../common/actions/index';
import {TimeRange} from '../../../dashboard/models/index';
import {getMomentByTimestamp} from '../../../common/services/timeUtils';
import {AppDateTimeFormat} from '../../../common/models/enums';
import * as timePreferencesActions from '../../../dashboard/actions/time-preferences.actions';
import * as policyGroupActions from '../../actions/web-socket/policy-group.actions';

@Injectable()
export class PolicyGroupEffects {
  private _actions$: Actions;
  private _store: Store<fromRealTime.State>;
  private _kpiService: KPIService;
  private _timeUtils: TimeUtils;

  @Effect() initialize$: Observable<Action>;
  @Effect() create$: Observable<Action>;
  @Effect() get$: Observable<Action>;
  @Effect() updateTimePreference$: Observable<Action>;


  constructor(action: Actions, store: Store<fromRealTime.State>,
              @Inject(KPI_SERVICE) kpiService: KPIService,
              @Inject(TIME_UTILS) timeUtils: TimeUtils) {
    this._actions$ = action;
    this._store = store;
    this._kpiService = kpiService;
    this._timeUtils = timeUtils;

    this.initializeEffect();
    this.createEffect();
    this.getEffect();
    this.updateTimePreferenceEffect();
  }

  private initializeEffect() {
    const launchingWidgets$ = this._store.pipe(select(fromRealTime.getLaunchingWidgets));
    const existPolicies$ = this._store.pipe(select(fromRealTime.getPolicyGroup));
    const topics$ = this._store.pipe(select(fromRealTime.getTopics));

    this.initialize$ = this._actions$.pipe(
      ofType(PolicyActions.INITIALIZE),
      withLatestFrom(launchingWidgets$, existPolicies$, topics$),
      mergeMap(([action, widgets, existPolicies, topics]) => {
        const payload = (action as PolicyActions.Initialize).payload;
        const lineWidgets = widgets.filter(widget => widget.type === WidgetType.Line && widget.dataType === payload);
        const data = lineWidgets.reduce((acc, item) => {
          const widget = item as Widget;
          const topic = topics.find(top => top.dataType === widget.dataType);
          const instances = unionDimensions(widget);
          widget.measures.forEach(measure => {
            const mesaureInfo = topic.measures.find(mea => mea.name === measure);
            if (!acc[measure]) {
              acc[measure] = {
                instances: [],
                windowName: mesaureInfo.windowName,
                windowType: mesaureInfo.windowType
              };
            }
            acc[measure].instances = _.union(acc[measure], instances);
          });
          return acc;
        }, {});

        const actions = Object.keys(data).reduce((acc, key) => {
          const currentData = data[key];
          currentData.instances.forEach(instance => {
            const existed = existPolicies.find(item => item.instance === instance && item.measure === key);
            if (!existed) {
              // const policyGroup = this.createPolicyGroup(instance, key);
              const policyGroup = this.createKpisValue();
              const { instances, ...window } = currentData;
              const policyInfo = { measure: key, instance , ...window };
              acc.push(new PolicyActions.Create(policyGroup, policyInfo));
            }
          });
          return acc;
        }, []);
        return actions.length > 0 ? actions : [new DummyAction()];
      })
    );
  }

  private createEffect() {
    this.create$ = this._actions$.pipe(
      ofType(PolicyActions.CREATE),
      concatMap((action: PolicyActions.Create) => {
        // return this._kpiService.initialize(action.payload, action.policyInfo).pipe(
        //   mergeMap(() => {
            return [
              new PolicyActions.Get(action.policyInfo),
              new PolicyActions.InitializeSuccess(action.policyInfo)
            ];
          // }),
          // catchError((error: Error) => of(new PolicyActions.Error(error.message)))
        // );
      })
    );
  }

  private getEffect() {
    const timePreferences$ = this._store.pipe(select(fromRealTime.getTimePreferencesState));

    this.get$ = this._actions$.pipe(
      ofType(PolicyActions.GET),
      withLatestFrom(timePreferences$),
      concatMap(([action, timePreferences]) => {
        return this._kpiService.get((action as PolicyActions.Get).policyInfo).pipe(
          map((policy: PolicyGroup) => {
            const timeRange = {...timePreferences.config.timeRangeSettings.range};
            if (timePreferences.currentTimestamp) {
              const { type, value } = timePreferences.config.timeRangeSettings.interval;
              timeRange.startTimestamp = this._timeUtils.subtract(timePreferences.currentTimestamp, value, type);
            }
            const data: RealtimeData[] = this.convertData(policy, timeRange);
            return new pollingActions.LoadKpiSuccess(data);
          }),
          catchError((error: Error) => of(new PolicyActions.Error(error.message)))
        );
      })
    );
  }

  private updateTimePreferenceEffect() {
    const policyGroups$ = this._store.pipe(select(fromRealTime.getPolicyGroup));

    this.updateTimePreference$ = this._actions$.pipe(
      ofType(timePreferencesActions.UPDATE_TIME_RANGE_SETTINGS, pollingActions.GO_BACK),
      withLatestFrom(policyGroups$),
      filter(([action, policyGroups]) => policyGroups && policyGroups.length > 0),
      mergeMap(([action, policyGroup]) => {
        return policyGroup.map((pInfo: PolicyInfo) => new policyGroupActions.Get(pInfo));
      })
    );
  }

  private convertData(policies: PolicyGroup, timeRange: TimeRange): RealtimeData[] {
    const data: RealtimeData[] = [];
    const addFunction = (actionPolicy: ActionPolicy, timeStamp: number) => {
      const trigger = actionPolicy.triggers[0];
      if (trigger.triggerType === 'GREATER') {
        data.push(this.getRealTimeData(actionPolicy, 'GREATER', KpiThreshold.Greater.value, timeStamp));
      } else {
        data.push(this.getRealTimeData(actionPolicy, 'LESS', KpiThreshold.Lesser.value, timeStamp));
      }
    };

    const zeroDay = this._timeUtils.startOf(timeRange.endTimestamp, TimeRangeType.Day);
    policies.actionPolicies.forEach((actionPolicy: ActionPolicy) => {
      let measureTimestamp = this._timeUtils.add(zeroDay, this.getTimeStamp(actionPolicy.entryIdentifiers), TimeRangeType.Hour);
      if (this.getHourFromTimeStamp(measureTimestamp) === this.getHourFromTimeStamp(this._timeUtils.startOf(timeRange.startTimestamp, TimeRangeType.Hour))) {
        addFunction(actionPolicy, timeRange.startTimestamp);
      }
      while (measureTimestamp >= timeRange.startTimestamp) {
        addFunction(actionPolicy, measureTimestamp);
        measureTimestamp -= (24 * 60 * 60 * 1000);
      }
    });
    return data;
  }

  private getHourFromTimeStamp(timestamp: number) {
    return getMomentByTimestamp(timestamp).format(AppDateTimeFormat.hour);
  }

  private getRealTimeData(actionPolicy: ActionPolicy, triggerType: string, groupKpi: number, measureTimestamp: number): RealtimeData {
    return {
      instance: this.getInstance(actionPolicy.entryIdentifiers),
      measureName: this.getMeasure(actionPolicy.entryIdentifiers),
      measureValue: this.getValue(actionPolicy.triggers, triggerType),
      group: groupKpi,
      measureTimestamp
    };
  }

  private getInstance(entryIdentifiers) {
    return entryIdentifiers.find(entryIdentify => entryIdentify.keyPath === 'instance').value;
  }

  private getMeasure(entryIdentifiers) {
    return entryIdentifiers.find(entryIdentify => entryIdentify.keyPath === 'measure').value;
  }

  private getTimeStamp(entryIdentifiers) {
    return entryIdentifiers.find(entryIdentify => entryIdentify.keyPath === 'time').value;
  }

  private getValue(triggers, triggerType: string) {
    return triggers.find(trigger => trigger.triggerType === triggerType).value;
  }

  private createPolicyGroup(instance: string, measure: string) {
    const actionPolicies: ActionPolicy[] = [];
    for (let i = 0; i < 24; i++) {
      const max = Math.round(Math.random() * 100);
      const min = max - (Math.round(Math.random() * 20));
      const policyGroupItem: ActionPolicy = {
        policyIdentifier: {
          policyGroupId: `kpi_measure_${measure}_instance_${instance}_granularity_hourly`,
          actionPolicyId: `hour_${i}_to_${i + 1}`
        },
        enabled: true,
        entryIdentifiers: [
          {
            keyPath: 'instance',
            identificationType: 'EQUALS',
            value: instance
          },
          {
            keyPath: 'measure',
            identificationType: 'EQUALS',
            value: measure
          },
          {
            keyPath: 'time',
            identificationType: 'EVENT_HOUR_OF_DAY',
            value: `${i}`
          }
        ],
        triggers: [
          {
            keyPath: 'value',
            triggerType: 'GREATER',
            value: `${max}`
          },
          {
            keyPath: 'value',
            triggerType: 'LESS',
            value: `${min}`
          }
        ]
      };
      actionPolicies.push(policyGroupItem);
    }

    return actionPolicies;
  }

  private createKpisValue() {
    const policyGroup = [];
    for (let i = 0; i < 24; i++) {
      const max = Math.round(Math.random() * 100);
      const min = max - (Math.round(Math.random() * 20));
      const policyGroupItem: KPIPolicyItem = {
        hour: i,
        maxValue: max + 100,
        minValue: min
      };
      policyGroup.push(policyGroupItem);
    }
    return policyGroup;
  }
}
