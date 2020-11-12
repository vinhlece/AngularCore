import {EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Observable, Subject} from 'rxjs';
import {filter, map, tap} from 'rxjs/operators';
import {isNullOrUndefined} from 'util';
import {REPStyles} from '../../../charts/models';
import * as navigationActions from '../../../layout/actions/navigation.actions';
import {Measure} from '../../../measures/models';
import * as fromMeasures from '../../../measures/reducers';
import {WidgetData} from '../../../realtime/models';
import * as editingWidgetActions from '../../actions/editing-widget.actions';
import * as widgetsActions from '../../actions/widgets.actions';
import {Column, Widget} from '../../models';
import * as fromWidgets from '../../reducers';
import {PreviewDataGenerator} from '../../services';
import {DataConfigFactory} from '../../utils/data-config-factory';
import {ColorPalette, InstanceColor} from '../../../common/models/index';
import * as fromUser from '../../../user/reducers';
import {EditWidgetType, MeasureFormat} from '../../models/enums';
import * as fromMeasure from '../../../measures/reducers/index';
import * as fromDashboard from '../../../dashboard/reducers/index';
import * as editWidgetActions from '../../actions/editing-widget.actions';
import * as fromEntities from '../../../reducers/index';

import {ThemeService} from '../../../theme/theme.service';

export abstract class AbstractEditWidgetContainer implements OnInit {
  private _store: Store<fromWidgets.State>;
  private _dataConfigFactory: DataConfigFactory;
  private _previewDataGenerator: PreviewDataGenerator;
  private _cache: Widget;

  @Input() id: string;
  @Input() isEditingOnSideBar: boolean = false;
  @Input() isEditingNewSideBar: boolean = false;
  @Output() onSave = new EventEmitter();
  @Output() onCancel = new EventEmitter();
  @Output() onValidate = new EventEmitter<boolean>();

  readonly EditWidgetType = EditWidgetType;
  widget$: Observable<Widget>;
  dataTypes$: Observable<string[]>;
  measures$: Observable<Measure[]>;
  segmentTypes$: Observable<Measure[]>;
  columns$: Observable<Column[]>;
  data$: Observable<WidgetData>;
  packages$: Observable<any>;
  styles: REPStyles = {backgroundColor: '#ffffff', color: '#333', font: 'Poppins'};
  colorPalette$: Observable<ColorPalette>;
  instanceColor$: Observable<InstanceColor[]>;
  packageDetails$: Observable<any>;
  allDimensions$: Observable<any>;
  allInstance$: Observable<string[]>;

  constructor(dataConfigFactory: DataConfigFactory,
              store: Store<fromWidgets.State>,
              previewDataGenerator: PreviewDataGenerator) {
    this._store = store;
    this._dataConfigFactory = dataConfigFactory;
    this._previewDataGenerator = previewDataGenerator;
  }

  ngOnInit() {
    if (!this.isEditingNewSideBar) {
      this._store.dispatch(new widgetsActions.Load(this.id, {edit: true}));
    }
    this.colorPalette$ = this._store.pipe(select(fromUser.getCurrentColorPalette));
    this.packages$ = this._store.pipe(select(fromMeasure.getMeasures));
    this.instanceColor$ = this._store.pipe(select(fromDashboard.getInstanceColors));
    this.widget$ = this._store.pipe(
      select(fromWidgets.getEditingWidget),
      filter((widget: Widget) => !isNullOrUndefined(widget) && widget.id === this.id),
      tap((widget: Widget) => {
        if (!this.dataTypes$) {
          this.setDataTypes();
        }
        if (this.isDataTypeChanged(widget)) {
          this.setMeasures(widget.dataType);
          this.setColumns(widget.dataType);

        }
        if (!this.isEditingOnSideBar) {
          this.generatePreviewData(widget);
        }
        this._cache = widget;
      })
    );
    this.packageDetails$ = this._store.pipe(select(fromMeasure.getPackageDetails));
    this.allDimensions$ = this._store.pipe(select(fromMeasure.getAllDimentionWithMeasure));
    this.allInstance$ = this._store.pipe(select(fromEntities.getAllInstances));
  }

  handleSubmit(widget: Widget) {
    if (this.isEditingOnSideBar) {
      this._store.dispatch(new widgetsActions.Update(widget));
      this.onSave.emit();
      return;
    }
    this._store.dispatch(new widgetsActions.UpdateAndNavigate(widget));
  }

  handleChange(widget: Widget) {
    const preChangeWidget = this.preChange(widget);
    this._store.dispatch(new editingWidgetActions.Edit(preChangeWidget));
  }

  handleCancel() {
    if (this.isEditingOnSideBar) {
      this.onCancel.emit();
      return;
    }
    this._store.dispatch(navigationActions.navigateToWidgetList());
  }

  handleValidate(event) {
    this.onValidate.emit(event);
  }

  handleChangeType(widget: Widget) {
    this._store.dispatch(new editWidgetActions.Update(widget));
  }

  getCachedWidget(): Widget {
    return this._cache;
  }

  isDataTypeChanged(newWidget: Widget): boolean {
    return !this._cache || newWidget.dataType !== this._cache.dataType;
  }

  preChange(widget: Widget): Widget {
    return widget;
  }

  isValidMeasure(measure: Measure): boolean {
    return true;
  }

  private setDataTypes() {
    this.dataTypes$ = this._dataConfigFactory.createDataTypes();
  }

  private setMeasures(dataType: string) {
    if (dataType) {
      this.measures$ = this._store.pipe(
        select(fromMeasures.getMeasuresByDataType(dataType, ['number', MeasureFormat.time])),
        map((measures: Measure[]) => measures.filter(this.isValidMeasure))
      );
      this.segmentTypes$ = this._store.pipe(select(fromMeasures.getMeasuresByDataType(dataType, ['number'])));
    }
  }

  private setColumns(dataType: string) {
    if (dataType) {
      this.columns$ = this._dataConfigFactory.generateTabularColumnList(dataType);
    }
  }

  private generatePreviewData(widget: Widget) {
    if (widget.dataType) {
      this.data$ = this._previewDataGenerator.generate(widget);
    }
  }
}
