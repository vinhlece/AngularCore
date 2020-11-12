import {TestBed} from '@angular/core/testing';
import {provideMockActions} from '@ngrx/effects/testing';
import {combineReducers, Store, StoreModule} from '@ngrx/store';
import {cold, hot} from 'jasmine-marbles';
import {Observable} from 'rxjs';
import * as fromRoot from '../../reducers';
import {mockPackages, mockWidgets} from '../../common/testing/mocks/widgets';
import * as packagesActions from '../../measures/actions/packages.actions';
import * as widgetsActions from '../../widgets/actions/widgets.actions';
import {WidgetType} from '../../widgets/constants/widget-types';
import {TrendDiffWidget} from '../../widgets/models';
import {
  createBillboardWidget,
  createDayTrendDiffWidget,
  createShiftTrendDiffWidget, createTableWidget,
  createTimelineWidget,
  createWeekTrendDiffWidget
} from '../../widgets/services/widgets.factory';
import * as creationOnPlotActions from '../actions/creation-on-plot.actions';
import * as plotActions from '../actions/plot.actions';
import {PlotPoint} from '../models';
import * as fromWidgets from '../reducers';
import * as fromDashboards from '../reducers';
import {PLOT_EDITOR} from '../services/tokens';
import {CreationOnPlotEffects} from './creation-on-plot.effects';

describe('CreationOnPlotEffects', () => {
  let effect: CreationOnPlotEffects;
  let actions: Observable<any>;
  let store: any;
  let plotEditor: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRoot.reducers,
          widgets: combineReducers(fromWidgets.reducers),
          dashboards: combineReducers(fromDashboards.reducers)
        })
      ],
      providers: [
        CreationOnPlotEffects,
        provideMockActions(() => actions),
        {
          provide: PLOT_EDITOR,
          useValue: jasmine.createSpyObj('plotEditor', ['updateSideEffects'])
        }
      ]
    }).compileComponents();

    store = TestBed.get(Store);
    plotEditor = TestBed.get(PLOT_EDITOR);
  });

  describe('createTimeLine$', () => {
    it('should return add widget and add to grid action with create time line action', () => {
      const widget = mockWidgets().find(item => item.type === WidgetType.Bar);
      const instance = 'New Sales';
      const measure = 'ContactsAnswered';
      const dimension = 'intent';
      const packages = mockPackages();
      const point: PlotPoint = {widgetId: widget.id, dataType: 'Queue Performance', instance, measure, trigger: 'mousedown'};
      const timeLineWidget = createTimelineWidget(widget.dataType, measure, instance, dimension);

      const createTimeLineAction = new creationOnPlotActions.CreateTimeLine({});
      const expectedAction = new widgetsActions.Add(timeLineWidget, {addToGrid: true});

      actions        =  hot('----a', {a: createTimeLineAction});
      const expected = cold('----e', {e: expectedAction});

      store.dispatch(new widgetsActions.LoadSuccess(widget));
      store.dispatch(new plotActions.Plot(point));
      store.dispatch(new packagesActions.LoadAllSuccess(packages));
      plotEditor.updateSideEffects.and.returnValue(timeLineWidget);

      effect = TestBed.get(CreationOnPlotEffects);
      const rs = effect.createTimeLine$;
      expect(effect.createTimeLine$).toBeObservable(expected);
    });
  });

  describe('createTable$', () => {
    it('should return add widget and add to grid action with create table action', () => {
      const widget = mockWidgets().find(item => item.type === WidgetType.Bar);
      const packages = mockPackages();
      const point: PlotPoint = {widgetId: widget.id, dataType: 'Queue Performance', trigger: 'mousedown', window: 'Window A'};
      const tableWidget = createTableWidget(widget.dataType, widget.measures, widget.dimensions, widget.name, 'Window A');

      const createTableAction = new creationOnPlotActions.CreateTable({});
      const expectedAction = new widgetsActions.Add(tableWidget, {addToGrid: true});

      actions        =  hot('----a', {a: createTableAction});
      const expected = cold('----e', {e: expectedAction});

      store.dispatch(new widgetsActions.LoadSuccess(widget));
      store.dispatch(new plotActions.Plot(point));
      store.dispatch(new packagesActions.LoadAllSuccess(packages));
      plotEditor.updateSideEffects.and.returnValue(tableWidget);

      effect = TestBed.get(CreationOnPlotEffects);
      const rs = effect.createTable$;
      expect(effect.createTable$).toBeObservable(expected);
    });
  });

  describe('createBillboard$', () => {
    it('should return add widget and add to grid action with create billboard action', () => {
      const widget = mockWidgets().find(item => item.type === WidgetType.Bar);
      const instance = 'New Sales';
      const measure = 'ContactsAnswered';
      const dimension = 'intent';
      const packages = mockPackages();
      const point: PlotPoint = {widgetId: widget.id, dataType: 'Queue Performance', instance, measure, trigger: 'mousedown', dimension: 'intent', window: 'Window A'};
      const billboardWidget = createBillboardWidget(widget.dataType, measure, instance, dimension, 'Window A');

      const createBillboardAction = new creationOnPlotActions.CreateBillboard({});
      const expectedAction = new widgetsActions.Add(billboardWidget, {addToGrid: true});

      actions        =  hot('----a', {a: createBillboardAction});
      const expected = cold('----e', {e: expectedAction});

      store.dispatch(new widgetsActions.LoadSuccess(widget));
      store.dispatch(new plotActions.Plot(point));
      store.dispatch(new packagesActions.LoadAllSuccess(packages));
      plotEditor.updateSideEffects.and.returnValue(billboardWidget);

      effect = TestBed.get(CreationOnPlotEffects);
      expect(effect.createBillboard$).toBeObservable(expected);
    });
  });

  describe('createTrendDiff$', () => {
    it('should return add widget and add to grid action with add shift trend diff action', () => {
      const widget = mockWidgets().find(item => item.type === WidgetType.Bar);
      const instance = 'New Sales';
      const measure = 'ContactsAnswered';
      const packages = mockPackages();
      const point: PlotPoint = {widgetId: widget.id, dataType: 'Queue Performance', instance, measure, trigger: 'mousedown', dimension: 'intent', window: ''};
      const trendDiffWidget: TrendDiffWidget = {...createShiftTrendDiffWidget(widget), measures: [measure],
        dimensions: [{customInstances: [], systemInstances: [instance], dimension: 'intent' }], windows: ['']};

      const createShiftTrendDiffAction = new creationOnPlotActions.CreateShiftTrendDiff();
      const expectedAction = new widgetsActions.Add(trendDiffWidget, {addToGrid: true});

      actions        =  hot('----a', {a: createShiftTrendDiffAction});
      const expected = cold('----e', {e: expectedAction});

      store.dispatch(new widgetsActions.LoadSuccess(widget));
      store.dispatch(new plotActions.Plot(point));
      store.dispatch(new packagesActions.LoadAllSuccess(packages));

      effect = TestBed.get(CreationOnPlotEffects);
      expect(effect.createTrendDiff$).toBeObservable(expected);
    });

    it('should return add widget and add to grid action with add day trend diff action', () => {
      const widget = mockWidgets().find(item => item.type === WidgetType.Bar);
      const instance = 'New Sales';
      const measure = 'ContactsAnswered';
      const packages = mockPackages();
      const point: PlotPoint = {widgetId: widget.id, dataType: 'Queue Performance', instance, measure, trigger: 'mousedown', dimension: 'intent', window: ''};
      const trendDiffWidget: TrendDiffWidget = {...createDayTrendDiffWidget(widget), measures: [measure],
        dimensions: [{customInstances: [], systemInstances: [instance], dimension: 'intent' }], windows: ['']};

      const createDayTrendDiffAction = new creationOnPlotActions.CreateDayTrendDiff();
      const expectedAction = new widgetsActions.Add(trendDiffWidget, {addToGrid: true});

      actions        =  hot('----a', {a: createDayTrendDiffAction});
      const expected = cold('----e', {e: expectedAction});

      store.dispatch(new widgetsActions.LoadSuccess(widget));
      store.dispatch(new plotActions.Plot(point));
      store.dispatch(new packagesActions.LoadAllSuccess(packages));

      effect = TestBed.get(CreationOnPlotEffects);
      expect(effect.createTrendDiff$).toBeObservable(expected);
    });

    it('should return add widget and add to grid action with add week trend diff action', () => {
      const widget = mockWidgets().find(item => item.type === WidgetType.Bar);
      const instance = 'New Sales';
      const measure = 'ContactsAnswered';
      const packages = mockPackages();
      const point: PlotPoint = {widgetId: widget.id, dataType: 'Queue Performance', instance, measure, trigger: 'mousedown', dimension: 'intent', window: ''};
      const trendDiffWidget: TrendDiffWidget = {...createWeekTrendDiffWidget(widget), measures: [measure],
        dimensions: [{customInstances: [], systemInstances: [instance], dimension: 'intent' }], windows: ['']};

      const createWeekTrendDiffAction = new creationOnPlotActions.CreateWeekTrendDiff();
      const expectedAction = new widgetsActions.Add(trendDiffWidget, {addToGrid: true});

      actions        =  hot('----a', {a: createWeekTrendDiffAction});
      const expected = cold('----e', {e: expectedAction});

      store.dispatch(new widgetsActions.LoadSuccess(widget));
      store.dispatch(new plotActions.Plot(point));
      store.dispatch(new packagesActions.LoadAllSuccess(packages));

      effect = TestBed.get(CreationOnPlotEffects);
      expect(effect.createTrendDiff$).toBeObservable(expected);
    });
  });
});
