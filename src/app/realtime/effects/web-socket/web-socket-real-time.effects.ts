import {Inject, Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Action, select, Store} from '@ngrx/store';
import {from, Observable, of, Subject} from 'rxjs';
import {catchError, distinct, filter, flatMap, map, mergeMap, takeUntil} from 'rxjs/operators';
import {DummyAction} from '../../../common/actions';
import * as timePreferencesActions from '../../../dashboard/actions/time-preferences.actions';
import * as pollingActions from '../../actions/rest-api/polling.actions';
import * as streamsActions from '../../actions/rest-api/streams.actions';
import * as topicsActions from '../../actions/rest-api/topics.actions';
import {RealtimeData, Stream, Topic} from '../../models';
import * as fromRealTime from '../../reducers';
import {IRealTimeFactoryService, RealTimeService, ReportingDataGeneratorService} from '../../services';
import {REAL_TIME_FACTORY_SERVICE, REPORTING_DATA_GENERATOR_SERVICE} from '../../services/tokens';
import {TopicMapper} from '../../services/TopicMapper';
import {delay, tap, withLatestFrom} from 'rxjs/internal/operators';
import {WebSocketSubscription} from '../../models/web-socket/widget-container';
import * as realTimeClientAction from '../../actions/web-socket/real-time-client.action';
import {FormulaMeasureFactory} from '../../../measures/services/index';
import {FORMULA_MEASURE_FACTORY} from '../../../measures/services/tokens';
import {getFormulaMeasures} from '../../utils/formatter';
import * as _ from 'lodash';
import {unionDimensions} from '../../../common/utils/function';
import * as connectionStatusActions from '../../../dashboard/actions/connection-status.actions';

@Injectable()
export class WebSocketRealTimeEffects {
  private _actions$: Actions;
  private _store: Store<fromRealTime.State>;
  private _realTimeFactoryService: IRealTimeFactoryService;
  private _topicMapper: TopicMapper;
  private _consumersByTopics: { [topic: string]: RealTimeService };
  private _reportingDataGeneratorService: ReportingDataGeneratorService;
  private _formulaMeasureFactory: FormulaMeasureFactory;
  private _WEB_SOCKET_CONSUMER = 'Web-Socket';

  @Effect() generate$: Observable<any>;
  @Effect() getData$: Observable<Action>;
  @Effect() stop$: Observable<Action>;

  constructor(action$: Actions,
              store: Store<fromRealTime.State>,
              topicMapper: TopicMapper,
              @Inject(REPORTING_DATA_GENERATOR_SERVICE) reportingDataGeneratorService: ReportingDataGeneratorService,
              @Inject(REAL_TIME_FACTORY_SERVICE) realTimeFactoryService: IRealTimeFactoryService,
              @Inject(FORMULA_MEASURE_FACTORY) formulaMeasureFactory: FormulaMeasureFactory) {
    this._actions$ = action$;
    this._store = store;
    this._realTimeFactoryService = realTimeFactoryService;
    this._topicMapper = topicMapper;
    this._consumersByTopics = {};
    this._reportingDataGeneratorService = reportingDataGeneratorService;
    this._formulaMeasureFactory = formulaMeasureFactory;

    this.generateEffect();
    this.getDataEffect();
    this.stopEffect();
  }

  private getDataEffect() {
    this.getData$ = this._actions$.pipe(
      ofType(realTimeClientAction.INITIALIZE),
      flatMap((payload: realTimeClientAction.Initialize) => {
        const consumer = this.getConsumer(this._WEB_SOCKET_CONSUMER);
        consumer.initConsumer();
        return consumer.getData(null).pipe(
          map((data: RealtimeData[]) => {
            return new pollingActions.LoadSuccess(data);
          }),
          catchError(() => of(new DummyAction()))
        );
      })
    );
  }

  private generateEffect() {
    const measures$ = this._store.pipe(select(fromRealTime.getNormalizedMeasures));
    const launchingWidgets$ = this._store.pipe(select(fromRealTime.getLaunchingWidgets));
    this.generate$ = this._actions$.pipe(
      ofType(pollingActions.GENERATE),
      withLatestFrom(measures$, launchingWidgets$),
      mergeMap(([actionGenerate, measures, launchingWidgets]) => {
        const action = actionGenerate as pollingActions.Generate;
        let currentMeasures = launchingWidgets.reduce((acc: any, item) => {
          if (!acc[item.dataType]) {
            acc[item.dataType] = [];
          }
          acc[item.dataType].push(...item.measures);
          return acc;
        }, {});
        const currentStreams = launchingWidgets.reduce((acc: Stream[], item) => {
          if (item.dimensions.length > 0) {
            acc.push(...unionDimensions(item).map(i => {
              return {dataType: item.dataType, instance: i};
            }));
          } else if (item.showAllData) {
            acc.push({dataType: item.dataType, instance: ''});
          }
          return acc;
        }, []);
        const topic = this.getTopic(action.payload[0], action.measures, measures);
        if (currentMeasures[topic.dataType]) {
          currentMeasures = _.union(currentMeasures[topic.dataType], topic.measures.map(i => i.name));
        }
        const addTopicAction = new topicsActions.Add(topic, currentMeasures);
        const setPumpUpStreams = new streamsActions.SetPumpUpStream(action.payload, currentStreams);
        const setGoBackPumpUpStreams = new streamsActions.SetGoBackPumpUpStream(action.payload);
        if (action.meta && action.meta.goBack) {
          return [addTopicAction, setPumpUpStreams, setGoBackPumpUpStreams];
        } else {
          return [addTopicAction, setPumpUpStreams];
        }
      })
    );
  }

  private stopEffect() {
    this.stop$ = this._actions$.pipe(
      ofType(pollingActions.STOP),
      mergeMap((action: pollingActions.Stop) => {
        this.destroyConsumer();
        return [
          new timePreferencesActions.SetGoBackTimestamp(null),
          new topicsActions.Reset(),
          new streamsActions.ResetPumpUpStream(),
          new streamsActions.ResetGoBackPumpUpStream()
        ];
      })
    );
  }

  private getTopic(stream: Stream, measuresWidget: string[], measures: object): Topic {
    const {dataType} = stream;
    const topic = this._topicMapper.getTopic(dataType);
    const measureWindows = measuresWidget.reduce((acc, item) => {
      const updateMeasures = getFormulaMeasures(this._formulaMeasureFactory, item);
      updateMeasures.forEach(measure => {
        const key = `${dataType}_${measure}`;
        if (measures[key]) {
          acc.push({...measures[key]});
        }
      });
      return acc;
    }, []);
    topic.measures = measureWindows;
    topic.isSubscribed = false;
    return topic;
  }

  private getConsumer(topic: string): RealTimeService {
    let consumer = this._consumersByTopics[topic];
    if (!consumer) {
      consumer = this._realTimeFactoryService.createRealTimeService();
      if (topic === this._WEB_SOCKET_CONSUMER) {
        const topics$ = this._store.pipe(select(fromRealTime.getTopics));
        consumer.getConsumerRegistrationInfo().pipe(
          delay(200),
          withLatestFrom(topics$),
          tap(([subscription, topics]) => {
            if (topics && topics.length > 0) {
              this._store.dispatch(new topicsActions.UpdateSessionId(subscription.sessionId));
            } else {
              const subject = consumer.getConsumerRegistrationInfo() as Subject<WebSocketSubscription>;
              if (typeof subject.next === 'function') {
                subject.next(subscription);
              }
            }
          })
        ).subscribe();
        consumer.getStatusConnection().subscribe(item => {
          this._store.dispatch(new connectionStatusActions.GetConnectionStatus(item));
        });
        this._consumersByTopics[topic] = consumer;
      }
    }
    return consumer;
  }

  private destroyConsumer() {
    Object.keys(this._consumersByTopics).forEach((topic: string) => {
      this._consumersByTopics[topic]
        .destroyConsumer()
        .subscribe();
    });
    this._consumersByTopics = {};
  }
}
