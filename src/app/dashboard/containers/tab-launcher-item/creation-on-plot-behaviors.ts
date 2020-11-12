import {Store} from '@ngrx/store';
import * as creationOnPlotActions from '../../actions/creation-on-plot.actions';
import {CreationSideEffects} from '../../models';
import * as fromDashboards from '../../reducers';

export interface CreationOnPlotBehavior {
  create();
}

export class DoNotCreateOnPlot {
  create() {
    // no op
  }
}

export class CreateTimeLine implements CreationOnPlotBehavior {
  private _store: Store<fromDashboards.State>;
  private _sideEffects: CreationSideEffects;

  constructor(store: Store<fromDashboards.State>, sideEffects: CreationSideEffects = {}) {
    this._store = store;
    this._sideEffects = sideEffects;
  }

  create() {
    this._store.dispatch(new creationOnPlotActions.CreateTimeLine(this._sideEffects));
  }
}

export class CreateBillboard implements CreationOnPlotBehavior {
  private _store: Store<fromDashboards.State>;
  private _sideEffects: CreationSideEffects;

  constructor(store: Store<fromDashboards.State>, sideEffects: CreationSideEffects = {}) {
    this._store = store;
    this._sideEffects = sideEffects;
  }

  create() {
    this._store.dispatch(new creationOnPlotActions.CreateBillboard(this._sideEffects));
  }
}


export class CreateLiquidFillGauge implements CreationOnPlotBehavior {
  private _store: Store<fromDashboards.State>;
  private _sideEffects: CreationSideEffects;

  constructor(store: Store<fromDashboards.State>, sideEffects: CreationSideEffects = {}) {
    this._store = store;
    this._sideEffects = sideEffects;
  }

  create() {
    this._store.dispatch(new creationOnPlotActions.CreateLiquidFillGauge(this._sideEffects));
  }
}

export class CreateTable implements CreationOnPlotBehavior {
  private _store: Store<fromDashboards.State>;
  private _sideEffects: CreationSideEffects;

  constructor(store: Store<fromDashboards.State>, sideEffects: CreationSideEffects = {}) {
    this._store = store;
    this._sideEffects = sideEffects;
  }

  create() {
    this._store.dispatch(new creationOnPlotActions.CreateTable(this._sideEffects));
  }
}
