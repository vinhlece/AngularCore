import {Inject, Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Action, select, Store} from '@ngrx/store';
import {Observable, of, zip} from 'rxjs';
import {first, flatMap, map, withLatestFrom} from 'rxjs/operators';
import {DummyAction} from '../../common/actions';
import * as fromMeasures from '../../measures/reducers';
import * as widgetsActions from '../../widgets/actions/widgets.actions';
import {TrendDiffWidget} from '../../widgets/models';
import * as fromWidgets from '../../widgets/reducers';
import {
  createBillboardWidget,
  createDayTrendDiffWidget,
  createShiftTrendDiffWidget, createTableWidget,
  createTimelineWidget,
  createWeekTrendDiffWidget,
  createLiquidFillGaugeWidget
} from '../../widgets/services/widgets.factory';
import * as creationOnPlotActions from '../actions/creation-on-plot.actions';
import * as fromDashboards from '../reducers';
import {PlotEditor} from '../services';
import {PLOT_EDITOR} from '../services/tokens';
import {isNullOrUndefined} from 'util';
import {filter} from 'rxjs/internal/operators';

@Injectable()
export class CreationOnPlotEffects {
  private _actions$: Actions;
  private _store: Store<fromDashboards.State>;
  private _plotEditor: PlotEditor;

  @Effect() createTimeLine$: Observable<Action>;
  @Effect() createBillboard$: Observable<Action>;
  @Effect() createLiquidFillGauge$: Observable<Action>;
  @Effect() createTrendDiff$: Observable<Action>;
  @Effect() createTable$: Observable<Action>;

  constructor(action: Actions, store: Store<fromDashboards.State>, @Inject(PLOT_EDITOR) plotEditor) {
    this._actions$ = action;
    this._store = store;
    this._plotEditor = plotEditor;

    this.createTimeLineEffect();
    this.createBillboardEffect();
    this.createLiquidFillGaugeEffect();
    this.createTrendDiffEffect();
    this.createTableEffect();
  }

  private createTimeLineEffect() {
    this.createTimeLine$ = this._actions$.pipe(
      ofType(creationOnPlotActions.CREATE_TIME_LINE),
      withLatestFrom(this._store.pipe(select(fromDashboards.getPlotPoint))),
      flatMap(([action, point]) => {
        return zip(
          this._store.pipe(select(fromWidgets.getWidgetById(point.widgetId))),
          this._store.pipe(select(fromMeasures.getMeasure(point.dataType, point.measure)))
        ).pipe(
          first(),
          map(([widget, measure]) => {
            const timeLineWidget = createTimelineWidget(widget.dataType, measure.name, point.instance, point.dimension);

            const sideEffects = (action as creationOnPlotActions.CreateTimeLine).payload;
            const finalWidget = this._plotEditor.updateSideEffects(timeLineWidget, point, sideEffects, {measure: measure.name});

            return new widgetsActions.Add(finalWidget, {addToGrid: true});
          })
        );
      })
    );
  }

  private createBillboardEffect() {
    this.createBillboard$ = this._actions$.pipe(
      ofType(creationOnPlotActions.CREATE_BILLBOARD),
      withLatestFrom(this._store.pipe(select(fromDashboards.getPlotPoint))),
      flatMap(([action, point]) => {
        return zip(
          this._store.pipe(select(fromWidgets.getWidgetById(point.widgetId))),
          this._store.pipe(select(fromMeasures.getMeasure(point.dataType, point.measure)))
        ).pipe(
          first(),
          map(([widget, measure]) => {
            const billboardWidget = createBillboardWidget(widget.dataType, measure.name, point.instance, point.dimension, point.window);
            return new widgetsActions.Add(billboardWidget, {addToGrid: true});
          })
        );
      })
    );
  }

  private createLiquidFillGaugeEffect() {
    this.createLiquidFillGauge$ = this._actions$.pipe(
      ofType(creationOnPlotActions.CREATE_LIQUID_FILL_GAUGE),
      withLatestFrom(this._store.pipe(select(fromDashboards.getPlotPoint))),
      flatMap(([action, point]) => {
        return zip(
          this._store.pipe(select(fromWidgets.getWidgetById(point.widgetId))),
          this._store.pipe(select(fromMeasures.getMeasure(point.dataType, point.measure)))
        ).pipe(
          first(),
          map(([widget, measure]) => {
            const liquidFillgauge = createLiquidFillGaugeWidget(widget, measure.name, point.instance, point.dimension, point.window);
            return new widgetsActions.Add(liquidFillgauge, {addToGrid: true});
          })
        );
      })
    );
  }

  private createTableEffect() {
    this.createTable$ = this._actions$.pipe(
      ofType(creationOnPlotActions.CREATE_TABLE),
      withLatestFrom(this._store.pipe(select(fromDashboards.getPlotPoint))),
      flatMap(([action, point]) => {
        return zip(
          this._store.pipe(select(fromWidgets.getWidgetById(point.widgetId))),
          this._store.pipe(select(fromMeasures.getMeasure(point.dataType, point.measure)))
        ).pipe(
          first(),
          map(([widget, measure]) => {
            const tableWidget = createTableWidget(widget.dataType, widget.measures, widget.dimensions, widget.name, point.window);
            return new widgetsActions.Add(tableWidget, {addToGrid: true});
          })
        );
      })
    );
  }

  private createTrendDiffEffect() {
    const trendDiffFactoryMapper = {
      [creationOnPlotActions.CREATE_SHIFT_TREND_DIFF]: (widget) => createShiftTrendDiffWidget(widget),
      [creationOnPlotActions.CREATE_DAY_TREND_DIFF]: (widget) => createDayTrendDiffWidget(widget),
      [creationOnPlotActions.CREATE_WEEK_TREND_DIFF]: (widget) => createWeekTrendDiffWidget(widget)
    };

    type actions = creationOnPlotActions.CreateShiftTrendDiff
      | creationOnPlotActions.CreateDayTrendDiff
      | creationOnPlotActions.CreateWeekTrendDiff;

    const actionTypes = [
      creationOnPlotActions.CREATE_SHIFT_TREND_DIFF,
      creationOnPlotActions.CREATE_DAY_TREND_DIFF,
      creationOnPlotActions.CREATE_WEEK_TREND_DIFF
    ];

    this.createTrendDiff$ = this._actions$.pipe(
      ofType<actions>(...actionTypes),
      withLatestFrom(this._store.pipe(select(fromDashboards.getPlotPoint))),
      filter(([action, point]) => !isNullOrUndefined(point)),
      flatMap(([action, point]) => {
        if (!(point.widgetId && point.instance && point.measure)) {
          return of(new DummyAction());
        }

        return zip(
          this._store.pipe(select(fromWidgets.getWidgetById(point.widgetId))),
          this._store.pipe(select(fromMeasures.getMeasure(point.dataType, point.measure)))
        ).pipe(
          first(),
          map(([widget, measure]) => {
            const trendDiffWidget: TrendDiffWidget = {
              ...trendDiffFactoryMapper[action.type](widget),
              dimensions: [{dimension: point.dimension, systemInstances: [point.instance], customInstances: []}],
              measures: [measure.name],
              windows: [point.window]
            };
            return new widgetsActions.Add(trendDiffWidget, {addToGrid: true});
          })
        );
      })
    );
  }
}
