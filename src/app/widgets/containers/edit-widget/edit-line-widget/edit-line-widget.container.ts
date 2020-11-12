import {Component, forwardRef, Inject} from '@angular/core';
import {Store} from '@ngrx/store';
import * as fromWidgets from '../../../reducers';
import {PreviewDataGenerator} from '../../../services';
import {CommonPreviewDataGenerator} from '../../../services/preview/common';
import {PREVIEW_DATA_GENERATOR} from '../../../services/tokens';
import {DataConfigFactory} from '../../../utils/data-config-factory';
import {AbstractEditWidgetContainer} from '../edit-widget-container';
import {LineChartTypesConst} from '../../../models/constants';

@Component({
  selector: 'app-edit-line-widget',
  templateUrl: './edit-line-widget.container.html',
  styleUrls: ['./edit-line-widget.container.scss'],
  providers: [
    {provide: PREVIEW_DATA_GENERATOR, useClass: forwardRef(() => CommonPreviewDataGenerator)}
  ]
})
export class EditLineWidgetContainer extends AbstractEditWidgetContainer {
  lineChartTypes = LineChartTypesConst;

  constructor(dataConfigFactory: DataConfigFactory,
              store: Store<fromWidgets.State>,
              @Inject(PREVIEW_DATA_GENERATOR) previewDataGenerator: PreviewDataGenerator) {
    super(dataConfigFactory, store, previewDataGenerator);
  }
}
