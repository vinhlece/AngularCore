import {Component, forwardRef, Inject} from '@angular/core';
import {async} from '@angular/core/testing';
import {Store} from '@ngrx/store';
import * as fromWidgets from '../../reducers';
import {PreviewDataGenerator} from '../../services';
import {CommonPreviewDataGenerator} from '../../services/preview/common';
import {PREVIEW_DATA_GENERATOR} from '../../services/tokens';
import {DataConfigFactory} from '../../utils/data-config-factory';
import {AbstractEditWidgetContainer} from './edit-widget-container';

@Component({
  selector: 'app-edit-widget-test',
  template: `
    <div fxLayout="row wrap" *ngIf="widget$ | async">
      <app-edit-bar-widget-form
        [widget]="widget$ | async"
        [chartTypes]="chartTypes"
        [dataTypes]="dataTypes"
        [measures]="measures$ | async"
        (onSubmit)="handleSubmit($event)"
        (onCancel)="handleCancel()"
        (onChange)="handleChange($event)"
        (onDataTypeChange)="handleDataTypeChange($event)"
        fxFlex="40"
      ></app-edit-bar-widget-form>
      <div fxFlex="60">
        <app-bar-chart
          *ngIf="widget$ | async"
          [widget]="widget$ | async"
          [data]="data"
        ></app-bar-chart>
      </div>
    </div>
  `,
  providers: [
    {provide: PREVIEW_DATA_GENERATOR, useClass: forwardRef(() => CommonPreviewDataGenerator)}
  ]
})
class EditWidgetContainerTest extends AbstractEditWidgetContainer {
  constructor(dataConfigFactory: DataConfigFactory,
              store: Store<fromWidgets.State>,
              @Inject(PREVIEW_DATA_GENERATOR) previewDataGenerator: PreviewDataGenerator) {
    super(dataConfigFactory, store, previewDataGenerator);
  }
}
