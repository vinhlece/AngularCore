import {Component, forwardRef, Inject} from '@angular/core';
import {Store} from '@ngrx/store';
import {BAR_CHART_TYPES} from '../../../constants/bar-chart-types';
import * as fromWidgets from '../../../reducers';
import {PreviewDataGenerator} from '../../../services';
import {CommonPreviewDataGenerator} from '../../../services/preview/common';
import {PREVIEW_DATA_GENERATOR} from '../../../services/tokens';
import {DataConfigFactory} from '../../../utils/data-config-factory';
import {AbstractEditWidgetContainer} from '../edit-widget-container';
import {BarStyleConst} from '../../../models/constants';

@Component({
  selector: 'app-edit-bar-widget',
  templateUrl: './edit-bar-widget.container.html',
  styleUrls: ['./edit-bar-widget.container.scss'],
  providers: [
    {provide: PREVIEW_DATA_GENERATOR, useClass: forwardRef(() => CommonPreviewDataGenerator)}
  ]
})
export class EditBarWidgetContainer extends AbstractEditWidgetContainer {
  chartTypes = BAR_CHART_TYPES;
  chartStyles = BarStyleConst;

  constructor(dataConfigFactory: DataConfigFactory,
              store: Store<fromWidgets.State>,
              @Inject(PREVIEW_DATA_GENERATOR) previewDataGenerator: PreviewDataGenerator) {
    super(dataConfigFactory, store, previewDataGenerator);
  }
}
