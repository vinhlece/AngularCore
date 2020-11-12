import {Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import * as formulaMeasureActions from '../../actions/formula-measure.actions';
import {FormulaMeasure, Measure, Package} from '../../models';
import * as fromMeasures from '../../reducers';

@Component({
  selector: 'app-add-formula-container',
  template: `
    <app-edit-formula-measure-form
      [packages]="packages$ | async"
      [formulaMeasure]="formulaMeasure"
      [allMeasureNames]="allMeasureNames$ | async"
      [packageMeasures]="packageMeasure$ | async"
      (onCancel)="handleCancel()"
      (onSave)="handleSave($event)"
      (onChangePackage)="handleChangePackage($event)"
    ></app-edit-formula-measure-form>`,
  styleUrls: ['./app-add-formula-container.scss']
})
export class AddFormulaMeasureContainer implements OnInit {
  private _store: Store<fromMeasures.State>;

  formulaMeasure: FormulaMeasure;
  packages$: Observable<Package[]>;
  allMeasureNames$: Observable<string[]>;
  packageMeasure$: Observable<Measure[]>;

  constructor(store: Store<fromMeasures.State>) {
    this._store = store;
  }

  ngOnInit() {
    this.formulaMeasure = {
      name: '',
      relatedMeasures: [],
      dataType: '',
      expression: '',
    };
    this.packages$ = this._store.pipe(select(fromMeasures.getPackages));
    this.allMeasureNames$ = this._store.pipe(
      select(fromMeasures.getMeasures),
      map(measures => measures.map(item => item.name.toLowerCase()))
    );
  }

  handleCancel() {
    history.back();
  }

  handleSave(measure: FormulaMeasure) {
    measure = {
      ...measure,
      id: measure.name
    };
    this._store.dispatch(new formulaMeasureActions.Add(measure));
    history.back();
  }

  handleChangePackage(packageName: string) {
    this.packageMeasure$ = this._store.pipe(select(fromMeasures.getOriginalMeasuresByDataType(packageName, ['number'])));
  }
}
