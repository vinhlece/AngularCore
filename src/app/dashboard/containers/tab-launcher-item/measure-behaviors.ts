import {Store} from '@ngrx/store';
import * as fromDashboards from '../../reducers';
import {Widget} from '../../../widgets/models';
import {OptionsBuilder} from './edit-on-plot-behaviors';
import * as editOnPlotActions from '../../actions/edit-on-plot.actions';

export interface MeasureBehaviors {
  add(event: any);
  update(event: any);
}

export class DefaultMeasureBehavior implements MeasureBehaviors {
  add(event: any) {
  }

  update(event: any) {
  }
}

export class CommonMeasureBehavior implements MeasureBehaviors {
  private _store: Store<fromDashboards.State>;
  private _widget: Widget;

  constructor(store: Store<fromDashboards.State>, widget: Widget) {
    this._store = store;
    this._widget = widget;
  }

  add(event: any) {
    const builder = this.addMeasure().options.measure;
    const data = {...event, builder};
    this._store.dispatch(new editOnPlotActions.AddMeasure(data));
  }

  update(event: any) {
    const builder = this.editMeasure().options.measure;
    const data = {...event, builder, confirmation: this.getConfirmation()};
    this._store.dispatch(new editOnPlotActions.UpdateMeasure(data));
  }

  protected getConfirmation() {
    return false;
  }

  protected editMeasure(): OptionsBuilder {
    return this.builder().fromMeasure().edit().toMeasure();
  }

  protected addMeasure(): OptionsBuilder {
    return this.builder().fromMeasure().add().toMeasure();
  }

  protected builder(): OptionsBuilder {
    return new OptionsBuilder();
  }
}

export class TableMeasureBehavior extends CommonMeasureBehavior {
  protected addMeasure(): OptionsBuilder {
    return this.builder().fromMeasure().add().toMeasure().withEffects({updateMeasureRelationship: true, addColumn: true});
  }

  protected getConfirmation() {
    return true;
  }

  protected editMeasure(): OptionsBuilder {
    return this.builder().fromMeasure().edit().toMeasure().withEffects({updateMeasureRelationship: true, editColumn: true});
  }
}

export class BarMeasureBehavior extends CommonMeasureBehavior {
  protected addMeasure(): OptionsBuilder {
    return this.builder().fromMeasure().add().toMeasure().withEffects({updateMeasureRelationship: true});
  }
}
