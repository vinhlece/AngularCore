import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {combineReducers, Store, StoreModule} from '@ngrx/store';
import {cold} from 'jasmine-marbles';
import * as timePreferencesActions from '../../../dashboard/actions/time-preferences.actions';
import * as widgetsDataActions from '../../../dashboard/actions/widgets-data.actions';
import * as fromDashboards from '../../../dashboard/reducers';
import {PlotLineLabel} from '../../models';
import {PlotLineLabelContainer} from './plot-line-label.container';

describe('PlotLineLabelContainer', () => {
  let fixture: ComponentFixture<PlotLineLabelContainer>;
  let comp: PlotLineLabelContainer;
  let store: Store<fromDashboards.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          dashboards: combineReducers(fromDashboards.reducers)
        })
      ],
      declarations: [PlotLineLabelContainer],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(PlotLineLabelContainer);
    comp = fixture.componentInstance;
    store = TestBed.get(Store);
  });

  it('should create a plot line label for each series', () => {
    store.dispatch(new widgetsDataActions.ConvertSuccess({
      'placeholder_1': [
        {
          name: 'series 1',
          color: 'red',
          data: [
            {x: 1, y: 3},
            {x: 2, y: 22},
            {x: 4, y: 13},
            {x: 7, y: 1},
            {x: 9, y: 9},
            {x: 12, y: 4},
            {x: 22, y: 33},
            {x: 57, y: 22},
            {x: 100, y: 10},
          ]
        },
        {
          name: 'series 2',
          color: 'green',
          data: [
            {x: 7, y: 3},
            {x: 9, y: 12},
            {x: 11, y: 11},
            {x: 22, y: 9},
            {x: 34, y: 2},
            {x: 55, y: 8},
            {x: 56, y: 92},
            {x: 57, y: 99},
            {x: 100, y: 102},
          ]
        }
      ]
    }));
    store.dispatch(new timePreferencesActions.SetCurrentTimestamp(23));
    comp.placeholderId = 'placeholder_1';
    fixture.detectChanges();
    const plotLineLabel1: PlotLineLabel = {name: 'series 1', color: 'red', value: 33};
    const platLineLabel2: PlotLineLabel = {name: 'series 2', color: 'green', value: 9};

    const expected$ = cold('a', {a: [plotLineLabel1, platLineLabel2]});
    expect(comp.labels$).toBeObservable(expected$);
  });

  it('should not create plot line label for series has newer points', () => {
    store.dispatch(new widgetsDataActions.ConvertSuccess({
      'placeholder_1': [
        {
          name: 'series 1',
          color: 'red',
          data: [
            {x: 1, y: 3},
            {x: 2, y: 22},
            {x: 4, y: 13},
            {x: 7, y: 1},
            {x: 9, y: 9},
            {x: 12, y: 4},
            {x: 22, y: 33},
            {x: 57, y: 22},
            {x: 100, y: 10},
          ]
        },
        {
          name: 'series 2',
          color: 'green',
          data: [
            {x: 7, y: 3},
            {x: 9, y: 12},
            {x: 11, y: 11},
            {x: 22, y: 9},
            {x: 34, y: 2},
            {x: 55, y: 8},
            {x: 56, y: 92},
            {x: 57, y: 99},
            {x: 100, y: 102},
          ]
        }
      ]
    }));
    store.dispatch(new timePreferencesActions.SetCurrentTimestamp(4));
    comp.placeholderId = 'placeholder_1';
    fixture.detectChanges();
    const plotLineLabel1: PlotLineLabel = {name: 'series 1', color: 'red', value: 13};

    const expected$ = cold('a', {a: [plotLineLabel1]});
    expect(comp.labels$).toBeObservable(expected$);
  });

  it('should not create plot line label if series data is empty', () => {
    store.dispatch(new widgetsDataActions.ConvertSuccess({
      'placeholder_1': [
        {
          name: 'series 1',
          color: 'red',
          data: []
        }
      ]
    }));
    store.dispatch(new timePreferencesActions.SetCurrentTimestamp(4));
    comp.placeholderId = 'placeholder_1';
    fixture.detectChanges();

    const expected$ = cold('a', {a: []});
    expect(comp.labels$).toBeObservable(expected$);
  });

  it('should not create plot line label if current timestamp is null', () => {
    store.dispatch(new widgetsDataActions.ConvertSuccess({
      'placeholder_1': [
        {
          name: 'series 1',
          color: 'red',
          data: [
            {x: 1, y: 3},
            {x: 2, y: 22},
            {x: 4, y: 13},
            {x: 7, y: 1},
            {x: 9, y: 9},
            {x: 12, y: 4},
            {x: 22, y: 33},
            {x: 57, y: 22},
            {x: 100, y: 10},
          ]
        }
      ]
    }));
    store.dispatch(new timePreferencesActions.SetCurrentTimestamp(null));
    comp.placeholderId = 'placeholder_1';
    fixture.detectChanges();

    const expected$ = cold('a', {a: []});
    expect(comp.labels$).toBeObservable(expected$);
  });
});
