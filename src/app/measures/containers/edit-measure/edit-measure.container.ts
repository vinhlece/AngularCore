import {Component, OnInit} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Measure, Package} from '../../models';

@Component({
  selector: 'app-edit-measure-container',
  template: `
    <app-measure-form [packages]="packages$ | async" [measure]="measure$ | async"></app-measure-form>`
})
export class EditMeasureContainer implements OnInit {
  packages$: Observable<Package[]>;
  measure$: Observable<Measure>;

  ngOnInit() {
    this.packages$ = of([]);
    this.measure$ = of(null);
  }
}
