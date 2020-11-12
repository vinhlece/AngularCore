import {Component, EventEmitter, forwardRef, Input, OnChanges, OnDestroy, OnInit, Output} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatRadioChange} from '@angular/material/radio';
import {Measure} from '../../../../measures/models';
import {BarWidget, Column, Widget, WidgetDimension} from '../../../models';
import {ChartIcons, MeasureFormat, TrendType, WidgetItem, WidgetSection} from '../../../models/enums';
import {WidgetMode, WidgetType} from '../../../constants/widget-types';
import {interval, Subject, Subscription} from 'rxjs/index';
import {NewDialogWithDataComponent} from '../common/new-dialog-with-data.component';
import {FlexibleChoicePackage} from '../flexible-choice-input/flexible-choice-package';
import * as _ from 'lodash';
import {WindowNames} from '../../../../common/models/constants';
import {getWindowInMeasure, isNullOrUndefined} from '../../../../common/utils/function';
import {distinctUntilChanged, map, merge} from 'rxjs/internal/operators';
import {Multi_M_Multi_D_Widget, Single_M_Multi_D_Widget, Single_M_Single_D_Widget} from '../../../models/constants';
import {ChangeTypeDialogComponent} from '../common/change-type-dialog';
import {ThemeService} from '../../../../theme/theme.service';
import {Theme} from '../../../../theme/model/index';
import {BarStyleDivider} from '../../../constants/constants';
import {select} from '@ngrx/store';

export interface EditWidgetFormControl {
  enabled?: boolean;
  value?: any;
  availableValues?: any;
  required?: boolean;
  choiceMode?: 'single' | 'multiple';
  inputValidators?: Function[];
  description?: string;
  section?: WidgetSection;
}

export interface EditWidgetFormOptions {
  type?: EditWidgetFormControl;
  name?: EditWidgetFormControl;
  subtitle?: EditWidgetFormControl;
  dataType?: EditWidgetFormControl;
  chartType?: EditWidgetFormControl;
  mode?: EditWidgetFormControl;
  measures?: EditWidgetFormControl;
  instances?: EditWidgetFormControl;
  windows?: EditWidgetFormControl;
  measure?: EditWidgetFormControl;
  instance?: EditWidgetFormControl;
  gaugeThreshold?: EditWidgetFormControl;
  thresholdColor?: EditWidgetFormControl;
  trendType?: EditWidgetFormControl;
  period?: EditWidgetFormControl;
  defaultSize?: EditWidgetFormControl;
  numberOfLines?: EditWidgetFormControl;
  showAllData?: EditWidgetFormControl;
  columns?: EditWidgetFormControl;
  displayData?: EditWidgetFormControl;
  displayMode?: EditWidgetFormControl;
  labelMode?: EditWidgetFormControl;
  enableNavigator?: EditWidgetFormControl;
  stateColor?: EditWidgetFormControl;
  thresholdLine?: EditWidgetFormControl;
  flashing?: EditWidgetFormControl;
  queues?: EditWidgetFormControl;
  agents?: EditWidgetFormControl;
  segmentTypes?: EditWidgetFormControl;
  groupBy?: EditWidgetFormControl;
  font?: EditWidgetFormControl;
  nodes?: EditWidgetFormControl;
  urls?: EditWidgetFormControl;
  xAxisMin?: EditWidgetFormControl;
  yAxisMin?: EditWidgetFormControl;
  yAxisMax?: EditWidgetFormControl;
  timestamps?: EditWidgetFormControl;
  customTimeRange?: EditWidgetFormControl;
  gaugeValue?: EditWidgetFormControl;
  chartStyle?: EditWidgetFormControl;
  hideIcon?: EditWidgetFormControl;
  color?: EditWidgetFormControl;
  titlePosition?: EditWidgetFormControl;
  hideLegend?: EditWidgetFormControl;
  dimensions?: EditWidgetFormControl;
  arcWidth?: EditWidgetFormControl;
  hideKPI?: EditWidgetFormControl;
  stackBy?: EditWidgetFormControl;

  // Liquid Fill Gauge Options
  minValue?: EditWidgetFormControl;
  maxValue?: EditWidgetFormControl;
  circleThickness?: EditWidgetFormControl;
  circleFillGap?: EditWidgetFormControl;
  circleColor?: EditWidgetFormControl;
  waveHeight?: EditWidgetFormControl;
  waveCount?: EditWidgetFormControl;
  waveRiseTime?: EditWidgetFormControl;
  waveAnimateTime?: EditWidgetFormControl;
  waveRise?: EditWidgetFormControl;
  waveHeightScaling?: EditWidgetFormControl;
  waveAnimate?: EditWidgetFormControl;
  waveColor?: EditWidgetFormControl;
  waveOffset?: EditWidgetFormControl;
  textVertPosition?: EditWidgetFormControl;
  textSize?: EditWidgetFormControl;
  valueCountUp?: EditWidgetFormControl;
  displayPercent?: EditWidgetFormControl;
  textColor?: EditWidgetFormControl;
  waveTextColor?: EditWidgetFormControl;
}

@Component({
  selector: 'app-edit-widget-form',
  templateUrl: './edit-widget-form.component.html',
  styleUrls: ['./edit-widget-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EditWidgetFormComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => EditWidgetFormComponent),
      multi: true
    }
  ]
})
export class EditWidgetFormComponent implements OnInit, OnChanges, OnDestroy {
  private _fb: FormBuilder;
  private _config: { [key: string]: any } = {};
  private _subscription: Subscription = null;
  private _dialogData;
  private _dialogService: MatDialog;
  private _themeService: ThemeService;
  _dimensions;
  _windows;
  _measures;
  _instances;

  chartType: string;
  chartStyle: string;

  form: FormGroup;
  count = 0;
  isDisablePackage = false;

  @Input() options: EditWidgetFormOptions;
  @Input() saveSubject: Subject<any>;
  @Input() editColumn: Subject<Column>;
  @Input() widget: Widget;
  @Input() packages: any;
  @Input() packageDetails: any;
  @Input() allDimensions: any;
  @Input() allInstance: any;
  @Input() section: string;

  @Output() onSubmit = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<void>();
  @Output() onChange = new EventEmitter<Widget>();
  @Output() onColumnChange = new EventEmitter<Column>();
  @Output() onValidate = new EventEmitter<boolean>();
  @Output() onChangeType = new EventEmitter<Widget>();

  dimensions: string[];
  measures: string[];
  windows: string[];
  currentPackage: string;
  icons = Object.keys(ChartIcons).filter(item => ChartIcons[item] !== ChartIcons.Label);
  readonly widgetItem = WidgetItem;

  constructor(dialogService: MatDialog, fb: FormBuilder, themeSerive: ThemeService) {
    this._fb = fb;
    this._dialogService = dialogService;
    this._themeService = themeSerive;
  }

  ngOnInit() {
    this.createForm();
    this.form.valueChanges.subscribe((value) => {
      this.onChange.emit(this.form.getRawValue());
    });
    this.form.statusChanges.pipe(
      merge(interval(250).pipe(map(() => this.form.status))),
      distinctUntilChanged(),
    ).subscribe(s => {
      this.validate();
    });
    if (this.saveSubject) {
      this._subscription = this.saveSubject.subscribe(item => {
        this.handleSubmit();
      });
    }
  }

  ngOnChanges() {
    if (this.form) {
      Object.keys(this.options).forEach((controlName: string) => {
        const control = this.getControl(controlName);
        if (!isNullOrUndefined(control)) {
          control.patchValue(this.options[controlName].value, {emitEvent: false});
          if (this.options[controlName].enabled) {
            control.enable({emitEvent: false});
          } else {
            control.disable({emitEvent: false});
          }
        }
      });
    }
    this.dimensions = this.allDimensions ? this.allDimensions.map((item) => item.dimension) : [];
    this.measures = this.getItemMeasures();
  }

  ngOnDestroy() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }

  // Func get change package
  getCurrentPackage() {
    if (this._measures.length > 0) {
      const tPackage = _.orderBy(this.packages.filter(f => this._measures.findIndex(fi => fi === f.name) >= 0
        && this._dimensions.findIndex(fd => fd === f.dimension)), ['dataType'], ['asc']);
      if (tPackage) {
        this.currentPackage = (tPackage.length > 1 ? tPackage[tPackage.findIndex(f => f.name === this._measures[this._measures.length - 1])] : tPackage[0]).dataType;
      }
    }
  }

  isDarkTheme() {
    return this._themeService.getCurrentTheme() === Theme.Dark;
  }

  selectChartType(item) {
    const newChartType = item.type;
    if (this.isSelectedIcon(item) || newChartType === WidgetType.CallTimeLine.toString().replace(' ', '')) {
      return;
    }

    const currentType = this.options.type.value.replace(' ', '');
    const windows = this._windows;
    const dimensions = this._dimensions;
    const measures = this._measures;

    if (this.isMultiWidget(currentType) && !this.isMultiWidget(newChartType)) {
      if (this.isSingleConfigure({dimensions, windows, measures})) {
        this.handleChangeChartType(dimensions, measures, windows,  WidgetType[newChartType] as WidgetType, item);
        return;
      }

      const inputData = this.isSingleWidget(newChartType) ? {
        dimensions,
        windows,
        measures
      } : {
        windows,
        measures
      };

      this._dialogData = this._dialogService.open(ChangeTypeDialogComponent, {
        data: {
          title: 'widgets.edit_widget_form.change_chart_type',
          width: '300px',
          height: '400px',
          inputData
        }
      });
      this._dialogData.afterClosed().subscribe((subscribedItem) => {
        this._dialogData = null;
        if (isNullOrUndefined(subscribedItem)) {
          return false;
        }
        this.changeChartType(subscribedItem, WidgetType[newChartType], dimensions, item);
      });
    } else {
      this.handleChangeChartType(dimensions, measures, windows,  WidgetType[newChartType] as WidgetType, item);
    }
  }

  changeChartType(subscribedItem, type, dimensions, item) {
    const newMeasure = subscribedItem.measure;
    const newWindow = subscribedItem.window;
    const newDimensionName = subscribedItem.dimension;
    let newDimension;
    const oldDimension = dimensions.find(dimension => dimension.dimension === newDimensionName);
    if (isNullOrUndefined(oldDimension)) {
      newDimension = dimensions;
    } else {
      if (oldDimension.systemInstances.find(instance => instance === subscribedItem.instance)) {
        newDimension = [
          {
            dimension: newDimensionName,
            systemInstances: [subscribedItem.instance],
            customInstances: []
          }
        ];
      } else {
        newDimension = [
          {
            dimension: newDimensionName,
            systemInstances: [],
            customInstances: [subscribedItem.instance]
          }
        ];
      }
    }

    this.handleChangeChartType(newDimension, [newMeasure], [newWindow], type as WidgetType, item);
  }

  handleChangeChartType(dimensions, measures, windows, type: WidgetType, item) {
    const widget: Widget = {
      dimensions,
      windows,
      measures,
      type
    };
    if (this.chartType) {
      widget['chartType'] = this.chartType;
    }

    if (this.chartStyle) {
      widget['chartStyle'] = this.chartStyle;
    }

    this.onChangeType.emit(widget);
  }

  handleSubmit() {
    // set new package
    if (this.currentPackage && this.currentPackage !== this.options.dataType.value) {
      this.form.get('dataType').patchValue(this.currentPackage);
    }

    // set instances to dimension
    const dimensionForm = this.form.get(this.widgetItem.Dimension);
    if (dimensionForm) {
      const vals = [];
      for (const dimen of dimensionForm.value) {
        const val = dimen;
        val.customInstances = _.difference(this._instances, val.systemInstances);
        val.systemInstances = _.difference(this._instances, val.customInstances);
        vals.push(val);
      }
      dimensionForm.patchValue(vals);
    }

    if (this.form.get('showAllData') && this._instances.length === 0) {
      this.form.get('showAllData').patchValue(true);
      this.form.get(this.widgetItem.Instance).patchValue([]);
    }

    const keys = Object.keys(WidgetSection);
    for (let i = 0; i < keys.length; i++) {
      if (this.section === WidgetSection[keys[i]]) {
        this.onSubmit.emit({
          [keys[i]]: this.form.getRawValue()
        });
      }
    }
  }

  handleTrendTypeChange(event: MatRadioChange) {
    const trendType = event.value;
    const periodControl = this.getControl('period');
    if (trendType === TrendType.Shift) {
      periodControl.setValue(8);
      periodControl.disable();
    } else if (trendType === TrendType.Day) {
      periodControl.setValue(null);
      periodControl.enable();
    }
  }

  handleCancel() {
    this.onCancel.emit();
  }

  handleColumnChange(column: Column) {
    this.onColumnChange.emit(column);
  }

  getMeasureNames(measures: Measure[]): string[] {
    return measures ? measures.map((measure: Measure) => measure.name) : [];
  }

  isSelectedIcon(item) {
    const {dimensions, windows, measures} = this.widget;
    const type = item.type;
    const widget = {
      dimensions,
      windows,
      measures,
      type
    };
    if (item.chartType) {
      this.chartType = item.chartType;
      if (this.isSameType(item)) {
        this.onChangeType.emit(({...widget, chartType : item.chartType}) as Widget);
      }
    }

    if (item.chartStyle) {
      this.chartStyle = item.chartStyle;
      if (this.isSameType(item)) {
        this.onChangeType.emit({...widget, chartType : item.chartType, chartStyle: item.chartStyle} as BarWidget);
      }
    }
    return this.isSameType(item);
  }

  isSameType(item) {
    return this.options.type && this.options.type.value.replace(' ', '') === item.type;
  }

  isSingleWidget(formatType) {
    return Single_M_Single_D_Widget.find(type => type === formatType);
  }

  isMultiWidget(currentType) {
    return Multi_M_Multi_D_Widget.find(type => type === currentType) ||
      Single_M_Multi_D_Widget.find(type => type === currentType);
  }

  isSingleConfigure(input: any) {
    return Object.values(input).reduce((acc, item) => {
      return acc && (item as Array<any>).length <= 1;
    }, true);
  }

  getSelectedIconStyle(item) {
    if (this.isSelectedIcon(item)) {
      return {
        color: '#5867DD'
      };
    }
  }

  isShowItem(type: WidgetItem) {
    if (this.widget.type !== WidgetType.CallTimeLine) {
      if (type === this.widgetItem.Measure) {
        return this.checkFormVal(this.widgetItem.Dimension);
      } else if (type === this.widgetItem.Instance && this.widget.type !== WidgetType.Tabular) {
        return this.checkFormVal(this.widgetItem.Dimension) && this.checkFormVal(this.widgetItem.Measure);
      } else if (type === this.widgetItem.Window && this.widget.type !== WidgetType.Tabular) {
        return this.checkFormVal(this.widgetItem.Dimension) && this.checkFormVal(this.widgetItem.Measure);
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  checkFormVal(type: WidgetItem) {
    return this.form.get(type) && this.form.get(type).value.length > 0 ? true : false;
  }

  showDialog(type: WidgetItem, dimension?: WidgetDimension) {
    console.log(type, dimension);
    this.isDisablePackage = true;
    if (!isNullOrUndefined(this._dialogData)) {
      return;
    }
    let items = [];
    let selection: any;
    let choiceMode = null;
    const showAllData = this.options.showAllData ? this.options.showAllData : null;
    if (type !== WidgetItem.Instance) {
      items = this.filterItemsOfPackages().filter(i => i[type].length > 0 && i.packageName === this.options.dataType.value)
                           .map(i => ({packageName: i.packageName, values: i[type].sort((a, b) => a.localeCompare(b))}));
      choiceMode = this.options[type].choiceMode;
      const selectedValues = type === WidgetItem.Dimension && this.options[type].value ? this.options[type].value.map(i => i.dimension) : this.options[type].value;
      selection = [{packageName: this.options.dataType.value, values: selectedValues}];
    } else {
      selection = {};
      if (dimension.systemInstances) {
        selection.systemSelections = dimension.systemInstances;
      }
      if (dimension.customInstances) {
        selection.customSelections = dimension.customInstances;
      }
      choiceMode = this.options[WidgetItem.Dimension].choiceMode;
    }

    const panelClass = this._themeService.getCurrentTheme() === Theme.Light ? 'custom-dialog' : 'dark-theme-dialog';

    this._dialogData = this._dialogService.open(NewDialogWithDataComponent, {
      width: '450px',
      height: '600px',
      hasBackdrop: false,
      position: {
        bottom: '5vh',
        right: '510px'
      },
      panelClass,
      data: {
        title: 'widgets.edit_widget_form.select',
        titleType: `${type.charAt(0).toUpperCase()}${type.slice(1)}`,
        inputData: {
          type,
          choiceMode,
          selection,
          items,
          dimension,
          showAllData,
          inputValidators: this.options.dimensions.inputValidators
        }
      }
    });
    this._dialogData.afterClosed().subscribe((subscribedItem) => {
      this._dialogData = null;
      this.isDisablePackage = false;
      if (isNullOrUndefined(subscribedItem) || isNullOrUndefined(subscribedItem.item)) {
        this.form.patchValue(this.form.value);
        return false;
      }
      if (type === WidgetItem.Instance) {
        if (subscribedItem.item && subscribedItem.item.values) {
          const {systemSelections, customSelections} = subscribedItem.item.values;
          const newDimension = {...dimension, systemInstances: systemSelections, customInstances: _.uniq(customSelections)};
          const dimensionForm = this.form.get(WidgetItem.Dimension);
          if (isNullOrUndefined(dimensionForm.value) || dimensionForm.value <= 0) {
            dimensionForm.patchValue([newDimension]);
          } else {
            const formValue = dimensionForm.value
            const index = formValue.findIndex(item => item.dimension === dimension.dimension);
            formValue[index] = newDimension;
            dimensionForm.patchValue(formValue);
          }
        }
      } else {
        const values = subscribedItem.item.checked
          && subscribedItem.item.checked[0] ? subscribedItem.item.checked[0].values : [];
        switch (type) {
          case (WidgetItem.Measure):
          case (WidgetItem.Window):
            if (values.length > 0) {
              this.form.get(type).patchValue(values);
            } else {
              this.form.patchValue(this.form.value);
            }
            break;
          case (WidgetItem.Dimension):
            this.handleAddDimension(WidgetItem.Dimension, subscribedItem.item);
            break;
          default: break;
        }
      }
    });
  }

  isDataTab() {
    return this.section === WidgetSection.info.toString();
  }

  // Handle deletet dimension event
  handleDeleteDimension(item) {
    this._dimensions = this._dimensions.filter(dimensions => dimensions.dimension !== item);
    this.form.get(WidgetItem.Dimension).patchValue(this._dimensions);
    if (this._dimensions.length === 0) {
      this._measures = [];
      this.form.get(this.widgetItem.Measure).patchValue([]);
      this._instances = [];
      this.form.get(this.widgetItem.Instance).patchValue([]);
      this._windows = [];
      this.form.get(this.widgetItem.Window).patchValue([]);
    }
  }

  handleAddDimension(name, values) {
    if (!isNullOrUndefined(values.showAllData)) {
      this.form.get('showAllData').patchValue(values.showAllData);
    }
    if (isNullOrUndefined(values.checked) || values.checked.length === 0) {
      return;
    }
    const item = values.checked[0].values;
    const formDimension = this.form.get(name);
    if (isNullOrUndefined(item) || item.length === 0) {
      formDimension.patchValue([]);
    }
    formDimension.patchValue(item.map(i => {
      const formValue = formDimension.value ? formDimension.value.find(d => d.dimension === i) : null;
      if (formValue) {
        return formValue;
      } else {
        return {
          dimension: i,
          systemInstances: [],
          customInstances: []
        };
      }
    }));
  }

  // Handle delete general item
  handleDeleteItem(item, type: WidgetItem) {
    let newItem;
    if (type === WidgetItem.Instance) {
      this._instances = this._instances.filter(f => f !== item);
      newItem = this._instances;
    }

    if (type === WidgetItem.Measure) {
      this._measures = this._measures.filter(f => f !== item);
      newItem = this._measures;
      this.getCurrentPackage();
    }

    if (type === WidgetItem.Window) {
      this._windows = this._windows.filter(f => f !== item);
      newItem = this._windows;
    }

    if (this._measures.length === 0) {
      this._instances = [];
      this.form.get(this.widgetItem.Instance).patchValue([]);
      this._windows = [];
      this.form.get(this.widgetItem.Window).patchValue([]);
    }

    this.form.get(type).patchValue(newItem);
  }

  handleRemoveItem(event) {
    if (event.type === this.widgetItem.Dimension) {
      this.handleDeleteDimension(event.item);
    } else {
      this.handleDeleteItem(event.item, event.type);
    }
  }

  handleAddItem(event) {
    if (event.items.length > 0) {
      if (event.type === WidgetItem.Dimension) {
        const formDimension = this.form.get(event.type);
        formDimension.patchValue(event.items.map(i => {
          const currentDimentsion = this._dimensions.findIndex(f => f.dimension === i);
          if (currentDimentsion >= 0) {
            return this._dimensions[currentDimentsion];
          } else {
            const formValue = formDimension.value ? formDimension.value.find(d => d.dimension === i) : null;
            if (formValue) {
              return formValue;
            } else {
              const newDimen = {
                dimension: i,
                systemInstances: [],
                customInstances: this.form.get(this.widgetItem.Instance).value
              };
              this._dimensions.push(newDimen);
              return newDimen;
            }
          }
        }));
      } else if (this.form.get(event.type)) {
        this.form.get(event.type).patchValue(event.items);
        if (event.type === WidgetItem.Instance) {
          this._instances = event.items;
        }

        if (event.type === WidgetItem.Measure) {
          this._measures = event.items;
          this.getCurrentPackage();
        }

        if (event.type === WidgetItem.Window) {
          this._windows = event.items;
        }
      }
    } else {
      this.form.patchValue(this.form.value);
    }
  }

  handleChangeShowAllInstance(event) {
    if (this.form.get('showAllData')) {
      if (event) {
        this._instances = [];
        this.form.get(this.widgetItem.Instance).patchValue([]);
      }
      this.form.get('showAllData').patchValue(event);
    }
  }

  handleClearItem(type: WidgetItem) {
    this.form.get(type).patchValue([]);
  }

  hasItem(type: WidgetItem) {
    const value = this.form.get(type).value;
    return isNullOrUndefined(value) || value.length <= 0;
  }

  getMargin(type: WidgetItem) {
    const marginBottom = this.hasItem(type) ? 0 : '10px';
    return {
      'margin-bottom': marginBottom
    };
  }

  isAvailabelAdd(option: EditWidgetFormControl): boolean {
    return !option.value || option.value.length === 0 || option.choiceMode === FlexibleChoicePackage.MULTIPLE;
  }

  getNumOfSelectedInstances(dimension: WidgetDimension) {
    let count = 0;
    if (dimension.customInstances) {
      count += dimension.customInstances.length;
    }
    if (dimension.systemInstances) {
      count += dimension.systemInstances.length;
    }

    return count;
  }

  getSelectedInstances(dimension: WidgetDimension) {
    const count = this.getNumOfSelectedInstances(dimension);
    return count === 0 ? null : count === 1 ? `widgets.edit_widget_form.one_instance` :
      `widgets.edit_widget_form.more_instances`;
  }

  checkSection(option) {
    return option && option.section && option.section === this.section;
  }

  writeValue(obj: any) {}

  registerOnChange(fn: any) {}

  registerOnTouched(fn: any) {}

  private validate() {
    if (this.form) {
      this.onValidate.emit(this.form.valid);
    }
  }

  private filterItemsOfPackages() {
    const filterObj = _.filter(this.packages, { 'dataType': this.options.dataType.value });
    const measures = filterObj.reduce((acc, item) => {
      if (!acc[item.dataType]) {
        acc[item.dataType] = { packageName: item.dataType };
        acc[item.dataType].measures = [];
        acc[item.dataType].dimensions = [];
        acc[item.dataType].windows = [];
      }
      if (this.measureCondition(item)) {
        acc[item.dataType].measures.push(item.name);
      }
      if (item.dimension && this.dimensionCondition(item)) {
        acc[item.dataType].dimensions = _.union(acc[item.dataType].dimensions, [item.dimension]);
      }
      const windowName = getWindowInMeasure(item);
      if (windowName && this.windowCondition(item)) {
        acc[item.dataType].windows = _.union(acc[item.dataType].windows, [windowName]);
      }
      return acc;
    }, {});
    return _.values(measures);
  }

  private measureCondition(currentItem) {
    const dimensions = this.filterEmptyArray(this.options.dimensions.value);
    const windows = this.filterEmptyArray(this.options.windows.value);

    return dimensions.length ? dimensions.filter(d => d.dimension === currentItem.dimension).length : true
      && (windows.length
        ? WindowNames.indexOf(currentItem.windowType) >= 0
          ? windows.includes(currentItem.windowName)
          : windows.includes(currentItem.windowType)
        : true);
  }

  private dimensionCondition(currentItem) {
    const measures = this.filterEmptyArray(this.getMeasureValue());
    const windows = this.filterEmptyArray(this.options.windows.value);
    return measures.length ? measures.includes(currentItem.name) : true
      && (windows.length
        ? WindowNames.indexOf(currentItem.windowType) >= 0
          ? windows.includes(currentItem.windowName)
          : windows.includes(currentItem.windowType)
        : true);
  }

  private windowCondition(currentItem) {
    const measures = this.filterEmptyArray(this.getMeasureValue());
    const dimensions = this.filterEmptyArray(this.options.dimensions.value);
    return measures.length ? measures.includes(currentItem.name) : true
      && (dimensions.length ? dimensions.filter(d => d.dimension === currentItem.dimension).length : true);
  }

  private getMeasureValue() {
    if (this.options.columns) {
      return this.options.columns.value.filter(column => column.type === MeasureFormat.number).map(measure => measure.id);
    }
    return this.options.measures.value;
  }

  private filterEmptyArray(array) {
    return _.filter(array, (value) => value !== '' && value !== null && value !== undefined);
  }

  private createForm() {
    this.chartType = this.chartStyle = null;
    Object.keys(this.options).forEach((controlName: string) => {
      const section = this.options[controlName].section;
      if (section && section === this.section) {
        this.addConfig(controlName, this.options[controlName]);
      }

      if (controlName === this.widgetItem.Window) {
        this._windows = this.options[controlName].value;
      }

      if (controlName === this.widgetItem.Dimension) {
        this._dimensions = this.options[controlName].value;
      }

      if (controlName === this.widgetItem.Measure) {
        this._measures = this.options[controlName].value;
      }

      if (controlName === this.widgetItem.Instance) {
        this._instances = this.options[controlName].value;
      }

      if (controlName === 'columns') {
        this._measures = this.options.columns.value.map(column => column.id);
      }

      if (controlName === 'chartType') {
        this.chartType = this.options.chartType.value;
      }

      if (controlName === 'dataType') {
        this.currentPackage = this.options.dataType.value;
      }

      if (controlName === 'chartStyle') {
        const chartOptions = this.options.chartStyle.value.split(BarStyleDivider);
        this.chartStyle = chartOptions[0].replace(' ', '');
        this.chartType = chartOptions[1].replace(' ', '');
      }
    });
    this.getCurrentPackage();
    this.form = this._fb.group(this._config);
  }

  private addConfig(control: string, controlOptions: EditWidgetFormControl) {
    if (controlOptions) {
      this._config[control] = this._fb.control({value: controlOptions.value, disabled: !controlOptions.enabled});
    }
  }

  private getControl(controlName: string): AbstractControl {
    return this.form.get(controlName);
  }

  isShowingStackBy() {
    if (this.checkSection(this.options.stackBy)
        && this.options.chartStyle.value.includes('Stacked')
        && this.options.type
        && this.options.dimensions
        && this.options.mode.value.value === WidgetMode.Instances) {
      return true;
    }
    return false;
  }

  getStackByItems() {
    if (this.isShowingStackBy()) {
      if (!isNullOrUndefined(this.options.dimensions.value[0])) {
        return this.options.dimensions.value[0].dimension.split(',');
      }
    }
  }

  getItems(vals) {
    return vals ? vals.map((item) => item.dimension) : [];
  }

  getItemMeasures() {
    if (this.widget.type !== WidgetType.CallTimeLine) {
      const tSelectedDimensions = this.form && this.form.get(WidgetItem.Dimension) ?
        this.form.get(WidgetItem.Dimension).value.map(m => m.dimension) : this.options[WidgetItem.Dimension] ?
        this.options[WidgetItem.Dimension].value.map(m => m.dimension) : [];
      let allMeasures = [];
      if (this.allDimensions) {
        const tDimensionMeasure = this.allDimensions.filter(di => tSelectedDimensions.findIndex(d => d === di.dimension) >= 0);
        const tMeasues = tDimensionMeasure.map(m => m.measures);
        tMeasues.reduce((acc, mea) => {
          allMeasures = _.union(allMeasures, mea);
        }, []);
      }
      let allWindows = [];
      const tSelectedMesure = this.form && this.form.get(WidgetItem.Measure) ? this.form.get(WidgetItem.Measure).value : this.options[WidgetItem.Measure] ?
        this.options[WidgetItem.Measure].value : this.options.columns ? this.options.columns.value.filter(f => f.type === MeasureFormat.number).map(m => m.id) : [];
      if (this.packages && tSelectedMesure.length > 0) {
        allWindows = _.uniqWith(this.packages.filter(f => tSelectedMesure.findIndex(fi => fi === f.name) >= 0).map(m => m.windowName), _.isEqual(true)).sort();
      }
      this.windows = allWindows.length > 0 ? allWindows : [];

      return allMeasures.sort();
    } else {
      return  _.uniqWith(this.packages.map(m => m.name), _.isEqual(true));
    }
  }

  private propagateChange(_: any) {}
}
