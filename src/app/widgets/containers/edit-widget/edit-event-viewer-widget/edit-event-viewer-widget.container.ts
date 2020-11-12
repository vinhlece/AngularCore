import {Component, forwardRef, Inject} from '@angular/core';
import {Store} from '@ngrx/store';
import * as fromWidgets from '../../../reducers';
import {PreviewDataGenerator} from '../../../services';
import {CommonPreviewDataGenerator} from '../../../services/preview/common';
import {PREVIEW_DATA_GENERATOR} from '../../../services/tokens';
import {DataConfigFactory} from '../../../utils/data-config-factory';
import {AbstractEditWidgetContainer} from '../edit-widget-container';

@Component({
  selector: 'app-edit-event-viewer-widget',
  templateUrl: './edit-event-viewer-widget.container.html',
  providers: [
    {provide: PREVIEW_DATA_GENERATOR, useClass: forwardRef(() => CommonPreviewDataGenerator)}
  ]
})
export class EditEventViewerWidgetContainer extends AbstractEditWidgetContainer {
  constructor(dataConfigFactory: DataConfigFactory,
              store: Store<fromWidgets.State>,
              @Inject(PREVIEW_DATA_GENERATOR) previewDataGenerator: PreviewDataGenerator) {
    super(dataConfigFactory, store, previewDataGenerator);
  }
}
