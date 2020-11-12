import { Inject, Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import * as intersectionWith from 'lodash/intersectionWith';
import * as isEqual from 'lodash/isEqual';
import { Observable, zip } from 'rxjs';
import { filter, first, flatMap, map, mergeMap, tap, withLatestFrom } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';
import { ActionWithPayload } from '../../common/actions';
import { uuid } from '../../common/utils/uuid';
import * as widgetsActions from '../../widgets/actions/widgets.actions';
import { Widget } from '../../widgets/models';
import * as fromWidgets from '../../widgets/reducers';
import { WidgetsFactory } from '../../widgets/services';
import { WIDGETS_FACTORY } from '../../widgets/services/tokens';
import * as placeholdersActions from '../actions/placeholders.actions';
import * as tabEditorActions from '../actions/tab-editor.actions';
import * as tabsActions from '../actions/tabs.actions';
import { Placeholder } from '../models';
import * as fromDashboards from '../reducers';
import { GridService } from '../services/grid/grid.service';
import * as _ from 'lodash';
import { PlaceholderDefaultSize } from '../../widgets/models/constants';
import * as editingWidgetActions from '../../widgets/actions/editing-widget.actions';
import * as widgetReducer from '../../widgets/reducers';
import {WidgetType} from '../../widgets/constants/widget-types';
import { isChartWidget } from '../../widgets/utils/functions';

@Injectable()
export class TabEditorEffects {
  private _actions$: Actions;
  private _store: Store<fromDashboards.State>;
  private _gridService: GridService;
  private _widgetFactory: WidgetsFactory;

  @Effect() initialize$: Observable<Action>;
  @Effect({ dispatch: false }) addWidget$: Observable<Action>;
  @Effect({ dispatch: false }) dragWidget$: Observable<Action>;
  @Effect({ dispatch: false }) removeWidget$: Observable<any>;
  @Effect({ dispatch: false }) bulkAdd$: Observable<Action>;
  @Effect() bulkCreateNew$: Observable<Action>;
  @Effect() bulkUpdate$: Observable<Action>;
  @Effect() widgetToCreateSubscriber$: Observable<Action>;
  @Effect() updateEditingTab$: Observable<Action>;
  @Effect() adjustSize$: Observable<Action>;
  @Effect() createWidgetFromTemplate$: Observable<Action>;
  @Effect() updatePlaceholderWithNewWidget$: Observable<Action>;
  @Effect() addInstance$: Observable<Action>;
  @Effect() removeInstance$: Observable<Action>;
  @Effect() saveEditingWidget$: Observable<Action>;
  @Effect() cancelEditingWidget$: Observable<Action>;

  constructor(action: Actions,
    store: Store<fromDashboards.State>,
    gridService: GridService,
    @Inject(WIDGETS_FACTORY) widgetFactory: WidgetsFactory) {
    this._actions$ = action;
    this._store = store;
    this._gridService = gridService;
    this._widgetFactory = widgetFactory;

    this.initializeEffect();
    this.addWidgetEffect();
    this.dragWidgetEffect();
    this.removeWidgetEffect();
    this.bulkAddEffect();
    this.widgetToCreateSubscriber();
    this.updateEditingTab();
    this.adjustSizeEffect();
    this.createWidgetFromTemplateEffect();
    this.updatePlaceholderWithNewWidgetEffect();
    this.AddInstanceEffect();
    this.RemoveInstanceEffect();
    this.bulkUpdateEffect();
    this.bulkCreateNewEffect();
    this.saveEditingWidget();
    this.cancelEditingWidget();
  }

  initializeEffect() {
    this.initialize$ = this._actions$.pipe(
      ofType(tabEditorActions.INITIALIZE),
      flatMap((action: tabEditorActions.Initialize) => (
        this._store.pipe(
          select(fromDashboards.getPlaceholdersOfTab(action.payload)),
          first(),
          mergeMap((placeholders: Placeholder[]) => {
            return [
              new placeholdersActions.Set(placeholders),
              new tabEditorActions.BulkAdd(placeholders)
            ];
          })
        )
      ))
    );
  }

  bulkAddEffect() {
    this.bulkAdd$ = this._actions$.pipe(
      ofType(tabEditorActions.BULK_ADD),
      tap((action: tabEditorActions.BulkAdd) => {
        this._gridService.bulkAddWidget(action.payload);
      })
    );
  }

  bulkUpdateEffect() {
    this.bulkUpdate$ = this._actions$.pipe(
      ofType(tabEditorActions.BULK_UPDATE),
      map((action: tabEditorActions.BulkUpdate) => {
        this._gridService.removeWidget(action.payload.id);
        return new tabEditorActions.BulkCreateNew(action.payload);
      })
    );
  }

  bulkCreateNewEffect() {
    this.bulkCreateNew$ = this._actions$.pipe(
      ofType(tabEditorActions.BULK_CREATE_NEW),
      mergeMap((action: tabEditorActions.BulkCreateNew) => {
        return [new widgetsActions.AddSuccess(action.payload),
        new tabEditorActions.AddWidget(action.payload),
        new editingWidgetActions.Edit(action.payload)];
      })
    );
  }

  addWidgetEffect() {
    this.addWidget$ = this._actions$.pipe(
      ofType(tabEditorActions.ADD_WIDGET),
      tap((action: tabEditorActions.AddWidget) => {
        this._gridService.addWidget(this.createPlaceHolder(action.payload), { autoPosition: true });
      })
    );
  }

  dragWidgetEffect() {
    this.dragWidget$ = this._actions$.pipe(
      ofType(tabEditorActions.DRAG_WIDGET),
      tap((action: tabEditorActions.DragWidget) => {
        const placeholder = this.createPlaceHolder(action.payload.payload);
        const event = action.payload.event;
        this._gridService.createDraggableWidget(placeholder, event);
      })
    );
  }

  removeWidgetEffect() {
    this.removeWidget$ = this._actions$.pipe(
      ofType(tabEditorActions.REMOVE_WIDGET),
      withLatestFrom(this._store.pipe(select(widgetReducer.getEditingWidget))),
      tap(([action, editingWidget]) => {
        this._store.dispatch(new placeholdersActions.Delete(action.payload));
        if (editingWidget && editingWidget.id === action.widgetId) {
          this._store.dispatch(new editingWidgetActions.Edit(null));
        }
        this._gridService.removeWidget(action.payload);
      })
    );
  }

  widgetToCreateSubscriber() {
    this.widgetToCreateSubscriber$ = this._store.pipe(
      select(fromDashboards.getWidgetToCreate),
      filter(widget => !isNullOrUndefined(widget)),
      map((widget: Widget) => {
        this._gridService.addWidget(this.createPlaceHolder(widget));
        return new tabEditorActions.CreateWidgetSuccess();
      })
    );
  }

  updateEditingTab() {
    this.updateEditingTab$ = this._actions$.pipe(
      ofType(tabEditorActions.UPDATE_EDITING_TAB),
      flatMap((action: tabEditorActions.UpdateEditingTab) => {
        const editingTab$ = this._store.pipe(select(fromDashboards.getEditingTab(action.payload)));
        const originalPlaceholders$ = this._store.pipe(select(fromDashboards.getPlaceholdersOfTab(action.payload)));
        return zip(editingTab$, originalPlaceholders$).pipe(
          first(),
          filter(([editingTab, originalPlaceholders]) => {
            const intersect = intersectionWith(editingTab.placeholders, originalPlaceholders, isEqual);
            return intersect.length !== originalPlaceholders.length || intersect.length !== editingTab.placeholders.length;
          }),
          map(([editingTab]) => new tabsActions.Update(editingTab))
        );
      })
    );
  }

  adjustSizeEffect() {
    this.adjustSize$ = this._actions$.pipe(
      ofType(tabEditorActions.ADJUST_SIZE),
      map((action: tabEditorActions.AdjustSize) => {
        this._gridService.update();
        return new tabEditorActions.UpdateMetrics(this._gridService.metrics);
      })
    );
  }

  createWidgetFromTemplateEffect() {
    this.createWidgetFromTemplate$ = this._actions$.pipe(
      ofType(tabEditorActions.CREATE_WIDGET_FROM_TEMPLATE),
      flatMap((action: tabEditorActions.CreateWidgetFromTemplate) => {
        const placeholder$ = this._store.pipe(select(fromDashboards.getPlaceholderById(action.payload)));
        const template$ = this._store.pipe(select(fromDashboards.getPlaceholderWidget(action.payload)));
        const widgets$ = this._store.pipe(select(fromWidgets.getWidgets));
        return zip(placeholder$, template$, widgets$).pipe(
          filter(([placeholder]) => !isNullOrUndefined(placeholder)),
          first(),
          map(([placeholder, template, widgets]) => {
            const meta = { changeWidgetOfPlaceholder: placeholder.id };
            return new widgetsActions.Add(this._widgetFactory.createFromTemplate(template, widgets), meta);
          })
        );
      })
    );
  }

  updatePlaceholderWithNewWidgetEffect() {
    this.updatePlaceholderWithNewWidget$ = this._actions$.pipe(
      ofType(widgetsActions.ADD_RESPONSE),
      filter((action: ActionWithPayload<any>) => !action.error && action.meta && action.meta.changeWidgetOfPlaceholder),
      flatMap((action: widgetsActions.AddSuccess) => {
        return this._store.pipe(
          select(fromDashboards.getPlaceholderById(action.meta.changeWidgetOfPlaceholder)),
          first(),
          mergeMap((placeholder: Placeholder) => {
            const widgetId = action.payload.result[0];
            this._gridService.getGridItem(placeholder.id).setWidgetId(widgetId);
            return [
              new placeholdersActions.Set([{ ...placeholder, widgetId }]),
              new tabEditorActions.UpdateEditingTab(placeholder.tabId)
            ];
          })
        );
      })
    );
  }

  saveEditingWidget() {
    this.saveEditingWidget$ = this._actions$.pipe(
      ofType(tabEditorActions.SAVE_EDITING_WIDGET),
      mergeMap((action: tabEditorActions.SaveEditingWidget) => {
        return isChartWidget(action.payload.type) ? [
          new editingWidgetActions.Edit(action.payload),
          new widgetsActions.Add(action.payload),
          new tabEditorActions.AddWidget(action.payload)
        ] : [
          new widgetsActions.Add(action.payload),
          new tabEditorActions.AddWidget(action.payload)
        ];
      })
    );
  }


  cancelEditingWidget() {
    this.cancelEditingWidget$ = this._actions$.pipe(
      ofType(tabEditorActions.CANCEL_EDITING_WIDGET),
      flatMap((action: tabEditorActions.CancelEditingWidget) => {
        return [new tabEditorActions.RemoveWidget(null),
        new editingWidgetActions.Edit(null)];
      })
    );
  }

  private AddInstanceEffect() {
    this.addInstance$ = this._actions$.pipe(
      ofType(tabEditorActions.ADD_INSTANCE),
      flatMap((action: tabEditorActions.AddInstance) => {
        const editingTab$ = this._store.pipe(select(fromDashboards.getEditingTab(action.payload)));
        const plotPoint$ = this._store.pipe(select(fromDashboards.getPlotPoint));
        return zip(editingTab$, plotPoint$).pipe(
          first(),
          map(([editingTab, plotPoint]) => {
            if (plotPoint && !isNullOrUndefined(plotPoint.instance)) {
              if (isNullOrUndefined(editingTab.globalFilters)) {
                editingTab.globalFilters = [];
              }
              editingTab.globalFilters = _.union(editingTab.globalFilters, [plotPoint.instance]);
            }
            return new tabsActions.Update(editingTab);
          })
        );
      })
    );
  }

  private RemoveInstanceEffect() {
    this.removeInstance$ = this._actions$.pipe(
      ofType(tabEditorActions.REMOVE_INSTANCE),
      flatMap((action: tabEditorActions.RemoveInstance) => {
        const tabData = action.payload;
        const editingTab$ = this._store.pipe(select(fromDashboards.getEditingTab(tabData.id)));
        return editingTab$.pipe(
          first(),
          filter((editingTab: any) => {
            return editingTab.globalFilters && editingTab.globalFilters.indexOf(tabData.instance) >= 0;
          }),
          map(((editingTab: any) => {
            const index = editingTab.globalFilters.indexOf(tabData.instance);
            editingTab.globalFilters.splice(index, 1);
            return new tabsActions.Update(editingTab);
          })
          ));
      })
    );
  }

  private createPlaceHolder(widget?: Widget): Placeholder {
    const size = widget.defaultSize ? widget.defaultSize : PlaceholderDefaultSize;

    return {
      id: uuid(),
      widgetId: widget.id,
      size,
      position: { x: 0, y: 0 },
      avatar: `assets/img/chart_thumbnails/${widget.type.replace(' ', '-').toLowerCase()}.svg`
    };
  }

}
