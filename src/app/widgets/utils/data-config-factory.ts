import {Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {filter, first, map} from 'rxjs/operators';
import {isNullOrUndefined} from 'util';
import {Measure, Package} from '../../measures/models';
import * as fromMeasures from '../../measures/reducers';
import {Column} from '../models';
import * as fromWidgets from '../reducers';
import {ColorPalette} from '../../common/models/index';
import {createThresholdColor} from '../services/widgets.factory';
import * as fromUser from '../../user/reducers';
import {Key, MeasureTimestamp} from '../models/constants';
import {Agent, Queue, Region} from '../../common/models/constants';

@Injectable()
export class DataConfigFactory {
  private _store: Store<fromWidgets.State>;
  private _colorPaletter: ColorPalette;

  constructor(store: Store<fromWidgets.State>) {
    this._store = store;
    this._store.pipe(select(fromUser.getCurrentColorPalette))
      .subscribe(palette => this._colorPaletter = palette);
  }

  createDataTypes(): Observable<string[]> {
    return this._store.pipe(
      select(fromMeasures.getPackages),
      filter((packages: Package[]) => !isNullOrUndefined(packages)),
      first(),
      map((packages: Package[]) => {
        return packages
          .map((item: Package) => item.name);
      })
    );
  }

  generateTabularColumnList(dataType: string): Observable<Column[]> {
    const instanceColumn = {
      id: Key, title: 'Instance', type: 'string', visibility: true
      , group: {enable: false, priority: null}, aggFunc: null
    };
    const dateTimeColumn = {
      id: MeasureTimestamp, title: 'Package Datetime', type: 'datetime', visibility: true
      , group: {enable: false, priority: null}, aggFunc: null
    };
    const agentColumn = {
      id: Agent, title: Agent, type: 'string', visibility: true
      , group: {enable: false, priority: null}, aggFunc: null
    };
    const queueColumn = {
      id: Queue, title: Queue, type: 'string', visibility: true
      , group: {enable: false, priority: null}, aggFunc: null
    };
    const regionColumn = {
      id: Region, title: Region, type: 'string', visibility: true
      , group: {enable: false, priority: null}, aggFunc: null
    };
    return this._store.pipe(
      select(fromMeasures.getMeasuresByDataType(dataType)),
      map((measures: Measure[]) => {
        const measureColumns = measures.map((measure: Measure) => ({
          id: measure.name,
          title: measure.name,
          type: measure.format,
          visibility: true,
          group: {enable: false, priority: null},
          aggFunc: null,
          threshold: createThresholdColor(this._colorPaletter)
        }));
        return [instanceColumn, dateTimeColumn, agentColumn, queueColumn, regionColumn, ...measureColumns];
      })
    );
  }
}
