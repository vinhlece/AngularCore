import {TestBed} from '@angular/core/testing';
import {provideMockActions} from '@ngrx/effects/testing';
import {combineReducers, Store, StoreModule} from '@ngrx/store';
import {cold, hot} from 'jasmine-marbles';
import {Observable, of} from 'rxjs';
import * as fromRoot from '../../reducers';
import {mockWidget} from '../../common/testing/mocks/widgets';
import * as fromWidgets from '../../widgets/reducers';
import * as editOnPlotActions from '../actions/edit-on-plot.actions';
import * as fromDashboards from '../reducers';
import {PLOT_EDITOR} from '../services/tokens';
import {EditOnPlotEffects} from './edit-on-plot.effects';
import {DragOption, IntervalUnit, Strategy} from '../models/enums';
import { MatDialog } from '@angular/material/dialog';
import {TimeGroup, Widget} from '../../widgets/models/index';
import {DataDisplayType, TimeGroupBy} from '../../widgets/models/enums';
import * as widgetsActions from '../../widgets/actions/widgets.actions';
import {WidgetMode, WidgetType} from '../../widgets/constants/widget-types';
import {PlotPoint} from '../models/index';
import * as plotActions from '../actions/plot.actions';

describe('EditOnPlotEffects', () => {
  let effects: EditOnPlotEffects;
  let actions: Observable<any>;
  let store: any;
  let plotEditor: any;
  let dialogServiceSpy: any;
  let dialogRefSpy;

  beforeEach(() => {
    dialogServiceSpy = jasmine.createSpyObj('MatDialog', ['open']);
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['open', 'close', 'afterClosed']);
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...fromRoot.reducers,
          widgets: combineReducers(fromWidgets.reducers),
          dashboards: combineReducers(fromDashboards.reducers)
        })
      ],
      providers: [
        EditOnPlotEffects,
        provideMockActions(() => actions),
        {
          provide: PLOT_EDITOR,
          useValue: jasmine.createSpyObj('plotEditor', [
            'updateInstance',
            'updateMeasure',
            'updateBoth',
            'deleteInstance',
            'deleteMeasure',
            'updateSideEffects',
            'updateMetrics'
          ])
        },
        {provide: MatDialog, useValue: dialogServiceSpy}
      ]
    }).compileComponents();

    store = TestBed.get(Store);
    plotEditor = TestBed.get(PLOT_EDITOR);
  });

  // describe('updateInstance$', () => {
  //   it('should do nothing if widget is not updated', () => {
  //     const widget = mockWidget();
  //     const point: PlotPoint = {widgetId: widget.id, instance: 'test', measure: 'test', trigger: 'mousedown'};
  //     const updateInstanceAction = new editOnPlotActions.UpdateInstance({widgetId: widget.id});
  //
  //     actions         =  hot('---a---', {a: updateInstanceAction});
  //     const expected$ = cold('-------');
  //
  //     store.dispatch(new widgetsActions.AddSuccess(widget));
  //     store.dispatch(new plotActions.Plot(point));
  //     plotEditor.updateInstance.and.returnValue(null);
  //
  //     effects = TestBed.get(EditOnPlotEffects);
  //     expect(effects.updateInstance$).toBeObservable(expected$);
  //   });
  //
  //   it('should dispatch update widget action if widget is updated', () => {
  //     const widget = mockWidget();
  //     const point: PlotPoint = {widgetId: '1', instance: 'test', measure: 'test', trigger: 'mousedown'};
  //     const updateInstanceAction = new editOnPlotActions.UpdateInstance({widgetId: widget.id});
  //     const updateWidgetAction = new widgetsActions.Update(widget);
  //
  //     actions         =  hot('---a---', {a: updateInstanceAction});
  //     const expected$ = cold('---a---', {a: updateWidgetAction});
  //
  //     store.dispatch(new widgetsActions.AddSuccess(widget));
  //     store.dispatch(new plotActions.Plot(point));
  //     plotEditor.updateInstance.and.returnValue(widget);
  //     plotEditor.updateSideEffects.and.returnValue(widget);
  //
  //     effects = TestBed.get(EditOnPlotEffects);
  //     expect(effects.updateInstance$).toBeObservable(expected$);
  //   });
  //
  //   it('should not update widget action when drop to itself', () => {
  //     const widget = mockWidget();
  //     const point: PlotPoint = {widgetId: widget.id, instance: 'test', measure: 'test', trigger: 'mousedown'};
  //     const updateInstanceAction = new editOnPlotActions.UpdateInstance({widgetId: widget.id});
  //     const updateWidgetAction = new widgetsActions.Update(widget);
  //
  //     actions         =  hot('---a---', {a: updateInstanceAction});
  //     const expected$ = cold('-------');
  //
  //     store.dispatch(new widgetsActions.AddSuccess(widget));
  //     store.dispatch(new plotActions.Plot(point));
  //     plotEditor.updateInstance.and.returnValue(widget);
  //     plotEditor.updateSideEffects.and.returnValue(widget);
  //
  //     effects = TestBed.get(EditOnPlotEffects);
  //     expect(effects.updateInstance$).toBeObservable(expected$);
  //   });
  // });
  //
  // describe('updateMeasure$', () => {
  //   it('should do nothing if widget is not updated', () => {
  //     const widget = mockWidget();
  //     const point: PlotPoint = {widgetId: '1', instance: 'test', measure: 'test', trigger: 'mousedown'};
  //     const updateMeasureAction = new editOnPlotActions.UpdateMeasure({widgetId: widget.id});
  //
  //     actions         =  hot('---a---', {a: updateMeasureAction});
  //     const expected$ = cold('-------');
  //
  //     store.dispatch(new widgetsActions.AddSuccess(widget));
  //     store.dispatch(new plotActions.Plot(point));
  //     plotEditor.updateMeasure.and.returnValue(null);
  //
  //     effects = TestBed.get(EditOnPlotEffects);
  //     expect(effects.updateMeasure$).toBeObservable(expected$);
  //   });
  //
  //   it('should dispatch update widget action if widget is updated', () => {
  //     const widget = mockWidget();
  //     const point: PlotPoint = {widgetId: '1', instance: 'test', measure: 'test', trigger: 'mousedown'};
  //     const updateMeasureAction = new editOnPlotActions.UpdateMeasure({widgetId: widget.id});
  //     const updateWidgetAction = new widgetsActions.Update(widget);
  //
  //     actions         =  hot('---a---', {a: updateMeasureAction});
  //     const expected$ = cold('---a---', {a: updateWidgetAction});
  //
  //     store.dispatch(new widgetsActions.AddSuccess(widget));
  //     store.dispatch(new plotActions.Plot(point));
  //     plotEditor.updateMeasure.and.returnValue(widget);
  //     plotEditor.updateSideEffects.and.returnValue(widget);
  //
  //     effects = TestBed.get(EditOnPlotEffects);
  //     expect(effects.updateMeasure$).toBeObservable(expected$);
  //   });
  //
  //   it('should not dispatch update widget action if widget is updated itself', () => {
  //     const widget = mockWidget();
  //     const point: PlotPoint = {widgetId: widget.id, instance: 'test', measure: 'test', trigger: 'mousedown'};
  //     const updateMeasureAction = new editOnPlotActions.UpdateMeasure({widgetId: widget.id});
  //     const updateWidgetAction = new widgetsActions.Update(widget);
  //
  //     actions         =  hot('---a---', {a: updateMeasureAction});
  //     const expected$ = cold('-------');
  //
  //     store.dispatch(new widgetsActions.AddSuccess(widget));
  //     store.dispatch(new plotActions.Plot(point));
  //     plotEditor.updateMeasure.and.returnValue(widget);
  //     plotEditor.updateSideEffects.and.returnValue(widget);
  //
  //     effects = TestBed.get(EditOnPlotEffects);
  //     expect(effects.updateMeasure$).toBeObservable(expected$);
  //   });
  // });
  //
  // describe('updateBoth$', () => {
  //   it('should do nothing if widget is not updated', () => {
  //     const widget = mockWidget();
  //     const point: PlotPoint = {widgetId: '1', instance: 'test', measure: 'test', trigger: 'mousedown'};
  //     const updateMeasureAction = new editOnPlotActions.UpdateBoth({widgetId: widget.id});
  //
  //     actions         =  hot('---a---', {a: updateMeasureAction});
  //     const expected$ = cold('-------');
  //
  //     store.dispatch(new widgetsActions.AddSuccess(widget));
  //     store.dispatch(new plotActions.Plot(point));
  //     plotEditor.updateBoth.and.returnValue(null);
  //
  //     effects = TestBed.get(EditOnPlotEffects);
  //     expect(effects.updateBoth$).toBeObservable(expected$);
  //   });
  //
  //   it('should dispatch update widget action if widget is updated', () => {
  //     const widget = mockWidget();
  //     const point: PlotPoint = {widgetId: '1', instance: 'test', measure: 'test', trigger: 'mousedown'};
  //     const updateMeasureAction = new editOnPlotActions.UpdateBoth({widgetId: widget.id});
  //     const updateWidgetAction = new widgetsActions.Update(widget);
  //
  //     actions         =  hot('---a---', {a: updateMeasureAction});
  //     const expected$ = cold('---a---', {a: updateWidgetAction});
  //
  //     store.dispatch(new widgetsActions.AddSuccess(widget));
  //     store.dispatch(new plotActions.Plot(point));
  //     plotEditor.updateBoth.and.returnValue(widget);
  //     plotEditor.updateSideEffects.and.returnValue(widget);
  //
  //     effects = TestBed.get(EditOnPlotEffects);
  //     expect(effects.updateBoth$).toBeObservable(expected$);
  //   });
  //
  //   it('should not dispatch update widget action if widget is updated itself', () => {
  //     const widget = mockWidget();
  //     const point: PlotPoint = {widgetId: widget.id, instance: 'test', measure: 'test', trigger: 'mousedown'};
  //     const updateMeasureAction = new editOnPlotActions.UpdateBoth({widgetId: widget.id});
  //     const updateWidgetAction = new widgetsActions.Update(widget);
  //
  //     actions         =  hot('---a---', {a: updateMeasureAction});
  //     const expected$ = cold('-------');
  //
  //     store.dispatch(new widgetsActions.AddSuccess(widget));
  //     store.dispatch(new plotActions.Plot(point));
  //     plotEditor.updateBoth.and.returnValue(widget);
  //     plotEditor.updateSideEffects.and.returnValue(widget);
  //
  //     effects = TestBed.get(EditOnPlotEffects);
  //     expect(effects.updateBoth$).toBeObservable(expected$);
  //   });
  // });
  //
  // describe('deleteInstance$', () => {
  //   it('should do nothing if widget is not updated', () => {
  //     const widget = mockWidget();
  //     const point: PlotPoint = {widgetId: widget.id, instance: 'test', measure: 'test', trigger: 'mousedown'};
  //     const deleteInstanceAction = new editOnPlotActions.DeleteInstance({widgetId: widget.id});
  //
  //     actions         =  hot('---a---', {a: deleteInstanceAction});
  //     const expected$ = cold('-------');
  //
  //     store.dispatch(new widgetsActions.AddSuccess(widget));
  //     store.dispatch(new plotActions.Plot(point));
  //     plotEditor.deleteInstance.and.returnValue(null);
  //
  //     effects = TestBed.get(EditOnPlotEffects);
  //     expect(effects.deleteInstance$).toBeObservable(expected$);
  //   });
  //
  //   it('should dispatch update widget action if widget is updated', () => {
  //     const widget = mockWidget();
  //     const point: PlotPoint = {widgetId: widget.id, instance: 'test', measure: 'test', trigger: 'mousedown'};
  //     const deleteInstanceAction = new editOnPlotActions.DeleteInstance({widgetId: widget.id});
  //     const updateWidgetAction = new widgetsActions.Update(widget);
  //
  //     actions         =  hot('---a---', {a: deleteInstanceAction});
  //     const expected$ = cold('---a---', {a: updateWidgetAction});
  //
  //     store.dispatch(new widgetsActions.AddSuccess(widget));
  //     store.dispatch(new plotActions.Plot(point));
  //     plotEditor.deleteInstance.and.returnValue(widget);
  //
  //     effects = TestBed.get(EditOnPlotEffects);
  //     expect(effects.deleteInstance$).toBeObservable(expected$);
  //   });
  // });
  //
  // describe('deleteMeasure$', () => {
  //   it('should do nothing if widget is not updated', () => {
  //     const widget = mockWidget();
  //     const point: PlotPoint = {widgetId: widget.id, instance: 'test', measure: 'test', trigger: 'mousedown'};
  //     const deleteMeasureAction = new editOnPlotActions.DeleteMeasure({widgetId: widget.id});
  //
  //     actions         =  hot('---a---', {a: deleteMeasureAction});
  //     const expected$ = cold('-------');
  //
  //     store.dispatch(new widgetsActions.AddSuccess(widget));
  //     store.dispatch(new plotActions.Plot(point));
  //     plotEditor.deleteMeasure.and.returnValue(null);
  //
  //     effects = TestBed.get(EditOnPlotEffects);
  //     expect(effects.deleteMeasure$).toBeObservable(expected$);
  //   });
  //
  //   it('should dispatch update widget action if widget is updated', () => {
  //     const widget = mockWidget();
  //     const point: PlotPoint = {widgetId: widget.id, instance: 'test', measure: 'test', trigger: 'mousedown'};
  //     const deleteMeasureAction = new editOnPlotActions.DeleteMeasure({widgetId: widget.id});
  //     const updateWidgetAction = new widgetsActions.Update(widget);
  //
  //     actions         =  hot('---a---', {a: deleteMeasureAction});
  //     const expected$ = cold('---a---', {a: updateWidgetAction});
  //
  //     store.dispatch(new widgetsActions.AddSuccess(widget));
  //     store.dispatch(new plotActions.Plot(point));
  //     plotEditor.deleteMeasure.and.returnValue(widget);
  //     plotEditor.updateSideEffects.and.returnValue(widget);
  //
  //     effects = TestBed.get(EditOnPlotEffects);
  //     expect(effects.deleteMeasure$).toBeObservable(expected$);
  //   });
  // });

  describe('addMeasure$', () => {
    it('should return update widget after got adding measure event', () => {
      const widget = mockWidget();
      const newMeasure = 'new measure';
      widget.measures = ['measure1', 'measure2', 'measure3'];
      const builder = {strategy: Strategy.EDIT, targetProp: 'measure'};
      const event = {widget: widget, newMeasure: newMeasure};
      const data = {...event, builder};
      const updateMetrics = {
        confirmation: null,
        srcWidget: null,
        targetWidget: widget,
        measure: builder,
        point: {dataType: widget.dataType, measure: newMeasure}
      };
      const successAction = new editOnPlotActions.Update(updateMetrics);
      const action = new editOnPlotActions.AddMeasure(data);

      actions         =  hot('-a', {a: action});
      const expected  = cold('-a', {a: successAction});

      effects = TestBed.get(EditOnPlotEffects);

      expect(effects.addMeasure$).toBeObservable(expected);
    });
  });

  describe('confirmTitle$', () => {
    it('should return update editOnPlotActions after closed dialog', () => {
      const widget = mockWidget();
      const builder = {strategy: Strategy.EDIT, targetProp: 'measure', valueGetter: null};
      const valueGetter = (srcWidget: Widget, targetWidget: Widget, srcValue: string) => 'measure';
      const updateMetrics = {
        confirmation: null,
        srcWidget: null,
        targetWidget: widget,
        measure: {...builder, valueGetter},
        point: {dataType: widget.dataType, measure: 'newMeasure'}
      };
      const successAction = new editOnPlotActions.Update({...updateMetrics, confirmation: 'confirmTitle$'});
      const action = new editOnPlotActions.ConfirmTitle(updateMetrics);

      dialogRefSpy.afterClosed.and.returnValue(of('confirmTitle$'));
      dialogServiceSpy.open.and.returnValue(dialogRefSpy);

      actions         =  hot('-a', {a: action});
      const expected  = cold('-a', {a: successAction});

      effects = TestBed.get(EditOnPlotEffects);

      expect(effects.confirmTitle$).toBeObservable(expected);
    });
  });

  describe('setTimeRange$', () => {
    const data = {
      type: TimeGroupBy.Today,
      interval: {
        value: 1,
        unit: IntervalUnit.Hour
      },
      range: null
    } as TimeGroup;
    it('should return update bar widget after closed dialog', () => {
      const widget = {...mockWidget(), mode: {value: WidgetMode.TimeRange, timeGroup: data}};
      const result = {...data,
        type: TimeGroupBy.Yesterday,
        interval: {
          value: 2,
          unit: IntervalUnit.Minute
        }
      };
      const barWidget = {...widget, mode: {value: WidgetMode.TimeRange, timeGroup: result}};
      const successAction = new widgetsActions.Update(barWidget);
      const action = new editOnPlotActions.ChangeTimeRange(widget);
      dialogRefSpy.afterClosed.and.returnValue(of({timeGroup: result}));
      dialogServiceSpy.open.and.returnValue(dialogRefSpy);

      actions         =  hot('-a', {a: action});
      const expected  = cold('-a', {a: successAction});

      effects = TestBed.get(EditOnPlotEffects);

      expect(effects.setTimeRange$).toBeObservable(expected);
    });

    it('should return update tabular widget after closed dialog', () => {
      const widget = {...mockWidget(), type: WidgetType.Tabular, customTimeRange: data, displayData: DataDisplayType.ShowInterval};
      const result = {...data,
        type: TimeGroupBy.Yesterday,
        interval: {
          value: 2,
          unit: IntervalUnit.Minute
        }
      };
      const tableWidget = {...widget, customTimeRange: result};
      const successAction = new widgetsActions.Update(tableWidget);
      const action = new editOnPlotActions.ChangeTimeRange(widget);
      dialogRefSpy.afterClosed.and.returnValue(of({timeGroup: result}));
      dialogServiceSpy.open.and.returnValue(dialogRefSpy);

      actions         =  hot('-a', {a: action});
      const expected  = cold('-a', {a: successAction});

      effects = TestBed.get(EditOnPlotEffects);

      expect(effects.setTimeRange$).toBeObservable(expected);
    });

    it('should return update line widget after closed dialog', () => {
      const widget = {...mockWidget(), type: WidgetType.Line, customTimeRange: data};
      const result = {...data,
        type: TimeGroupBy.Yesterday,
        interval: {
          value: 2,
          unit: IntervalUnit.Minute
        }
      };
      const lineWidget = {...widget, customTimeRange: result};
      const successAction = new widgetsActions.Update(lineWidget);
      const action = new editOnPlotActions.ChangeTimeRange(widget);
      dialogRefSpy.afterClosed.and.returnValue(of({timeGroup: result}));
      dialogServiceSpy.open.and.returnValue(dialogRefSpy);

      actions         =  hot('-a', {a: action});
      const expected  = cold('-a', {a: successAction});

      effects = TestBed.get(EditOnPlotEffects);

      expect(effects.setTimeRange$).toBeObservable(expected);
    });
  });

  describe('selectOption$', () => {
    const timeRange = {
      type: TimeGroupBy.Today,
      interval: {
        value: 1,
        unit: IntervalUnit.Hour
      },
      range: null
    } as TimeGroup;
    it('should return update metrics editOnPlotActions for bar widget after closed dialog', () => {
      const widget = {...mockWidget(), mode: {value: WidgetMode.TimeRange, timeGroup: timeRange}};
      const updateMetrics = {
        confirmation: null,
        srcWidget: null,
        widgetId: 'widgetId',
        targetWidget: widget,
        point: {dataType: widget.dataType, measure: 'newMeasure'}
      };
      const builder = {strategy: Strategy.EDIT, targetProp: 'measure', valueGetter: null};
      const measureBuilder = {measure: builder};
      const data = {
        options: null,
        metrics: updateMetrics,
        targetWidget: widget,
        optionsGetter: (optionSelections: string[], mode: string, isGroup: boolean) => measureBuilder
      };
      const point: PlotPoint = {widgetId: widget.id, dataType: 'Queue Performance', trigger: 'mousedown'};
      store.dispatch(new plotActions.Plot(point));

      const action = new editOnPlotActions.SelectOptionDialog(data);
      dialogRefSpy.afterClosed.and.returnValue(of([DragOption.AddInstance]));
      dialogServiceSpy.open.and.returnValue(dialogRefSpy);
      const metrics = {
        widgetId: updateMetrics.widgetId,
        confirmation: updateMetrics.confirmation,
        ...measureBuilder
      };
      const successAction = new editOnPlotActions.UpdateMetrics(metrics);

      actions         =  hot('-a', {a: action});
      const expected  = cold('-a', {a: successAction});

      effects = TestBed.get(EditOnPlotEffects);

      expect(effects.selectOption$).toBeObservable(expected);
    });

    it('should return update metrics editOnPlotActions for line widget after closed dialog', () => {
      const widget = {...mockWidget(), type: WidgetType.Line, customTimeRange: timeRange};
      const updateMetrics = {
        confirmation: null,
        srcWidget: null,
        widgetId: 'widgetId',
        targetWidget: widget,
        point: {dataType: widget.dataType, measure: 'newMeasure'}
      };
      const builder = {strategy: Strategy.EDIT, targetProp: 'measure', valueGetter: null};
      const measureBuilder = {measure: builder};
      const data = {
        options: null,
        metrics: updateMetrics,
        targetWidget: widget,
        optionsGetter: (optionSelections: string[], isGroup: boolean) => measureBuilder
      };
      const point: PlotPoint = {widgetId: widget.id, dataType: 'Queue Performance', trigger: 'mousedown'};
      store.dispatch(new plotActions.Plot(point));

      const action = new editOnPlotActions.SelectOptionDialog(data);
      dialogRefSpy.afterClosed.and.returnValue(of([DragOption.AddInstance]));
      dialogServiceSpy.open.and.returnValue(dialogRefSpy);
      const metrics = {
        widgetId: updateMetrics.widgetId,
        confirmation: updateMetrics.confirmation,
        ...measureBuilder
      };
      const successAction = new editOnPlotActions.UpdateMetrics(metrics);

      actions         =  hot('-a', {a: action});
      const expected  = cold('-a', {a: successAction});

      effects = TestBed.get(EditOnPlotEffects);

      expect(effects.selectOption$).toBeObservable(expected);
    });
  });

  // describe('updateMeasure$', () => {
  //   it('should return update widget after got updating measure event', () => {
  //     const widget = mockWidget();
  //     const measure = 'measure2';
  //     const newMeasure = 'new measure';
  //     widget.measures = ['measure1', measure, 'measure3'];
  //     const builder = {strategy: Strategy.EDIT, targetProp: 'measure'};
  //     const event = {widget: widget, newMeasure: newMeasure};
  //     const data = {...event, builder};
  //     const valueGetter = (srcWidget: Widget, targetWidget: Widget, srcValue: string) => newMeasure;
  //     const updateMetrics = {
  //       confirmation: null,
  //       srcWidget: null,
  //       targetWidget: widget,
  //       measure: {...builder, valueGetter},
  //       point: {dataType: widget.dataType, measure: measure}
  //     };
  //     const successAction = new editOnPlotActions.Update(updateMetrics);
  //     const action = new editOnPlotActions.UpdateMeasure(data);
  //     const point: PlotPoint = {widgetId: widget.id, dataType: 'Queue Performance', measure, trigger: 'mousedown'};
  //
  //     actions         =  hot('-a', {a: action});
  //     const expected  = cold('-a', {a: successAction});
  //     store.dispatch(new plotActions.Plot(point));
  //
  //     effects = TestBed.get(EditOnPlotEffects);
  //
  //     expect(effects.updateMeasure$).toBeObservable(expected);
  //   });
  // });
});
