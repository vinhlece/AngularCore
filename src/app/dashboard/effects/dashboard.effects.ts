import {Inject, Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Action, select, Store} from '@ngrx/store';
import {Observable, of} from 'rxjs';
import {catchError, flatMap, map, mergeMap, switchMap} from 'rxjs/operators';
import {createTab} from '../../common/models/factory/createTab';
import * as dashboardActions from '../actions/dashboards.action';
import {Dashboard, Placeholder, Tab} from '../models';
import {DashboardNavigator} from '../services';
import {DashboardService} from '../services/http/dashboard.service';
import {TabService} from '../services/http/tab.service';
import {DASHBOARD_NAVIGATOR} from '../services/tokens';
import * as tabsActions from '../actions/tabs.actions';
import {DummyAction} from '../../common/actions/index';
import * as fromDashboards from '../reducers/index';
import * as fromWidgets from '../../widgets/reducers/index';
import {concatMap, withLatestFrom} from 'rxjs/internal/operators';
import {uuid} from '../../common/utils/uuid';
import {Widget} from '../../widgets/models/index';
import * as WidgetActions from '../../widgets/actions/widgets.actions';
import {isNullOrUndefined} from '../../common/utils/function';
import * as tabActions from '../actions/tabs.actions';

@Injectable()
export class DashboardsEffect {
  private _actions$: Actions;
  private _dashboardService: DashboardService;
  private _tabService: TabService;
  private _navigator: DashboardNavigator;
  private _store: Store<fromDashboards.State>;

  @Effect() loadAll$: Observable<Action>;
  @Effect() load$: Observable<Action>;
  @Effect() add$: Observable<Action>;
  @Effect() delete$: Observable<Action>;
  @Effect() update$: Observable<Action>;
  @Effect() loadTabs$: Observable<Action>;
  @Effect() copy$: Observable<Action>;
  @Effect() copyTab$: Observable<Action>;

  constructor(action$: Actions,
              store: Store<fromDashboards.State>,
              dashboardService: DashboardService,
              tabService: TabService,
              @Inject(DASHBOARD_NAVIGATOR) navigator: DashboardNavigator) {
    this._actions$ = action$;
    this._dashboardService = dashboardService;
    this._tabService = tabService;
    this._navigator = navigator;
    this._store = store;

    this.loadAllEffect();
    this.loadEffect();
    this.addEffect();
    this.deleteEffect();
    this.updateEffect();
    this.loadTabEffect();
    this.copyEffect();
    this.copyTabEffect();
  }

  loadAllEffect() {
    this.loadAll$ = this._actions$.pipe(
      ofType(dashboardActions.LOAD_ALL),
      switchMap((action: dashboardActions.LoadAll) => (
        this._dashboardService.getDashboardsByUser(action.payload).pipe(
          map((dashboards: Dashboard[]) => new dashboardActions.LoadAllSuccess(dashboards)),
          catchError((error: Error) => of(new dashboardActions.LoadAllFailure(error)))
        )
      ))
    );
  }

  loadTabEffect() {
    this.loadTabs$ = this._actions$.pipe(
      ofType(tabsActions.LOAD),
      switchMap((action: tabsActions.Load) => (
        this._tabService.getTabs().pipe(
          map((tabs: Tab[]) => {
            return new tabsActions.LoadSuccess(tabs);
          }),
          catchError((error: Error) => of(new tabsActions.LoadFailure(error)))
        )
      ))
    );
  }

  loadEffect() {
    this.load$ = this._actions$.pipe(
      ofType(dashboardActions.LOAD),
      switchMap((action: dashboardActions.Load) => (
        this._dashboardService.getDashboardWithTabs(action.payload).pipe(
          map((dashboard: Dashboard) => new dashboardActions.LoadSuccess(dashboard)),
          catchError((error: Error) => of(new dashboardActions.LoadFailure(error)))
        )
      ))
    );
  }


  /**
   * Add a new dashboard, after add dashboard success, add a new tab for this dashboard
   * This effect will dispatch success action (upsert dashboard) when add dashboard success, no matter when add tab success or not
   * There is no error action if add tab failed
   */
  addEffect() {
    this.add$ = this._actions$.pipe(
      ofType(dashboardActions.ADD),
      mergeMap((action: dashboardActions.Add) => (
        this._dashboardService.addDashboard(action.dashboard).pipe(
          flatMap((dashboard: Dashboard) => (
            // Add a new tab for this newly created dashboard, name of this tab will be the default name
            this._tabService.add(createTab({dashboardId: dashboard.id})).pipe(
              map((tab: Tab) => {
                // Disable navigate to dashboard detail by net::ERR_CONNECTION_RESET many times
                this._navigator.navigateToDashboardDetails(dashboard.id);
                return new dashboardActions.AddSuccess(dashboard);
              }),
              // We still dispatch success action when add tab failed, no error action here
              catchError((error: Error) => of(new dashboardActions.AddSuccess(dashboard)))
            )
          )),
          catchError((error: Error) => of(new dashboardActions.AddFailure(error)))
        )
      ))
    );
  }

  copyEffect() {
    const tabs$ = this._store.pipe(select(fromDashboards.getTabs));
    const widgets$ = this._store.pipe(select((fromWidgets.getWidgets)));
    const dashboards$ = this._store.pipe(select(fromDashboards.getDashboards));
    this.copy$ = this._actions$.pipe(
      ofType(dashboardActions.COPY),
      withLatestFrom(tabs$, widgets$, dashboards$),
      mergeMap(([action, tabs, widgets, dashboards]) => {
        const actions = [];
        let temp_placeholders = []
        const dashboard = (action as dashboardActions.Copy).payload;
        // get original tab of dashboard
        const dashboardTab: Tab = tabs.find(tab => tab.dashboardId === dashboard.id);
        let original_widgets;
        if (dashboardTab) {
          // get original placeholders
          const placeholders = dashboardTab.placeholders;
          if (placeholders && placeholders.length > 0) {
            const widgetId = placeholders.map(p => p.widgetId);
            // get original widgets from placeholders
            original_widgets = widgets.reduce((acc, o_widget) => {
              if (widgetId.find(id => id === o_widget.id)) {
                acc.push(o_widget);
              }
              return acc;
            }, []);
            // create copy widgets, copy placeholders
            original_widgets.forEach((widget: Widget) => {
              const id = uuid();
              const current_placeholeder = placeholders.find(p => p.widgetId === widget.id);
              const copy_placeholeder = {
                ...current_placeholeder,
                widgetId: id,
                id: uuid()
              };
              temp_placeholders.push(copy_placeholeder);
              const copy_widget: Widget = {
                ...widget,
                id,
                name: widget.name
              };
              actions.push(new WidgetActions.Copy(copy_widget));
            });
          }
        }
        const name = this.getDashboardName(dashboards, dashboard);
        // create copy dashboard
        const copy_dashboard = {
            id: uuid(),
            userId: dashboard.userId,
            name,
            description: dashboard.description
        };
        actions.push(new dashboardActions.CopyTab(copy_dashboard, temp_placeholders));
        return actions;
      })
    );
  }

  copyTabEffect() {
    this.copyTab$ = this._actions$.pipe(
      ofType(dashboardActions.COPY_TAB),
      concatMap((action: dashboardActions.CopyTab) => (
        this._dashboardService.addDashboard(action.payload).pipe(
          flatMap((dashboard: Dashboard) => (
            this._tabService.add(createTab({dashboardId: dashboard.id})).pipe(
              mergeMap((tab: Tab) => {
                // after create a new tab, replace it in copy placeholders
                const newPlaceholder = action.placeholders.map((placeholder: Placeholder) => {
                  return {
                    ...placeholder,
                    tabId: tab.id
                  };
                })
                const newTab: Tab = {
                  ...tab,
                  placeholders: newPlaceholder
                };
                return [
                  new dashboardActions.AddSuccess(dashboard),
                  new tabActions.Copy(newTab)
                ];
              }),
              catchError((error: Error) => of(new dashboardActions.AddSuccess(dashboard)))
            )
          )),
          catchError((error: Error) => of(new dashboardActions.AddFailure(error)))
        )
      ))
    );
  }

  deleteEffect() {
    this.delete$ = this._actions$.pipe(
      ofType(dashboardActions.DELETE),
      mergeMap((action: dashboardActions.Delete) => (
        this._dashboardService.deleteDashboard(action.payload).pipe(
          map((id: string) => new dashboardActions.DeleteSuccess(id)),
          catchError((error: Error) => of(new dashboardActions.DeleteFailure(error)))
        )
      ))
    );
  }

  updateEffect() {
    this.update$ = this._actions$.pipe(
      ofType(dashboardActions.UPDATE),
      mergeMap((action: dashboardActions.Update) => (
        this._dashboardService.updateDashboard(action.payload).pipe(
          map((db: Dashboard) => new dashboardActions.UpdateSuccess(db)),
          catchError((error: Error) => of(new dashboardActions.UpdateFailure(error)))
        )
      ))
    );
  }

  private getDashboardName(list: Dashboard[], dashboard: Dashboard): string {
    // get copy dashboard name
    let name = dashboard.name;
    if (list.find(d => d.name === `Copy of ${name}`)) {
      let exist = true;
      let i = 1;
      while (exist) {
        if (isNullOrUndefined(list.find(d => d.name === `Copy of ${name} (${i})`))) {
          name = `Copy of ${name} (${i})`;
          exist = false;
        } else {
          i++;
        }
      }
    } else {
      name = `Copy of ${name}`;
    }

    return name;
  }
}
