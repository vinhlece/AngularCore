import {Component, forwardRef, Inject, OnInit} from '@angular/core';
import {AbstractEditWidgetContainer} from '../edit-widget-container';
import {DataConfigFactory} from '../../../utils/data-config-factory';
import {Store} from '@ngrx/store';
import {PREVIEW_DATA_GENERATOR} from '../../../services/tokens';
import {PreviewDataGenerator} from '../../../services/index';
import * as fromWidgets from '../../../reducers';
import {CommonPreviewDataGenerator} from '../../../services/preview/common';

@Component({
  selector: 'app-edit-bubble-widget',
  templateUrl: './edit-bubble-widget.container.html',
  styleUrls: ['./edit-bubble-widget.container.scss'],
  providers: [
    {provide: PREVIEW_DATA_GENERATOR, useClass: forwardRef(() => CommonPreviewDataGenerator)}
  ]
})
export class EditBubbleWidgetContainer extends AbstractEditWidgetContainer {

  constructor(dataConfigFactory: DataConfigFactory,
              store: Store<fromWidgets.State>,
              @Inject(PREVIEW_DATA_GENERATOR) previewDataGenerator: PreviewDataGenerator) {
    super(dataConfigFactory, store, previewDataGenerator);
  }
}
