import {async, TestBed} from '@angular/core/testing';
import {provideMockActions} from '@ngrx/effects/testing';
import {Action, Store} from '@ngrx/store';
import {cold, hot} from 'jasmine-marbles';
import {Observable} from 'rxjs';
import * as navigationActions from '../../layout/actions/navigation.actions';
import {mockWidget, mockWidgets} from '../../common/testing/mocks/widgets';
import * as widgetsActions from '../actions/widgets.actions';
import {WidgetService} from '../services/http/widgets.service';
import {WidgetsEffects} from './widgets.effects';
import {PlotPoint} from '../../dashboard/models/index';
import {WidgetsFactory} from '../services/index';
import {WIDGETS_FACTORY} from '../services/tokens';

describe('WidgetsEffects', () => {
  let effects: WidgetsEffects;
  let actions: Observable<Action>;
  let mockWidgetsService: any;
  let widgetsFactory: any;
  const mockStore = jasmine.createSpyObj('mockStore', ['select', 'pipe']);
  const loggedInUser = {
    id: 'User',
    displayName: 'UserName'
  };

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      providers: [
        WidgetsEffects,
        provideMockActions(() => actions),
        {
          provide: WidgetService,
          useValue: jasmine.createSpyObj('WidgetService', [
            'add',
            'get',
            'update',
            'getAll',
            'remove',
            'findByName'
          ])
        },
        {provide: Store, useValue: mockStore},
        {provide: WIDGETS_FACTORY, useValue: jasmine.createSpyObj('WidgetsFactory', ['createFromTemplate'])}
      ]
    });
    mockWidgetsService = TestBed.get(WidgetService);
    widgetsFactory = TestBed.get(WIDGETS_FACTORY);
  }));

  describe('loadAll$', () => {
    it('should return success actions if load all widgets success', () => {
      const widgets = mockWidgets();
      const loadAction = new widgetsActions.LoadAll();
      const successAction = new widgetsActions.LoadAllSuccess(widgets);

      const userStore      = cold('a', {a: loggedInUser});
      actions              = cold('-a', {a: loadAction});
      const widgetsService = cold('-a|', {a: widgets});
      const expected       = cold('--d', {d: successAction});

      mockStore.select.and.returnValue(userStore);
      mockWidgetsService.getAll.and.returnValue(widgetsService);
      effects = TestBed.get(WidgetsEffects);

      expect(effects.loadAll$).toBeObservable(expected);
    });

    it('should return fail action if service throws error', () => {
      const loadAction = new widgetsActions.LoadAll();
      const error = new Error('Error!');
      const failAction = new widgetsActions.LoadAllFailure(error);

      const userStore     = cold('a', {a: loggedInUser});
      actions             = cold('-a', {a: loadAction});
      const widgetService = cold('-#', {}, error);
      const expected      = cold('--c', {c: failAction});

      mockWidgetsService.getAll.and.returnValue(widgetService);
      mockStore.select.and.returnValue(userStore);
      effects = TestBed.get(WidgetsEffects);

      expect(effects.loadAll$).toBeObservable(expected);
    });
  });

  describe('load$', () => {
    it('should return success actions if load widget success', () => {
      const widget = mockWidgets()[0];
      const loadAction = new widgetsActions.Load('1');
      const successAction = new widgetsActions.LoadSuccess(widget);

      actions              = cold('-a', {a: loadAction});
      const widgetsService = cold('-a|', {a: widget});
      const expected       = cold('--e', {e: successAction});

      mockWidgetsService.get.and.returnValue(widgetsService);
      effects = TestBed.get(WidgetsEffects);

      expect(effects.load$).toBeObservable(expected);
    });

    it('should return fail action if service throws error', () => {
      const loadAction = new widgetsActions.Load('1');
      const error = new Error('Error!');
      const failAction = new widgetsActions.LoadFailure(error);

      actions             = cold('-a', {a: loadAction});
      const widgetService = cold('-#', {}, error);
      const expected      = cold('--c', {c: failAction});

      mockWidgetsService.get.and.returnValue(widgetService);
      effects = TestBed.get(WidgetsEffects);

      expect(effects.load$).toBeObservable(expected);
    });
  });

  describe('delete$', () => {
    beforeEach(() => {
      mockStore.select.and.returnValue(cold('a', {a: loggedInUser}));
      effects = TestBed.get(WidgetsEffects);
    });

    it('should return success action contain deleted widget id if success', () => {
      const action = new widgetsActions.Delete('1');
      const successAction = new widgetsActions.DeleteSuccess('1');

      actions             =  hot('-a', {a: action});
      const widgetService = cold('-a|', {a: '1'});
      const expected      = cold('--e', {e: successAction});

      mockWidgetsService.remove.and.returnValue(widgetService);

      expect(effects.delete$).toBeObservable(expected);
    });

    it('should return fail action contain error message if error', () => {
      const error = new Error('Error!');
      const action = new widgetsActions.Delete('1');
      const failAction = new widgetsActions.DeleteFailure(error);

      actions             =  hot('-a', {a: action});
      const widgetService = cold('-#', {}, error);
      const expected      = cold('--e', {e: failAction});

      mockWidgetsService.remove.and.returnValue(widgetService);

      expect(effects.delete$).toBeObservable(expected);
    });
  });

  describe('add$', () => {
    it('should return success actions if user is logged in and service add success', () => {
      const widget = mockWidget();
      const action = new widgetsActions.Add(widget);
      const successAction = new widgetsActions.AddSuccess(widget);

      actions             =  hot('--a', {a: action});
      const userStore     = cold('a', {a: loggedInUser});
      const widgetService = cold('-s-', {s: widget});
      const expected      = cold('---e-', {e: successAction});

      mockStore.select.and.returnValue(userStore);
      mockWidgetsService.add.and.returnValue(widgetService);
      effects = TestBed.get(WidgetsEffects);

      expect(effects.add$).toBeObservable(expected);
    });

    it('should return add success and navigate to edit widget actions if user is logged in and service add success', () => {
      const widget = mockWidget();
      const action = new widgetsActions.AddAndNavigate(widget);
      const successAction = new widgetsActions.AddSuccess(widget);
      const navigateAction = navigationActions.navigateToEditWidget(widget);

      actions             =  hot('--a', {a: action});
      const userStore     = cold('a', {a: loggedInUser});
      const widgetService = cold('-s-', {s: widget});
      const expected      = cold('---(cd)-', {c: successAction, d: navigateAction});

      mockStore.select.and.returnValue(userStore);
      mockWidgetsService.add.and.returnValue(widgetService);
      effects = TestBed.get(WidgetsEffects);

      expect(effects.addAndNavigate$).toBeObservable(expected);
    });


    it('should return error action if user is logged in but service add failed', () => {
      const widget = mockWidget();
      const error = new Error('Error!');
      const action = new widgetsActions.Add(widget);
      const failAction = new widgetsActions.AddFailure(error);

      actions             =  hot('-a', {a: action});
      const userStore     = cold('a', {a: loggedInUser});
      const widgetService = cold('-#', {}, error);
      const expected      = cold('--c', {c: failAction});

      mockStore.select.and.returnValue(userStore);
      mockWidgetsService.add.and.returnValue(widgetService);
      effects = TestBed.get(WidgetsEffects);

      expect(effects.add$).toBeObservable(expected);
    });
  });

  describe('update$', () => {
    it('should return success actions if service update success', () => {
      const widget = mockWidget();
      const action = new widgetsActions.Update(widget);
      const successAction = new widgetsActions.UpdateSuccess(widget);

      actions             =  hot('---a', {a: action});
      const widgetService = cold('-s-', {s: widget});
      const expected      = cold('----e', {e: successAction});

      mockWidgetsService.update.and.returnValue(widgetService);
      effects = TestBed.get(WidgetsEffects);

      expect(effects.update$).toBeObservable(expected);
    });

    it('should return update success and navigate to widgets actions if service update success', () => {
      const widget = mockWidget();
      const action = new widgetsActions.UpdateAndNavigate(widget);
      const successAction = new widgetsActions.UpdateSuccess(widget);
      const navigateAction = navigationActions.navigateToWidgetList();

      actions             =  hot('---a', {a: action});
      const widgetService = cold('-s-', {s: widget});
      const expected      = cold('----(cd)', {c: successAction, d: navigateAction});

      mockWidgetsService.update.and.returnValue(widgetService);
      effects = TestBed.get(WidgetsEffects);

      expect(effects.updateAndNavigate$).toBeObservable(expected);
    });


    it('should return error action if service update failed', () => {
      const widget = mockWidget();
      const error = new Error('Error!');
      const action = new widgetsActions.Update(widget);
      const failAction = new widgetsActions.UpdateFailure(error);

      actions             =  hot('-a', {a: action});
      const widgetService = cold('-#', {}, error);
      const expected      = cold('--e', {e: failAction});

      mockWidgetsService.update.and.returnValue(widgetService);
      effects = TestBed.get(WidgetsEffects);

      expect(effects.update$).toBeObservable(expected);
    });
  });

  describe('search$', () => {
    it('should return success actions if search widgets success', () => {
      const widgets = mockWidgets();
      const loadAction = new widgetsActions.Search('abc');
      const successAction = new widgetsActions.SearchSuccess(widgets);

      const userStore      = cold('a', {a: loggedInUser});
      actions              = cold('-a', {a: loadAction});
      const widgetsService = cold('-a|', {a: widgets});
      const expected       = cold('--d', {d: successAction});

      mockStore.select.and.returnValue(userStore);
      mockWidgetsService.findByName.and.returnValue(widgetsService);
      effects = TestBed.get(WidgetsEffects);

      expect(effects.search$).toBeObservable(expected);
    });

    it('should return fail action if service throws error', () => {
      const loadAction = new widgetsActions.Search('abc');
      const error = new Error('Error!');
      const failAction = new widgetsActions.SearchFailure(error);

      const userStore     = cold('a', {a: loggedInUser});
      actions             = cold('-a', {a: loadAction});
      const widgetService = cold('-#', {}, error);
      const expected      = cold('--c', {c: failAction});

      mockWidgetsService.findByName.and.returnValue(widgetService);
      mockStore.select.and.returnValue(userStore);
      effects = TestBed.get(WidgetsEffects);

      expect(effects.search$).toBeObservable(expected);
    });
  });
});
