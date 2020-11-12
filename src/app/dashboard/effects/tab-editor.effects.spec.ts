import {TestBed} from '@angular/core/testing';
import {provideMockActions} from '@ngrx/effects/testing';
import {combineReducers, Store, StoreModule} from '@ngrx/store';
import {cold, hot} from 'jasmine-marbles';
import {Observable} from 'rxjs';
import {mockDashboard, mockPlaceholder} from '../../common/testing/mocks/dashboards';
import {mockWidget, mockWidgets} from '../../common/testing/mocks/widgets';
import * as fromRoot from '../../reducers';
import * as widgetsActions from '../../widgets/actions/widgets.actions';
import * as fromWidgets from '../../widgets/reducers';
import {WIDGETS_FACTORY} from '../../widgets/services/tokens';
import * as dashboardsActions from '../actions/dashboards.action';
import * as placeholdersActions from '../actions/placeholders.actions';
import * as tabEditorActions from '../actions/tab-editor.actions';
import {CreateWidgetSuccess} from '../actions/tab-editor.actions';
import * as tabsActions from '../actions/tabs.actions';
import {GridMetrics, PlotPoint} from '../models';
import * as fromDashboards from '../reducers';
import {GridService} from '../services/grid/grid.service';
import {TabEditorEffects} from './tab-editor.effects';
import {WidgetType} from '../../widgets/constants/widget-types';
import * as plotActions from '../actions/plot.actions';

class MockGridService {
  metrics: GridMetrics = {innerGridHeight: 100};

  addWidget() {}
  update() {}
  bulkAddWidget() {}
  getGridItem() {}
}

describe('TabEditorEffects', () => {
  let effects: TabEditorEffects;
  let store: any;
  let actions: Observable<any>;
  let service: any;
  let widgetsFactory: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRoot.reducers,
          dashboards: combineReducers(fromDashboards.reducers),
          widgets: combineReducers(fromWidgets.reducers),
        })
      ],
      providers: [
        TabEditorEffects,
        provideMockActions(() => actions),
        {provide: GridService, useClass: MockGridService},
        {provide: WIDGETS_FACTORY, useValue: jasmine.createSpyObj('WidgetsFactory', ['createFromTemplate'])}
      ]
    });
    store = TestBed.get(Store);
    service = TestBed.get(GridService);
    widgetsFactory = TestBed.get(WIDGETS_FACTORY);
  });

  describe('initialize$', () => {
    it('should dispatch set editing placeholders and bulk add action', () => {
      const dashboard = mockDashboard();
      const tab = dashboard.tabs[0];
      const initializeAction = new tabEditorActions.Initialize(tab.id);
      const setPlaceholdersAction = new placeholdersActions.Set(tab.placeholders);
      const bulkAddAction = new tabEditorActions.BulkAdd(tab.placeholders);

      actions        =  hot('-a---', {a: initializeAction});
      const expected = cold('-(ab)', {a: setPlaceholdersAction, b: bulkAddAction});
      store.dispatch(new dashboardsActions.LoadSuccess(dashboard));

      effects = TestBed.get(TabEditorEffects);

      expect(effects.initialize$).toBeObservable(expected);
    });
  });

  describe('widgetToCreateSubscriber$', () => {
    it('should call service to add widget to grid and return create widget success action', () => {
      const spy = spyOn(service, 'addWidget');
      const widget = mockWidget();
      const successAction = new CreateWidgetSuccess();

      const expected = cold('a', {a: successAction});
      store.dispatch(new widgetsActions.LoadSuccess(widget, {addToGrid: true}));
      effects = TestBed.get(TabEditorEffects);

      expect(effects.widgetToCreateSubscriber$).toBeObservable(expected);
      expect(service.addWidget).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateEditingTab$', () => {
    it('should return update tab action after get editing tab with new placeholders', () => {
      const dashboard = mockDashboard();
      const tab = dashboard.tabs[0];
      const placeholders = tab.placeholders.slice(0, tab.placeholders.length - 1);
      const successAction = new tabsActions.Update({...tab, placeholders});
      const action = new tabEditorActions.UpdateEditingTab(tab.id);

      actions        =  hot('-a', {a: action});
      const expected = cold('-a', {a: successAction});
      store.dispatch(new dashboardsActions.LoadSuccess(dashboard));
      store.dispatch(new placeholdersActions.Set(placeholders));

      effects = TestBed.get(TabEditorEffects);

      expect(effects.updateEditingTab$).toBeObservable(expected);
    });
  });

  describe('adjustSize$', () => {
    it('should call update on grid service and return update metrics action', () => {
      const spy = spyOn(service, 'update');
      const action = new tabEditorActions.AdjustSize();
      const updateMetricsAction = new tabEditorActions.UpdateMetrics(service.metrics);

      actions        =  hot('-a', {a: action});
      const expected = cold('-a', {a: updateMetricsAction});

      effects = TestBed.get(TabEditorEffects);

      expect(effects.adjustSize$).toBeObservable(expected);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('createWidgetFromTemplate$', () => {
    it('should create widget from template', () => {
      const template = {...mockWidget(), isTemplate: true};
      const placeholder = {...mockPlaceholder(), widgetId: template.id};
      const newWidget = {...template, isTemplate: false};
      const meta = {changeWidgetOfPlaceholder: placeholder.id};
      const action = new tabEditorActions.CreateWidgetFromTemplate(placeholder.id );
      const successAction = new widgetsActions.Add(newWidget, meta);

      actions        =  hot('-a', {a: action});
      const expected = cold('-a', {a: successAction});

      store.dispatch(new placeholdersActions.LoadSuccess(placeholder));
      store.dispatch(new widgetsActions.LoadSuccess(template));
      widgetsFactory.createFromTemplate.and.returnValue(newWidget);

      effects = TestBed.get(TabEditorEffects);

      expect(effects.createWidgetFromTemplate$).toBeObservable(expected);
    });
  });

  describe('updatePlaceholderWithNewWidget$', () => {
    it('should update placeholder with new widget', () => {
      const placeholder = mockPlaceholder();
      const widget = mockWidget();
      const meta = {changeWidgetOfPlaceholder: placeholder.id};
      const action = new widgetsActions.AddSuccess(widget, meta);
      const setPlaceholdersAction = new placeholdersActions.Set([{...placeholder, widgetId: widget.id}]);
      const updateEditingTabAction = new tabEditorActions.UpdateEditingTab(placeholder.tabId);

      actions        =  hot('-a----', {a: action});
      const expected = cold('-(ab)-', {a: setPlaceholdersAction, b: updateEditingTabAction});

      store.dispatch(new placeholdersActions.LoadSuccess(placeholder));
      const mockGridItem = jasmine.createSpyObj('GridItem', ['setWidgetId']);
      spyOn(service, 'getGridItem').and.returnValue(mockGridItem);

      effects = TestBed.get(TabEditorEffects);

      expect(effects.updatePlaceholderWithNewWidget$).toBeObservable(expected);
      expect(mockGridItem.setWidgetId).toHaveBeenCalledWith(widget.id);
    });
  });

  describe('addInstance$', () => {
    it('should return update current tab after got adding global instance', () => {
      const dashboard = mockDashboard();
      const widget = mockWidgets().find(item => item.type === WidgetType.Bar);
      const tab = dashboard.tabs[0];
      const instance = 'New Sales';
      tab.globalFilters = ['a instance'];
      const measure = 'ContactsAnswered';
      const successAction = new tabsActions.Update({...tab, placeholders: [], globalFilters: [...tab.globalFilters, instance]});
      const action = new tabEditorActions.AddInstance(tab.id);
      const point: PlotPoint = {widgetId: widget.id, dataType: 'Queue Performance', instance, measure, trigger: 'mousedown'};

      actions        =  hot('-a', {a: action});
      const expected = cold('-a', {a: successAction});
      store.dispatch(new dashboardsActions.LoadSuccess(dashboard));
      store.dispatch(new plotActions.Plot(point));

      effects = TestBed.get(TabEditorEffects);

      expect(effects.addInstance$).toBeObservable(expected);
    });
  });

  describe('removeInstance$', () => {
    it('should return update current tab after got removing global instances', () => {
      const dashboard = mockDashboard();
      const widget = mockWidgets().find(item => item.type === WidgetType.Bar);
      const tab = dashboard.tabs[0];
      const instance = 'New Sales';
      tab.globalFilters = [instance, 'a instance'];
      const measure = 'ContactsAnswered';
      const successAction = new tabsActions.Update({...tab, placeholders: [], globalFilters: ['a instance']});
      const action = new tabEditorActions.RemoveInstance({id: tab.id, instance: instance});
      const point: PlotPoint = {widgetId: widget.id, dataType: 'Queue Performance', instance, measure, trigger: 'mousedown'};

      actions        =  hot('-a', {a: action});
      const expected = cold('-a', {a: successAction});
      store.dispatch(new dashboardsActions.LoadSuccess(dashboard));
      store.dispatch(new plotActions.Plot(point));

      effects = TestBed.get(TabEditorEffects);

      expect(effects.removeInstance$).toBeObservable(expected);
    });
  });
});
