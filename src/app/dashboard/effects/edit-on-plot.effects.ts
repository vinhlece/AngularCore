import {Inject, Injectable} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Action, select, Store} from '@ngrx/store';
import {Observable, zip} from 'rxjs';
import {filter, first, flatMap, map, withLatestFrom} from 'rxjs/operators';
import {isNullOrUndefined} from 'util';
import * as widgetsActions from '../../widgets/actions/widgets.actions';
import {BarWidget, LineWidget, TabularWidget, Widget} from '../../widgets/models';
import * as fromWidgets from '../../widgets/reducers';
import * as editOnPlotActions from '../actions/edit-on-plot.actions';
import {ConfirmationDialogComponent} from '../components/confirmation-dialog/confirmation-dialog.component';
import * as fromDashboards from '../reducers';
import {PlotEditor} from '../services';
import {PLOT_EDITOR} from '../services/tokens';
import {ConfirmationTitleDialogComponent} from '../components/confirmation-title-dialog/confirmation-title-dialog.component';
import {TimeRangeDialogContainer} from '../containers/time-range-dialog-container/time-range-dialog.container';
import {WidgetMode, WidgetType} from '../../widgets/constants/widget-types';
import {SelectOptionDialogComponent} from '../components/select-option-dialog/select-option-dialog.component';
import {DataDisplayType} from '../../widgets/models/enums';
import {DummyAction} from '../../common/actions/index';
import {DragOption} from '../models/enums';
import * as _ from 'lodash';

@Injectable()
export class EditOnPlotEffects {
  private _actions$: Actions;
  private _store: Store<fromDashboards.State>;
  private _plotEditor: PlotEditor;
  private _dialogService: MatDialog;

  @Effect() updateMetrics$: Observable<Action>;
  @Effect() confirm$: Observable<Action>;
  @Effect() update$: Observable<Action>;
  @Effect() addMeasure$: Observable<Action>;
  @Effect() updateMeasure$: Observable<Action>;
  @Effect() confirmTitle$: Observable<Action>;
  @Effect() setTimeRange$: Observable<Action>;
  @Effect() dropTimeStampDialog$: Observable<Action>;
  @Effect() selectOption$: Observable<Action>;
  @Effect() dropTimeStamp$: Observable<Action>;

  constructor(actions$: Actions, store: Store<fromDashboards.State>, @Inject(PLOT_EDITOR) plotEditor, dialogService: MatDialog) {
    this._actions$ = actions$;
    this._store = store;
    this._plotEditor = plotEditor;
    this._dialogService = dialogService;

    this.updateMetricsEffect();
    this.confirmEffect();
    this.updateEffect();
    this.addMeasureEffect();
    this.updateMeasureEffect();
    this.confirmTitleEffect();
    this.setTimeRangeEffect();
    this.dropTimeStampDialogEffect();
    this.selectOptionEffect();
    this.dropTimeStampEffect();
  }

  private updateMetricsEffect() {
    this.updateMetrics$ = this._actions$.pipe(
      ofType(editOnPlotActions.UPDATE_METRICS),
      withLatestFrom(this._store.pipe(select(fromDashboards.getPlotPoint))),
      flatMap(([action, point]) => {
        const payload = (action as editOnPlotActions.UpdateMetrics).payload;
        return zip(this.getWidgetObs(point.widgetId), this.getWidgetObs(payload.widgetId)).pipe(
          first(),
          map(([srcWidget, targetWidget]) => {
            const options = {...payload, srcWidget, targetWidget, point};
            const confirmation = payload.confirmation;
            return confirmation && typeof confirmation === 'function' && confirmation(srcWidget, targetWidget, point)
              ? new editOnPlotActions.Confirm(options)
              : new editOnPlotActions.Update({...options, confirmation: null});
          }),
        );
      })
    );
  }

  private confirmEffect() {
    this.confirm$ = this._actions$.pipe(
      ofType(editOnPlotActions.CONFIRM),
      flatMap((action: editOnPlotActions.Confirm) => {
        const confirmation = action.payload.confirmation(action.payload.srcWidget, action.payload.targetWidget, action.payload.point);
        const dialog = this._dialogService.open(ConfirmationDialogComponent, {
          width: '512px',
          data: {
            title: 'Confirmation',
            message: confirmation.message,
            choices: confirmation.choices
          }
        });
        return dialog.afterClosed().pipe(
          map((result: string) => new editOnPlotActions.Update({
            ...action.payload,
            confirmation: result
          }))
        );
      })
    );
  }

  private confirmTitleEffect() {
    this.confirmTitle$ = this._actions$.pipe(
      ofType(editOnPlotActions.CONFIRM_TITLE),
      flatMap((action: editOnPlotActions.ConfirmTitle) => {
        const payload = (action as editOnPlotActions.ConfirmTitle).payload;
        const {srcWidget, targetWidget, point} = payload;
        const dialog = this._dialogService.open(ConfirmationTitleDialogComponent, {
          width: '450px',
          data: {
            title: 'Title',
            input: payload.measure.valueGetter(srcWidget, targetWidget, point.measure)
          }
        });
        return dialog.afterClosed().pipe(
          map((result: string) => new editOnPlotActions.Update({
            ...action.payload,
            confirmation: result
          }))
        );
      })
    );
  }

  private updateEffect() {
    this.update$ = this._actions$.pipe(
      ofType(editOnPlotActions.UPDATE),
      map((action: editOnPlotActions.Update) => this._plotEditor.updateMetrics(action.payload)),
      filter((widget: Widget) => !isNullOrUndefined(widget)),
      map((widget: Widget) => new widgetsActions.Update(widget))
    );
  }

  private addMeasureEffect() {
    this.addMeasure$ = this._actions$.pipe(
      ofType(editOnPlotActions.ADD_MEASURE),
      filter((action) => {
        const payload = (action as editOnPlotActions.AddMeasure).payload;
        return payload.widget.measures.findIndex(measure => measure === payload.newMeasure) < 0;
      }),
      map((action) => {
        const payload = (action as editOnPlotActions.AddMeasure).payload;
        const data = {
          confirmation: null,
          srcWidget: null,
          targetWidget: payload.widget,
          measure: payload.builder,
          point: {dataType: payload.widget.dataType, measure: payload.newMeasure}
        };
        return new editOnPlotActions.Update(data);
      })
    );
  }

  private updateMeasureEffect() {
    const plotPoint$ = this._store.pipe(select(fromDashboards.getPlotPoint));
    this.updateMeasure$ = this._actions$.pipe(
      ofType(editOnPlotActions.UPDATE_MEASURE),
      withLatestFrom(plotPoint$),
      filter(([action, plotPoint]) => {
        const payload = (action as editOnPlotActions.UpdateMeasure).payload;
        return payload.widget.measures.findIndex(measure => measure === payload.newMeasure) < 0;
      }),
      map(([action, plotPoint]) => {
        const payload = (action as editOnPlotActions.UpdateMeasure).payload;
        const valueGetter = (srcWidget: Widget, targetWidget: Widget, srcValue: string) => payload.newMeasure;
        const data = {
          confirmation: null,
          srcWidget: null,
          targetWidget: payload.widget,
          measure: {...payload.builder, valueGetter},
          point: {dataType: plotPoint.dataType, measure: plotPoint.measure}
        };
        return payload.confirmation ? new editOnPlotActions.ConfirmTitle(data) : new editOnPlotActions.Update(data);
      })
    );
  }

  private setTimeRangeEffect() {
    this.setTimeRange$ = this._actions$.pipe(
      ofType(editOnPlotActions.SET_TIME_RANGE),
      flatMap((action) => {
        const widget = (action as editOnPlotActions.ChangeTimeRange).payload;
        const type = widget.type;
        let timeGroup;
        if (widget.type === WidgetType.Tabular || widget.type === WidgetType.Line) {
          timeGroup = widget['customTimeRange'] ? widget['customTimeRange'] : null;
        } else if (type === WidgetType.Bar) {
          timeGroup = (widget as BarWidget).mode.timeGroup;
        }
        const dialog = this._dialogService.open(TimeRangeDialogContainer, {
          width: '535px',
          data: {
            title: 'Select Time Range',
            timeGroup,
            type
          }
        });
        return dialog.afterClosed().pipe(
          filter((result: any) => !isNullOrUndefined(result)),
          map((result: any) => {
            if (widget.type === WidgetType.Tabular) {
              (widget as TabularWidget).displayData = DataDisplayType.ShowInterval;
              (widget as TabularWidget).customTimeRange = result.timeGroup;
            } else if (widget.type === WidgetType.Bar) {
              (widget as BarWidget).mode.value = WidgetMode.TimeRange;
              (widget as BarWidget).mode.timeGroup = result.timeGroup;
            } else if (widget.type === WidgetType.Line) {
              (widget as LineWidget).customTimeRange = result.timeGroup;
            }
            return new widgetsActions.Update(widget);
          })
        );
      })
    );
  }

  private dropTimeStampDialogEffect() {
    this.dropTimeStampDialog$ = this._actions$.pipe(
      ofType(editOnPlotActions.DROP_TIMESTAMP_DIALOG),
      withLatestFrom(this._store.pipe(select(fromDashboards.getPlotPoint))),
      flatMap(([action, point]) => {
        const payload = (action as editOnPlotActions.DropTimeStampDialog).payload;
        return zip(this.getWidgetObs(point.widgetId), this.getWidgetObs(payload.metrics.widgetId)).pipe(
          first(),
          map(([srcWidget, targetWidget]) => {
            const intervalMode = srcWidget as TabularWidget &&
              (srcWidget as TabularWidget).displayData === DataDisplayType.ShowInterval;
            if (intervalMode) {
              const options = [];
              const checkDimension = (instances) => {
                return targetWidget.dimensions.reduce((acc, item) => {
                  return acc && !this.isNotExisted([...item.systemInstances, ...item.customInstances], instances);
                }, true);
              };
              if (!checkDimension(point.instance) ||
                (point.groupParams && !checkDimension(point.groupParams.instance))) {
                options.push(DragOption.AddInstance);
              }
              if (this.isNotExisted(targetWidget.measures, point.measure) ||
                (point.groupParams && this.isNotExisted(targetWidget.measures, point.groupParams.measure))) {
                options.push(DragOption.AddMeasure);
              }
              const enableAddTimestamp = !point.groupParams || (targetWidget.type === WidgetType.Line && point.groupParams) ||
                (targetWidget.type === WidgetType.Bar && (targetWidget as BarWidget).mode.value === WidgetMode.TimeRange && point.groupParams);
              if (enableAddTimestamp && (this.isNotExisted(targetWidget.timestamps, point.otherParams['timestamp'])
                  || (point.groupParams && this.isNotExisted(targetWidget.timestamps, point.groupParams.timestamps)))) {
                options.push(DragOption.AddTimestamp);
              }
              if (options.length === 0) {
                return new DummyAction();
              }
              return new editOnPlotActions.SelectOptionDialog({
                ...payload,
                targetWidget,
                options
              });
            }
            return new editOnPlotActions.UpdateMetrics(payload.metrics);
          }),
        );
      })
    );
  }

  private isNotExisted(WidgetData: any, value: any) {
    if (!value) {
      return false;
    }
    if (!WidgetData) {
      return true;
    }
    let existed = null;
    if (Array.isArray(value)) {
      existed = _.difference(value, WidgetData);
      return existed.length > 0;
    } else {
      existed = WidgetData.find(param => param === value);
      return isNullOrUndefined(existed);
    }
  }

  private dropTimeStampEffect() {
    this.dropTimeStamp$ = this._actions$.pipe(
      ofType(editOnPlotActions.DROP_TIMESTAMP),
      withLatestFrom(this._store.pipe(select(fromDashboards.getPlotPoint))),
      flatMap(([action, point]) => {
        const payload = (action as editOnPlotActions.DropTimeStamp).payload;
        return this.getWidgetObs(point.widgetId).pipe(
          first(),
          map((srcWidget: Widget) => {
            const intervalMode = srcWidget as TabularWidget &&
              (srcWidget as TabularWidget).displayData === DataDisplayType.ShowInterval;
            if (intervalMode && point.otherParams) {
              payload.metrics = {...payload.metrics, ...payload.timestamp};
            }
            return new editOnPlotActions.UpdateMetrics(payload.metrics);
          })
        );
      })
    );
  }

  private selectOptionEffect() {
    this.selectOption$ = this._actions$.pipe(
      ofType(editOnPlotActions.SELECT_OPTION_DIALOG),
      withLatestFrom(this._store.pipe(select(fromDashboards.getPlotPoint))),
      flatMap(([action, point]) => {
        const payload = (action as editOnPlotActions.SelectOptionDialog).payload;
        const dialog = this._dialogService.open(SelectOptionDialogComponent, {
          width: '535px',
          panelClass: 'add-new-widget',
          data: {
            title: 'Select Options',
            options: payload.options
          }
        });
        return dialog.afterClosed().pipe(
          filter((result: any) => !isNullOrUndefined(result)),
          map((result: string[]) => {
            let builder = null;
            if (payload.targetWidget.type === WidgetType.Bar) {
              const mode = (payload.targetWidget as BarWidget).mode.value;
              builder = payload.optionsGetter(result, mode, !isNullOrUndefined(point.groupParams));
            } else if (payload.targetWidget.type === WidgetType.Line) {
              builder = payload.optionsGetter(result, !isNullOrUndefined(point.groupParams));
            }
            const metrics = {
              widgetId: payload.metrics.widgetId,
              confirmation: payload.metrics.confirmation,
              ...builder
            };
            return new editOnPlotActions.UpdateMetrics(metrics);
          })
        );
      })
    );
  }

  private getWidgetObs(id: string): Observable<Widget> {
    return this._store.pipe(select(fromWidgets.getWidgetById(id)));
  }
}
