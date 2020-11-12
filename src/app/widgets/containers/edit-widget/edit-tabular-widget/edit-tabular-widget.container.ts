import {Component, forwardRef, Inject, Input} from '@angular/core';
import {Store} from '@ngrx/store';
import {MoveColumnEvent} from '../../../../charts/models';
import {Column, PairItem, TabularWidget, Widget} from '../../../models';
import * as fromWidgets from '../../../reducers';
import {PreviewDataGenerator} from '../../../services';
import {CommonPreviewDataGenerator} from '../../../services/preview/common';
import {PREVIEW_DATA_GENERATOR} from '../../../services/tokens';
import {DataConfigFactory} from '../../../utils/data-config-factory';
import {AbstractEditWidgetContainer} from '../edit-widget-container';
import {Subject} from 'rxjs/index';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {EditWidgetDialogComponent} from '../../../components/edit-widget-dialog/edit-widget-dialog.component';
import {DataDisplayTypeConst} from '../../../models/constants';

@Component({
  selector: 'app-edit-tabular-widget',
  templateUrl: './edit-tabular-widget.container.html',
  styleUrls: ['./edit-tabular-widget.container.scss'],
  providers: [
    {provide: PREVIEW_DATA_GENERATOR, useClass: forwardRef(() => CommonPreviewDataGenerator)}
  ]
})
export class EditTabularWidgetContainer extends AbstractEditWidgetContainer {
  private _dialogService: MatDialog;

  displayData: PairItem[] = DataDisplayTypeConst;
  editColumn: Subject<Column> = new Subject();
  @Input() saveSubject: Subject<Widget>;

  constructor(dataConfigFactory: DataConfigFactory,
              store: Store<fromWidgets.State>,
              @Inject(PREVIEW_DATA_GENERATOR) previewDataGenerator: PreviewDataGenerator,
              dialogService: MatDialog) {
    super(dataConfigFactory, store, previewDataGenerator);
    this._dialogService = dialogService;
  }

  preChange(widget: Widget): Widget {
    if (this.isDataTypeChanged(widget)) {
      widget = this.resetColumns(widget);
    }
    return this.updateMeasures(widget);
  }

  handleMoveColumn(event: MoveColumnEvent) {
    const widget = {
      ...(this.getCachedWidget() as TabularWidget),
      columns: event.columns
    };
    this.handleChange(widget);
  }

  handleResizeColumn(event) {
    this.handleChange(event);
  }

  handleColumnChange(column: Column) {
    let config = new MatDialogConfig();
    if (this.isEditingNewSideBar) {
      config = {
        position: {
          top: '25px',
          right: '25px'
        },
        backdropClass: 'custom-backdrop'
      };
    } else {
      config = null;
    }
    const dialog = this._dialogService.open(EditWidgetDialogComponent, {
      width: '450px',
      data: {
        title: 'widgets.edit_widget_form.columns_setting',
        column,
      },
      ...config
    });
    dialog.afterClosed().subscribe((newColumn: any) => {
      if (newColumn && newColumn.editingColumn) {
        this.editColumn.next(newColumn.editingColumn);
      }
    });
  }

  private resetColumns(widget: Widget): Widget {
    const columns: Column[] = [{
      id: 'Key',
      type: 'string',
      title: 'Instance',
      visibility: true,
      group: {enable: false, priority: null},
      aggFunc: null
    }];

    return {...widget, columns} as TabularWidget;
  }

  private updateMeasures(widget: Widget): Widget {
    const columns = (widget as TabularWidget).columns;
    const measures = columns
      .filter((column: Column) => column.id !== 'Key' && column.id !== 'MeasureTimestamp')
      .map((column: Column) => column.id);
    return {...widget, measures};
  }
}
