import {Inject, Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Action, select, Store} from '@ngrx/store';
import {Observable, of} from 'rxjs';
import {catchError, flatMap, map, mergeMap, switchMap, withLatestFrom} from 'rxjs/operators';
import * as navigationActions from '../../layout/actions/navigation.actions';
import * as fromUsers from '../../user/reducers';
import {State} from '../../user/reducers';
import * as widgetsActions from '../actions/widgets.actions';
import {Widget} from '../models';
import {WidgetService} from '../services/http/widgets.service';
import * as editingWidgetAction from '../actions/editing-widget.actions';
import {getEditingWidget} from '../reducers/index';
import {WidgetsFactory} from '../services/index';
import {WIDGETS_FACTORY} from '../services/tokens';
import {WidgetType} from '../constants/widget-types';
import {concatMap, delay} from 'rxjs/internal/operators';

@Injectable()
export class WidgetsEffects {
  private _actions$: Actions;
  private _widgetService: WidgetService;
  private _widgetFactory: WidgetsFactory;
  private _store: Store<State>;

  @Effect() loadAll$: Observable<Action>;
  @Effect() load$: Observable<Action>;
  @Effect() add$: Observable<Action>;
  @Effect() update$: Observable<Action>;
  @Effect() delete$: Observable<Action>;
  @Effect() reset$: Observable<Action>;
  @Effect() addAndNavigate$: Observable<Action>;
  @Effect() updateAndNavigate$: Observable<Action>;
  @Effect() search$: Observable<Action>;
  @Effect() changeType$: Observable<Action>;
  @Effect() copy$: Observable<Action>;

  constructor(actions$: Actions, widgetService: WidgetService, store: Store<State>, @Inject(WIDGETS_FACTORY) widgetFactory: WidgetsFactory) {
    this._actions$ = actions$;
    this._widgetService = widgetService;
    this._widgetFactory = widgetFactory;
    this._store = store;

    this.configureEffects();
  }

  private configureEffects() {
    this.configureLoadAllEffect();
    this.configureLoadEffect();
    this.configureAddEffect();
    this.configureUpdateEffect();
    this.configureDeleteEffect();
    this.configureAddAndNavigateEffect();
    this.configureUpdateAndNavigateEffect();
    this.searchEffect();
    this.resetEffect();
    this.changeChartTypeEffect();
    this.copyEffect();
  }

  private configureLoadAllEffect() {
    this.loadAll$ = this._actions$.pipe(
      ofType(widgetsActions.LOAD_ALL),
      withLatestFrom(this._store.select(fromUsers.getAuthenticatedUser)),
      flatMap(([action, user]) => (
        this._widgetService.getAll(user.id).pipe(
          map((widgets: Widget[]) => new widgetsActions.LoadAllSuccess(widgets)),
          catchError((error: Error) => of(new widgetsActions.LoadAllFailure(error)))
        )
      ))
    );
  }

  private configureLoadEffect() {
    this.load$ = this._actions$.pipe(
      ofType(widgetsActions.LOAD),
      switchMap((action: widgetsActions.Load) => (
        this._widgetService.get(action.payload).pipe(
          map((widget: Widget) => new widgetsActions.LoadSuccess(widget, action.meta)),
          catchError((error: Error) => of(new widgetsActions.LoadFailure(error)))
        )
      ))
    );
  }

  private configureAddEffect() {
    this.add$ = this._actions$.pipe(
      ofType(widgetsActions.ADD),
      withLatestFrom(this._store.select(fromUsers.getAuthenticatedUser)),
      flatMap(([action, user]) => (
        this._widgetService
          .add({
            ...(action as widgetsActions.Add).payload,
            userId: user.id
          })
          .pipe(
            map((widget: Widget) => new widgetsActions.AddSuccess(widget, (action as widgetsActions.Add).meta)),
            catchError((error: Error) => of(new widgetsActions.AddFailure(error)))
          )
      ))
    );
  }

  private configureUpdateEffect() {
    this.update$ = this._actions$.pipe(
      ofType(widgetsActions.UPDATE),
      flatMap((action: widgetsActions.Update) => (
        this._widgetService.update(action.payload).pipe(
          map((widget: Widget) => new widgetsActions.UpdateSuccess(widget)),
          catchError((error: Error) => of(new widgetsActions.UpdateFailure(error)))
        )
      ))
    );
  }

  private configureDeleteEffect() {
    this.delete$ = this._actions$.pipe(
      ofType(widgetsActions.DELETE),
      flatMap((action: widgetsActions.Delete) => (
        this._widgetService.remove(action.payload).pipe(
          map((id: string) => new widgetsActions.DeleteSuccess(id)),
          catchError((error: Error) => of(new widgetsActions.DeleteFailure(error)))
        )
      ))
    );
  }

  private configureAddAndNavigateEffect() {
    this.addAndNavigate$ = this._actions$.pipe(
      ofType(widgetsActions.ADD_AND_NAVIGATE),
      withLatestFrom(this._store.select(fromUsers.getAuthenticatedUser)),
      flatMap(([action, user]) => (
        this._widgetService
          .add({
            ...(action as widgetsActions.Add).payload,
            userId: user.id
          })
          .pipe(
            mergeMap((widget: Widget) => {
              const actions = [navigationActions.navigateToEditWidget(widget)];
              return [new widgetsActions.AddSuccess(widget), ...actions];
            }),
            catchError((error: Error) => of(new widgetsActions.AddFailure(error)))
          )
      ))
    );
  }

  private configureUpdateAndNavigateEffect() {
    this.updateAndNavigate$ = this._actions$.pipe(
      ofType(widgetsActions.UPDATE_AND_NAVIGATE),
      flatMap((action: widgetsActions.UpdateAndNavigate) => (
        this._widgetService.update(action.payload).pipe(
          mergeMap((widget: Widget) => {
            const actions = [navigationActions.navigateToWidgetList()];
            return [ new widgetsActions.UpdateSuccess(widget),
                    ...actions];
          }),
          catchError((error: Error) => of(new widgetsActions.UpdateFailure(error)))
        )
      ))
    );
  }

  private searchEffect() {
    this.search$ = this._actions$.pipe(
      ofType(widgetsActions.SEARCH),
      withLatestFrom(this._store.select(fromUsers.getAuthenticatedUser)),
      switchMap(([action, user]) => (
        this._widgetService.findByName(user.id, (action as widgetsActions.Search).payload).pipe(
          map((widgets: Widget[]) => new widgetsActions.SearchSuccess(widgets)),
          catchError((error: Error) => of(new widgetsActions.SearchFailure(error)))
        )
      ))
    );
  }

  private resetEffect() {
    this.reset$ = this._actions$.pipe(
      ofType(widgetsActions.RESET),
      switchMap((action: widgetsActions.Reset) => {
        return this._widgetService.remove(action.payload.id).pipe(
          mergeMap((id: string) => [new widgetsActions.DeleteSuccess(id),
                                            new widgetsActions.AddAndNavigate(action.payload)]),
          catchError((error: Error) => of(new widgetsActions.DeleteFailure(error)))
        );
      })
    );
  }

  private changeChartTypeEffect() {
    this.changeType$ = this._actions$.pipe(
      ofType(editingWidgetAction.UPDATE),
      withLatestFrom(this._store.pipe(select(getEditingWidget))),
      map(([action, widget]) => {
        const changeAction = action as editingWidgetAction.Update;
        const {id, userId, name, dataType, defaultSize, isTemplate} = widget;
        const type = changeAction.payload.type;
        const newWidget: Widget = {
          ...this._widgetFactory.create({type}, null),
          id, userId, name, dataType, defaultSize, isTemplate,
          ...changeAction.payload
        };
        if (type === WidgetType.Tabular) {
          const columns = this.createTabularColumns(newWidget.measures)
          newWidget['columns'] = columns;
        }
        return new editingWidgetAction.Edit(newWidget);
      })
    );
  }

  private createTabularColumns(measures) {
    const columns = [];
    measures.forEach(measure => {
      const column = {
        id: measure,
        title: measure,
        type: 'number',
        visibility: true,
        group: {
          enable: false,
          priority: null
        },
        aggFunc: null,
        threshold: null
      };

      columns.push(column);
    });

    return columns;
  }

  private copyEffect() {
    this.copy$ = this._actions$.pipe(
      ofType(widgetsActions.COPY),
      delay(200),
      concatMap((action: widgetsActions.Copy) => (
        this._widgetService
          .add(action.payload)
          .pipe(
            map((widget: Widget) => new widgetsActions.AddSuccess(widget, {addToGrid: true})),
            catchError((error: Error) => of(new widgetsActions.AddFailure(error)))
          )
      ))
    );
  }
}
