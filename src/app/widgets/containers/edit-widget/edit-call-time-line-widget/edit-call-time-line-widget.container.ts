import {Component, forwardRef, Inject} from '@angular/core';
import {Store} from '@ngrx/store';
import * as fromWidgets from '../../../reducers';
import {PreviewDataGenerator} from '../../../services';
import {CommonPreviewDataGenerator} from '../../../services/preview/common';
import {PREVIEW_DATA_GENERATOR} from '../../../services/tokens';
import {DataConfigFactory} from '../../../utils/data-config-factory';
import {AbstractEditWidgetContainer} from '../edit-widget-container';
import {BAR_CHART_TYPES} from '../../../constants/bar-chart-types';
import {Observable} from 'rxjs';
import {Measure} from '../../../../measures/models';
import {CallTimeLineWidget} from '../../../models/index';
import * as editingWidgetActions from '../../../actions/editing-widget.actions';

@Component({
  selector: 'app-edit-call-time-line-widget',
  templateUrl: './edit-call-time-line-widget.container.html',
  styleUrls: ['./edit-call-time-line-widget.container.scss'],
  providers: [
    {provide: PREVIEW_DATA_GENERATOR, useClass: forwardRef(() => CommonPreviewDataGenerator)}
  ]
})
export class EditCallTimeLineWidgetContainer extends AbstractEditWidgetContainer {
  chartTypes = BAR_CHART_TYPES;

  constructor(dataConfigFactory: DataConfigFactory,
              store: Store<fromWidgets.State>,
              @Inject(PREVIEW_DATA_GENERATOR) previewDataGenerator: PreviewDataGenerator) {
    super(dataConfigFactory, store, previewDataGenerator);
  }

  isValidMeasure(measure: Measure): boolean {
    return measure.name.startsWith('CallTimeLine');
  }
}
