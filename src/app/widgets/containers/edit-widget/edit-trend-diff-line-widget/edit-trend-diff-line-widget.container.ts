import {Component, forwardRef, Inject} from '@angular/core';
import {Store} from '@ngrx/store';
import * as fromWidgets from '../../../reducers';
import {PreviewDataGenerator} from '../../../services';
import {TrendDiffPreviewDataGenerator} from '../../../services/preview/trenddiff';
import {PREVIEW_DATA_GENERATOR} from '../../../services/tokens';
import {DataConfigFactory} from '../../../utils/data-config-factory';
import {AbstractEditWidgetContainer} from '../edit-widget-container';
import {LineChartTypesConst} from '../../../models/constants';

@Component({
  selector: 'app-edit-trend-diff-line-widget',
  templateUrl: './edit-trend-diff-line-widget.container.html',
  styleUrls: ['./edit-trend-diff-widget.container.scss'],
  providers: [
    {provide: PREVIEW_DATA_GENERATOR, useClass: forwardRef(() => TrendDiffPreviewDataGenerator)}
  ]
})
export class EditTrendDiffLineWidgetContainer extends AbstractEditWidgetContainer {
  chartTypes = LineChartTypesConst;

  constructor(dataConfigFactory: DataConfigFactory,
              store: Store<fromWidgets.State>,
              @Inject(PREVIEW_DATA_GENERATOR) previewDataGenerator: PreviewDataGenerator) {
    super(dataConfigFactory, store, previewDataGenerator);
  }
}
